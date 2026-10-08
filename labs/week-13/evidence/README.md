# หลักฐานการทำงานสัปดาห์ที่ 13 (Week 13 Evidence)

**หน่วยที่ 5 คุณภาพซอฟต์แวร์ การทดสอบ และความพร้อมก่อนใช้งาน** · งาน A5 คุณภาพและความปลอดภัย

- **นักศึกษา:** ณัฏฐกิตติ์ รอดเรือน (BELLprime)
- **รหัสนักศึกษา:** 68543210007 (SEC1)
- **Branch:** `unit5/week-13`
- **Submission Tag:** `lab-13-submission-v1`
- **Cloud Deployment:** [Campus Service บน Render + Turso](https://campus-service-w13.onrender.com)

---

## 1. ผลการตรวจด้วยสคริปต์อัตโนมัติ (`check-week13.mjs`)

ผ่านครบทุกข้อ **27/27 รายการ (100% เต็ม)**:

```text
✅ CP48 ชื่อผู้แจ้ง 100 ตัวผ่าน · 101 ตัวถูกปฏิเสธ
✅ CP48 รายละเอียด 1000 ตัวผ่าน · 1001 ตัวถูกปฏิเสธ
✅ CP48 สถานที่ยาวเกิน 100 ตัวถูกปฏิเสธ
✅ CP49 hashPassword คืนรูปแบบ scrypt$salt$hash
✅ CP49 รหัสผ่านเดียวกันได้ hash ต่างกัน (salt สุ่ม) และไม่มีรหัสผ่านจริงปน
✅ CP49 verifyPassword: ถูก → true · ผิด → false
✅ CP49 ตรวจ hash บัญชีเจ้าหน้าที่ใน schema.sql ได้
✅ CP49 ตาราง users มีคอลัมน์ role และ password_hash
✅ CP48 body ใหญ่เกิน 10kb → 413 เป็น JSON
✅ CP50 POST /api/auth/login ถูกต้อง → 200 พร้อม token (3 ส่วน)
✅ CP50 payload ของ token มี role=staff และ exp · ไม่มีรหัสผ่าน
✅ CP50 รหัสผ่านผิด กับ อีเมลที่ไม่มี → 401 ข้อความเดียวกัน
✅ CP50 ผู้แจ้งทั่วไป (ไม่มีรหัสผ่าน) เข้าสู่ระบบไม่ได้
✅ CP51 PUT ไม่มี token → 401
✅ CP51 PUT ด้วย token ปลอม (secret อื่น) → 401
✅ CP51 PUT ด้วย token ที่ไม่ใช่เจ้าหน้าที่ → 403
✅ CP51 เจ้าหน้าที่: PUT → 200 และ DELETE → 204
✅ CP51 GET และ POST ยังไม่ต้องเข้าสู่ระบบ
✅ CP51 ไม่ถอยหลัง · BUG #1 ของสัปดาห์ 12 ยังแก้อยู่ (ลบแล้วเพิ่มใหม่ → 201)
✅ CP52 production ไม่ตั้ง JWT_SECRET → ระบบไม่ยอม start
✅ CP52 production: error ไม่ส่ง stack trace ให้ผู้ใช้
✅ CP52 .env.example มี JWT_SECRET ค่าว่าง และ .gitignore มี .env (ไม่ commit ค่าลับ)
✅ CP52 npm test ใน api ผ่านทุกข้อ และมี test ของ 401 กับ 403
✅ CHAL ⭐ มี security header (X-Content-Type-Options: nosniff)
✅ CHAL ⭐ ผิดเกิน 5 ครั้ง → 429 (จำกัดการเดารหัสผ่าน)
✅ CHAL ⭐ frontend แนบ Authorization: Bearer ทุกคำขอ (ทำต่อใน Term Project)
✅ CHAL ⭐ render.yaml ให้ Render สร้าง JWT_SECRET (generateValue)

──────────────────────────────────────────────────────────
🏫 ในห้อง (CP48–CP52)   ผ่าน 23/23 รายการ
⭐ Challenge            ผ่าน 4/4 รายการ
──────────────────────────────────────────────────────────
ผ่าน 27/27 รายการ
```

---

## 2. ฟีเจอร์ความปลอดภัยและสิทธิ์ในระบบ (Key Security Highlights)

1. **Input Validation & Body Limit 10kb (CP48):**
   - ตรวจความยาวชื่อ $\le 100$, สถานที่ $\le 100$, รายละเอียด $\le 1000$ ตัวอักษร
   - ป้องกัน DoS ด้วย `express.json({ limit: '10kb' })` ตอบ `413 Payload Too Large` เมื่อขนาดข้อมูลเกิน
2. **Password Hashing ด้วย Scrypt & Timing-Safe Comparison (CP49):**
   - รหัสผ่านถูกเข้ารหัสทางเดียวรูปแบบ `scrypt$<salt>$<hash>` โดยสร้าง Salt สุ่ม 16 bytes ใหม่ทุกครั้ง
   - ตรวจสอบรหัสผ่านด้วย `crypto.timingSafeEqual` เพื่อป้องกัน Timing Attack
3. **JWT Authentication & Stateless Token (CP50):**
   - ออก JSON Web Token เมื่อเข้าสู่ระบบสำเร็จผ่าน `POST /api/auth/login` มีอายุ 2 ชั่วโมง
   - ตอบกลับ `401 Unauthorized` ด้วยข้อความเดียวกันทั้งกรณีรหัสผ่านผิดและไม่มีอีเมล (ป้องกัน User Enumeration)
4. **Role-Based Access Control Middleware (CP51):**
   - `authenticate`: ตรวจความถูกต้องของ Token ถ้าไม่มีหรือปลอม ตอบ `401`
   - `requireRole('staff')`: ตรวจบทบาทของผู้ใช้ ถ้าไม่ใช่เจ้าหน้าที่ ตอบ `403 Forbidden`
   - เปิดให้คนทั่วไปส่งและดูคำร้อง (`GET`, `POST`) แต่จำกัดการเปลี่ยนสถานะและลบคำร้อง (`PUT`, `DELETE`) เฉพาะเจ้าหน้าที่
5. **Fail-Fast Secret & Information Exposure Prevention (CP52):**
   - ในโหมด Production หากไม่มีตัวแปร `JWT_SECRET` เซิร์ฟเวอร์จะปฏิเสธการเริ่มทำงานทันที (Fail-Fast)
   - ปิดการส่ง Error Stack Trace ในโหมด Production ตอบเฉพาะข้อความผิดพลาดที่ปลอดภัย
6. **⭐ Security Challenges (ครบทั้ง 4 รายการ):**
   - Security Header: `X-Content-Type-Options: nosniff` ป้องกัน MIME Confusion
   - Rate Limiter: บล็อกการเดารหัสผ่านผิดเกิน 5 ครั้งด้วยสถานะ `429 Too Many Requests`
   - Frontend Bearer Token: `apiClient.js` แนบ Token อัตโนมัติในทุกคำขอ
   - Cloud Secret: `render.yaml` ใช้ `generateValue: true` สุ่มสร้าง Secret อย่างปลอดภัย
7. **Frontend Role-Based UI เต็มรูปแบบ:**
   - Navbar สลับปุ่มระหว่าง "เจ้าหน้าที่" และ "ออกจากระบบ (เจ้าหน้าที่ฝ่ายบริการ)"
   - ซ่อนปุ่มลบเมื่อไม่ได้ล็อกอิน และแสดงปุ่มลบเมื่อเป็นเจ้าหน้าที่
   - หน้ารายละเอียดแสดง Dropdown ให้เจ้าหน้าที่เลือกเปลี่ยนสถานะคำร้องได้สดๆ
