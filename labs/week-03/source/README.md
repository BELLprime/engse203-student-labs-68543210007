# ENGSE203 LAB 3 — Campus Service Request (Responsive Web UI, Form & Event)

## ผู้จัดทำ

- ชื่อ-นามสกุล: นายณัฏฐกิตติ์ รอดเรือน
- รหัสนักศึกษา: 68543210007-9
- ระบบปฏิบัติการที่ใช้: Windows-WSL

---

## วัตถุประสงค์ของงาน

- ออกแบบหน้าเว็บด้วย **Semantic HTML** (`header`, `main`, `section`, `aside`, `form`) ที่รองรับการเข้าถึง (accessibility) เช่น `label for` ตรงกับ `id`, `aria-describedby` เชื่อมข้อความ error/hint เข้ากับ field
- จัดวางหน้าเว็บแบบ **Responsive Layout** ที่แสดงผลถูกต้องตั้งแต่จอมือถือ (375px, หนึ่งคอลัมน์ ไม่มี horizontal scroll) จนถึงจอ desktop และรองรับการ zoom 200%
- ฝึกใช้ **DOM Event** (`input`, `submit`) เพื่อทำ Live Preview แบบ real-time และป้องกันการ reload หน้าเมื่อ submit ฟอร์ม (`preventDefault()`)
- ฝึก **Validate ข้อมูล** ฝั่ง client พร้อมแสดงสถานะ invalid/success 
- ฝึก workflow การทำงานด้วย Git (feature branch, commit เป็นระยะ, Pull Request) และ deploy แอปขึ้น **GitHub Pages** ผ่าน Vite build

---

## เครื่องมือที่ใช้

- Vite `^8.1.1` (dev server / build tool)
- JavaScript (Vanilla, ES Modules), HTML5, CSS3
- Node.js `>=22.12.0`, npm
- Git และ GitHub / GitHub Pages
- Visual Studio Code
- Claude (AI assistant) — ดูรายละเอียดในหัวข้อ References & AI Assistance

---

## วิธีติดตั้งและรัน

```bash
git clone https://github.com/BELLprime/engse203-lab03-68543210007-9.git
cd engse203-lab03-68543210007-9

npm install
npm run dev
npm run check
# Build สำหรับ  docs/  GitHub Pages
npm run build
npm run preview
```

---

## โครงสร้างไฟล์

```text
.
engse203-lab03-68543210007-9/
├── docs/                     # ผลลัพธ์จาก npm run build → deploy ด้วย GitHub Pages
│   ├── assets/
│   └── index.html
├── pre-lab03/                # แบบฝึกหัดก่อน LAB 3 (Profile Card Builder)
│   ├── app.js
│   ├── index.html
│   └── style.css
├── src/
│   ├── main.js                # จัดการ state, DOM event (input/submit), validate, render preview
│   └── style.css              # responsive layout (mobile-first, 2 คอลัมน์บน desktop)
├── index.html                  # โครงหน้าเว็บ (semantic HTML, form, live preview panel)
├── package.json
├── vite.config.js             
└── README.md
```

---

## หลักฐานผลลัพธ์

หน้าเว็บ **Campus Service Request** เป็นฟอร์มสำหรับสร้างคำขอใช้บริการภายในมหาวิทยาลัย ประกอบด้วย
Requester Name, Request Type และ Details พร้อม Live Preview และรายการคำขอที่ส่งแล้ว

