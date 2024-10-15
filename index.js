require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { pool, initDB } = require("./db");

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

initDB();

bot.setMyCommands([
  { command: "/start", description: "Start the bot and register" },
  { command: "/login", description: "Log in daily and earn points" },
  { command: "/score", description: "Check your current score" },
  { command: "/leaderboard", description: "See the top 5 users by score" },
]);

let lastMessageTime = {};

const spamWords = ["gm", "gn"];
bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE telegram_id = ?",
      [userId]
    );

    if (!rows.length) {
      await pool.query(
        "INSERT INTO users (telegram_id, score, last_login) VALUES (?, 0, NULL)",
        [userId]
      );
      bot.sendMessage(
        msg.chat.id,
        "Welcome! Your engagement will earn you points. Use /score to check your points!"
      );
    } else {
      bot.sendMessage(
        msg.chat.id,
        "Welcome back! Keep earning points by staying active. Use /score to check your points."
      );
    }
  } catch (error) {
    console.error("Error during /start:", error);
  }
});

bot.onText(/\/login/, async (msg) => {
  const userId = msg.from.id;
  const today = new Date().toISOString().slice(0, 10);

  try {
    const [rows] = await pool.query(
      "SELECT last_login FROM users WHERE telegram_id = ?",
      [userId]
    );

    if (!rows.length) {
      await pool.query(
        "INSERT INTO users (telegram_id, score, last_login) VALUES (?, 0, ?)",
        [userId, today]
      );
      bot.sendMessage(
        msg.chat.id,
        "You've logged in today and earned 5 points!"
      );
    } else {
      const lastLoginDate = new Date(rows[0].last_login).toLocaleDateString(
        "en-CA"
      );

      if (lastLoginDate !== today) {
        await pool.query(
          "UPDATE users SET score = score + 5, last_login = ? WHERE telegram_id = ?",
          [today, userId]
        );
        bot.sendMessage(
          msg.chat.id,
          "You've logged in today and earned 5 points! Come back tomorrow for more."
        );
      } else {
        bot.sendMessage(
          msg.chat.id,
          "You've already logged in today. You can log in again tomorrow."
        );
      }
    }
  } catch (error) {
    console.error("Error during login:", error);
  }
});

bot.on("message", async (msg) => {
  const userId = msg.from.id;
  const messageText = msg.text;
  const now = Date.now();

  if (spamWords.some((spam) => messageText.toLowerCase() === spam)) {
    await pool.query(
      "UPDATE users SET score = score - 1 WHERE telegram_id = ?",
      [userId]
    );
    return bot.sendMessage(
      msg.chat.id,
      "You've sent a spam message and lost 1 point."
    );
  }

  if (lastMessageTime[userId] && now - lastMessageTime[userId] < 1500) {
    await pool.query(
      "UPDATE users SET score = score - 1 WHERE telegram_id = ?",
      [userId]
    );
    return bot.sendMessage(
      msg.chat.id,
      "You're sending messages too fast! You've lost 1 point."
    );
  }

  lastMessageTime[userId] = now;

  if (messageText.length > 10) {
    await pool.query(
      "UPDATE users SET score = score + 1 WHERE telegram_id = ?",
      [userId]
    );
    return bot.sendMessage(
      msg.chat.id,
      "You've earned 1 point for your message!"
    );
  }
});

bot.onText(/\/score/, async (msg) => {
  const userId = msg.from.id;
  try {
    const [rows] = await pool.query(
      "SELECT score FROM users WHERE telegram_id = ?",
      [userId]
    );
    const score = rows.length ? rows[0].score : 0;
    bot.sendMessage(msg.chat.id, `Your current score is: ${score} points.`);
  } catch (error) {
    console.error("Error fetching score:", error);
  }
});

bot.onText(/\/leaderboard/, async (msg) => {
  try {
    const [rows] = await pool.query(
      "SELECT telegram_id, score FROM users ORDER BY score DESC LIMIT 5"
    );
    let leaderboard = "Top 5 users by score:\n";
    rows.forEach((row, index) => {
      leaderboard += `${index + 1}. User ${row.telegram_id}: ${
        row.score
      } points\n`;
    });
    bot.sendMessage(msg.chat.id, leaderboard);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
});
