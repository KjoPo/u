require('dotenv').config();
const axios = require('axios');
const { SocksProxyAgent } = require('socks-proxy-agent');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Get multiple proxy options from environment
const PROXY_LIST = process.env.PROXY_LIST ? 
  process.env.PROXY_LIST.split(',') : [];

// Local fallback logging
const logToFile = (message) => {
  const logPath = path.join(__dirname, 'telegram_fallback.log');
  fs.appendFileSync(logPath, `${new Date().toISOString()}: ${message}\n`);
};

const createAgent = (proxyUrl = null) => {
  if (proxyUrl) {
    console.log('Attempting proxy:', proxyUrl);
    return new SocksProxyAgent(proxyUrl);
  }
  return new https.Agent({ 
    keepAlive: true,
    timeout: 15000,
    rejectUnauthorized: true
  });
};

const telegramEndpoints = [
  'https://api.telegram.org',
  'https://api1.telegram.org',
  'https://api2.telegram.org',
  'https://api3.telegram.org'
];

const sendViaEndpoint = async (endpoint, message, proxyUrl = null) => {
  try {
    const response = await axios.post(
      `${endpoint}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      },
      {
        timeout: 10000,
        httpsAgent: createAgent(proxyUrl)
      }
    );
    return { success: true, endpoint, proxyUrl, response: response.data };
  } catch (error) {
    return { 
      success: false, 
      endpoint, 
      proxyUrl,
      error: error.message 
    };
  }
};

const sendMessage = async (message) => {
 
  for (const endpoint of telegramEndpoints) {
    const result = await sendViaEndpoint(endpoint, message);
    if (result.success) return result;
  }

 
  for (const proxyUrl of PROXY_LIST) {
    for (const endpoint of telegramEndpoints) {
      const result = await sendViaEndpoint(endpoint, message, proxyUrl);
      if (result.success) return result;
    }
  }


  logToFile(`Failed to send: ${message}`);
  throw new Error('All connection attempts failed');
};

module.exports = { sendMessage };