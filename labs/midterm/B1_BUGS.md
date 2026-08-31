# B1 · บันทึกการแก้บั๊ก (กรอกให้ครบทั้ง 6 จุด)

> แต่ละบั๊กให้เขียน 4 อย่าง: ไฟล์ · บรรทัด · สาเหตุ (ทำไมทำงานผิด) · แก้อย่างไร
> เขียนด้วยคำของตัวเอง — จุดนี้จะถูกถามใน oral

## บั๊กที่ 1 — อาการ: Console เตือนสีเหลืองเรื่องรายการ
- ไฟล์/บรรทัด: src/components/RequestList.jsx บรรทัด 9 .map()
- สาเหตุ: Each child in a list should have a unique "key" prop. ไม่ได้ใส่ key
- แก้อย่างไร: เพิ่ม key={request.id} เข้าไป

## บั๊กที่ 2 — อาการ: ตัวเลข "รอดำเนินการ" ในแผงสรุปไม่ตรงกับที่เห็น
- ไฟล์/บรรทัด: src/pages/DashboardPage.jsx บรรทัด 47
- สาเหตุ: มีการใช้ request.status === 'completed' แทนที่จะเป็น pending 
pending: requests.filter((request) => request.status === 'completed').length,
- แก้อย่างไร: เปลี่ยน completed to pending

## บั๊กที่ 3 — อาการ: กดตัวกรอง "รอดำเนินการ" แล้วได้รายการที่ไม่ใช่
- ไฟล์/บรรทัด: src/pages/DashboardPage.jsx บรรทัด 55
- สาเหตุ: request.status !== statusFilter เงื่อนไขกรองใน DashboardPage.jsx ไม่ถูกต้อง
- แก้อย่างไร: request.status === statusFilter

## บั๊กที่ 4 — อาการ: เปลี่ยน URL จาก REQ-001 เป็น REQ-002 แล้วข้อมูลไม่เปลี่ยน
- ไฟล์/บรรทัด: src/pages/RequestDetailPage.jsx บรรทัด 28
- สาเหตุ: ไม่ได้มีการใช้ requestId ที่เป็น useParams() ทำให้หา requestId ไม่เจอ และไม่รัน useEffect
- แก้อย่างไร: เพิ่ม requestId ใน array [ requestId,reloadKey ] 

## บั๊กที่ 5 — อาการ: กด "ลบ" แล้วรายการยังอยู่ ต้องรีเฟรชถึงหาย
- ไฟล์/บรรทัด:
- สาเหตุ: 
- แก้อย่างไร:

## บั๊กที่ 6 — อาการ: กด "Reset Demo Data" แล้วหน้าพัง/ว่างเปล่า
- ไฟล์/บรรทัด:
- สาเหตุ:
- แก้อย่างไร:
