// config.js
require('dotenv').config();

module.exports = {
  MONGODB_URI: process.env.MONGODB_URI,
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
  NOTIFY_USER_ID: process.env.NOTIFY_USER_ID,
  GIFT_COLLECTION: 'GiftCollection',
  GIFT_DATABASE: 'GiftDatabase'
};
