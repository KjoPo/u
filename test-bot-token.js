const axios = require('axios');
require('dotenv').config();

const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function sendMessage(text) {
  try {
    const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: CHAT_ID,
      text: text,
      parse_mode: 'HTML'
    });

    console.log('✅ Message sent to Telegram!');
    console.log('Message ID:', response.data.result.message_id);
    console.log('Chat ID:', response.data.result.chat.id);
    return true;
  } catch (error) {
    console.error('❌ Failed to send to Telegram!');
    console.error('Error:', error.response?.data || error.message);
    return false;
  }
}

// Example usage
sendMessage('Testing console logs...');
