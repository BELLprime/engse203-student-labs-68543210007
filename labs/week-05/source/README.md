# ENGSE203 LAB 05 — Student Evidence README

## ผู้จัดทำ

- ชื่อ–นามสกุล: นายณัฏฐกิตติ์ รอดเรือน
- รหัสนักศึกษา: 68543210007-9
- Section: Sec 1
- ระบบปฏิบัติการที่ใช้: Windows 11 / Microsoft Edge
- Node version: v22.23.1
- Branch: `lab/week-05`
- Commit: `2fdb5c6`
- วันที่ทดสอบ: 24 สิงหาคม 2026

## URLs

- Repository: [https://github.com/BELLprime/engse203-student-labs-68543210007](https://github.com/BELLprime/engse203-student-labs-68543210007)
- Pull Request: [https://github.com/BELLprime/engse203-student-labs-68543210007/pull/6](https://github.com/BELLprime/engse203-student-labs-68543210007/pull/6)
- GitHub Pages: [https://bellprime.github.io/engse203-student-labs-68543210007/labs/week-05/](https://bellprime.github.io/engse203-student-labs-68543210007/labs/week-05/)

## Component Tree & Routing

```text
App (HashRouter + Routes)
└── AppLayout (Main layout with Outlet)
    ├── / (DashboardPage)
    │   ├── AppHeader
    │   ├── SummaryPanel
    │   ├── FilterBar
    │   └── RequestList ── RequestCard
    ├── /requests/new (NewRequestPage)
    │   ├── AppHeader
    │   └── RequestForm
    ├── /requests/:requestId (RequestDetailPage)
    │   └── AppHeader + Details
    └── * (NotFoundPage)
        └── AppHeader + 404 Message
```

**Architecture & Core Concepts สรุป**

| หัวข้อ | คำอธิบาย |
| --------------------- | -------------------------------------------------------------- |
| **Route** | จัดการเส้นทางหน้าเว็บ (SPA) ด้วย `react-router-dom` (HashRouter) โดยกำหนด `<Routes>` ไว้ที่ `App.jsx` และใช้ `<Outlet />` ใน `AppLayout` เพื่อสลับ Component ตาม URL เช่น `/`, `/requests/new`, `/requests/:requestId` โดยที่หน้าจอไม่ต้องรีโหลดใหม่ |
| **Effect (`useEffect`)** | ใช้ในระดับ Page Component (เช่น `DashboardPage`) เพื่อรันคำสั่งดึงข้อมูล (Fetch) อัตโนมัติทันทีที่ผู้ใช้โหลดเข้าหน้านั้น หรือเมื่อ Dependency เปลี่ยนแปลง |
| **Service Layer** | ย้าย Business Logic ออกจาก UI มาไว้ที่ `requestService.js` (สำหรับดึง/เพิ่ม/ลบข้อมูล) ทำให้ UI Component ต่างๆ ไม่ต้องเข้าไปแตะข้อมูลตรงๆ ช่วยลดความซับซ้อนของการส่ง Props |
| **Persistence** | การจัดเก็บข้อมูลถาวรด้วย `localStorage` ผ่าน `requestStorage.js` ทำให้ข้อมูลอยู่รอดแม้จะถูกกด Refresh รวมถึงมีฟังก์ชัน Recovery เมื่อข้อมูลพัง (Malformed) หรือ Schema ไม่ตรงกับระบบ |

## Setup และ Run

```bash
nvm use
npm install
npm run dev
npm run check
npm run build
npm run preview
```

## รายงานผลการทดสอบ (TEST REPORT)

**เงื่อนไขเริ่มต้นของทุกข้อ** — รัน `npm run dev` แล้วเปิด URL ที่แสดง เว้นแต่ระบุเป็นอย่างอื่น

### คาบ 5A · CP02 — Routing

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-01** | เปิด `#/` | Dashboard แสดงแผงสรุปและรายการคำร้อง | แสดงหน้า Dashboard พร้อมกราฟิกสรุปและรายการคำร้องที่เตรียมไว้ | PASS | |
| **TC-L5-02** | กดเมนู Dashboard → New Request → About ทีละปุ่ม · เปิด DevTools แท็บ Network ค้างไว้ | เปลี่ยนหน้าทั้ง 3 ครั้ง · **ไม่มีไฟล์ `.html` ถูกโหลดใหม่** · ปุ่มที่ active ตรงกับหน้าปัจจุบัน | เปลี่ยนหน้าได้ทันที ไม่มี HTML โหลดใหม่ (SPA) เมนูสีเข้มสอดคล้องกับหน้าปัจจุบัน | PASS | |
| **TC-L5-03** | เปิด `#/requests/new` แล้วกด `F5` | หลัง refresh ยังอยู่หน้า New Request ไม่ใช่หน้า 404 | รีเฟรชแล้วฟอร์มไม่หายและไม่เจอหน้า 404 | PASS | |
| **TC-L5-06** | เปิด `#/unknown` | หน้า NotFound **พร้อม header และ footer** + ลิงก์กลับ Dashboard | แสดงหน้า 404 NotFound พร้อม Layout ส่วนบนและล่างปกติ | PASS | ![alt route-not-found](/labs/week-05/evidence-templates/images/route-not-found.png) |

### คาบ 5A · CP03 — Service และ Data Lifecycle

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-08** | เปิด `#/` แล้วสังเกตช่วงแรก · ถ้าถ่ายไม่ทันให้ตั้ง Network throttle เป็น Slow 3G | เห็นตัวบอกว่ากำลังโหลดก่อน แล้วรายการจึงขึ้น | มีหน้าต่างโหลด (Loading State) ขึ้นชั่วครู่ก่อนแสดงรายการ | PASS | ![alt state-loading](/labs/week-05/evidence-templates/images/state-loading.png) |
| **TC-L5-09** | เปิด `#/?scenario=error` | แถบบอกว่าอยู่ในโหมดทดสอบ + ข้อความผิดพลาดที่คนทั่วไปเข้าใจ + ปุ่มลองอีกครั้ง · **ไม่มี stack trace** | แสดงหน้า Error และปุ่ม Retry โดยไม่มีโค้ด Stack Error | PASS | ![alt state-error-retry](/labs/week-05/evidence-templates/images/state-error-retry.png) |
| **TC-L5-10** | จากข้อ 09 กดปุ่มลองอีกครั้ง | **URL เปลี่ยนกลับเป็น `#/`** แล้วโหลดรายการปกติ | URL กลับเป็นปกติ รายการถูกโหลดขึ้นมาสำเร็จ | PASS | |
| **TC-L5-11** | เปิด `#/?scenario=empty` | ข้อความว่ายังไม่มีคำร้อง + ปุ่มไปหน้าสร้างใหม่ · **ไม่ใช่หน้าจอ error** | หน้าจอแจ้งว่ายังไม่มีคำร้อง (Empty State) ไม่ใช้กล่อง Error | PASS | ![alt state-empty](/labs/week-05/evidence-templates/images/state-empty.png) |
| **TC-L5-15** | เปลี่ยนตัวกรองครบทุกค่า — all, pending, in-progress, completed | รายการเปลี่ยนถูกต้องทุกค่า · **แผงสรุปไม่เปลี่ยน** เพราะนับจากข้อมูลทั้งหมด | ตารางกรองเฉพาะรายการที่ตรงกับประเภท แผงตัวเลขข้างบนยังแสดงครบทั้งหมด | PASS | |

### คาบ 5A · CP05a — Dynamic Detail

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-04** | เปิด `#/requests/REQ-001` | แสดงรายละเอียดที่ตรงกับรหัสนั้น | แสดงรายละเอียด Request-001 ตรงตามข้อมูลจริง | PASS | ![alt route-detail-found](/labs/week-05/evidence-templates/images/route-detail-found.png) |
| **TC-L5-05** | เปิด `#/requests/REQ-999` | ข้อความว่าไม่พบคำร้องรหัสนั้น + ลิงก์กลับ · **อยู่ในหน้า Detail ไม่ใช่หน้า NotFound และไม่ใช่หน้าจอ error** | โชว์ข้อความว่า Request Not Found ไม่เด้งไปหน้า 404 | PASS | |

### คาบ 5B · CP04a — Persistence

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-07** | DevTools → Application → Local Storage → ลบคีย์ `engse203-campus-requests-v1` → refresh | ข้อมูลตัวอย่างกลับมา และคีย์ถูกสร้างใหม่พร้อม envelope · **ไม่มีข้อความแจ้งว่ากู้ข้อมูล** เพราะเป็นการเปิดครั้งแรก | ข้อมูลเริ่มต้นสร้างใหม่ใน Local Storage โดยไม่มีหน้าต่างแจ้งเตือนซ่อมแซม | PASS | |
| **TC-L5-13** | ส่งฟอร์มโดยเว้นบางช่อง แล้วลองใส่รายละเอียดสั้นกว่า 10 ตัวอักษร | ข้อความเตือนใต้ช่องที่ผิด · **ไม่ใช่ `TypeError` หรือข้อความภาษาโปรแกรมเมอร์** | แจ้งเตือนข้อความให้กรอกให้ครบตรงด้านล่างของช่อง Input | PASS | |
| **TC-L5-14** | เพิ่มคำร้องที่กรอกครบ → เด้งไปหน้ารายละเอียด → กด `F5` | บันทึกสำเร็จ · **หน้ารายละเอียดแสดงข้อมูลจริง** · refresh แล้วคำร้องยังอยู่ | รีเฟรชหน้าต่างใหม่ข้อมูลคำร้องใหม่ยังคงอยู่และแสดงครบ | PASS | ![alt persistence-add-refresh](/labs/week-05/evidence-templates/images/persistence-add-refresh.png) |
| **TC-L5-16** | ลบคำร้องที่เพิ่งเพิ่ม → กด `F5` | หายจากรายการทันที และ **refresh แล้วไม่กลับมา** | รายการถูกลบหายไปจากหน้าจอและ Local Storage | PASS | ![alt persistence-delete-refresh](/labs/week-05/evidence-templates/images/persistence-delete-refresh.png) |
| **TC-L5-17** | กดปุ่ม Reset Demo Data → ยืนยัน | ข้อมูลตัวอย่างกลับมาครบ · ตัวกรองรีเซ็ตเป็น all · **ข้อมูลของเว็บอื่นในโดเมนเดียวกันไม่ถูกลบ** | ข้อมูลกลับมาเป็นค่าทดสอบตั้งต้น ตัวกรองกลับสู่สถานะเดิม | PASS | |

### คาบ 5B · CP04b — Recovery

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-18a** | ใน Local Storage วางค่า `{ ไม่ใช่ JSON` ทับคีย์ LAB05 → refresh | กู้ข้อมูลตัวอย่าง + **ข้อความแจ้งผู้ใช้** · ไม่มีหน้าจอขาว ไม่มี error ค้างใน Console | กู้ข้อมูลคืนค่าตั้งต้นสำเร็จและมีการแจ้งเตือนผู้ใช้ ไม่มีจอขาว | PASS | ![alt storage-recovery](/labs/week-05/evidence-templates/images/storage-recovery.png) |
| **TC-L5-18b** | วางค่า `{"schemaVersion":99,"requests":[]}` → refresh | กู้ได้เหมือนกัน · **จับด้วยการเทียบ SCHEMA_VERSION ไม่ใช่ try/catch** | กู้ข้อมูลคืนค่าตั้งต้นสำเร็จจาก Version Mismatch | PASS | |
| **TC-L5-18c** | วาง envelope ที่มีคำร้อง `id` ซ้ำกัน 2 รายการ → refresh | กู้ได้เหมือนกัน · จับด้วย `validateRequests()` | กู้ข้อมูลคืนค่าตั้งต้นจากการตรวจสอบ Validation Id ซ้ำ | PASS | |

### คาบ 5B · CP05b — Regression จาก Week 04

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-19** | เพิ่มและลบคำร้องหลายรอบ แล้วเทียบตัวเลขในแผงสรุปกับจำนวนรายการที่นับด้วยตา | **ตัวเลขตรงกันทุกครั้ง** ทั้ง total, pending, in-progress, completed | ข้อมูลบนแผงสรุปคำนวณถูกต้องตามจำนวนรายการจริง | PASS | |

### คาบ 5B · CP06 — Verify และ Delivery

| ID | ทำอะไร | ผลที่ควรได้ | ผลจริง | สถานะ | หลักฐาน |
|---|---|---|---|---|---|
| **TC-L5-20** | DevTools → Toggle device toolbar → ตั้งความกว้าง 375px → เปิดครบทุกหน้า | ไม่มีการเลื่อนแนวนอน · ปุ่มกดได้ไม่ทับกัน · ข้อความไม่ถูกตัด | Layout หน้าเว็บปรับตัวกับขนาดจอเล็กได้ ไม่ล้น | PASS | ![alt responsive-375](/labs/week-05/evidence-templates/images/responsive-375.png) |
| **TC-L5-21** | วางเมาส์ไว้ข้าง ๆ ใช้ `Tab` `Shift+Tab` `Enter` `Space` เท่านั้น | เข้าถึงทุกลิงก์ ปุ่ม และช่องกรอกได้ · **เห็นชัดตลอดว่าโฟกัสอยู่ที่ไหน** | เข้าถึงทุกเมนูได้ด้วยคีย์บอร์ด | PASS | |
| **TC-L5-12** | `npm run check` | ผ่าน **133/133** | ผ่านครบทั้งหมด 133/133 (100%) | PASS | ![alt npm-run-check](/labs/week-05/evidence-templates/images/npm-run-check.png) |
| **TC-L5-22** | `npm run build` แล้ว `npm run preview` | build ไม่มี error · เปิด preview แล้ว refresh ที่ทุก URL ได้ | Build สำเร็จ เปิดพรีวิวแล้วรีเฟรชได้ปกติ | PASS | |
| **TC-L5-23** | เปิด GitHub Pages **ในหน้าต่างส่วนตัว** แล้ว refresh ที่ URL ที่มี `#` | โหลดได้ทุกหน้า · refresh แล้วไม่ 404 · ข้อมูลตัวอย่างขึ้นเหมือนผู้ใช้ใหม่ | เปิด URL หน้าต่างๆ บน Incognito ได้และมีข้อมูลตัวอย่างครบ | PASS | ![alt gitPage](/labs/week-05/evidence-templates/images/gitPage.png) |
| **TC-L5-24** | เปิด Pull Request และติด tag `lab-05-submission-v1` | PR เปิดแล้ว · tag ถูก push ขึ้น remote | สั่งเปิด PR และลง Tag ใน Remote สำเร็จ | PASS |  |

### สรุปผล

| | จำนวน |
|---|---|
| PASS | 24 |
| FAIL | 0 |
| NOT RUN | 0 |
| **รวม** | **24** |

## Rerun log

เก็บร่องรอย FAIL เดิม แล้วเพิ่มบรรทัด rerun แทนการลบประวัติ

| Test ID | เวลา | Fix | Actual result | Status |
|---|---|---|---|---|
| TC-L5-14 | 16:32 น. | แก้ไขบั๊ก Template Literal ตอนสร้าง ID (`requestService.js`) | สร้างคำร้องที่ 2 ได้ ไม่ค้างที่กำลังบันทึกแล้ว | PASS |

## Week 04 → Week 05 Reflection

ใน Week 04 เราจัดการ State และ Logic ทั้งหมดแบบรวมศูนย์ไว้ที่ `App.jsx` แล้วใช้วิธีส่ง Props ลึกลงไปยัง Component ลูกเพื่อสั่งงาน สิ่งที่ตามมาคือ Component จะผูกติดกัน (Tightly coupled) หากมีการแก้ไขข้อมูลแล้วกดรีเฟรช ข้อมูลทั้งหมดจะสูญหายทันที และการใช้ Conditional Rendering ธรรมดาในการเปลี่ยนหน้าจอ ทำให้ผู้ใช้ไม่สามารถแชร์ลิงก์หน้าย่อยไปให้คนอื่นได้ (URL ไม่เปลี่ยน)

ใน Week 05 มีการอัปเกรดครั้งใหญ่ 2 ส่วนหลัก:
1. **Routing:** เปลี่ยนมาใช้ `react-router-dom` แทน ทำให้แต่ละหน้าจอมี URL เป็นของตัวเองจริง ๆ เช่น `/requests/new` ผู้ใช้สามารถกด Back/Forward และแชร์ลิงก์ให้กันได้ 
2. **Service Layer & Persistence:** แยกลอจิกของการเรียก/บันทึกข้อมูลไปไว้ใน `requestService.js` (แยกออกจาก UI โดยสิ้นเชิง) และเสริมระบบจัดเก็บข้อมูลถาวรลง `localStorage` ไว้ใน `requestStorage.js` ทำให้ข้อมูลอยู่รอดแม้จะรีเฟรช นอกจากนี้ Component UI จะใช้ `useEffect` เพื่อขอดึงข้อมูลจาก Service Layer เมื่อ Component ถูกโหลด ช่วยให้โค้ด UI สะอาดขึ้นและสามารถรองรับสถานการณ์ความผิดพลาด (เช่น Loading / Error / Empty states) ได้ดียิ่งขึ้น

## AI / Resource Usage

| Tool / Resource | Purpose | Used portion | How I verified | My final decision |
|---|---|---|---|---|
| Gemini | ให้ AI ช่วย Review โค้ด ตรวจเช็คสถานะการผ่าน Checker เช็คเวอร์ชั่นของแบบฟอร์ม และช่วยสร้าง Template | การกรอกตารางทดสอบ ผลลัพธ์คาดการณ์ และคำอธิบายโครงสร้าง | ตรวจสอบรัน `npm run check` ได้ครบถ้วน และทดสอบด้วยตัวเองซ้ำตาม Checklist | ใช้ Template ที่ AI กรอกให้ พร้อมถ่ายภาพ Screenshot ด้วยตนเองส่ง |
| Gemini | อธิบายการใช้ `.map` ใน React Component | `<AppHeader>` | อ่านและทำความเข้าใจการทำงานของการดึงข้อมูลจาก Array มาสร้างเป็น Component อัตโนมัติ | นำไปใช้ตามความเข้าใจเพื่อลดการเขียนโค้ดซ้ำ |
| Gemini | อธิบายการใช้ `async/await` | `DashboardPage.jsx` และ Service Layer | เปรียบเทียบการเขียนกับ `.then().catch()` แบบดั้งเดิม พบว่าอ่านลำดับการทำงานได้ง่ายกว่า | นำมาประยุกต์ใช้ทำความเข้าใจการรอข้อมูล (Asynchronous) |
| Gemini | ตรวจสอบการจัดการ LocalStorage (TODO 5B) | `writeStoredRequests` ใน `requestStorage.js` | ทดสอบเรียงลำดับโค้ดพบว่าการโยนค่า String เข้า `validateRequests` จะทำให้ Error จึงสลับไปตรวจสอบ Array ก่อน | แก้ไขโค้ดตามคำแนะนำเพื่อให้ Validate ผ่านก่อนทำ stringify |
| Gemini | แนะนำวิธีเขียน Cleanup Guard เพื่อป้องกัน Stale update | `useEffect` ใน `DashboardPage.jsx` และ `RequestDetailPage.jsx` | ทดลองเปลี่ยนหน้าไปมาอย่างรวดเร็วและใช้โหมด Developer (Strict Mode) ดูการทำงานของ React | เพิ่มตัวแปร `ignore` และเงื่อนไขเช็คเพื่อทิ้งข้อมูลตามที่ |
