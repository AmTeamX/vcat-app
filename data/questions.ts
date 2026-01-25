export type QuestionType = 'choice' | 'manual' | 'view' | 'grid-match' | 'multi-choice' | 'hint-manual';

export interface ChoiceOption {
    id: string;
    label: string;
    image: string;
}

export interface HintItem {
    id: string;
    label: string;
    hintImage?: string; // Image shown when hint is revealed
}

export interface Question {
    type: QuestionType;
    title: string;
    image: string;
    options?: ChoiceOption[];
    correctAnswer?: string;
    correctAnswers?: string[]; // For multi-choice questions
    instruction?: string;
    duration?: number; // For VIEW type questions (in seconds)
    maxScore?: number; // For MANUAL type questions
    instructorVideo?: string; // Sign language instructor video URL (shown before question)
    hintInstructorVideo?: string; // Video explaining hint system (for hint-manual questions)
    outroVideos?: string[]; // Videos shown after completing the question (before next question)
    outroScoreMax?: number; // Max score for manual scoring after outro videos (if needed)
    gridPattern?: boolean[][]; // For GRID-MATCH type questions (6x4 grid)
    requiredSelections?: number; // For multi-choice questions (how many items to select)
    hintItems?: HintItem[]; // For hint-manual questions (items with hints)
}

