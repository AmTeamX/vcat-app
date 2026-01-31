# VCAT App

ระบบบริหารจัดการและทำแบบทดสอบ VCAT (Vascular Cognitive impairment Assessment Tool)
พัฒนาด้วย Next.js และ SurrealDB สำหรับใช้ในการประเมินและติดตามผลผู้ป่วย

## ฟีเจอร์หลัก

- **ระบบสมาชิก (Authentication)**:
  - เข้าสู่ระบบ/ลงทะเบียน (รองรับ Registration Codes)
  - จัดการ Session ด้วย Cookie ที่ปลอดภัย

- **การจัดการผู้ป่วย (Patient Management)**:
  - เพิ่มข้อมูลผู้ป่วยใหม่
  - ดูรายชื่อและประวัติการทดสอบของผู้ป่วย

- **ระบบทำแบบทดสอบ (Test Administration)**:
  - รองรับแบบทดสอบ VCAT รูปแบบต่างๆ (Multiple Choice, Grid Matching, Manual Scoring, etc.)
  - Test Runners ที่ปรับแต่งได้ตามประเภทคำถาม (Question 1-14)
  - ระบบจับเวลาและบันทึกคำตอบ

- **การประมวลผลและรายงานผล (Scoring & Results)**:
  - คำนวณคะแนนอัตโนมัติ (Automated Scoring)
  - ระบบให้คะแนนโดยผู้เชี่ยวชาญ (Manual Scoring Inputs)
  - Dashboard แสดงผลลัพธ์การทดสอบ

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SurrealDB
- **Styling**: Tailwind CSS 4
- **Libraries**:
  - `surrealdb`: การเชื่อมต่อฐานข้อมูล
  - `bcryptjs`: การเข้ารหัสรหัสผ่าน
  - `cookie`: การจัดการ Session cookies

## การติดตั้งและใช้งาน (Getting Started)

### 1. Prerequisites

- Node.js (v20 ขึ้นไป)
- SurrealDB (ติดตั้งและรัน Service หรือใช้ Cloud)

### 2. การติดตั้ง (Installation)

1. **Clone repository**

   ```bash
   git clone <repository-url>
   cd vcat-app
   ```

2. **ติดตั้ง Dependencies**

   ```bash
   npm install
   ```

3. **ตั้งค่า Environment Variables**
   สร้างไฟล์ `.env.local` ที่ root ของโปรเจค โดยคัดลอกโครงสร้างจาก `example.env`:

   ```bash
   cp example.env .env.local
   ```

   แก้ไขค่าในไฟล์ `.env.local` ให้ถูกต้อง:

   ```env
   # SurrealDB Configuration
   SURREALDB_URL=wss://localhost:8000/rpc # หรือ URL ของ Cloud Instance
   SURREALDB_NAMESPACE=vcat
   SURREALDB_DATABASE=vcat_db
   SURREALDB_USER=root
   SURREALDB_PASS=root

   # Security
   SESSION_SECRET=your_super_secret_key
   REGISTRATION_CODES=code1,code2 # รหัสสำหรับลงทะเบียน (ถ้ามี)
   ```

### 3. เตรียมฐานข้อมูล (Database Setup)

รัน script เพื่อ seed ข้อมูลเบื้องต้น (เช่น ผู้ดูแลระบบ หรือคำถาม):

```bash
npm run db:seed
```

### 4. รันโปรแกรม (Run Development Server)

```bash
npm run dev
```

เปิด Browser ไปที่ [http://localhost:3000](http://localhost:3000)

## โครงสร้างโปรเจค (Project Structure)

- `app/`: หน้าเว็บ (Pages) และ API Routes (Next.js App Router)
  - `api/`: Backend endpoints (Auth, Patients, Test Sessions)
  - `dashboard/`: หน้า Dashboard สำหรับดูข้อมูลและผลลัพธ์
  - `test/`: หน้าทำแบบทดสอบ
- `components/`: UI Components และ Test Runners
  - `TestRunner/`: Components ย่อยสำหรับแบบทดสอบแต่ละข้อ
  - `TestRunners/`: Wrapper Components สำหรับคำถามแต่ละชุด
- `data/`: ข้อมูลคำถาม (Questions Data) และ Types
- `lib/`: ฟังก์ชัน Utility
  - `db.ts`: การเชื่อมต่อ SurrealDB
  - `auth.ts`: Authentication Logic
  - `scoring-*.ts`: Logic การคำนวณคะแนน
- `public/`: ไฟล์ Static (รูปภาพ, ไอคอน)

## Scripts

- `npm run dev`: รันเซิฟเวอร์โหมด Development
- `npm run build`: Build โปรเจคสำหรับ Production
- `npm run start`: รันเซิฟเวอร์โหมด Production
- `npm run db:seed`: รัน script เพื่อ Seed ข้อมูลลงฐานข้อมูล
