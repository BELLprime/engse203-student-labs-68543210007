# Campus Service — ระบบคำร้องขอใช้บริการวิทยาเขต

> ระบบ full-stack สำหรับจัดการคำร้องขอใช้บริการภายในวิทยาเขต
> ผู้ใช้สามารถ ดู · เพิ่ม · เปลี่ยนสถานะ · ลบ คำร้องผ่านหน้าเว็บได้
> พัฒนาด้วย **React** (frontend) + **Express** (API) + **SQLite** (database)

---

## สถาปัตยกรรม 3 ชั้น

ระบบแบ่งออกเป็น 3 ชั้นที่ทำงานแยกกันอย่างชัดเจน โดยแต่ละชั้นมีหน้าที่เฉพาะของตัวเอง
ทำให้สามารถเปลี่ยนแปลงส่วนใดส่วนหนึ่งได้โดยไม่กระทบชั้นอื่น

```
┌─────────────┐   HTTP/JSON   ┌─────────────┐   SQL   ┌─────────────┐
│   React     │ ────────────► │   Express   │ ──────► │   SQLite    │
│  (frontend) │ ◄──────────── │    (API)    │ ◄────── │ (database)  │
└─────────────┘   Response    └─────────────┘  rows   └─────────────┘
    พอร์ต 5173                    พอร์ต 3001               campus.db
    (dev เท่านั้น)
```

| ชั้น | หน้าที่ | โฟลเดอร์ | เทคโนโลยี |
|------|---------|----------|-----------|
| **Frontend** | หน้าจอผู้ใช้ — แสดงข้อมูล รับ input ส่งคำขอไปยัง API | `frontend/src/` | React + Vite |
| **API** | รับคำขอจาก frontend → ตรวจสอบ → ดึง/บันทึกข้อมูล → ตอบกลับเป็น JSON | `api/src/` | Express (Node.js) |
| **Database** | เก็บข้อมูลคำร้องและผู้ใช้อย่างถาวรในไฟล์ SQLite | `api/data/` | SQLite (`node:sqlite`) |

### การไหลของข้อมูลเมื่อผู้ใช้เพิ่มคำร้อง

1. ผู้ใช้กรอกฟอร์มบนหน้าเว็บ → `RequestForm.jsx` เรียก `requestService.js`
2. `requestService.js` ใช้ `apiClient.js` ยิง `POST /api/requests` ไปที่ API
3. **route** (`requestRoutes.js`) รับคำขอ → ผ่าน **middleware** (`validateRequest.js`) ตรวจข้อมูล
4. **controller** (`requestController.js`) เรียก **service** (`requestService.js` ฝั่ง API)
5. **service** ใช้ SQL `INSERT` บันทึกลงฐานข้อมูล → คืนข้อมูลที่สร้างเสร็จกลับมา
6. controller ตอบ `201 Created` พร้อม JSON → frontend แสดงผลให้ผู้ใช้เห็น

---

## โครงสร้างโฟลเดอร์

```
labs/week-11/source/
├── api/                          ← ชั้น API (Express)
│   ├── data/
│   │   ├── schema.sql            ← โครงสร้างตาราง + ข้อมูลตั้งต้น
│   │   └── campus.db             ← ไฟล์ฐานข้อมูล SQLite
│   ├── src/
│   │   ├── server.js             ← จุดเริ่มต้น — เปิด server
│   │   ├── app.js                ← ประกอบ Express app (CORS, route, static, error)
│   │   ├── config.js             ← อ่าน env รวมไว้ที่เดียว
│   │   ├── routes/
│   │   │   ├── requestRoutes.js  ← เส้นทาง CRUD คำร้อง
│   │   │   ├── userRoutes.js     ← เส้นทางผู้ใช้
│   │   │   └── healthRoutes.js   ← เส้นทาง health check
│   │   ├── controllers/
│   │   │   └── requestController.js ← ตัดสิน status code + เรียก service
│   │   ├── services/
│   │   │   └── requestService.js ← คุยกับฐานข้อมูล (SQL query)
│   │   └── middleware/
│   │       ├── validateRequest.js ← ตรวจข้อมูลก่อนส่งต่อ
│   │       └── errorHandler.js   ← จับ error รวมศูนย์
│   └── package.json
├── frontend/                     ← ชั้น Frontend (React)
│   ├── src/
│   │   ├── App.jsx               ← route หลัก
│   │   ├── pages/                ← หน้าต่าง ๆ (Dashboard, NewRequest, Detail)
│   │   ├── components/           ← ชิ้นส่วน UI (RequestCard, FilterBar, Form)
│   │   ├── services/
│   │   │   ├── apiClient.js      ← ตัวกลางเรียก fetch() ที่เดียว
│   │   │   └── requestService.js ← ฟังก์ชัน CRUD เรียกผ่าน apiClient
│   │   └── hooks/                ← custom hook (useManualReload)
│   ├── .env.production           ← ตั้ง VITE_API_BASE_URL ว่าง (ใช้ relative path)
│   └── package.json
├── package.json                  ← script build + start สำหรับ production/deploy
├── README.md                     ← ไฟล์นี้
└── API_CONTRACT.md               ← ข้อตกลง API (endpoint, request/response)
```

