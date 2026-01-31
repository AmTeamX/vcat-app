import { Question } from "./types";


export const question: Question = {
    type: 'choice',
    title: '2. Visuospatial (ลูกบาศก์): ตัวเลือกข้อใดต่อไปนี้ เมื่อพับแล้วจะได้ออกมาเป็นดังรูปด้านล่างนี้',
    image: '/questions/question2_q.webp',
    instructorVideo: 'https://drive.google.com/file/d/1N0UN7lXzxE-U-0D8TkWtB6f-whygnMul/view?usp=drive_link',
    options: [
        {
            id: 'A',
            label: '',
            image: '/questions/question2_a1.webp',
        },
        {
            id: 'B',
            label: '',
            image: '/questions/question2_a2.webp',

        },
        {
            id: 'C',
            label: '',
            image: '/questions/question2_a3.webp',

        },
        {
            id: 'D',
            label: '',
            image: '/questions/question2_a4.webp',

        },
    ],
    correctAnswer: 'B',
    maxScore: 1,
};
