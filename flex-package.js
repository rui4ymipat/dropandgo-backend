module.exports = {
  type: "flex",
  altText: "เลือกแพ็กเกจซักผ้า",
  contents: {
    type: "carousel",
    contents: [
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ผ้าไม่เกิน 14 กก.",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 139 บาท (ซัก 90 + ส่ง 49)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ ผ้าไม่เกิน 14 โล",
              },
              // ข้อความบนปุ่มเป็นสีขาว (ถ้าแพลตฟอร์มรองรับ)
              textColor: "#FFFFFF",
            },
          ],
        },
      },
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ผ้า 14–18 กก.",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 159 บาท (ซัก 110 + ส่ง 49)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ ผ้า 14–18 โล",
              },
              textColor: "#FFFFFF",
            },
          ],
        },
      },
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "เครื่องนอน 3.5 ฟุต",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 159 บาท (ซัก 110 + ส่ง 49)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ เครื่องนอน 3.5 ฟุต",
              },
              textColor: "#FFFFFF",
            },
          ],
        },
      },
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "เครื่องนอน 5–6 ฟุต",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 169 บาท (ซัก 110 + ส่ง 59)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ เครื่องนอน 5–6 ฟุต",
              },
              textColor: "#FFFFFF",
            },
          ],
        },
      },
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ผ้านวม 3.5 ฟุต",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 169 บาท (ซัก 110 + ส่ง 59)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ ผ้านวม 3.5 ฟุต",
              },
              textColor: "#FFFFFF",
            },
          ],
        },
      },
      {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          spacing: "sm",
          contents: [
            {
              type: "text",
              text: "ผ้านวม 5–6 ฟุต",
              weight: "bold",
              size: "md",
              color: "#14213D",
            },
            {
              type: "text",
              text: "รวม 219 บาท (ซัก 160 + ส่ง 59)",
              size: "sm",
              color: "#1976D2",
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          backgroundColor: "#FFD23F",
          contents: [
            {
              type: "button",
              style: "primary",
              color: "#14213D",
              action: {
                type: "message",
                label: "เลือกแพ็กเกจนี้",
                text: "เลือกแพ็กเกจ ผ้านวม 5–6 ฟุต",
              },
              textColor: "#FFFFFF",
            },
          ],
        },
      },
    ],
  },
};

// module.exports = {
//   type: "template",
//   altText: "เลือกแพ็กเกจซักผ้า",
//   template: {
//     type: "image_carousel",
//     columns: [
//       {
//         imageUrl:
//           "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/ChatGPT%20Image%2013%20ก.ค.%202568%2015_24_48.png?alt=media&token=605da02a-a3b8-48b6-8bf6-58333819b00b",
//         action: {
//           type: "message",
//           label: "14 กก",
//           text: "ไม่เกิน 14 kg",
//         },
//       },
//       {
//         imageUrl:
//           "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/ChatGPT%20Image%2013%20ก.ค.%202568%2015_24_48.png?alt=media&token=605da02a-a3b8-48b6-8bf6-58333819b00b",
//         action: {
//           type: "message",
//           label: "14 - 18 kg",
//           text: "14 - 18 kg",
//         },
//       },
//       {
//         imageUrl:
//           "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/ChatGPT%20Image%2013%20ก.ค.%202568%2015_24_48.png?alt=media&token=605da02a-a3b8-48b6-8bf6-58333819b00b",
//         action: {
//           type: "message",
//           label: "3.5 ฟุต",
//           text: "เครื่องนอน 3.5 ฟุต",
//         },
//       },
//       {
//         imageUrl:
//           "https://firebasestorage.googleapis.com/v0/b/drop-and-go-6e3db.firebasestorage.app/o/ChatGPT%20Image%2013%20ก.ค.%202568%2015_24_48.png?alt=media&token=605da02a-a3b8-48b6-8bf6-58333819b00b",
//         action: {
//           type: "message",
//           label: "5-6 ฟุต",
//           text: "เครื่องนอน 5-6 ฟุต",
//         },
//       },
//     ],
//   },
// };
