import { Question } from "./types";

export const question: Question = {
    type: 'grid-match',
    title: '3.Visuospatial (ตาราง): จงคัดลอกรูปภาพจากด้านซ้ายไปยังช่องว่างทางด้านขวาให้เร็วที่สุดเท่าที่จะทําได้',
    image: 'https://images.unsplash.com/photo-1509228627152-1b0f5f3c4d2b?w=800',
    instructorVideo: "https://drive.google.com/file/d/1q7d3cXvRiY7DvIewocz6cn0ygSaP3ckN/view?usp=drive_link",
    gridPattern: [
        [false, false, false, true, false, false],
        [false, true, false, false, false, false],
        [false, false, false, false, true, true],
        [true, false, true, false, false, false]
    ],
    maxScore: 2
};
