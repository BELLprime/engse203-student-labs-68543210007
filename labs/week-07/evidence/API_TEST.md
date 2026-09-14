# API_TEST — LAB 07

**ชื่อ–รหัส:** นายณัฏฐกิตติ์ รอดเรือน 68543210007-9 **วันที่ทดสอบ:** 14 ก.ย. 2569

> บันทึก **ผลจริง** ที่ได้จากการรันชุดทดสอบ Automated Test (`api/tests/api.test.js` ผ่านคำสั่ง `npm test`) และการทดสอบผ่าน Postman

---

## ผลการทดสอบ Automated Test (CP16: 6 เคส)

| # | Method | Path / หัวข้อการทดสอบ | สิ่งที่ส่งไป (Request Payload / Header) | Status ที่ควรได้ | Status ที่ได้จริง | ผลการทดสอบ | ผ่าน |
|---|---|---|---|---|---|---|:---:|
| 1 | `GET` | `/api/requests` | — | 200 | 200 | คืน Array รายการคำร้องทั้งหมด | ✓ |
| 2 | `GET` | `/api/requests/REQ-001` | — | 200 | 200 | คืน Object คำร้อง `REQ-001` ถูกต้อง | ✓ |
| 3 | `GET` | `/api/requests/REQ-999` | — | 404 | 404 | คืน `{"error": "ไม่พบคำร้องรหัส REQ-999"}` | ✓ |
| 4 | `POST` | `/api/requests` | `{ requesterName: "ทดสอบ ระบบ", requestType: "แจ้งซ่อม", location: "C3-401", details: "รายละเอียดยาวพอสมควรจริง", priority: "normal" }` | 201 | 201 | สร้างสำเร็จ ได้ ID `REQ-...` และ `status: "pending"` โดยชื่อ `requesterName` ตรงตามที่ส่ง | ✓ |
| 5 | `POST` | `/api/requests` | `{ requesterName: "-", details: "-" }` (ข้อมูลไม่ครบถ้วน/ไม่ผ่านเกณฑ์) | 400 | 400 | คืน error validation พร้อม array details | ✓ |
| 6 | `GET` | `/api/requests` (CORS) | Header `Origin: http://localhost:5173` | 200 | 200 | คืน `Access-Control-Allow-Origin: http://localhost:5173` | ✓ |

---

## ผลการรัน `npm test` จริงใน Terminal

```text
GET /api/requests 200 1.896 ms - 1030
▶ GET /api/requests
  ✔ คืนรายการทั้งหมด พร้อม status 200 และเป็น Array (14.989722ms)
✔ GET /api/requests (21.115577ms)
GET /api/requests/REQ-001 200 1.442 ms - 321
▶ GET /api/requests/:id พบ
  ✔ พบคำร้อง คืนข้อมูลคำร้องพร้อม status 200 (11.127572ms)
✔ GET /api/requests/:id พบ (11.356866ms)
GET /api/requests/REQ-999 404 0.416 ms - 65
▶ GET /api/requests/:id ไม่พบ
  ✔ ไม่พบคำร้อง ตอบกลับ 404 Not Found (4.232165ms)
✔ GET /api/requests/:id ไม่พบ (4.699864ms)
POST /api/requests 201 13.811 ms - 258
▶ POST /api/requests ข้อมูลถูกต้อง
  ✔ ตอบ 201 Created และ status เป็น pending ที่มีชื่อ requesterName  ค้องเหมือนตามที่ส่งใน validRequest (17.612002ms)
✔ POST /api/requests ข้อมูลถูกต้อง (17.881264ms)
POST /api/requests 400 0.562 ms - 514
▶ POST /api/requests ข้อมูลไม่ครบถ้วน
  ✔ ตอบ 400 Bad Request พร้อมรายละเอียดข้อผิดพลาด (4.112418ms)
✔ POST /api/requests ข้อมูลไม่ครบถ้วน (4.450486ms)
GET /api/requests 200 0.233 ms - 1289
▶ CORS header ตอบ origin ที่อนุญาต
  ✔ ตอบ CORS header (Access-Control-Allow-Origin) ให้ frontend origin ที่อนุญาต (2.661997ms)
✔ CORS header ตอบ origin ที่อนุญาต (2.830471ms)
ℹ tests 6
ℹ suites 6
ℹ pass 6
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 293.276827
```

---

## สรุปผลการทดสอบ

- **Automated Test (`api.test.js`):** ผ่าน 6 / 6 เคส (100%)
- **Checker ประจำสัปดาห์ (`node check-week07.mjs`):**
  - ในห้อง (CP09–CP12): ผ่าน 25/25 รายการ (100%)
  - ที่บ้าน (CP13–CP16): ผ่าน 8/8 รายการ (100%)
- **ข้อผิดพลาดและสิ่งที่พบ:** ไม่มีข้อผิดพลาด ทุก Endpoint และ CORS Header ทำงานสอดคล้องกับ API Contract และพฤติกรรมของระบบจริง
