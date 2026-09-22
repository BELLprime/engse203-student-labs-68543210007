# ENGSE203 LAB 09 — Student Evidence README

## ผู้จัดทำ

- **ชื่อ–นามสกุล:** นายณัฏฐกิตติ์ รอดเรือน
- **รหัสนักศึกษา:** 68543210007-9
- **Section:** Sec 1
- **ระบบปฏิบัติการที่ใช้:** Windows 11 / WSL2 (Ubuntu 24.04 LTS)
- **Node version:** v22.23.1
- **Branch:** `unit4/week-09`
- **Commit:** `e7638b7`
- **วันที่ทดสอบ:** 21 กันยายน 2026

## URLs

- **Repository:** [https://github.com/BELLprime/engse203-student-labs-68543210007](https://github.com/BELLprime/engse203-student-labs-68543210007)
- **Pages Hub:** [https://BELLprime.github.io/engse203-student-labs-68543210007/](https://BELLprime.github.io/engse203-student-labs-68543210007/)
- **Weekly Result:** [https://BELLprime.github.io/engse203-student-labs-68543210007/labs/week-09/](https://BELLprime.github.io/engse203-student-labs-68543210007/labs/week-09/)
- **Pull Request:** *(ระบุเมื่อเปิด PR บน GitHub)*

---

## สถาปัตยกรรมข้อมูล & แผนผังความสัมพันธ์ (Data Architecture & Relationship)

```text
┌─────────────────────────┐              ┌──────────────────────────────────┐
│          users          │              │             requests             │
├─────────────────────────┤              ├──────────────────────────────────┤
│ PK  id (INTEGER)        │ 1 ──────── < │ PK  id (TEXT)                    │
│     name (TEXT)         │              │ FK  requester_id (INTEGER)       │
│     department (TEXT)   │              │     request_type (TEXT)          │
│     email (TEXT, UNIQUE)│              │     location (TEXT)              │
└─────────────────────────┘              │     details (TEXT)               │
                                         │     priority (TEXT)              │
                                         │     status (TEXT)                │
                                         │     created_at (TEXT)            │
                                         └──────────────────────────────────┘
```

* **ความสัมพันธ์แบบ One-to-Many (1:N):** ผู้ใช้งาน 1 คน (`users`) สามารถแจ้งคำร้องได้หลายรายการ แต่คำร้องแต่ละรายการ (`requests`) ต้องมาจากผู้ใช้คนเดียวเท่านั้น เชื่อมโยงผ่าน `requests.requester_id` $\rightarrow$ `users.id`
* **แนวคิดสำคัญ:** แยกข้อมูลผู้ใช้ออกจากคำร้อง เพื่อแก้ปัญหาข้อมูลซ้ำซ้อน (Data Redundancy) และปัญหาความขัดแย้งของข้อมูลเมื่อมีการอัปเดต (Update Anomaly) โดยยึดหลัก "แก้ที่เดียว ถูกต้องทั้งระบบ"

---

## วัตถุประสงค์ของงาน

1. ออกแบบและสร้างโครงสร้างฐานข้อมูลเชิงสัมพันธ์ (Relational Database) 2 ตารางด้วย SQLite
2. กำหนดข้อกำหนดความถูกต้องของข้อมูล (Constraints) ได้แก่ `PRIMARY KEY`, `FOREIGN KEY`, `NOT NULL`, `UNIQUE`, `CHECK` และ `DEFAULT`
3. จัดทำไฟล์ `schema.sql` (DDL) ที่สามารถรันสร้างฐานข้อมูลได้สมบูรณ์ และรันซ้ำได้โดยไม่เกิดข้อผิดพลาด (Idempotency)
4. เขียนคำสั่งค้นหาข้อมูล (DQL) ใน `queries.sql` ตอบโจทย์ครบทั้ง 8 ข้อพื้นฐาน และ 3 ข้อส่วนขยายพิเศษ (⭐ Challenge)
5. เขียนเอกสาร `DATA_MODEL.md` อธิบายเหตุผลเบื้องหลังการออกแบบและตอบคำถามเชิงวิศวกรรม
6. ทดสอบและบันทึกผลการทำงานของ Constraints ทั้ง 5 รูปแบบ (CP25) พิสูจน์ว่าระบบปฏิเสธข้อมูลที่ผิดจริง
7. พัฒนา Challenge ครบถ้วน: การสรุปสถิติด้วย `GROUP BY` + `COUNT`, การดึงข้อมูลผู้ใช้ทุกคนด้วย `LEFT JOIN`, และการสร้าง `INDEX` เพื่อเพิ่มประสิทธิภาพ

---

## เครื่องมือที่ใช้

- **Database Engine:** SQLite 3 (ทำงานผ่านโมดูลในตัว `node:sqlite` บน Node.js v22.23.1)
- **Database Client:** VS Code Extension "Database Client"
- **Testing & Verification:** `check-week09.mjs`, `scripts/verify-repository.mjs`
- **Version Control & Platform:** Git, GitHub, GitHub Pages, WSL2 (Ubuntu 24.04 LTS)

---

## วิธีติดตั้งและรันคำสั่งทดสอบ

```bash
# 1. เข้าสู่โฟลเดอร์ source ของ Week 09
cd labs/week-09/source

# 2. สร้าง/รีเซ็ตฐานข้อมูลจาก schema.sql
sqlite3 campus.db < schema.sql

# 3. รันตัวตรวจเช็คอัตโนมัติประจำสัปดาห์ (Checker 30/30)
node --disable-warning=ExperimentalWarning check-week09.mjs

# 4. ตรวจสอบความถูกต้องและสร้างหน้า GitHub Pages Hub (รันจาก root)
cd ../../..
npm run build:pages
npm run verify:lab -- week-09
```

---

## โครงสร้างโฟลเดอร์

```text
labs/week-09/
├── README.md               # คู่มือใบงานต้นฉบับประจำสัปดาห์
├── lab-metadata.json       # ข้อมูลกำกับสถานะการส่งงานและผลการทดสอบ
├── lab09/                  # เอกสารคู่มือ In-Class และ Take-Home
├── guides/                 # สไลด์และเอกสารประกอบการสอน HTML
├── evidence/               # หลักฐานการทดสอบ
│   ├── README.md           # รายงานผลการทดสอบ Constraints (CP25) และ Checker
│   └── images/             # ภาพ Screenshot หลักฐาน
└── source/
    ├── README.md           # รายงานการส่งงานของนักศึกษา (เอกสารฉบับนี้)
    ├── AI_USAGE.md         # บันทึกการใช้งานและการเรียนรู้ผ่าน AI
    ├── DATA_MODEL.md       # เอกสารอธิบายการออกแบบและบันทึกผลทดสอบ Constraint
    ├── schema.sql          # พิมพ์เขียวสร้างโครงสร้างตารางและข้อมูลเริ่มต้น
    ├── queries.sql         # คำสั่ง SQL ตอบโจทย์ 8 ข้อ + 3 Challenge
    ├── campus.db           # ไฟล์ฐานข้อมูล SQLite
    ├── playground-seed.sql # ข้อมูลตัวอย่างสำหรับทดลองเล่น
    └── check-week09.mjs    # สคริปต์ตรวจความถูกต้องอัตโนมัติ
```

---

## หลักฐานผลลัพธ์ (Evidence)

### 1. ผลการตรวจเช็คอัตโนมัติ (`check-week09.mjs`): ผ่าน 30 / 30 รายการ (100% เต็ม)

![ผลการตรวจ check-week09](../evidence/images/check-week09-30-pass.png)

```text
✅ FILE มีไฟล์ campus.db
✅ FILE มีไฟล์ schema.sql
✅ CP19 มีตาราง users
✅ CP19 มีตาราง requests
✅ CP19 users มีคอลัมน์ id, name, department
✅ CP19 requests มีคอลัมน์ครบตามที่ออกแบบ
✅ CP18 ทั้งสองตารางมี Primary Key
✅ CP18 requests มี Foreign Key ชี้ไป users
✅ CP19 requests มีคอลัมน์ NOT NULL อย่างน้อย 5 คอลัมน์
✅ CP19 มีข้อมูลใน users อย่างน้อย 4 คน
✅ CP19 มีข้อมูลใน requests อย่างน้อย 5 รายการ
✅ CP22 เพิ่มข้อมูลเองแล้ว — requests อย่างน้อย 8 รายการ
✅ CP21 JOIN ระหว่าง requests กับ users ทำงานได้
✅ CP21 ไม่มีคำร้องที่ชี้ไปผู้ใช้ที่ไม่มีจริง
✅ CP25 Foreign Key ปฏิเสธ requester_id ที่ไม่มีจริง
✅ CP25 ปฏิเสธ id ที่ซ้ำกับของเดิม
✅ CP23 schema.sql มี CREATE TABLE ทั้งสองตาราง
✅ CP23 schema.sql มี FOREIGN KEY หรือ REFERENCES
✅ CP23 schema.sql รันซ้ำได้ (มี DROP TABLE IF EXISTS)
✅ CP23 schema.sql มี INSERT ข้อมูลตั้งต้น
✅ CP23 schema.sql รันจริงแล้วสร้างฐานข้อมูลได้
✅ CP24 มีไฟล์ DATA_MODEL.md
✅ CP24 อธิบายเหตุผลที่แยก users ออกจาก requests
✅ CP22 มีไฟล์ queries.sql
✅ CP22 queries.sql มีคำสั่ง SELECT อย่างน้อย 8 ข้อ
✅ CP22 queries.sql มีการใช้ JOIN
✅ CP22 queries.sql มีการใช้ WHERE และ ORDER BY
✅ CHAL ⭐ ใช้ GROUP BY สรุปข้อมูล
✅ CHAL ⭐ ใช้ฟังก์ชันรวม (COUNT/SUM/AVG)
✅ CHAL ⭐ สร้าง INDEX เพื่อให้ค้นเร็วขึ้น
──────────────────────────────────────────────────────────
🏫 ในห้อง (CP17–CP21)   ผ่าน 11/11 รายการ
🏠 ที่บ้าน (CP22–CP25)   ผ่าน 16/16 รายการ
⭐ Challenge            ผ่าน 3/3 รายการ
──────────────────────────────────────────────────────────
ผ่าน 30/30 รายการ (100%)
```

---

### 2. สรุปคำสั่ง SQL ใน `queries.sql` (8 ข้อ + 3 Challenge)

| ข้อ | วัตถุประสงค์ | คำสั่ง / เทคนิคสำคัญ | ผลลัพธ์ที่ได้ |
|:---:|---|---|---|
| ① | คำร้องทั้งหมด เรียงตามรหัส | `ORDER BY id` | รายการคำร้องทั้งหมดเรียงตามรหัส REQ-001 ถึง REQ-008 |
| ② | คำร้องที่ยังไม่ได้ดำเนินการ | `WHERE status = 'pending' ORDER BY id` | กรองเฉพาะคำร้องที่มีสถานะ pending |
| ③ | คำร้องเร่งด่วนที่ยังไม่เสร็จ | `WHERE priority = 'urgent' AND status IN ('pending', 'in-progress')` | คำร้องเร่งด่วนที่ยังไม่เสร็จสิ้น |
| ④ | ค้นคำร้องจากคำบางส่วน | `WHERE details LIKE '%ไม่ทำงาน%'` | ค้นหาคำร้องที่มีข้อความตรงตามคีย์เวิร์ด |
| ⑤ | คำร้องพร้อมชื่อผู้แจ้ง | `JOIN users u ON r.requester_id = u.id` | แสดงข้อมูลคำร้องพร้อมชื่อผู้แจ้งที่ดึงข้ามตาราง |
| ⑥ | คำร้องเฉพาะของภาควิชา | `JOIN ... WHERE u.department = 'วิศวกรรมซอฟต์แวร์'` | กรองคำร้องเฉพาะที่แจ้งโดยบุคลากรภาควิชาที่กำหนด |
| ⑦ | รายชื่อผู้แจ้งที่ไม่ซ้ำกัน | `SELECT DISTINCT u.name, u.department` | ตัดชื่อผู้ใช้ที่ซ้ำออก เหลือเฉพาะผู้ที่เคยส่งคำร้องจริง |
| ⑧ | คำร้อง 3 รายการล่าสุด | `ORDER BY r.id DESC LIMIT 3` | ดึงข้อมูลคำร้อง 3 ลำดับหลังสุด |
| ⑨ | ⭐ สรุปจำนวนคำร้องตามสถานะ | `GROUP BY status` + `COUNT(*)` | ตัวเลขสถิติจำนวนคำร้องแยกตามสถานะงาน |
| ⑩ | ⭐ สรุปการแจ้งคำร้องของผู้ใช้ทุกคน | `LEFT JOIN requests r ... GROUP BY u.id` | รายชื่อผู้ใช้ทุกคนพร้อมยอดคำร้อง (รวมถึงผู้ที่ยังไม่เคยแจ้ง) |
| ⑪ | ⭐ สร้าง Index เพิ่มความเร็ว | `CREATE INDEX idx_requests_status`, `idx_requests_requester` | ดัชนีช่วยเร่งความเร็วในการค้นหาและ JOIN |

---

### 3. ผลการทดสอบ Constraints (CP25)

![การทดสอบ Constraints](../evidence/images/cp25-constraint-violation.png)

| ข้อ | ประเภท Constraint | คำสั่งที่ทดสอบ | Error ที่ได้รับจริง | ผลการประเมิน |
|:---:|---|---|---|:---:|
| ① | Foreign Key | ใส่ `requester_id = 99999` ที่ไม่มีอยู่จริง | `FOREIGN KEY constraint failed` | ✅ ปฏิเสธสำเร็จ |
| ② | Check Constraint | ใส่ `status = 'ยกเลิก'` นอกเหนือจากที่กำหนด | `CHECK constraint failed` | ✅ ปฏิเสธสำเร็จ |
| ③ | Unique Constraint | ใส่อีเมล `somchai@rmutl.ac.th` ซ้ำกับคนเดิม | `UNIQUE constraint failed: users.email` | ✅ ปฏิเสธสำเร็จ |
| ④ | Primary Key | ใส่รหัสคำร้อง `id = 'REQ-001'` ซ้ำ | `UNIQUE constraint failed: requests.id` | ✅ ปฏิเสธสำเร็จ |
| ⑤ | Not Null Constraint | ใส่คำร้องโดยไม่ระบุคอลัมน์ `location` | `NOT NULL constraint failed: requests.location` | ✅ ปฏิเสธสำเร็จ |

---

## References & AI Assistance

- **Source / Documentation:**
  - SQLite Official Documentation: [https://www.sqlite.org/](https://www.sqlite.org/)
  - Node.js Built-in SQLite Module: [https://nodejs.org/api/sqlite.html](https://nodejs.org/api/sqlite.html)
  - เอกสารประกอบการสอนวิชา ENGSE203 สัปดาห์ที่ 9 (ฐานข้อมูลเชิงสัมพันธ์และภาษา SQL)
- **AI tool used:** Google Antigravity
- **Used for:**
  - ปรึกษาหลักการทำงานของ Relational JOIN และการใช้ Table Alias
  - วิเคราะห์สาเหตุของข้อผิดพลาด Ambiguous Column Name และกลไกของ `LIMIT` ร่วมกับ `ORDER BY ... DESC`
  - ทำความเข้าใจพฤติกรรมของคำสั่ง `DISTINCT` และวงจรการประมวลผลของ `GROUP BY` ร่วมกับ Aggregate Functions
- **My adaptation:**
  - นำความเข้าใจเรื่อง `JOIN` และ `IN` ไปเขียนคำสั่งจริงใน `queries.sql`
  - นำหลักการ Referential Integrity ไปปรับแก้ลำดับ `DROP TABLE` ใน `schema.sql`
  - จัดทำบันทึกประวัติการปรึกษาอย่างละเอียดลงในเอกสาร [`AI_USAGE.md`](AI_USAGE.md)