---

## วิธีรัน (Development)

ต้องเปิด **2 terminal** พร้อมกัน เพราะ frontend กับ API รันคนละ process

```bash
# ① ติดตั้ง dependencies ทั้งสองฝั่ง
npm install --prefix api
npm install --prefix frontend

# ② Terminal 1 — เปิด API (พอร์ต 3001)
cd api
npm run dev                       # http://localhost:3001

# ③ Terminal 2 — เปิด Frontend (พอร์ต 5173)
cd frontend
npm run dev                       # http://localhost:5173
```

> **เปิด API ก่อนเสมอ** — ไม่งั้น frontend จะขึ้นข้อความว่าติดต่อเซิร์ฟเวอร์ไม่ได้

### ทดสอบว่าระบบพร้อม

```bash
# เช็คสถานะ API
curl http://localhost:3001/api/health

# ดูคำร้องทั้งหมด
curl http://localhost:3001/api/requests
```

---

## วิธีรัน (Production)

ตอน production ระบบรวมเป็น **พอร์ตเดียว** — Express เสิร์ฟทั้งหน้าเว็บ (React ที่ build แล้ว) และ API จาก server เดียวกัน

```bash
cd labs/week-11/source

# ① build frontend + ติดตั้ง dependencies ทั้งหมด
npm run build

# ② เปิดเซิร์ฟเวอร์ในโหมด production (พอร์ตเดียว)
NODE_ENV=production PORT=10000 npm start
```

เปิด `http://localhost:10000` ในเบราว์เซอร์ → จะเห็นหน้าเว็บ React
เปิด `http://localhost:10000/api/health` → จะเห็น `"env": "production"`

> **Windows (PowerShell):**
> ```powershell
> $env:NODE_ENV="production"; $env:PORT="10000"; npm start
> ```

### ทำไม production ถึงใช้พอร์ตเดียว

ตอน dev จะแยก frontend (5173) กับ API (3001) คนละพอร์ต ต้องตั้ง CORS ให้ข้ามพอร์ตได้
แต่ตอน production จะให้ Express เสิร์ฟ `frontend/dist/` เป็น static file จากพอร์ตเดียวกัน
ทำให้ไม่ต้องแยกพอร์ต ไม่มีปัญหา CORS และพร้อม deploy ขึ้น cloud ได้ทันที

---

## Environment Variables

### ฝั่ง API (`api/.env`)

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|--------|-------------|----------|
| `NODE_ENV` | `development` | `production` → log แบบ combined, ซ่อน stack trace, เสิร์ฟ static |
| `PORT` | `3001` | พอร์ตที่ API รับคำขอ (cloud กำหนดให้เอง) |
| `CORS_ORIGIN` | `http://localhost:5173` | origin ที่อนุญาตให้เรียก API (dev เท่านั้น) |
| `DB_FILE` | `./data/campus.db` | ที่อยู่ไฟล์ฐานข้อมูล SQLite |

### ฝั่ง Frontend

