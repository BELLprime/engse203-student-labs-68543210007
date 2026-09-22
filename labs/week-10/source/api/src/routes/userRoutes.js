import { Router } from 'express';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.js';

const router = Router();
const db = new DatabaseSync(config.dbFile);

// GET /api/users → รายชื่อผู้ใช้ทั้งหมด
router.get('/', (req, res) => {
  const users = db.prepare('SELECT id, name, department, email, created_at FROM users ORDER BY id').all();
  res.json(users);
});

// GET /api/users/:id/requests → คำร้องของคนนั้น
router.get('/:id/requests', (req, res) => {
  const requests = db.prepare(`
    SELECT r.id, u.name AS requesterName, r.request_type AS requestType,
           r.location, r.details, r.priority, r.status
    FROM requests r
    JOIN users u ON u.id = r.requester_id
    WHERE r.requester_id = ?
    ORDER BY r.id
  `).all(req.params.id);
  res.json(requests);
});

export default router;
