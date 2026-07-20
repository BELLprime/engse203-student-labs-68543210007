# ENGSE203 LAB 02 — Modern JavaScript Dashboard

## ผู้จัดทำ

- ชื่อ-นามสกุล : นายณัฏฐกิตติ์ รอดเรือน
- รหัสนักศึกษา : 68543210007-9
- ระบบปฏิบัติการที่ใช้ : macOS
- Repository : engse203-lab02-68543210007-9

---

## วัตถุประสงค์ของงาน

โปรเจกต์นี้เป็นส่วนหนึ่งของ Lab 02 ในรายวิชา ENGSE203 (Modern JavaScript) โดยเป็นการพัฒนา
**Dashboard** ด้วย JavaScript สมัยใหม่ (Modern JavaScript / ES Modules) ที่แบ่งการทำงานออกเป็น
โมดูลย่อยอย่างน้อย 4 โมดูล เพื่อฝึกการออกแบบโครงสร้างโค้ดที่เป็นระเบียบ นำกลับมาใช้ซ้ำได้
(reusable) และดูแลรักษาง่าย (maintainable)

Dashboard นี้แสดงผลข้อมูลในรูปแบบ UI ที่รองรับทั้ง **สถานะปกติ (Normal State)** และ
**สถานะเมื่อเกิดข้อผิดพลาด (Error State)** พร้อมทั้งมีการตรวจสอบชนิดข้อมูล/คุณภาพโค้ดด้วย
เครื่องมือที่กำหนด และ deploy ขึ้น GitHub Pages เพื่อให้เข้าถึงได้จริงผ่านเบราว์เซอร์

### โครงสร้างโมดูล (Modules)

| NO. | Module | หน้าที่ความรับผิดชอบ |
|---|--------|----------------------|
| 1 | `api.js` | ดึงข้อมูล (data fetching) จาก `data/learning-tasks.json` ผ่าน `fetchLearningTasks()` รองรับการจำลอง error (`simulateError`) ตรวจสอบ HTTP status และรูปแบบข้อมูลที่ได้รับ (validation) |
| 2 | `main.js` | Entry point ของแอป จัดการ state, event listeners (search/filter), เรียกใช้ฟังก์ชันจากโมดูลอื่นเพื่อโหลดและ render ข้อมูล รวมถึงจัดการ try/catch สำหรับ error handling |
| 3 | `ui.js` | รับผิดชอบการ render UI ทั้งหมด เช่น `renderStats()`, `renderTasks()`, `setMessage()` และป้องกัน XSS ด้วย `escapeHtml()` |
| 4 | `utils.js` | ฟังก์ชันช่วยเหลือ (utilities) สำหรับกรองข้อมูล (`filterTasks`), คำนวณสถิติ (`getStats`) และแปลง label สถานะ (`getStatusLabel`) |

---

## วิธีติดตั้งและรันโปรเจกต์

### ข้อกำหนดเบื้องต้น (Prerequisites)

- node -v
- npm -v

### ขั้นตอนกรทำ

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash

source ~/.zshrc

command -v nvm

nvm install 22
nvm alias default 22
nvm use 2
```
###  เข้าไปที่ ENGSE203/engse203-lab02-68543210007-9
```bas
# 1. Clone repository
git clone https://github.com/BELLprime/engse203-lab02-68543210007-9.git
cd engse203-lab02-<student-id>

# 2. ติดตั้ง npm
npm init -y
npm install
```

## โครงสร้างไฟล์

```text
.
engse203-lab02-<student-id>/
├── public/
│   ├── .nojekyll
│   └── data/
│       └── learning-tasks.json
├── scripts/
│   └── check-project.mjs
├── src/
│   ├── api.js
│   ├── main.js
│   ├── style.css
│   ├── ui.js
│   └── utils.js
├── docs/               # สร้างจาก npm run build และต้อง commit
├── .gitignore
├── index.html
├── package.json
├── README.md
└── vite.config.js
```


### คำสั่งที่ใช้งานได้

| คำสั่ง | คำอธิบาย |
|--------|----------|
| `npm install` | ติดตั้ง dependencies ทั้งหมดของโปรเจกต์ |
| `npm run dev` | รันเซิร์ฟเวอร์สำหรับพัฒนา (development server) พร้อม hot reload |
| `npm run check` | ตรวจสอบโค้ด |
| `npm run build` | สร้าง build output สำหรับ production ไปยังโฟลเดอร์ `docs/` |

หลังรัน `npm run dev` ให้เปิดเบราว์เซอร์ไปที่ URL ที่แสดงใน terminal (เช่น `http://localhost:5173`)