export const questions: Question[] = [
    // Question 1
    {
        type: 'view',
        title: 'ดูภาพเหตุการณ์นี้ 1 นาที',
        image: '/questions/question1_scene.png',
        instructorVideo: 'https://drive.google.com/file/d/1ZPK6nLfWL3A7Df8HKfqIZPdWbzW_12ee/view?usp=drive_link',
        duration: 60,
        outroVideos: [
            "https://drive.google.com/file/d/1T-COKlOpkMXWWVRBsDH84pwdKPs9pe-0/view?usp=drive_link",
            "https://drive.google.com/file/d/1OiGdhoYk9Ax-6mqP17uclBX4lizkAHpK/view?usp=drive_link"
        ]
    },

    // Question 2
    {
        type: 'choice',
        title: 'ตัวเลือกข้อใดต่อไปนี้ เมื่อพับแล้วจะได้ออกมาเป็นดังรูปด้านล่างนี้',
        image: '/questions/question2_q.png',
        instructorVideo: 'https://drive.google.com/file/d/1N0UN7lXzxE-U-0D8TkWtB6f-whygnMul/view?usp=drive_link', // Replace with actual sign language video
        options: [
            {
                id: 'A',
                label: '',
                image: '/questions/question2_a1.png',
            },
            {
                id: 'B',
                label: '',
                image: '/questions/question2_a2.png',

            },
            {
                id: 'C',
                label: '',
                image: '/questions/question2_a3.png',

            },
            {
                id: 'D',
                label: '',
                image: '/questions/question2_a4.png',

            },
        ],
        correctAnswer: 'B',
        maxScore: 1,
    },

    // Question 3
    {
        type: 'grid-match',
        title: 'จงคัดลอกรูปภาพจากด้านซ้ายไปยังช่องว่างทางด้านขวาให้เร็วที่สุดเท่าที่จะทําได้',
        image: 'https://images.unsplash.com/photo-1509228627152-1b0f5f3c4d2b?w=800',
        instructorVideo: "https://drive.google.com/file/d/1q7d3cXvRiY7DvIewocz6cn0ygSaP3ckN/view?usp=drive_link",
        gridPattern: [[false, false, false, true, false, false,],
        [false, true, false, false, false, false,],
        [false, false, false, false, true, true,],
        [true, false, true, false, false, false,],],
        maxScore: 2
    },

    // Question 4
    {
        type: 'manual',
        title: 'กากบาททับรูปร่าง',
        image: '/questions/question4_q.png',
        duration: 60,
        instructorVideo: "https://drive.google.com/file/d/10Ji6pQq7ViXeeFK2ZbjpbModsvYWeIWc/view?usp=drive_link",
        maxScore: 3,
        instruction: "ผิด 0 - 1 จุด = 3 คะแนน ผิด 2 จุด = 1 คะแนน ผิด 3 จุดหรือมากกว่า = 0 คะแนน"
    },

    // Question 5
    {
        type: 'multi-choice',
        title: 'จากภาพเหตุการณ์ที่คุณได้ดูไปก่อนหน้านี้ มี 3 รูปด้านล่างที่ไม่ปรากฏอยู่ในรูปภาพดังกล่าวจงเลือกรูปทั้ง 3 รูป',
        image: '/questions/question_mark.png',
        instructorVideo: "https://drive.google.com/file/d/1TGtEVP7BDGd7CiEcHBdVSAA8u131H5tj/view?usp=drive_link",
        options: [
            {
                id: 'A',
                label: '',
                image: '/questions/question5_a1.png',
            },
            {
                id: 'B',
                label: '',
                image: '/questions/question5_a2.png',
            },
            {
                id: 'C',
                label: '',
                image: '/questions/question5_a3.png',
            },
            {
                id: 'D',
                label: '',
                image: '/questions/question5_a4.png',
            },
            {
                id: 'E',
                label: '',
                image: '/questions/question5_a5.png',
            },
            {
                id: 'F',
                label: '',
                image: '/questions/question5_a6.png',
            },
        ],
        correctAnswers: ["B", "D", "F"],
        maxScore: 3,
        requiredSelections: 3,
    },

    // Question 6
    {
        type: 'view',
        title: 'ดูภาพรูปร่างต่อไปนี้ จากนั้นพยายามจํารายละเอียดให้ได้มากที่สุดเท่าที่สามารถทําได้ผม/ดิฉัน จะกลับมาถามคุณภายหลัง',
        image: '/questions/question6_q.png',
        instructorVideo: "https://drive.google.com/file/d/1uB3uh5mxuxa_1gHSNuhh0YT3Up1km2KL/view?usp=drive_link",
        duration: 10
    },

    // Question 7
    {
        type: 'manual',
        title: 'จงบอกชื่อรูปภาพต่อไปนี้',
        image: '/questions/question7_q.png',
        instructorVideo: "https://drive.google.com/file/d/13CoSxDQp-aR4gzqITqxHIWEOkMxbGC6i/view?usp=drive_link",
        maxScore: 3,
        instruction: "ให้คะแนน 1 คะแนนต่อชื่อที่ถูกต้อง"
    },

    // Question 8
    {
        type: 'manual',
        title: 'จงบอกชื่อผักให้มากที่สุดเท่าที่คุณจะทําได้',
        image: '/questions/question_mark.png',
        instructorVideo: "https://drive.google.com/file/d/1_TuqhsAaiNs7KzfvJNnlOGiUQmJYWo7l/view?usp=drive_link",
        maxScore: 2,
        duration: 60,
        instruction: "บอกได้ 8 - 10 คํา = 1 คะแนนบอกได้มากกว่า 10 คํา = 2 คะแนน"
    },

    // Question 9
    {
        type: 'manual',
        title: 'หากเฟืองหมายเลข 1 หมุนไปในทิศทางตามที่หัวลูกศรชี้ ให้วาดลูกศรชี้ทิศทางที่เฟืองหมายเลขอื่น จะหมุนไป',
        image: '/questions/question_mark.png',
        instructorVideo: "https://drive.google.com/file/d/1prJIV-vbI7or5-Wfjak5FdmRpkEX-LCb/view?usp=drive_link",
        outroVideos: ["https://drive.google.com/file/d/1Elowky5GhPDz8nHvicDuRHZ16lYwW3Pa/view?usp=drive_link"],
        maxScore: 1,
        outroScoreMax: 2,
        instruction: "วาดผิดทั้ง 2 ข้อ = 0 คะแนนวาดถูก 1 ข้อ = 1 คะแนน วาดถูก 2 ข้อ = 3 คะแนน"
    },

    // Question 10
    {
        type: 'manual',
        title: 'จากภาพรูปร่างที่ ผม/ดิฉัน แสดงให้ดูก่อนหน้านี้ ให้คุณลองนึกและเติมรูปร่างในตารางให้เหมือนกับทีคุณเห็น',
        image: '/questions/question10_q.png',
        instructorVideo: "https://drive.google.com/file/d/1nUh4ZQM3OP9z2ZRx49Cjdtvl2-XwA6hp/view?usp=drive_link",
        maxScore: 2,
        instruction: "ถูก 0 - 1 รูป = 0 คะแนนถูก 2 - 3 รูป = 1 คะแนนถูก 4 รูป (ถูกทั้งหมด) = 2คะแนน *ต้องถูกทั้งรูปร่างและตําแหน่ง"
    },
    // Question 11
    {
        type: 'view',
        title: 'จงบอกชื่อภาพต่อไปนี้ พูดทวนซ้ํา 2 รอบ จากนั้นให้คุณจําภาพทั้ง 4 ภาพนี้ไว้ ผม/ดิฉัน จะกลับมาถามอีกครั้ง',
        image: '/questions/question11_q.png',
        instructorVideo: "https://drive.google.com/file/d/1HNl8jGTGnLvp_RGrHJwtwpAcybxalx-S/view?usp=drive_link",
        duration: 40
    },

    // Question 12
    {
        type: 'manual',
        title: 'ดูที่รูปแบบภาพด้านล่าง จงวาดรูปแบบในช่องว่างให้ถูกต้อง',
        image: '/questions/question12_q.png',
        instructorVideo: "https://drive.google.com/file/d/1AqseqDPRkKpktcC-McFYWkeYAS2oojKo/view?usp=drive_link",
        maxScore: 2,
        instruction: "1 คะแนน สําหรับคําตอบทีถูกต้องในแต่ละข้อ *ขนาดของรูปไม่มีผลต่อการให้คะแนน หากยังสามารถระบุได้ว่าเป็นคําตอบที่ถูกต้อง"
    },

    // Question 13: MANUAL - Follow instructions
    {
        type: 'choice',
        title: 'รูปใดในตัวเลือกต่อไปนี้ ที่เป็นตัวเลือกที่ดีที่สุดที่จะนําไปใส่ในช่องว่าง',
        image: '/questions/question13_q.png',
        instructorVideo: "https://drive.google.com/file/d/1-VHPsOzKcF4Fvh_K218hHlsYFDcw6dZ0/view?usp=drive_link",
        correctAnswer: 'B',
        maxScore: 1,
        options: [
            {
                id: 'A',
                label: '',
                image: '/questions/question13_a1.png',
            },
            {
                id: 'B',
                label: '',
                image: '/questions/question13_a2.png',
            },
            {
                id: 'C',
                label: '',
                image: '/questions/question13_a3.png',
            },
        ]
    },

    // Question 14: CHOICE - Identify shape
    {
        type: 'hint-manual',
        title: 'รูปภาพที่ผม/ดิฉัน แสดงให้ดูก่อนหน้านี้ คุณจําได้หรือไม่ว่า 4 ภาพ มีอะไรบ้าง',
        image: '/questions/question_mark.png',
        instructorVideo: 'https://drive.google.com/file/d/1Q_tgGGAlKAu2LkKsKfHjnZU8Iw9bTB-k/view?usp=drive_link',
        hintInstructorVideo: 'https://drive.google.com/file/d/1dMVCPgx-B_L5-eRc91ykiIgd8PjMLXM1/view?usp=drive_link',

        hintItems: [
            { id: '1', label: '', hintImage: '/questions/question14_h1.png' },
            { id: '2', label: '', hintImage: '/questions/question14_h2.png' },
            { id: '3', label: '', hintImage: '/questions/question14_h3.png' },
            { id: '4', label: '', hintImage: '/questions/question14_h4.png' }
        ],
        maxScore: 8
    },
];
