const express = require('express');
const line = require('@line/bot-sdk');

const app = express();

const config = {
  channelAccessToken: 'YOUR_CHANNEL_ACCESS_TOKEN',
  channelSecret: 'YOUR_CHANNEL_SECRET'
};

const client = new line.Client(config);

// webhook endpoint
app.post('/webhook', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  // รับเฉพาะข้อความเท่านั้น
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  try {
    // ดึงชื่อผู้ใช้จาก LINE Profile API
    const profile = await client.getProfile(event.source.userId);
    const name = profile.displayName;

    // ตอบกลับ
    const replyText = `Hello ${name}`;
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: replyText
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: 'Hello'
    });
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