| ไฟล์ | ตัวแปร | ค่า | คำอธิบาย |
|------|--------|-----|----------|
| `.env.local` (dev) | `VITE_API_BASE_URL` | `http://localhost:3001` | ยิงไปที่ API แยกพอร์ต |
| `.env.production` (build) | `VITE_API_BASE_URL` | _(ว่าง)_ | ใช้ relative path เพราะเสิร์ฟจากพอร์ตเดียวกัน |

> ต้องขึ้นต้นด้วย `VITE_` ไม่งั้น Vite จะไม่ส่งค่าไปให้โค้ดฝั่งเบราว์เซอร์
> **ห้าม commit** ไฟล์ `.env` และ `.env.local` — ใช้ `.env.example` เป็นตัวอย่างแทน

---

## การตัดสินใจออกแบบ

### ทำไมแยก 3 ชั้น

- **เปลี่ยนแหล่งข้อมูลได้โดยแก้ชั้นเดียว** — ตลอดหน่วยที่ 4 เราเปลี่ยนจาก JSON file → in-memory array → SQLite → (Turso) โดยแก้แค่ service ชั้นเดียว controller และ frontend ไม่ต้องแตะ
- **ทดสอบได้ง่าย** — test API โดยไม่ต้องเปิดหน้าเว็บ (ใช้ supertest) หรือ test service โดยไม่ต้องเปิด server
- **ทำงานเป็นทีมได้** — คนทำ frontend กับคนทำ API ตกลง API Contract แล้วทำงานคู่ขนานได้

### ทำไมเลือก SQLite

- **ข้อมูลมีโครงชัดเจน** — คำร้องมี field ตายตัว (id, requesterName, requestType, location, ...) เหมาะกับ relational database
- **มีความสัมพันธ์ระหว่างตาราง** — ผู้ใช้ 1 คนสร้างคำร้องได้หลายใบ (1-to-many) ต้องใช้ FOREIGN KEY
- **ไม่ต้องตั้ง server ฐานข้อมูลแยก** — SQLite เป็นไฟล์เดียว (`campus.db`) ติดตั้งง่าย ใช้ `node:sqlite` ที่มากับ Node.js 22 ได้เลย
- **sync API** — `node:sqlite` เป็น sync ทำให้ controller ไม่ต้องใช้ async/await เลย เรียก service ได้ตรง ๆ

### ทำไม config รวมศูนย์

ทุกค่าที่อ่านจาก environment variable รวมไว้ใน `config.js` ไฟล์เดียว — ไม่มี `process.env.xxx` กระจายอยู่ทั่วโค้ด ถ้าต้องเพิ่มหรือเปลี่ยนค่า แก้ที่เดียวจบ

### ทำไมมี health check

`GET /api/health` ทำให้ระบบบอกสถานะตัวเองได้ — cloud platform (เช่น Render) จะเรียก endpoint นี้เป็นระยะ ถ้าตอบ 503 แปลว่าฐานข้อมูลมีปัญหา cloud จะแจ้งเตือนหรือ restart ให้

---

## API Endpoints

| Method | Endpoint | คำอธิบาย | สำเร็จ | ผิดพลาด |
|--------|----------|----------|--------|---------|
| `GET` | `/api/health` | ตรวจสถานะระบบ + ฐานข้อมูล | `200` | `503` DB ไม่พร้อม |
| `GET` | `/api/requests` | ดูคำร้องทั้งหมด (กรองด้วย `?status=` ได้) | `200` | — |
| `GET` | `/api/requests/:id` | ดูคำร้องรหัสที่ระบุ | `200` | `404` ไม่พบ |
| `POST` | `/api/requests` | สร้างคำร้องใหม่ | `201` | `400` ข้อมูลไม่ถูกต้อง |
| `PUT` | `/api/requests/:id` | เปลี่ยนสถานะคำร้อง | `200` | `400` / `404` |
| `DELETE` | `/api/requests/:id` | ลบคำร้อง | `204` | `404` ไม่พบ |

> รายละเอียดเพิ่มเติมดูที่ `API_CONTRACT.md`

---

## Live Demo

🔗 https://campus-service-68543210007-9.onrender.com

> Render free tier — เปิดครั้งแรกช้า 30-60 วินาที (server ต้องตื่นก่อน)
> ข้อมูลที่เพิ่มจะกลับเป็นค่าตั้งต้นเมื่อ restart (ephemeral filesystem)
