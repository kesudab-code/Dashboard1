# คู่มือการติดตั้ง Firebase Realtime Database และขึ้นระบบ (Deployment Guide)

คู่มือนี้จะอธิบายขั้นตอนการนำระบบประเมินความพึงพอใจการอบรมไปใช้งานจริง โดยแบ่งเป็น 2 ไฟล์หลัก:
1. `survey.html` — หน้าแบบประเมินสำหรับให้ผู้เข้าอบรมสแกนเปิดบนมือถือ
2. `dashboard.html` — หน้าแดชบอร์ดสรุปผลแบบเรียลไทม์ สำหรับผู้จัดฉายขึ้นจอโปรเจกเตอร์

---

## สรุปจุดเด่นของระบบ
- ✅ **ฟรี 100% (No Credit Card)**: ใช้ Firebase Spark Plan (โหมดฟรี ไม่ต้องผูกบัตรเครดิต)
- ✅ **ไม่ต้องเขียน Backend**: ข้อมูลวิ่งตรงระหว่างมือถือผู้ตอบและจอแดชบอร์ดด้วย Realtime Database
- ✅ **ไม่ต้องติดตั้ง npm หรือ Node.js**: ดับเบิลคลิกเปิดไฟล์ `.html` ได้ทันที หรืออัปโหลดขึ้นเว็บโฮสติ้งฟรี
- ✅ **ป้องกันการตอบซ้ำ**: มีระบบจำกัดการตอบซ้ำในอุปกรณ์เดียวกันด้วย LocalStorage
- ✅ **ดาวน์โหลดผลเป็น CSV**: รองรับภาษาไทยสมบูรณ์แบบ เปิดใน Excel สระไม่เพี้ยน (UTF-8 BOM)

---

## ขั้นตอนที่ 1: สร้าง Firebase Project (ฟรี)

1. เข้าเว็บไซต์ [Firebase Console](https://console.firebase.google.com/) แล้วล็อกอินด้วย Google Account
2. กดปุ่ม **"Add project"** (สร้างโปรเจกต์)
3. ตั้งชื่อโปรเจกต์ เช่น `training-satisfaction-survey` แล้วกด Continue
4. ส่วน Google Analytics สามารถเลือกเปิดหรือปิดก็ได้ แล้วกด **"Create project"**
5. รอระบบสร้างโปรเจกต์ประมาณ 30 วินาที เมื่อเสร็จแล้วกด **"Continue"**

---

## ขั้นตอนที่ 2: เปิดใช้งาน Firebase Realtime Database

1. ในเมนูด้านซ้ายของ Firebase Console ไปที่ **Build** > **Realtime Database**
2. กดปุ่ม **"Create Database"**
3. เลือกตำแหน่งเซิร์ฟเวอร์ (Realtime Database Location):
   - แนะนำเลือก **Singapore (`asia-southeast1`)** หรือ **United States (`us-central1`)** เพื่อความเร็วในการตอบสนองสูงสุดในไทย
4. ในหน้าถัดไป ส่วน Security Rules ให้เลือก **"Start in test mode"** แล้วกด **"Enable"**

---

## ขั้นตอนที่ 3: ตั้งค่า Security Rules (กฎความปลอดภัย)

เพื่อให้ผู้ตอบสามารถบันทึกข้อมูลได้โดยไม่ต้องล็อกอิน และให้หน้า Dashboard อ่านผลได้:
1. ในหน้า Realtime Database ให้คลิกที่แท็บ **"Rules"** ด้านบน
2. แก้ไขโค้ดในช่องเป็นข้อความด้านล่างนี้:

```json
{
  "rules": {
    "satisfaction_responses": {
      ".read": true,
      ".write": true
    }
  }
}
```

3. กดปุ่ม **"Publish"** (เผยแพร่) ที่มุมขวาบน

---

## ขั้นตอนที่ 4: คัดลอก `firebaseConfig` มาใส่ในโค้ด

1. ใน Firebase Console ให้คลิกรูป **ฟันเฟือง (Project Settings)** ที่มุมบนซ้ายข้าง Project Overview
2. เลื่อนลงมาที่หัวข้อ **"Your apps"**
3. คลิกไอคอน **เว็บ `</>` (Web App)**
4. ตั้งชื่อ App เช่น `survey-web` แล้วกด **"Register app"**
5. ระบบจะแสดงโค้ด `firebaseConfig` ออกมา ดังตัวอย่างนี้:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxx...",
  authDomain: "training-survey-xxxx.firebaseapp.com",
  databaseURL: "https://training-survey-xxxx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "training-survey-xxxx",
  storageBucket: "training-survey-xxxx.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef..."
};
```

6. เปิดไฟล์ `survey.html` และ `dashboard.html` ด้วย Text Editor (เช่น VS Code หรือ Notepad)
7. มองหาบรรทัดที่มีข้อความ:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     ...
   };
   ```
