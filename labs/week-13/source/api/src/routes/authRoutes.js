import { Router } from 'express';
import * as authService from '../services/authService.js';
import { validateLoginInput } from '../validators/requestValidator.js';

// route ให้มาแล้ว — งานหลักอยู่ใน services/authService.js (CP50)

// เก็บประวัติการล็อกอินผิดในหน่วยความจำ (email -> { count, resetAt })
const failedAttempts = new Map();
const WINDOW_MS = 60 * 1000; // 1 min

export function resetLoginLimiter() { 
  failedAttempts.clear(); 
}

const router = Router();

router.post('/login', (req, res) => {
  const errors = validateLoginInput(req.body);
  if (errors.length > 0) {
    return res.status(400).json({ error: 'ข้อมูลเข้าสู่ระบบไม่ถูกต้อง', details: errors });
  }
  // -----challenge 
  const email = req.body.email?.toLowerCase();
  const now = Date.now();
  const records = failedAttempts.get(email);
  // 
  if (records) {
    if (now > records.resetAt) { // ครบ 1 นาทีแล้ว 
      failedAttempts.delete(email);
    } else if (records.count >= 5) {// ยังไม่ครบ 1 นาที และผิดครบ 5 ครั้งขึ้นไป -> block
      return res.status(429).json({ error: 'พยายามเข้าสู่ระบบผิดเกินกำหนด กรุณารอ 15 นาที' });
    }
  }
  // -----login
  const result = authService.login(req.body.email, req.body.password);

  if (!result) {
    const currentCount = (records && now <= records.resetAt) ? records.count : 0;
    failedAttempts.set(email, {
      count: currentCount + 1,
      resetAt: now + WINDOW_MS
    });
    return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
  } 
  failedAttempts.delete(email); //login successs ลบประวัติผิดของ email นี้ออก
  res.status(200).json(result);
});

export default router;
