# Drop & Go Backend Bot

บอท LINE สำหรับร้านซักผ้า Drop & Go ที่สามารถตอบคำถามและช่วยจองคิวซักผ้าได้

## ฟีเจอร์

- **ตอบคำถามทั่วไป** เกี่ยวกับร้านและบริการ
- **ช่วยเลือกแพ็กเกจ** ที่เหมาะสมกับลูกค้า
- **รับข้อมูลการจอง** วัน เวลา แพ็กเกจ และจำนวน
- **คำนวณราคารวม** และสรุปการจอง
- **Session Management** เก็บประวัติการสนทนาของแต่ละคน
- **AI-Powered Responses** ใช้ OpenAI API ตอบกลับทุกข้อความ

## การติดตั้ง

1. Clone repository
```bash
git clone <repository-url>
cd dropandgo-backend
```

2. ติดตั้ง dependencies
```bash
npm install
# หรือ
yarn install
```

3. สร้างไฟล์ `.env` และตั้งค่า environment variables:
```env
# Line Bot Configuration
CHANNEL_ACCESS_TOKEN=your_line_channel_access_token_here
CHANNEL_SECRET=your_line_channel_secret_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Notification Configuration
NOTIFY_URL=your_notify_url_here
NOTIFY_TOKEN=your_notify_token_here

# Server Configuration
PORT=3000
```

4. รันเซิร์ฟเวอร์
```bash
npm start
# หรือ
yarn start
```

## Environment Variables

- `CHANNEL_ACCESS_TOKEN`: Line Bot Channel Access Token
- `CHANNEL_SECRET`: Line Bot Channel Secret
- `OPENAI_API_KEY`: OpenAI API Key สำหรับ AI responses
- `NOTIFY_URL`: URL สำหรับส่งการแจ้งเตือนไปยังแอดมิน
- `NOTIFY_TOKEN`: Token สำหรับการยืนยันการแจ้งเตือน
- `PORT`: Port ที่เซิร์ฟเวอร์จะรัน (default: 3000)

## การทำงานของ Session

1. **เริ่มต้น**: เมื่อลูกค้าส่งข้อความครั้งแรก จะสร้าง session ใหม่
2. **เก็บประวัติ**: ทุกข้อความจะถูกเก็บไว้ใน session เพื่อให้ AI รู้บริบทการสนทนา
3. **Reset Session**: Session จะถูกรีเซ็ตเมื่อ:
   - ลูกค้าเริ่มจองใหม่ (กด "จองคิวซักผ้า")
   - การจองเสร็จสิ้น (AI ตอบ "ขอบคุณสำหรับการจอง")

## คำสั่งพิเศษ

- `วิธีใช้งาน`: แสดงภาพวิธีใช้งาน
- `แพ็คเกจราคา`: แสดงภาพราคาแพ็กเกจ
- `ติดต่อแอดมิน`: ส่งการแจ้งเตือนไปยังแอดมิน
- `จองคิวซักผ้า`: เริ่มกระบวนการจอง (รีเซ็ต session)

## การตอบกลับ

- **คำสั่งพิเศษ**: ตอบกลับตามที่กำหนดไว้
- **ข้อความอื่นๆ**: ใช้ OpenAI API ตอบกลับโดยอัตโนมัติ พร้อมเก็บประวัติการสนทนา

## ข้อกำหนด

- Node.js >= 20
- OpenAI API Key
- Line Bot Channel