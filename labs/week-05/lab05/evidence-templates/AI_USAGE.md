# ENGSE203 LAB05 — AI / Resource Usage

| Tool / Resource | Purpose | Used portion | How I verified | My final decision |
|---|---|---|---|---|
| Gemini | ให้ AI ช่วย Review โค้ด ตรวจเช็คสถานะการผ่าน Checker เช็คเวอร์ชั่นของแบบฟอร์ม และช่วยสร้าง Template | การกรอกตารางทดสอบ ผลลัพธ์คาดการณ์ และคำอธิบายโครงสร้าง | ตรวจสอบรัน `npm run check` ได้ครบถ้วน และทดสอบด้วยตัวเองซ้ำตาม Checklist | ใช้ Template ที่ AI กรอกให้ พร้อมถ่ายภาพ Screenshot ด้วยตนเองส่ง |
| Gemini | อธิบายการใช้ `.map` ใน React Component | `<AppHeader>` | อ่านและทำความเข้าใจการทำงานของการดึงข้อมูลจาก Array มาสร้างเป็น Component อัตโนมัติ | นำไปใช้ตามความเข้าใจเพื่อลดการเขียนโค้ดซ้ำ |
| Gemini | อธิบายการใช้ `async/await` | `DashboardPage.jsx` และ Service Layer | เปรียบเทียบการเขียนกับ `.then().catch()` แบบดั้งเดิม พบว่าอ่านลำดับการทำงานได้ง่ายกว่า | นำมาประยุกต์ใช้ทำความเข้าใจการรอข้อมูล (Asynchronous) |
| Gemini | ตรวจสอบการจัดการ LocalStorage (TODO 5B) | `writeStoredRequests` ใน `requestStorage.js` | ทดสอบเรียงลำดับโค้ดพบว่าการโยนค่า String เข้า `validateRequests` จะทำให้ Error จึงสลับไปตรวจสอบ Array ก่อน | แก้ไขโค้ดตามคำแนะนำเพื่อให้ Validate ผ่านก่อนทำ stringify |
| Gemini | แนะนำวิธีเขียน Cleanup Guard เพื่อป้องกัน Stale update | `useEffect` ใน `DashboardPage.jsx` และ `RequestDetailPage.jsx` | ทดลองเปลี่ยนหน้าไปมาอย่างรวดเร็วและใช้โหมด Developer (Strict Mode) ดูการทำงานของ React | เพิ่มตัวแปร `ignore` และเงื่อนไขเช็คเพื่อทิ้งข้อมูลตามที่ AI แนะนำ |
| Gemini | ช่วยแก้บั๊กสร้างคำร้องใบที่ 2 ค้าง และเข้าหน้า Detail ไม่ได้ | `createRequestId` ใน `requestService.js` | ตรวจสอบ Syntax ของ Template Literal ที่เขียนผิด (มีขึ้นบรรทัดใหม่และลืมเครื่องหมาย `$`) | แก้ไขโค้ด Template Literal ใหม่ ทำให้ระบบสร้าง ID แบบสุ่มและบันทึกได้ปกติ |

คำรับรอง:

- [x] ไม่ส่ง token, password, secret หรือข้อมูลส่วนบุคคลจริงให้เครื่องมือ
- [x] ตรวจ source และรัน test ด้วยตนเอง
- [x] อธิบาย Route, Effect, Service Layer และ persistence ของ final code ได้
