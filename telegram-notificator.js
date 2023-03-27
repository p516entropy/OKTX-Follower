const axios = require("axios");
const querystring = require('querystring');


const sendTelegramNotification = async (text) => {
  try {
    let key = `key`;
    let chatId = 'chatId';
    await axios.post(
      `https://api.telegram.org/bot${key}/sendMessage`,
      querystring.stringify({
        chat_id: chatId, //gave the values directly for testing
        text,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      });
  } catch (e) {
    console.log(e)
  }
}

module.exports = {
  sendTelegramNotification
}