8. นำค่าที่คุณคัดลอกมาวางแทนที่ลงไป **ทั้งในไฟล์ `survey.html` และ `dashboard.html`** แล้วบันทึกไฟล์

---

## ขั้นตอนที่ 5: วิธีนำขึ้นเว็บฟรี (Free Deployment)

คุณสามารถเลือกใช้วิธีที่สะดวกได้ดังนี้:

### ทางเลือก A: เผยแพร่ผ่าน GitHub Pages (ง่ายและฟรีตลอดชีพ)
1. เข้า [github.com](https://github.com) สร้าง Repository ใหม่ เช่น `training-survey` (ตั้งเป็น Public)
2. อัปโหลดไฟล์ `survey.html` และ `dashboard.html` ขึ้นไป
3. ไปที่แท็บ **Settings** > **Pages**
4. ในหัวข้อ **Branch** ให้เลือก `main` แล้วกด **Save**
5. รอ 1-2 นาที คุณจะได้ URL เว็บไซต์ เช่น:
   - ลิงก์หน้าตอบ: `https://<username>.github.io/training-survey/survey.html`
   - ลิงก์หน้าจอ: `https://<username>.github.io/training-survey/dashboard.html`

### ทางเลือก B: เผยแพร่ผ่าน Firebase Hosting (แนะนำสำหรับผู้ใช้ Firebase)
1. ติดตั้ง Firebase CLI บนคอมพิวเตอร์ของคุณ:
   ```bash
   npm install -g firebase-tools
   ```
2. ล็อกอิน Firebase:
   ```bash
   firebase login
   ```
3. รันคำสั่งตั้งค่าในโฟลเดอร์ที่มีไฟล์:
   ```bash
   firebase init hosting
   ```
   (เลือกโปรเจกต์เดิม และระบุโฟลเดอร์ปัจจุบัน)
4. อัปโหลดขึ้น Cloud:
   ```bash
   firebase deploy --only hosting
   ```
5. ระบบจะมอบ URL พร้อมใช้งานทันที เช่น `https://training-survey-xxxx.web.app/survey.html`

### ทางเลือก C: อัปโหลดบน Vercel หรือ Netlify (ลากและวางไฟล์)
1. ลากโฟลเดอร์ที่มีไฟล์ทั้งสองไปวางที่หน้าเว็บ [app.netlify.com/drop](https://app.netlify.com/drop)
2. ได้รับ URL เว็บทันทีภายใน 10 วินาที

---

## วิธีใช้งานจริงในวันจัดอบรม

1. **ก่อนเริ่มงาน:**
   - ผู้จัดเปิดหน้า `dashboard.html` บนแล็ปท็อปที่ต่อกับโปรเจกเตอร์
   - กดปุ่ม **"ฉาย QR Code"** ขึ้นบนจอใหญ่เพื่อให้ผู้เข้าอบรมเห็นได้ชัดเจน
2. **ระหว่างหรือหลังจบการอบรม:**
   - เชิญชวนผู้เข้าอบรมยกสมาร์ตโฟนขึ้นมาสแกน QR Code บนจอ
   - เมื่อผู้เข้าอบรมกด "ส่งแบบประเมิน" ผลคะแนนเฉลี่ย, สัดส่วนดาว, และข้อความจะวิ่งขึ้นสู่หน้าจอโปรเจกเตอร์แบบสดทันที!
3. **สรุปรายงานการอบรม:**
   - ผู้จัดกดปุ่ม **"ดาวน์โหลด CSV"** เพื่อบันทึกข้อมูลทุกรายการไปเปิดใน Microsoft Excel เพื่อทำรายงานสรุปส่งต่อได้อย่างรวดเร็ว
