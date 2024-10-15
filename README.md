# Telegram Engagement Bot

This is a simple Telegram bot that tracks user engagement in a chat, rewards points for messages, and maintains a leaderboard.

## Features

- Responds to `/start` command by greeting the user.
- Tracks user activity in a group chat.
- Provides a `/score` command to show the user's current score.
- Implements a basic scoring system:
  - Earn 1 point for every message longer than 10 characters.
  - Earn 5 points for logging in daily (via `/login` command).
  - Lose 1 point for repetitive messages like "gm" or "gn".
  - Lose 1 point for spamming messages (sending too quickly).
- Displays a leaderboard with the `/leaderboard` command.

## Requirements

- Node.js (version 14 or higher)
- MySQL Database

## Setup Instructions

1. **Clone the Repository**

   Open your terminal and run:

   ```bash
   git clone <repository-url>
   cd tg_bot
   ```

2. **Install Dependencies**

   Install the required npm packages:

   ```bash
   npm install
   ```

3. **Database Connection**

   The bot is already configured to connect to a MySQL database. If you want to use your own database, you can set up your own MySQL database and modify the connection details in the code.

4. **Bot Token**

   The bot is already configured with a Telegram bot token. If you want to use your own bot, replace the token in the code with your own Telegram bot token.

5. **Run the Bot**

   Start the bot by running:

   ```bash
   node index.js
   ```

6. **Invite the Bot to a Telegram Group**

   Create a group chat in Telegram, invite your bot, give permission and start interacting with it!

## Commands

- `/start` - Start the bot and receive a welcome message.
- `/login` - Log in to earn points for today.
- `/score` - Check your current score.
- `/leaderboard` - View the top 5 users by score.

## License

This project is licensed under the MIT License. Feel free to modify and use it as you wish!
