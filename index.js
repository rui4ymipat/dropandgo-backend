const express = require("express");
const line = require("@line/bot-sdk");
const axios = require("axios");
const OpenAI = require("openai");
const flexPackage = require("./flex-package");
const qs = require("qs");

const app = express();

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Session storage for each user
const userSessions = new Map();

// Function to get or create user session
function getUserSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, {
      messages: [],
      context: "เริ่มต้นการสนทนา",
      lastActivity: Date.now()
    });
  }
  return userSessions.get(userId);
}

// Function to reset user session
function resetUserSession(userId) {
  userSessions.delete(userId);
  console.log(`Session reset for user: ${userId}`);
}

// Function to add message to session
function addMessageToSession(userId, role, content) {
  const session = getUserSession(userId);
  session.messages.push({ role, content });
  session.lastActivity = Date.now();
  
  // Keep only last 20 messages to avoid token limit
  if (session.messages.length > 20) {
    session.messages = session.messages.slice(-20);
  }
}

// Function to get current date and time info
function getCurrentDateTimeInfo() {
  const now = new Date();
  const thaiTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
  
  const currentHour = thaiTime.getHours();
  const currentMinute = thaiTime.getMinutes();
  const currentDate = thaiTime.toLocaleDateString('th-TH', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const tomorrow = new Date(thaiTime.getTime() + (24 * 60 * 60 * 1000));
  const tomorrowDate = tomorrow.toLocaleDateString('th-TH', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  return {
    currentTime: `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`,
    currentDate: currentDate,
    tomorrowDate: tomorrowDate,
    currentHour: currentHour
  };
}

// Function to get AI response
async function getAIResponse(userId, userMessage) {
  try {
    const session = getUserSession(userId);
    
    // Add user message to session
    addMessageToSession(userId, "user", userMessage);
    
    // Get current date and time info
    const dateTimeInfo = getCurrentDateTimeInfo();
    
    // Prepare conversation history for OpenAI
    const conversationHistory = [
             {
         role: "system",
         content: `คุณเป็นบอทของร้านซักผ้า Drop & Go ที่เป็นมิตรและช่วยเหลือลูกค้าในการจองคิวซักผ้า

ข้อมูลร้าน:
- ร้านซักผ้า Drop & Go ให้บริการซักรีดผ้า

ข้อมูลเวลาปัจจุบัน:
- เวลาตอนนี้: ${dateTimeInfo.currentTime} น.
- วันที่: ${dateTimeInfo.currentDate}
- สามารถจองได้เฉพาะ: วันนี้ (${dateTimeInfo.currentDate}) และพรุ่งนี้ (${dateTimeInfo.tomorrowDate}) เท่านั้น

แพ็กเกจและราคา (จาก flex-package.js):
1. ผ้าไม่เกิน 14 กก. - 139 บาท (ซัก 90 + ส่ง 49)
2. ผ้า 14–18 กก. - 159 บาท (ซัก 110 + ส่ง 49)
3. ผ้านวม 3.5 ฟุต - 169 บาท (ซัก 110 + ส่ง 59)
4. ผ้านวม 5–6 ฟุต - 219 บาท (ซัก 160 + ส่ง 59)

รอบรับ-ส่ง:
- รอบที่ 1: 10:00 น. (รับ-ส่งภายใน 14:00 น.)
- รอบที่ 2: 12:00 น. (รับ-ส่งภายใน 16:00 น.)
- รอบที่ 3: 14:00 น. (รับ-ส่งภายใน 18:00 น.)

กฎการจอง:
1. จองได้เฉพาะวันนี้และพรุ่งนี้เท่านั้น
2. ถ้าตอนนี้เวลา ${dateTimeInfo.currentHour}:${dateTimeInfo.currentMinute.toString().padStart(2, '0')} แล้ว:
   - ถ้าลูกค้าบอก "เที่ยง" = พรุ่งนี้เที่ยง
   - ถ้าลูกค้าบอก "เช้า" = พรุ่งนี้เช้า
   - ถ้าลูกค้าบอก "เย็น" = วันนี้เย็น (ถ้ายังไม่เกิน 18:00) หรือพรุ่งนี้เย็น
3. ถ้าลูกค้าจองเกินวันที่กำหนด ให้แจ้งว่า "ขออภัยครับ จองได้เฉพาะวันนี้และพรุ่งนี้เท่านั้น"

หน้าที่หลัก:
1. ตอบคำถามทั่วไปเกี่ยวกับร้าน บริการ และราคา
2. ช่วยเลือกแพ็กเกจที่เหมาะสมตามปริมาณผ้า
3. รับข้อมูลการจอง (วัน, เวลา, แพ็กเกจ, จำนวน)
4. คำนวณราคารวมและแสดงรายละเอียด
5. สรุปการจองและขอหลักฐานการโอนเงิน

ขั้นตอนการจอง:
1. เมื่อลูกค้าสรุปการจอง ให้บอกว่า "กรุณาส่งหลักฐานการโอนเงินมาในแชทนี้ด้วยครับ" และส่ง QR Code
2. เมื่อลูกค้าส่งรูปสลิปมา ให้บอกว่า "ขอบคุณครับ! กรุณาวางผ้าแล้วถ่ายรูปมาด้วยครับ"
3. หลังจากนั้นให้บอกว่า "ขอบคุณสำหรับการจองครับ! แอดมินจะติดต่อกลับไปเร็วๆ นี้" และ reset session

ตอบเป็นภาษาไทยที่สุภาพและเป็นมิตร ใช้ emoji เพื่อให้ดูเป็นมิตร`
        },
      ...session.messages
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: conversationHistory,
      max_tokens: 1000,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0].message.content;
    
    // Add AI response to session
    addMessageToSession(userId, "assistant", aiResponse);
    
    // Update context based on conversation
    if (aiResponse.includes("สรุปการจอง") || aiResponse.includes("ยืนยันการจอง")) {
      session.context = "รอการยืนยันการจอง";
    } else if (aiResponse.includes("ขอบคุณสำหรับการจอง")) {
      session.context = "จองเสร็จสิ้น";
    }
    
    return aiResponse;
  } catch (error) {
    console.error("OpenAI API Error:", error);
    return "ขออภัยครับ มีปัญหาทางเทคนิค กรุณาลองใหม่อีกครั้ง";
  }
}

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
  if (event.type !== "message") return null;

  const userId = event.source.userId;
  const profile = await client.getProfile(userId);

  // Handle image messages (slip upload)
  if (event.message.type === "image") {
    const session = getUserSession(userId);
    
    // Check if user is in payment confirmation stage
    if (session.context === "รอการยืนยันการจอง") {
      // Send notification to admin about slip upload
      await sendNotify(
        `ลูกค้า ${profile.displayName} (${userId}) ส่งสลิปโอนเงินมาแล้ว กรุณาเช็คเลย!`
      );
      
      // Update session context
      session.context = "ส่งสลิปแล้ว";
      
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "ขอบคุณครับ! กรุณาวางผ้าแล้วถ่ายรูปมาด้วยครับ 📸",
      });
    }
    
    return null;
  }

  // Handle text messages
  if (event.message.type !== "text") return null;

  const text = event.message.text.trim();

  // Check if this is a special command that needs admin notification
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
        chatId: userId,
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

  // Handle special commands first
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
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/5CDF61DC-9190-4097-87AA-00C3A9ED9068.png?alt=media&token=b79acb87-465b-4a1b-a0e5-0f7d25b1e8a9",
        previewImageUrl:
          "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/5CDF61DC-9190-4097-87AA-00C3A9ED9068.png?alt=media&token=b79acb87-465b-4a1b-a0e5-0f7d25b1e8a9",
      });

    case "ติดต่อแอดมิน":
      await sendNotify(
        `มีคนติดต่อแอดมินจาก ${profile.displayName} (${userId})`
      );
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "แอดมินกำลังมากรุณารอสักครู่",
      });

    case "จองคิวซักผ้า":
      await sendNotify(
        `จองคิวซักผ้า ${profile.displayName} (${userId})`
      );
      // Reset session when starting new booking
      resetUserSession(userId);
      return client.replyMessage(event.replyToken, [
        {
          type: "image",
          originalContentUrl:
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/5CDF61DC-9190-4097-87AA-00C3A9ED9068.png?alt=media&token=b79acb87-465b-4a1b-a0e5-0f7d25b1e8a9",
          previewImageUrl:
            "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/5CDF61DC-9190-4097-87AA-00C3A9ED9068.png?alt=media&token=b79acb87-465b-4a1b-a0e5-0f7d25b1e8a9",
        },
        flexPackage,
        {
          type: "text",
          text: `เลือกแพ็กเกจที่ต้องการ แล้วส่งวันและเวลาที่อยากจองคิวซักผ้ามาได้เลยนะครับ 🧺\n\nเรามีรอบรับ-ส่งให้เลือก 3 รอบ: 10:00, 12:00 และ 14:00\nแต่ละรอบใช้เวลาประมาณ 4 ชั่วโมง เช่น ถ้าเลือกรอบ 10:00 จะได้รับผ้าภายในไม่เกิน 14:00 ครับ 😊`,
        },
      ]);

         default:
       // Use AI to respond to all other messages
       try {
         const aiResponse = await getAIResponse(userId, text);
         
         // Check if AI response indicates payment request (สรุปการจอง)
         if (aiResponse.includes("กรุณาส่งหลักฐานการโอนเงิน") || 
             aiResponse.includes("ส่งหลักฐานการโอน")) {
           
           // Send notification to admin about package selection
           await sendNotify(
             `ลูกค้า ${profile.displayName} (${userId}) เลือกแพ็กเกจเรียบร้อยแล้ว กรุณาเช็คเลย!`
           );
           
           // Send QR Code along with AI response
           return client.replyMessage(event.replyToken, [
             {
               type: "text",
               text: aiResponse,
             },
             {
               type: "image",
               originalContentUrl: "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/qr.png?alt=media&token=26e1f213-a455-49ea-87c4-1c9303674d1f",
               previewImageUrl: "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/qr.png?alt=media&token=26e1f213-a455-49ea-87c4-1c9303674d1f",
             }
           ]);
         }
         
         // Check if AI response indicates booking completion
         if (aiResponse.includes("ขอบคุณสำหรับการจอง") || 
             aiResponse.includes("จองเสร็จสิ้น") ||
             aiResponse.includes("แอดมินจะติดต่อกลับ")) {
           // Reset session after booking completion
           setTimeout(() => {
             resetUserSession(userId);
           }, 5000); // Reset after 5 seconds
         }
         
         return client.replyMessage(event.replyToken, {
           type: "text",
           text: aiResponse,
         });
       } catch (error) {
         console.error("Error getting AI response:", error);
         return client.replyMessage(event.replyToken, {
           type: "text",
           text: "ขออภัยครับ มีปัญหาทางเทคนิค กรุณาลองใหม่อีกครั้ง",
         });
       }
  }
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Bot server running on port ${PORT}`);
});
