import { Question } from "./types";

export const question: Question = {
    type: 'multi-choice',
    title: 'จากภาพเหตุการณ์ที่คุณได้ดูไปก่อนหน้านี้ มี 3 รูปด้านล่างที่ไม่ปรากฏอยู่ในรูปภาพดังกล่าวจงเลือกรูปทั้ง 3 รูป',
    image: '/questions/question_mark.webp',
    instructorVideo: "https://drive.google.com/file/d/1TGtEVP7BDGd7CiEcHBdVSAA8u131H5tj/view?usp=drive_link",
    options: [
        {
            id: 'A',
            label: '',
            image: '/questions/question5_a1.webp',
        },
        {
            id: 'B',
            label: '',
            image: '/questions/question5_a2.webp',
        },
        {
            id: 'C',
            label: '',
            image: '/questions/question5_a3.webp',
        },
        {
            id: 'D',
            label: '',
            image: '/questions/question5_a4.webp',
        },
        {
            id: 'E',
            label: '',
            image: '/questions/question5_a5.webp',
        },
        {
            id: 'F',
            label: '',
            image: '/questions/question5_a6.webp',
        },
    ],
    correctAnswers: ["B", "D", "F"],
    maxScore: 3,
    requiredSelections: 3,
};
