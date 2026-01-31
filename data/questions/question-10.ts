import { Question } from "./types";

export const question: Question = {
    type: 'manual',
    title: '10.Delayed Recall (รูปร่าง): จากภาพรูปร่างที่แสดงให้ดูก่อนหน้านี้ ให้คุณลองนึกและเติมรูปร่างในตารางให้เหมือนกับที่คุณเห็น',
    image: '/questions/question10_q.webp',
    instructorVideo: "https://drive.google.com/file/d/1nUh4ZQM3OP9z2ZRx49Cjdtvl2-XwA6hp/view?usp=drive_link",
    maxScore: 2,
    instruction: "ถูก 0 - 1 รูป = 0 คะแนน.ถูก 2 - 3 รูป = 1 คะแนน.ถูก 4 รูป (ถูกทั้งหมด) = 2 คะแนน.ต้องถูกทั้งรูปร่างและตําแหน่ง"
};
