const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

// LINE config
const lineConfig = {
  channelAccessToken: 'R846vjBbQCEnx0M3SzhXXcUwwac+rfh6EmoQ7Um1yC2vv97YJVNvdyiVEiPOvXLMF9Al9PDqJwuoiWVCleyZ8scnUHaDBy3CMkAk55m3XzLfOacN6kjvIUcOYhjsWIcZnq1kgZeYIPj5x3lhoLGj7wdB04t89/1O/w1cDnyilFU=',
  channelSecret: '4341de182285e0ae9a99da507d9047ae'
};

const client = new line.Client(lineConfig);

// ✅ WEBHOOK ENDPOINT
app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  try {
    const events = req.body.events;
    
    await Promise.all(
      events.map(event => handleEvent(event))
    );
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ HÀM XỬ LÝ EVENT
async function handleEvent(event) {
  if (event.type !== 'message') {
    return Promise.resolve(null);
  }

  if (event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `Pet_Trung Thành nhận được: "${event.message.text}"`
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
