# AI_USAGE — LAB 13 (Unit 5: Quality & Security)

บันทึกการใช้ AI ระหว่างทำงาน · **ใช้ AI ได้ แต่ต้องเป็นเจ้าของโค้ดที่ส่ง**

> ผู้สอนจะสุ่มถามจากโค้ดที่ส่ง — ถ้าอธิบายไม่ได้ คะแนนส่วนนั้นจะถูกทบทวน

---

## ครั้งที่ 1 · หลักการทำงานของ Password Hashing ใน CP49 (scrypt + salt สุ่ม)

**ถามอะไร**
- ช่วยอธิบายหลักการทำงานของ password hashing ของ CP49 มาหน่อย (การเก็บ hash ใน `schema.sql`, การสร้างบัญชีด้วย `npm run create-staff`, และฟังก์ชัน `hashPassword` / `verifyPassword` ใน `api/src/utils/password.js`)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- **โครงสร้างของ Hash:** เก็บในรูปแบบ `scrypt$<salt>$<hash>` (แบ่งออกเป็น 3 ส่วนคั่นด้วยเครื่องหมาย `$`)
  1. `scheme`: ระบุขั้นตอนวิธีที่ใช้คือ `scrypt`
  2. `salt`: เกลือสุ่มขนาด 16 bytes (32 ตัวอักษร hex) สุ่มขึ้นมาสดใหม่ทุกครั้งด้วย `randomBytes(16)` เพื่อให้รหัสผ่านคำเดียวกัน ได้ Hash ต่างกัน ป้องกันการใช้ Rainbow Table โจมตี
  3. `hash`: ผลลัพธ์จากการนำ Plaintext password + Salt เข้าฟังก์ชันทางคณิตศาสตร์ `scryptSync(plain, salt, 64)` ได้ข้อความ hex ยาว 128 ตัวอักษร
- **One-way Function (การแปลงทางเดียว):** `scrypt` เป็นฟังก์ชันทางเดียว ไม่สามารถถอดรหัสย้อนกลับได้ (No Decryption) ป้องกันการรั่วไหลของรหัสผ่านจริงแม้ไฟล์ฐานข้อมูล (`campus.db`) จะหลุดออกไป
- **การตรวจสอบรหัสผ่าน (`verifyPassword`):**
  - ดึง salt และ expected hash จากฐานข้อมูลด้วยการตัดแบ่งสตริงด้วย `$`
  - นำรหัสผ่านที่ผู้ใช้พิมพ์เข้ามาไปคำนวณซ้ำด้วย Salt เดิม
  - ตรวจสอบความถูกต้องด้วย `timingSafeEqual(actual, expected)` เพื่อป้องกัน Timing Attack
- **การเชื่อมโยงในระบบ:**
  - `api/data/schema.sql`: เก็บค่า hash สำเร็จรูปของ `staff1234` สำหรับบัญชีตั้งต้นในการพัฒนา
  - `api/scripts/create-staff.mjs`: ใช้ฟังก์ชัน `hashPassword` ตัวเดียวกันในการสร้างหรือเปลี่ยนรหัสผ่านเจ้าหน้าที่คนใหม่ในระบบ Production โดยไม่เก็บรหัสผ่านจริงลงในดิสก์

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำหลักการนี้ไปทำความเข้าใจการทำงานของ `api/src/utils/password.js`, การเปรียบเทียบด้วย `timingSafeEqual`, และลำดับการคำนวณของ `scrypt` เพื่อให้สามารถอธิบายโค้ดและตอบคำถามเชิงวิศวกรรมปากเปล่ากับผู้สอนได้

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2 · ภาพรวมเส้นทางการทำงานของระบบ (End-to-End Request Flow) จาก End-User ถึง Database

**ถามอะไร**
- ช่วยบอกภาพรวมของการทำงานหน่อย ถ้าเริ่มจาก enduser จะผ่านที่ไหนบ้าง (Request Lifecycle และด่านตรวจความปลอดภัย)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- **โครงสร้าง 3 ชั้นหลัก:**
  1. **Frontend (React UI บน Browser):** รับ input จากผู้ใช้, ตรวจสอบเบื้องต้น (Client-side validation), และยิงคำขอผ่าน `fetch` / `apiClient.js`
  2. **Backend (Express API Server):** ผ่าน Middlewares ด่านตรวจ 4 ด่าน (CORS/Body limit 10kb → Router → Validation / Authentication 401 / Authorization 403) → ส่งต่อให้ Controller และ Service
  3. **Database (SQLite `campus.db`):** Service รัน Parameterized SQL Query (`prepare().run()`) เพื่ออ่าน/บันทึกข้อมูลอย่างปลอดภัย
- **เส้นทาง 2 รูปแบบ:**
  - **รูปแบบที่ 1 (Public Flow - เช่น ดูหรือส่งคำร้อง):** `User UI` ─▶ `apiClient` ─▶ `express.json(10kb)` ─▶ `validateRequest` ─▶ `requestController` ─▶ `requestService` ─▶ `campus.db` ─▶ ตอบ 201 Created
  - **รูปแบบที่ 2 (Protected Staff Flow - เช่น เปลี่ยนสถานะหรือลบคำร้อง):** เจ้าหน้าที่ต้อง Login ได้รับ JWT ก่อน ─▶ แนบ Header `Authorization: Bearer <token>` ─▶ ผ่านด่าน `authenticate` (ตรวจ token) ─▶ ผ่านด่าน `requireRole('staff')` (ตรวจสิทธิ์) ─▶ Controller ทำงาน ─▶ ตอบ 200 OK หรือ 204 No Content
- **การจัดการความปลอดภัยและ Error:** หากผิดด่านไหน เซิร์ฟเวอร์จะตัดไฟตอบกลับทันที (413 / 400 / 401 / 403 / 404 / 500) โดยไม่ส่ง stack trace ออกไปในโหมด Production

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำความเข้าใจภาพรวม Request Lifecycle นี้ไปใช้อธิบายสถาปัตยกรรมระบบ 3 ชั้น และลำดับการทำงานของ Middleware ในการสัมภาษณ์และนำเสนอ Final Term Project

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---
