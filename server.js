const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');

const app = express();

// LINE config
const lineConfig = {
  channelAccessToken: 'R846vjBbQCEnx0M3SzhXXcUwwac+rfh6EmoQ7Um1yC2vv97YJVNvdyiVEiPOvXLMF9Al9PDqJwuoiWVCleyZ8scnUHaDBy3CMkAk55m3XzLfOacN6kjvIUcOYhjsWIcZnq1kgZeYIPj5x3lhoLGj7wdB04t89/1O/w1cDnyilFU=',
  channelSecret: '4341de182285e0ae9a99da507d9047ae'
};

// ✅ KIỂM TRA CONFIG
if (!lineConfig.channelAccessToken || !lineConfig.channelSecret) {
  console.error('❌ Missing LINE credentials!');
  process.exit(1);
}

const client = new line.Client(lineConfig);

// ✅ PARSE JSON
app.use(express.json());

// ✅ LOG ALL INCOMING REQUESTS (debug middleware)
app.use((req, res, next) => {
  console.log(`📥 [${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log(`   Headers: content-type=${req.headers['content-type'] || 'none'}, user-agent=${req.headers['user-agent'] || 'none'}`);
  next();
});

// ✅ TEST ENDPOINT
app.get('/', (req, res) => {
  res.status(200).send('✅ Bot is running!');
});

// ✅ GET /webhook — handle LINE verification / manual browser test
app.get('/webhook', (req, res) => {
  console.log('✅ GET /webhook hit — LINE or browser verification request');
  res.status(200).send('✅ Webhook endpoint is alive. Use POST for LINE events.');
});

// ✅ WEBHOOK ENDPOINT
app.post('/webhook', line.middleware(lineConfig), async (req, res) => {
  try {
    console.log(`📨 POST /webhook received`);
    console.log(`   Body keys: ${Object.keys(req.body || {}).join(', ') || '(empty)'}`);

    const events = req.body.events;
    
    if (!events || events.length === 0) {
      console.log('ℹ️  No events in payload — returning 200 OK');
      return res.status(200).send('OK');
    }
    
    console.log(`📨 Processing ${events.length} event(s)`);
    
    await Promise.all(
      events.map(event => handleEvent(event))
    );
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error.message || error);
    res.status(500).send('Internal Server Error');
  }
});

// ✅ HÀM XỬ LÝ EVENT
async function handleEvent(event) {
  console.log(`📌 Event type: ${event.type}`);
  
  if (event.type !== 'message') {
    return Promise.resolve(null);
  }

  if (event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  console.log(`💬 Message: ${event.message.text}`);

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: `Pet_Trung Thành nhận được: "${event.message.text}"`
  });
}

// ✅ PORT
const PORT = process.env.PORT || 8080;

// ✅ ERROR HANDLING
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

// ✅ START SERVER
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`✅ Webhook URL: https://line-bot-pet-trung-thanh.railway.app/webhook`);
});