---

## GitHub Pages URL

🔗 Dashboard ที่ deploy แล้ว: [https://bellprime.github.io/engse203-lab02-68543210007-9/](https://bellprime.github.io/engse203-lab02-68543210007-9/)

---

## ภาพหน้าจอ (Screenshots)

### Normal State

- <img width="1893" height="971" alt="Screenshot 2026-07-07 103025" src="https://github.com/user-attachments/assets/c25e2679-408d-4ed8-888c-d7c0b6a72b28" />

> คำอธิบาย: หน้าจอ Dashboard เมื่อโหลดข้อมูลสำเร็จและแสดงผลตามปกติ **สามารถดูได้ : [https://bellprime.github.io/engse203-lab02-68543210007-9/](https://bellprime.github.io/engse203-lab02-68543210007-9/) 

### Error State

- <img width="1907" height="965" alt="Screenshot 2026-07-07 103214" src="https://github.com/user-attachments/assets/9bdc84cf-11ee-4d70-a11a-497a762842ea" />

> คำอธิบาย: หน้าจอ Dashboard เมื่อเกิดข้อผิดพลาด เช่น การดึงข้อมูลล้มเหลว หรือ network error **สามารถดูได้ : [https://bellprime.github.io/engse203-lab02-68543210007-9/?simulateError=1](https://bellprime.github.io/engse203-lab02-68543210007-9/?simulateError=1)

---

## ปัญหาที่พบและวิธีแก้ไข

| ปัญหาที่พบ | สาเหตุ | วิธีแก้ไข |
|-----------|-------|-----------|
| `Permission denied (publickey) ตอน git clone หรือ git push` | `ใช้ SSH URL แต่ตั้งค่า SSH key กับ GitHub account ผิด` | `เปลี่ยนไป clone ด้วย HTTPS URL แทน (https://github.com/...) หรือสร้าง SSH key ใหม่แล้วเพิ่มใน GitHub Settings → SSH and GPG keys` |
| `zsh: permission denied: ./install.sh หรือ script รันไม่ได้` | `ไฟล์ script ไม่มีสิทธิ์ execute` | `รัน chmod +x <ชื่อไฟล์> ก่อน แล้วค่อยรันใหม่` |

> เพิ่ม/ลบแถวได้ตามจำนวนปัญหาที่พบจริงระหว่างการพัฒนา

---

## References & AI Assistance

### References
-[async-await_and_error-handling.md](https://github.com/se-rmutl/engse203-lab/blob/main/labs/week-02-modern-javascript/docs/async-await_and_error-handling.md)
-[destructuring_array_map_filter_reduce.md](https://github.com/se-rmutl/engse203-lab/blob/main/labs/week-02-modern-javascript/docs/destructuring_array_map_filter_reduce.md)
-[functions_and_invocation.md](https://github.com/se-rmutl/engse203-lab/blob/main/labs/week-02-modern-javascript/docs/functions_and_invocation.md)
-[variable_naming.md](https://github.com/se-rmutl/engse203-lab/blob/main/labs/week-02-modern-javascript/docs/variable_naming.md)

### AI Assistance Disclosure

- **เครื่องมือที่ใช้:** `<Claude>`
- **ลักษณะการใช้งาน:** `<ช่วยอธิบายแนวคิด ES Modules, ช่วย debug error , ช่วยอธิยายหลักการทำงานของ function ต่างๆว่ามีการเชื่อมโยงกันยังไง , ช่วยร่างโครง README>`
- **ส่วนที่เขียน/แก้ไขเองโดยผู้เรียน:** `ส่วนที่เป็น scr และ ขั้นตอนการติดตั้ง ตามที่ศึกษาจากเอกสารของ lab week2`

---
