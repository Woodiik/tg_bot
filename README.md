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
   cd telegram-engagement-bot
