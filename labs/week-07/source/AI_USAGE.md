# AI_USAGE — LAB 07

บันทึกการใช้ AI ระหว่างทำงาน · **ใช้ AI ได้ แต่ต้องเป็นเจ้าของโค้ดที่ส่ง**

> ผู้สอนจะสุ่มถามจากโค้ดที่ส่ง — ถ้าอธิบายไม่ได้ คะแนนส่วนนั้นจะถูกทบทวน

---

## ครั้งที่ 1

**ถามอะไร**
- สอบถามเกี่ยวกับโค้ดบรรทัด `return await apiFetch(`/api/requests/${encodeURIComponent(requestId)}`);` ใน `getRequestById` ว่าการส่งค่าผ่าน URL แบบนี้คล้ายกับ `params` ที่เคยใช้ใน Week 05 หรือไม่

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- ใช่เลย เป็นการส่งข้อมูลผ่าน **Route/Path Parameters** เพื่อระบุ resource ที่เจาะจง โดยมีความเชื่อมโยงกับสิ่งที่เรียนมา:
  - ใน **Week 05 (React Router):** ประกาศ route `path="/requests/:requestId"` แล้วดึงค่าผ่าน `const { requestId } = useParams()`
  - ใน **Week 06 (Express API):** ประกาศ endpoint `router.get('/:id', ...)` แล้วอ่านค่าผ่าน `req.params.id`
  - ใน **Week 07 (API Client):** ฝั่ง frontend เรียก URL `/api/requests/${id}` เพื่อส่ง ID ตรงไปยัง Express route ดังกล่าว
- เสริมเรื่อง `encodeURIComponent(requestId)` ว่าใช้เพื่อ escape อักขระพิเศษ (เช่น space, `/`, `?`) ป้องกันไม่ให้ URL ผิดเพี้ยนหรือพัง

**ใช้ส่วนไหน / แก้เองตรงไหน**
- ทำความเข้าใจการทำงานของ `getRequestById` ใน `frontend/src/services/requestService.js` และการเชื่อมโยงระหว่าง React กับ Express Route Params

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 2

**ถามอะไร**
- สอบถามความหมายและการทำงานของโอเปอเรเตอร์ `instanceof` ในเงื่อนไข `if (error instanceof ApiError && error.status === 404) return null;`

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- `instanceof` เป็นตัวดำเนินการ (Operator) ใน JavaScript ใช้ตรวจสอบว่า **"ออบเจกต์นี้ถูกสร้างขึ้นมาจากคลาส (Class) หรือพิมพ์เขียวนี้ใช่หรือไม่"**
- ในบริบทนี้:
  - Error ที่หลุดเข้ามาในบล็อก `catch` อาจเกิดจากหลายสาเหตุ เช่น อินเทอร์เน็ตหลุด (`TypeError: Failed to fetch`), บั๊กในโค้ด JavaScript หรือ Error จากการเรียก HTTP API
  - การใช้ `error instanceof ApiError` ช่วยคัดกรองอย่างปลอดภัยว่า Error นี้เป็น instance ของคลาส `ApiError` ที่เราเขียนขึ้นเพื่อรับมือกับ HTTP Response จริง ๆ ไม่ใช่ข้อผิดพลาดทั่วไป
  - เมื่อเป็น `ApiError` และมี `error.status === 404` จะคืนค่า `null` เพื่อสื่อว่า "ไม่พบข้อมูล" ซึ่งไม่ใช่ความผิดพลาดของระบบ ส่วน error อื่น ๆ จะถูก `throw` ต่อไปให้ UI จัดการ
- ช่วยป้องกัน Runtime Error จากการเผลอเข้าถึง `.status` บนตัวแปร error ชนิดอื่นที่ไม่มี property นี้

**ใช้ส่วนไหน / แก้เองตรงไหน**
- ทำความเข้าใจกลไก Type Checking และการดักจับ Custom Error ใน `frontend/src/services/requestService.js`

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 3

**ถามอะไร**
- สอบถามความหมายและข้อแตกต่างระหว่าง `assert.equal` กับ `assert.ok` ในชุดทดสอบ Automated Test (CP16) ของ Node.js (`node:assert/strict`)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- ทั้งสองเป็นฟังก์ชันสำหรับตรวจสอบผลลัพธ์ (Assertion) ในการทดสอบ หากเงื่อนไขไม่เป็นจริงจะโยน `AssertionError` และทำให้เคสนั้นไม่ผ่าน (Fail) ทันที:
  - `assert.equal(actual, expected)`: ใช้ตรวจสอบว่า "ค่าที่ได้จริง (Actual) ตรงกับค่าที่คาดหวัง (Expected) หรือไม่" เหมาะกับการตรวจค่าที่แน่นอน เช่น HTTP Status Code (200, 201) หรือค่า String/ตัวเลขที่เจาะจง
  - `assert.ok(value)`: ใช้ตรวจสอบว่า "นิพจน์หรือตัวแปรนั้นมีค่าเป็นจริง (Truthy) หรือไม่" เหมาะกับการตรวจเงื่อนไข Boolean เช่น `Array.isArray(res.body)` หรือเช็คว่ามี property (`id`, `error`) ส่งกลับมาจริง