- 🔗 Live demo: [https://bellprime.github.io/engse203-lab03-68543210007-9/](https://bellprime.github.io/engse203-lab03-68543210007-9/)
- 🔗 Repository: [https://github.com/BELLprime/engse203-lab03-68543210007-9](https://github.com/BELLprime/engse203-lab03-68543210007-9)

**สิ่งที่ทดสอบและทำงานได้ตามที่ใบงานกำหนด:**

| หัวข้อ | รายละเอียด |
|---|---|
| Semantic HTML / Accessibility | ใช้ `header`, `main`, `section`, `aside`, `form`; `label for` ตรงกับ `id` ของทุก field; ทุก control มี `name`; error message เชื่อมด้วย `aria-describedby` |
| Responsive Layout | มือถือ (375px) แสดงเป็นหนึ่งคอลัมน์ไม่มี horizontal scroll; หน้าจอ desktop แสดงเป็นสองคอลัมน์ (ฟอร์ม + live preview) |
| Event / Live Preview | ใช้ `input` event อัปเดต Live Preview แบบ real-time; ใช้ `submit` event ร่วมกับ `preventDefault()` เพื่อไม่ให้หน้ารีโหลด; ใช้ `textContent` ในการแสดงข้อมูลผู้ใช้เพื่อป้องกัน XSS |
| Validation / Feedback | ตรวจสอบความยาวชื่อ (≥2 ตัวอักษร), การเลือกประเภทคำขอ และรายละเอียด (≥10 ตัวอักษร); แสดง error ใกล้ field ที่ผิด และไม่ reset ฟอร์มเมื่อข้อมูลไม่ผ่าน; เมื่อข้อมูลถูกต้องจะเพิ่มรายการคำขอและ reset ฟอร์ม |

---
>  ### No error
> <img width="800" height="135" alt="Screenshot 2026-07-14 221648" src="https://github.com/user-attachments/assets/0891b2a2-50cc-4dd2-a55f-abaab4159412" />
> 
> ### Mobile View (375px)
> <img width="1917" height="1078" alt="Screenshot 2026-07-14 215958" src="https://github.com/user-attachments/assets/44de3802-7540-4f4d-a7a2-be2defba342d" />
>
> ### Tablet (768px)
> <img width="1917" height="1078" alt="Screenshot 2026-07-14 220139" src="https://github.com/user-attachments/assets/d801113e-4219-4800-a39e-0dbfd997e9c8" />
> 
> ### Desktop View
> <img width="1917" height="1073" alt="Screenshot 2026-07-14 220205" src="https://github.com/user-attachments/assets/bfff8864-89eb-4a5b-bd8c-ecf74233fe53" />
>
> ### Real-time
> <img width="1915" height="1073" alt="Screenshot 2026-07-14 221146" src="https://github.com/user-attachments/assets/0e35311c-44b8-4a1a-b6a6-ae647e0b3d2a" />
> 
> ### Validation Error State
><img width="1911" height="1078" alt="Screenshot 2026-07-14 220304" src="https://github.com/user-attachments/assets/4cb12e87-2525-47d8-928a-ea0039ed1c93" />
>
> ### Success State
> <img width="1913" height="1072" alt="Screenshot 2026-07-14 220902" src="https://github.com/user-attachments/assets/c1eabb49-a2ae-43c4-b944-71ee454e443b" />
>
> 
---

## ปัญหาที่พบและวิธีแก้ไข

- ปัญหา: `หลัง npm run build แล้ว deploy ขึ้น GitHub Pages หน้าเว็บขึ้น 404 `
  วิธีแก้: `ตรวจค่า base ใน vite.config.js ให้ตรงกับชื่อ repository <engse203-lab03-68543210007-9> ให้ตรง แล้ว build ใหม่`
> - ปัญหา: `กรอกข้อมูลในฟอร์มแล้ว Live Preview ไม่แสดงผลแบบ real-time เนื่องจาก attribute name ของ field ใน HTML ระบุไม่ตรงกับ key ที่ <renderPreview(data)> เรียกใช้ ทำให้ถึงแม้จะพิมพ์ข้อมูลแล้ว ส่วน <id="preview-name"> ก็ยังคงแสดงข้อความ default (ยังไม่ระบุชื่อ) อยู่เหมือนเดิม `
  วิธีแก้: `ตรวจสอบและแก้ attribute name ใน HTML ให้ตรงกับ key ที่ใช้ใน renderPreview() เนื่องจากมีการสับสนจาก prelab03 `

---

## References & AI Assistance

- Source / Documentation:
  - [week-03-responsive-ui/lab3 — se-rmutl/engse203-lab](https://github.com/se-rmutl/engse203-lab/tree/main/labs/week-03-responsive-ui/lab3)
  - [submission-guide.md — se-rmutl/engse203-lab](https://github.com/se-rmutl/engse203-lab/blob/main/docs/submission-guide.md)
- AI tool used: Claude
- Used for: Used for: ช่วยอธิบายแนวคิดการจัดการ DOM event (input/submit), แนวทางการ validate ฟอร์มและแสดง error/success state, และอธิบายการเชื่อมโยงระหว่าง attribute ต่าง ๆ (เช่น id, name, aria-describedby) กับการดึงค่าผ่าน querySelector
- My adaptation: ศึกษาและทำความเข้าใจโค้ดในส่วน src/main.js และ index.html จากเอกสารตัวอย่างของ week-03-responsive-ui/lab3 โดยเน้นที่การส่งค่าระหว่างฟังก์ชัน การเข้าถึง element ผ่าน DOM (querySelector) และลำดับการเรียกใช้งานฟังก์ชันว่าอันไหนควรทำงานก่อน-หลัง ส่วน style.css มีการปรับแต่ง mobile-first layout เอง เช่น เพิ่ม @media query ให้ .page-grid เปลี่ยนเป็น 2 คอลัมน์บนจอ desktop ทั้งนี้ยอมรับว่ามีการใช้เครื่องมือ AI ช่วยด้านการจัดสัดส่วนหน้าเว็บตกแต่งหน้าเว็บให้ดูสวยงามมากขึ้นแต่กลไกในการจัดสัดส่วนเป็นการทำด้วยตนเอง
