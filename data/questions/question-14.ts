import { Question } from './types';

export const question: Question = {
    type: 'hint-manual',
    title: '14. Delayed Recall (ชื่อภาพ): รูปภาพที่ฉันแสดงให้ดูก่อนหน้านี้ คุณจําได้หรือไม่ว่า 4 ภาพ มีอะไรบ้าง',
    image: '/questions/question_mark.webp',
    instructorVideo: 'https://drive.google.com/file/d/1Q_tgGGAlKAu2LkKsKfHjnZU8Iw9bTB-k/view?usp=drive_link',
    hintInstructorVideo: 'https://drive.google.com/file/d/1dMVCPgx-B_L5-eRc91ykiIgd8PjMLXM1/view?usp=drive_link',
    hintItems: [
        { id: '1', label: '', hintImage: '/questions/question14_h1.webp' },
        { id: '2', label: '', hintImage: '/questions/question14_h2.webp' },
        { id: '3', label: '', hintImage: '/questions/question14_h3.webp' },
        { id: '4', label: '', hintImage: '/questions/question14_h4.webp' }
    ],
    maxScore: 8
};