- การเลือกใช้ให้เหมาะสมช่วยให้เมื่อเคสไม่ผ่าน ตัว Runner จะรายงาน Expected/Actual ได้ชัดเจน ทำให้ไล่แก้บั๊กได้รวดเร็ว

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำไปใช้ทำความเข้าใจและตรวจสอบการเขียนชุด Automated Test ทั้ง 6 เคสใน `api/tests/api.test.js` (CP16)

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 4

**ถามอะไร**
- สอบถามความหมายและการทำงานของคำสั่ง `.post(...)` และ `.send(...)` ในชุดทดสอบ `supertest` (เช่น `request(app).post('/api/requests').send(validRequest)`)

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- ทั้งสองคำสั่งเป็นเมธอดของไลบรารี `supertest` ใช้สำหรับจำลองการยิง HTTP Request เข้าไปยัง Express App:
  - `.post(endpoint)`: กำหนด HTTP Method เป็น `POST` และระบุเส้นทาง URL ที่ต้องการส่งคำขอไปหา เช่น `'/api/requests'`
  - `.send(data)`: ใช้สำหรับแนบข้อมูล **Request Body** เข้าไปในคำขอ โดย `supertest` จะแปลง JavaScript Object เป็นข้อความ JSON (`JSON.stringify`) และตั้งค่า Header `Content-Type: application/json` ให้อัตโนมัติ เพื่อให้ Middleware `express.json()` ฝั่ง Express ถอดค่าไปเก็บไว้ใน `req.body` ได้ถูกต้อง
- เทียบเท่ากับการเลือกเมธอด `POST` และพิมพ์ข้อมูลในแท็บ `Body -> raw -> JSON` ของ Postman หรือการใส่ `body: JSON.stringify(...)` ในฟังก์ชัน `fetch` ฝั่ง Frontend

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำไปใช้ทำความเข้าใจการจำลองการส่งข้อมูลสร้างคำร้องใหม่ในเคสทดสอบ `POST /api/requests` ของไฟล์ `api/tests/api.test.js` (CP16)

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## ครั้งที่ 5

**ถามอะไร**
- สอบถามว่าการทดสอบหรือใช้งาน CORS Header (`Access-Control-Allow-Origin`) ต้องใช้ HTTP Method `GET` หรือว่าเมธอดอะไร

**AI ตอบว่าอย่างไร (สรุปสั้น)**
- CORS สามารถใช้และทำงานได้กับทุก HTTP Method โดยมีรายละเอียด:
  - **ในการเขียน Test (Automated Test):** นิยมใช้ `.get(...)` คู่กับการตั้งค่า Header `.set('Origin', 'http://localhost:5173')` เพราะเป็นวิธีที่สะดวกและรวดเร็วที่สุดในการตรวจเช็คว่า Middleware `cors()` คืน Header `Access-Control-Allow-Origin` ให้ Origin ที่กำหนดถูกต้องหรือไม่
  - **ในการทำงานจริงของเบราว์เซอร์:** มี 2 รูปแบบ
    1. *Simple Request:* คำขอทั่วไป (เช่น `GET`) เบราว์เซอร์จะส่งคำขอไปทันทีพร้อมแนบ `Origin` เพื่อรอตรวจเช็ค Header ที่ตอบกลับ
    2. *Preflight Request:* คำขอที่มีการเปลี่ยนแปลงข้อมูลหรือส่ง JSON (เช่น `PUT`, `DELETE`, `POST`) เบราว์เซอร์จะส่งเมธอดชิมลางชื่อ **`OPTIONS`** ไปถามสิทธิ์เซิร์ฟเวอร์ก่อน เมื่อเซิร์ฟเวอร์ตอบอนุญาตจึงจะส่ง Request จริงตามไป

**ใช้ส่วนไหน / แก้เองตรงไหน**
- นำไปใช้ทำความเข้าใจการทดสอบ CORS Header ใน `api/tests/api.test.js` (เคสที่ 6) และกลไกการทำงานของ Preflight Request (`OPTIONS`) ระหว่าง React กับ Express

**เข้าใจโค้ดที่ได้มาไหม** ☑ เข้าใจทั้งหมด ☐ เข้าใจบางส่วน ☐ ยังไม่เข้าใจ

---

## สรุป

- **ส่วนที่เขียนเองทั้งหมด:**
  - การเชื่อมต่อ React Component เข้ากับ Service Layer (CP11)
  - การจัดการสถานะ Loading และ Error State บนหน้า Dashboard (CP12)
  - การทำระบบเปลี่ยนสถานะคำร้อง PUT /api/requests/:id ทั้งฝั่ง API และปุ่มในหน้าจอ React (CP13)
  - การทดสอบระบบด้วย Postman และการบันทึกผลการทดสอบลงใน evidence/API_TEST.md
- **ส่วนที่ AI ช่วย:**
  - ให้คำแนะนำและอธิบายความหมายของ Route Parameters, instanceof ApiError, คำสั่ง .post().send() และการเปรียบเทียบ assert.equal กับ assert.ok

- **ส่วนที่ยังไม่มั่นใจ:** ไม่มี 
