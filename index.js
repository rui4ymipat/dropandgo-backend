const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const flexPackage = require("./flex-package");

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
    res.status(500).end();
  }
});

const sendNotify = async (msg) => {
  await axios.post(
    process.env.NOTIFY_URL,
    `message=${encodeURIComponent(msg)}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${process.env.NOTIFY_TOKEN.trim()}`,
      },
    }
  );
};

async function handleEvent(event) {
  if (event.type !== "message" || event.message.type !== "text") return null;

  const text = event.message.text.trim();
  const profile = await client.getProfile(event.source.userId);

  switch (text) {
    case "วิธีใช้งาน":
      return client.replyMessage(event.replyToken, {
        type: "image",
        originalContentUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/2B722B47-DA1A-426D-8DB8-AFD72B73F85A.png?alt=media&token=621d89d7-9609-4423-925a-21a093434b14",
        previewImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/2B722B47-DA1A-426D-8DB8-AFD72B73F85A.png?alt=media&token=621d89d7-9609-4423-925a-21a093434b14",
      });

    case "แพ็คเกจราคา":
      return client.replyMessage(event.replyToken, {
        type: "image",
        originalContentUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/3B8698D4-9709-4AB9-BEB7-E39B184412F4.png?alt=media&token=708a63ca-fb4f-494f-bb01-5f5727dbe355",
        previewImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/3B8698D4-9709-4AB9-BEB7-E39B184412F4.png?alt=media&token=708a63ca-fb4f-494f-bb01-5f5727dbe355",
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
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/3B8698D4-9709-4AB9-BEB7-E39B184412F4.png?alt=media&token=708a63ca-fb4f-494f-bb01-5f5727dbe355",
          previewImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/3B8698D4-9709-4AB9-BEB7-E39B184412F4.png?alt=media&token=708a63ca-fb4f-494f-bb01-5f5727dbe355",
        },
        flexPackage,
        {
          type: "text",
          text: `เลือกแพ็กเกจที่ต้องการ แล้วส่งวันและเวลาที่อยากจองคิวซักผ้ามาได้เลยนะครับ 🧺\n\nเรามีรอบรับ-ส่งให้เลือก 3 รอบ: 10:00, 12:00 และ 14:00\nแต่ละรอบใช้เวลาประมาณ 4 ชั่วโมง เช่น ถ้าเลือกรอบ 10:00 จะได้รับผ้าภายในไม่เกิน 14:00 ครับ 😊`,
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
