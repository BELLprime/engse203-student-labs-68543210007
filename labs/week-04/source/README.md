# ENGSE203 LAB 4 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: นายณัฏฐกิตติ์ รอดเรือน
- รหัสนักศึกษา: 68543210007-9
- Section: Sec 1

## URLs

- Repository: [https://github.com/BELLprime/engse203-student-labs-68543210007](https://github.com/BELLprime/engse203-student-labs-68543210007)
- Pull Request: [https://github.com/BELLprime/engse203-student-labs-68543210007/pull/5](https://github.com/BELLprime/engse203-student-labs-68543210007/pull/5)
- GitHub Pages: [https://bellprime.github.io/engse203-student-labs-68543210007/labs/week-04/](https://bellprime.github.io/engse203-student-labs-68543210007/labs/week-04/)

## Component Tree

```text
App                              [state: requests, statusFilter]
├── AppHeader                    [props: title, subtitle]
├── SummaryPanel                 [props: summary]
│   └── (map) summary card       [key: summary field name]
├── RequestForm                  [state: formData, errors, feedback]
│   └── (props received: onAddRequest)
├── section.panel (request list)
│   ├── FilterBar                [props: value, onFilterChange]
│   └── RequestList              [props: requests, onDeleteRequest]
│       └── (map) RequestCard    [key: request.id]
│                                [props: request, onDeleteRequest]
```

**State owner สรุป**

| State/Derived data   | ประเภท        | Owner        | เหตุผล                                                        |
| --------------------- | -------------- | ------------ | -------------------------------------------------------------- |
| `requests`             | State          | `App`        | `SummaryPanel`, `RequestList`, `FilterBar` ใช้ข้อมูลชุดเดียวกัน |
| `statusFilter`         | State          | `App`        | `FilterBar` เปลี่ยนค่า, `RequestList` ใช้กรองข้อมูล             |
| `summary`              | Derived data   | `App`        | คำนวณจาก `requests` ใหม่ทุก render (`filter().length`)          |
| `filteredRequests`     | Derived data   | `App`        | คำนวณจาก `requests` + `statusFilter`                            |
| `formData`             | State          | `RequestForm`| ใช้เฉพาะภายในฟอร์ม ไม่มี component อื่นต้องรู้ระหว่างพิมพ์      |
| `errors`               | State          | `RequestForm`| แสดง validation error ของแต่ละ field                            |
| `feedback`             | State          | `RequestForm`| ข้อความสถานะหลัง submit (สำเร็จ/ไม่สำเร็จ)                       |

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## State / Props / Callback Explanation

**State ownership**

- `App` เป็นเจ้าของ `requests` และ `statusFilter` เพราะเป็นข้อมูลที่ต้องใช้ร่วมกันหลาย component (`SummaryPanel` นับสรุปยอด, `RequestList` แสดงรายการ, `FilterBar` ควบคุมตัวกรอง) — ถ้าให้ component ลูกถือ state เอง จะไม่สามารถ sync ข้อมูลกันได้
- `RequestForm` เป็นเจ้าของ `formData`, `errors`, `feedback` ของตัวเอง เพราะเป็นข้อมูลที่ใช้เฉพาะระหว่างกรอกฟอร์ม ไม่มี component อื่นต้องรู้ค่าระหว่างพิมพ์ จนกว่าจะ submit สำเร็จแล้วส่งเป็น payload ที่สมบูรณ์กลับไปให้ `App`

**Props ไหลลง (App → children)**

- `App` → `SummaryPanel`: ส่ง `summary` (object สรุปยอด total/pending/in-progress/completed)
- `App` → `FilterBar`: ส่ง `statusFilter` เป็น `value`
- `App` → `RequestList`: ส่ง `filteredRequests` เป็น `requests`
- `RequestList` → `RequestCard`: ส่ง `request` แต่ละตัวจากการ `map()` พร้อม `key={request.id}`

**Callback ไหลกลับขึ้น (children → App)**

- `RequestForm` เรียก `onAddRequest(formData)` หลัง validate ผ่าน → `App.handleAddRequest` สร้าง `id` ด้วย `generateRequestId()`, ตั้ง `status: "pending"` แล้ว `setRequests` แบบ immutable (`[...current, newRequest]`)
- `FilterBar` เรียก `onFilterChange(filterValue)` เมื่อคลิกปุ่มกรอง → `App` ใช้ `setStatusFilter` ตรง ๆ เป็น callback
- `RequestCard` เรียก `onDeleteRequest(request.id)` เมื่อกดปุ่ม "ลบ" → ไล่ผ่าน `RequestList` ขึ้นไปจนถึง `App.handleDeleteRequest` ซึ่ง `filter()` เอา request ที่ id ตรงกันออกแบบ immutable

**หลักการสำคัญที่ยึดตลอด Lab:** *Props ลง • Events (callback) ขึ้น* — component ลูกไม่แก้ไข state ของ parent โดยตรง แต่ส่ง "เจตนา" (เช่น id ที่จะลบ, ค่า filter ใหม่, ข้อมูลฟอร์มที่ validate แล้ว) กลับขึ้นไปให้ owner ของ state เป็นคนเปลี่ยนค่าจริงเสมอ

## Test Evidence

| Test ID | Actual Result | Pass/Fail | Evidence/Screenshot |
|---|---|---|---|
| TC-01 Initial | โหลดหน้าแรกแสดง 3 คำร้องเริ่มต้นจาก `initialRequests.js` (REQ-001, REQ-002, REQ-003) และ Summary แสดง total ถูกต้อง | TODO | ![alt text](/labs/week-04/evidence/images/TC01.png) |
| TC-02 Controlled input | พิมพ์ในทุก field (`requesterName`, `location`, `details`) แล้วค่าปรากฏใน state ทันที (`value` ผูกกับ `formData`) ยืนยันด้วย React DevTools | TODO | ![alt text](/labs/week-04/evidence/images/TC02.png) |
| TC-03 Invalid | Submit ฟอร์มเปล่า/ข้อมูลไม่ครบ → error message แสดงใต้แต่ละ field ตรงกับ `validateRequest()`, ฟอร์มไม่ reset และไม่เพิ่มรายการใหม่ | TODO | ![alt text](/labs/week-04/evidence/images/TC03.png) |
| TC-04 Valid add | กรอกครบและถูกต้อง → รายการใหม่ถูกเพิ่มเข้า list, ฟอร์ม reset กลับเป็นค่าเริ่มต้น, feedback ขึ้นข้อความ "เพิ่มรายการสำเร็จ" | TODO | ![alt text](/labs/week-04/evidence/images/TC04.png)` |
| TC-05 Filter | คลิกปุ่มกรองสถานะ (เช่น "รอดำเนินการ") → `RequestList` แสดงเฉพาะ request ที่ status ตรงกัน | TODO | ![alt text](/labs/week-04/evidence/images/TC05.png) |
| TC-06 All | คลิกปุ่ม "ทั้งหมด" → กลับมาแสดงครบทุก request อีกครั้ง | TODO | ![alt text](/labs/week-04/evidence/images/TC06.png) |
| TC-07 Empty | กรองสถานะที่ไม่มีข้อมูล → แสดง empty state "ยังไม่มีรายการในสถานะนี้" แทนลิสต์ว่างเปล่า | TODO | ![alt text](/labs/week-04/evidence/images/TC07.png) |
| TC-08 Delete | กดปุ่ม "ลบ" ที่การ์ด → รายการหายไปจากลิสต์ทันที และ summary count ลดลงตาม | TODO | ![alt text](/labs/week-04/evidence/images/TC08.png) |
| TC-09 Mobile | ทดสอบที่ 375px → เป็นหนึ่งคอลัมน์ ไม่มี horizontal scroll, ปุ่ม/ฟอร์มกดง่าย | TODO | ![alt text](/labs/week-04/evidence/images/TC09.png) |
| TC-10 Keyboard | Tab ไล่ลำดับ field ได้ครบ, focus-visible เห็นชัด (outline สีเหลือง), radio ใช้ลูกศรเลือกได้ | TODO | ![alt text](/labs/week-04/evidence/images/TC10.png) |
| TC-11 Build | `npm run check` และ `npm run build` ผ่านโดยไม่มี error/warning, ไม่มี React key warning ใน console | TODO | ![alt text](/labs/week-04/evidence/images/TC11.png) |
| TC-12 Pages | เปิด GitHub Pages URL ใน Incognito → หน้าเว็บโหลดและทำงานได้ครบ ไม่มี asset 404 | TODO | ![alt text](/labs/week-04/evidence/images/TC12.png) |

## Screenshots

### Desktop: 
![alt text](/labs/week-04/evidence/images/Desktop.png)
### Mobile 375px: 
![alt text](/labs/week-04/evidence/images/Mobile.png)
### Validation/empty state: 
![alt text](/labs/week-04/evidence/images/TC04.png), ![alt text](/labs/week-04/evidence/images/TC07.png)

## Week 03 → Week 04 Reflection

ใน Week 03 การอัปเดต UI ทำแบบ DOM-driven คือ อ่านค่าจากฟอร์มด้วย `FormData`/`querySelector`, แก้ไข array ข้อมูลเอง แล้วต้องเรียกฟังก์ชัน `renderRequests()` และ `updateSummary()` ด้วยตัวเองทุกครั้งที่ข้อมูลเปลี่ยน ทำให้ต้องคอยจำว่าจุดไหนของโค้ดต้อง sync หน้าจอใหม่บ้าง หากลืมเรียกฟังก์ชัน render จุดใดจุดหนึ่งจะทำให้ UI ไม่ตรงกับข้อมูลจริงได้ง่าย

ใน Week 04 เปลี่ยนมาเป็น State-driven UI ด้วย React คือเก็บ `requests` และ `statusFilter` เป็น state ที่ `App` และเปลี่ยนค่าผ่าน `setRequests`/`setStatusFilter` แบบ immutable (ไม่ mutate array เดิม) เท่านั้น ส่วนการ re-render, การคำนวณ `summary` และ `filteredRequests` ใหม่ React จัดการให้อัตโนมัติทุกครั้งที่ state เปลี่ยน ไม่ต้องเรียกฟังก์ชัน update UI เอง

ข้อดีที่เห็นชัดคือโค้ดสั้นลง คาดเดาพฤติกรรมได้ง่ายขึ้น (state เปลี่ยน → UI เปลี่ยนตามเสมอ) และบั๊กที่เจอบ่อยใน Week 04 ก็ต่างไปจาก Week 03 เดิม กลายเป็นเรื่องเฉพาะของ React เช่น การผสม `value`/`defaultValue` บน input ตัวเดียวกันจน React แจ้ง controlled/uncontrolled conflict, การ spread object ผิดลำดับจนค่าถูกเขียนทับโดยไม่ตั้งใจ (เช่น `id` ถูกทับด้วยค่าว่าง), และการใช้ `key` ซ้ำใน list ที่ React เตือนทันทีเพราะเป็นกลไกสำคัญของการ reconcile DOM — ปัญหาเหล่านี้ไม่มีทางเกิดใน Week 03 เพราะไม่มี concept ของ state/key/controlled component เลย

## AI / External Resource Disclosure

- **เครื่องมือที่ใช้:** Claude (Anthropic)
- **แหล่งอ้างอิงประกอบ:**
  - [ENGSE203-LAB (Sec1-2) — เอกสารประกอบวิชา](https://docs.google.com/document/d/1ozdylIgLqshdAaYyNvpAJIH6yJVn570cjs2TwXZ6MAo/edit?tab=t.0)
  - [week-04-react-components-state/pre-lab04 — se-rmutl/engse203-lab](https://github.com/se-rmutl/engse203-lab/tree/main/labs/week-04-react-components-state/pre-lab04)
  - [ENGSE203 Week 04 — React.js Fundamentals (Slides)](https://se-rmutl.github.io/engse203/week04)
- **Prompt/คำถามสำคัญที่ใช้ถาม:** ให้ Claude ช่วยอธิบาย error message ของ React ที่เจอระหว่างเขียนโค้ด (เช่น `request is not defined`, controlled/uncontrolled input conflict, React key ซ้ำ), อธิบายการทำงานของ object spread (`{...obj}`) และ computed property (`[name]: value`), และช่วยตรวจสอบ logic ของ `handleAddRequest`/`handleDeleteRequest`/`validateRequest`
- **ส่วนที่นำมาปรับใช้:**
  - แก้ typo ตัวแปร `request` → `requests` ในการคำนวณ `filteredRequests`
  - แก้ `setTasks` ที่ไม่มีอยู่จริงเป็น `setRequests` และแก้ปัญหา parameter shadowing ใน `handleDeleteRequest`
  - แก้ `<select>` ที่มีทั้ง `defaultValue` และ `value` พร้อมกัน (controlled/uncontrolled conflict)
  - แก้ `setFormData({ initialForm })` และ `onAddRequest({ formData })` ที่เขียนผิดเป็น object shorthand ทำให้ข้อมูลถูกห่อซ้อนโดยไม่ตั้งใจ
  - แก้ลำดับการ spread ใน `handleAddRequest` เพื่อไม่ให้ `id` ที่สร้างใหม่ถูกทับด้วยค่าว่างจากฟอร์ม
  - แก้ radio button จาก `defaultChecked` (uncontrolled) เป็น `checked={formData.priority === "..."}` คู่กับ `onChange` (controlled)
  - เปลี่ยนวิธีสร้าง `id` จาก `Date.now()` เป็นฟังก์ชัน `generateRequestId()` ใน `initialRequests.js` เพื่อให้ id ต่อเนื่องรูปแบบเดียวกับข้อมูลตั้งต้น (`REQ-004`, `REQ-005`, ...)
- **วิธีตรวจสอบความถูกต้อง:** ทดสอบรันจริงด้วย `npm run dev` หลังแก้ทุกจุด ตรวจสอบ browser console ว่าไม่มี error/warning เหลืออยู่, ทดสอบ flow เพิ่ม/ลบ/กรองข้อมูลด้วยตนเองซ้ำหลายรอบ, และรัน `npm run check` กับ `npm run build` ให้ผ่านก่อน commit ทุกครั้ง