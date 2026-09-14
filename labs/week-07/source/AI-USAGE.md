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
