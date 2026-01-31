import { Question } from "./types";

export const question: Question = {
    type: 'choice',
    title: '13. Executive Function (หมวดหมู่): รูปใดในตัวเลือกต่อไปนี้ ที่เป็นตัวเลือกที่ดีที่สุดที่จะนําไปใส่ในช่องว่าง',
    image: '/questions/question13_q.webp',
    instructorVideo: "https://drive.google.com/file/d/1-VHPsOzKcF4Fvh_K218hHlsYFDcw6dZ0/view?usp=drive_link",
    correctAnswer: 'B',
    maxScore: 1,
    options: [
        {
            id: 'A',
            label: '',
            image: '/questions/question13_a1.webp',
        },
        {
            id: 'B',
            label: '',
            image: '/questions/question13_a2.webp',
        },
        {
            id: 'C',
            label: '',
            image: '/questions/question13_a3.webp',
        },
    ]
};
