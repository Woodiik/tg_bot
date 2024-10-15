const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

async function initDB() {
  const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    telegram_id BIGINT NOT NULL,
    username VARCHAR(255),
    score INT DEFAULT 0,
    last_login DATE,
    PRIMARY KEY (telegram_id)
);
    `;
  await pool.query(createUsersTable);
}

module.exports = { pool, initDB };
