const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const flexPackage = require("./flex-package");
const qs = require("qs");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

app.post("/webhook", line.middleware(config), async (req, res) => {
  try {
    const events = req.body.events;
    const results = await Promise.all(events.map(handleEvent));
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(200).end();
  }
});

const sendNotify = async (msg) => {
  let data = qs.stringify({
    message: msg,
  });

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: process.env.NOTIFY_URL,
    headers: {
      Authorization: `Bearer ${process.env.NOTIFY_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: data,
  };

  await axios.request(config);
};

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") return null;

  const text = event.message.text.trim();
  const profile = await client.getProfile(event.source.userId);
  // New case: if message contains 'เลือกแพ็คเกจ'
  if (
    text.includes("เลือกแพ็กเกจ") ||
    text === "วิธีใช้งาน" ||
    text === "แพ็คเกจราคา" ||
    text === "ติดต่อแอดมิน" ||
    text === "จองคิวซักผ้า"
  ) {
    await axios.post(
      `https://api.line.me/v2/bot/chat/loading/start`,
      {
        chatId: event.source.userId,
        loadingSeconds: 5,
      },
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  }
  if (text.includes("เลือกแพ็กเกจ")) {
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "แอดมินกำลังมากรุณารอสักครู่ 🕒😊",
    });
  }

  switch (text) {
    case "วิธีใช้งาน":
      return client.replyMessage(event.replyToken, {
        type: "image",
        originalContentUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__7643152.jpg?alt=media&token=eec356c4-54ca-4725-81f7-efa1206b99d3",
        previewImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__7643152.jpg?alt=media&token=eec356c4-54ca-4725-81f7-efa1206b99d3",
      });

    case "แพ็คเกจราคา":
      return client.replyMessage(event.replyToken, {
        type: "image",
        originalContentUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__13107206.jpg?alt=media&token=788cf546-331b-4910-9c1c-fae64fd5d5d0",
        previewImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__13107206.jpg?alt=media&token=788cf546-331b-4910-9c1c-fae64fd5d5d0",
      });

    case "ติดต่อแอดมิน":
      await sendNotify(
        `มีคนติดต่อแอดมินจาก ${profile.displayName} (${event.source.userId})`
      );
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "แอดมินกำลังมากรุณารอสักครู่",
      });

    case "จองคิวซักผ้า":
      await sendNotify(
        `จองคิวซักผ้า ${profile.displayName} (${event.source.userId})`
      );
      return client.replyMessage(event.replyToken, [
        {
          type: "image",
          originalContentUrl:
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__13107206.jpg?alt=media&token=788cf546-331b-4910-9c1c-fae64fd5d5d0",
          previewImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/S__13107206.jpg?alt=media&token=788cf546-331b-4910-9c1c-fae64fd5d5d0",
        },
        flexPackage,
        {
          type: "text",
          text: `เลือกแพ็กเกจที่ต้องการ แล้วส่งวันและเวลาที่อยากจองคิวซักผ้ามาได้เลยนะครับ 🧺\n\nรบกวนวางผ้าก่อน 13:00 น. ไรเดอร์จะเข้ารับช่วงประมาณ 13:00 น.\nลูกค้าจะได้รับผ้าภายในไม่เกิน 17:00 น.\nหมายเหตุ: วันพุธอาจล่าช้าเล็กน้อย เนื่องจากมีโปรโมชั่น ลูกค้าใช้บริการจำนวนมาก 😊`,
        },
      ]);

    default:
      return null; // ไม่ตอบข้อความอื่น
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
