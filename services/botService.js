// botService.js
const TelegramBot = require('node-telegram-bot-api');
const { TELEGRAM_BOT_TOKEN, NOTIFY_USER_ID } = require('../config');

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const sendMessage = (message) => {
  bot.sendMessage(NOTIFY_USER_ID, message);
};

module.exports = { sendMessage };
