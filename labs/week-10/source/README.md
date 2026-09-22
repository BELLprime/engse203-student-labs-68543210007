# ENGSE203 LAB 10 — Student Evidence README

## ผู้จัดทำ

- **ชื่อ–นามสกุล:** นายณัฏฐกิตติ์ รอดเรือน
- **รหัสนักศึกษา:** 68543210007-9
- **Section:** Sec 1
- **ระบบปฏิบัติการที่ใช้:** Windows 11 / WSL2 (Ubuntu 24.04 LTS)
- **Node version:** v22.23.1
- **Branch:** `unit4/week-10`
- **วันที่ทดสอบ:** 22 กันยายน 2026

## URLs

- **Repository:** [https://github.com/BELLprime/engse203-student-labs-68543210007](https://github.com/BELLprime/engse203-student-labs-68543210007)
- **Pages Hub:** [https://BELLprime.github.io/engse203-student-labs-68543210007/](https://BELLprime.github.io/engse203-student-labs-68543210007/)
- **Weekly Result:** [https://BELLprime.github.io/engse203-student-labs-68543210007/labs/week-10/](https://BELLprime.github.io/engse203-student-labs-68543210007/labs/week-10/)
- **Pull Request:** *(ระบุเมื่อเปิด PR บน GitHub)*

---

## สถาปัตยกรรมระบบและการบูรณาการฐานข้อมูล (Architecture & Integration)

```text
┌───────────────────────────┐         HTTP (JSON)        ┌───────────────────────────┐
│     React Frontend        │ <────────────────────────> │    Express API Server     │
│   (Vite @ Port 5173)      │                            │     (Node @ Port 3001)    │
└───────────────────────────┘                            └─────────────┬─────────────┘
                                                                       │
                                                         node:sqlite   │ DatabaseSync
                                                         (SQL / JOIN)  ▼
                                                         ┌───────────────────────────┐
                                                         │     SQLite Database       │
                                                         │       (campus.db)         │
                                                         └───────────────────────────┘
```

### การทำ Data Mapping ระหว่าง Database กับ Frontend
- **Database Schema:** เก็บ `requester_id` ชี้ไปยังตาราง `users` เพื่อรักษาหลัก Normalization
- **API Response:** คืน `requesterName` ให้ Frontend เพื่อให้ไม่ต้องยิงดึงข้อมูลซ้ำซ้อน
- **Service Layer:** ใช้คำสั่ง `JOIN users u ON u.id = r.requester_id` และกำหนด Alias `AS requesterName`

---

## วัตถุประสงค์ของงาน

1. เปลี่ยนระบบจัดเก็บข้อมูลของ Express API จากไฟล์ JSON มาเป็นฐานข้อมูลเชิงสัมพันธ์ **SQLite (`campus.db`)** ด้วยโมดูลมาตรฐาน `node:sqlite`
2. คง Signature ของฟังก์ชันใน `requestService.js` ให้เหมือนเดิม 100% เพื่อไม่ให้กระทบต่อ Controller และ Frontend (Backward Compatibility)
3. ใช้งาน Parameterized Query (`?` placeholder) ในทุกคำสั่ง SQL เพื่อป้องกันช่องโหว่ **SQL Injection (CP31)**
4. จัดการแปลง Database Constraints Error ให้เป็น `AppError` พร้อม HTTP Status Code ที่เหมาะสม (400/409) และข้อความภาษาไทย (CP32)
5. เขียนและรันชุดทดสอบอัตโนมัติ (Automated Tests ด้วย `supertest`) ครอบคลุมทั้งกรณีปกติ, Error Handling และ SQL Injection (CP33)
6. อัปเดตเอกสาร `API_CONTRACT.md` เวอร์ชัน 2.0.0 ให้มีหัวข้อ Data Model, Data Mapping, และระบุพฤติกรรม Auto User Creation (CP34)
7. พัฒนา Challenge ครบถ้วน: Endpoint `/api/users`, การใช้ Database Transaction (`BEGIN`, `COMMIT`, `ROLLBACK`), และการสร้าง `INDEX` เพิ่มประสิทธิภาพ

---

## 🛡️ ผลการทดสอบความปลอดภัย (SQL Injection Prevention — CP31)

ได้ทำการทดสอบส่ง SQL Injection ผ่าน Query Parameter `?status=` เพื่อพิสูจน์ว่าระบบป้องกันการโจมตีได้จริง:

| ลำดับ | การทดสอบ | คำสั่งที่ยิง | ผลลัพธ์ที่ได้ | ผลการประเมิน |
|---|---|---|---|---|
| **1** | เงื่อนไขจริงเสมอ (Always True) | `GET /api/requests?status=x' OR '1'='1` | `[]` (0 รายการ) | ✅ ปลอดภัย (ไม่หลุดข้อมูล) |
| **2** | พยายามลบตาราง (DROP TABLE) | `GET /api/requests?status='; DROP TABLE requests; --` | `[]` (0 รายการ) | ✅ ปลอดภัย (ตารางยังอยู่ครบ) |
| **3** | ต่อเงื่อนไขเพิ่ม (Extra Condition) | `GET /api/requests?status=pending' OR status='completed` | `[]` (0 รายการ) | ✅ ปลอดภัย (ไม่ข้ามเงื่อนไข) |
| **4** | ตรวจสอบข้อมูลหลังยิง | `GET /api/requests` | คืนข้อมูลปกติ | ✅ ตาราง `requests` ไม่ได้รับผลกระทบ |

> **สรุป:** ระบบปลอดภัยจาก SQL Injection 100% เนื่องจากใน `requestService.js` ใช้ `db.prepare(...).all(?)` (Parameterized Query) ของ `node:sqlite` ทำให้ค่าที่รับจากผู้ใช้ถูกมองเป็น Data Literal เสมอ

---

## วิธีติดตั้งและรันคำสั่งทดสอบ

```bash
# 1. เข้าสู่โฟลเดอร์ source ของ Week 10
cd labs/week-10/source

# 2. ติดตั้ง Dependencies (ถ้ายังไม่ได้ติดตั้ง)
npm install

# 3. รันตัวตรวจเช็คอัตโนมัติประจำสัปดาห์ (Checker 31/31)
node --disable-warning=ExperimentalWarning check-week10.mjs

# 4. ตรวจสอบความเข้ากันได้ย้อนหลังกับ Week 07 (Checker 36/36)
node --disable-warning=ExperimentalWarning check-week07.mjs

# 5. รัน Unit/Integration Test ด้วย Supertest
npm test
```

---

## ผลการตรวจผ่าน Checker

- **`check-week10.mjs`:** **31/31 ผ่านครบถ้วน 100%** (ในห้อง 20/20, การบ้าน 8/8, Challenge 3/3)
- **`check-week07.mjs`:** **36/36 ผ่านครบถ้วน 100%** (ยืนยัน Backward Compatibility)

---

## โครงสร้างโฟลเดอร์

```text
labs/week-10/
├── README.md               # คู่มือใบงานต้นฉบับประจำสัปดาห์
├── lab-metadata.json       # ข้อมูลกำกับสถานะการส่งงานและผลการทดสอบ
├── lab10/                  # คู่มือ In-Class และ Take-Home
├── guides/                 # สไลด์และเอกสารประกอบการสอน HTML
├── evidence/               # หลักฐานการทดสอบ
│   ├── SECURITY_TEST.md    # รายงานผลการทดสอบความปลอดภัย SQL Injection
│   └── images/             # รูปภาพ Screenshot หลักฐานการทดสอบ
└── source/
    ├── README.md           # รายงานการส่งงานของนักศึกษา (เอกสารฉบับนี้)
    ├── AI_USAGE.md         # บันทึกการใช้งานและการเรียนรู้ผ่าน AI
    ├── API_CONTRACT.md     # ข้อตกลง API Contract v2.0.0
    ├── check-week10.mjs    # สคริปต์ตรวจเช็คของสัปดาห์ที่ 10
    ├── check-week07.mjs    # สคริปต์ตรวจเช็คความเข้ากันได้ย้อนหลัง
    ├── api/                # Express API Backend
    │   ├── data/
    │   │   ├── campus.db   # ฐานข้อมูล SQLite
    │   │   └── schema.sql  # DDL สคริปต์สร้างตารางและ Index
    │   ├── src/
    │   │   ├── app.js
    │   │   ├── server.js
    │   │   ├── config.js
    │   │   ├── controllers/
    │   │   ├── middleware/
    │   │   ├── routes/
    │   │   └── services/
    │   └── tests/
    └── frontend/           # React Frontend Application
```
