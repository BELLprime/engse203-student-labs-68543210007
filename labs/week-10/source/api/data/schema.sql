-- ═══════════════════════════════════════════════════════════
-- Campus Service Request — โครงสร้างฐานข้อมูล
-- ENGSE203 สัปดาห์ที่ 10 · หน่วยที่ 4
-- ═══════════════════════════════════════════════════════════

PRAGMA foreign_keys = ON;

DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  department  TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE
);

CREATE TABLE requests (
  id            TEXT PRIMARY KEY,
  requester_id  INTEGER NOT NULL,
  request_type  TEXT NOT NULL
                CHECK (request_type IN ('แจ้งซ่อม','บริการบัญชีผู้ใช้','ขอใช้อุปกรณ์','อื่น ๆ')),
  location      TEXT NOT NULL,
  details       TEXT NOT NULL,
  priority      TEXT NOT NULL DEFAULT 'normal'
                CHECK (priority IN ('normal','urgent')),
  status        TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','in-progress','completed')),
  created_at    TEXT NOT NULL DEFAULT (datetime('now','localtime')),

  FOREIGN KEY (requester_id) REFERENCES users(id)
);

INSERT INTO users (id, name, department, email) VALUES
  (1, 'สมชาย ใจดี',      'วิศวกรรมซอฟต์แวร์', 'somchai@rmutl.ac.th'),
  (2, 'สุภาวดี รักเรียน', 'วิศวกรรมซอฟต์แวร์', 'supawadee@rmutl.ac.th'),
  (3, 'ธนกฤต ตั้งใจ',     'วิศวกรรมไฟฟ้า',     'thanakrit@rmutl.ac.th'),
  (4, 'ปรียา ขยันยิ่ง',   'สำนักวิทยบริการ',   'preeya@rmutl.ac.th');

INSERT INTO requests (id, requester_id, request_type, location, details, priority, status) VALUES
  ('REQ-001', 1, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 301', 'เครื่องปรับอากาศไม่ทำงานตั้งแต่เช้า',       'urgent', 'pending'),
  ('REQ-002', 2, 'ขอใช้อุปกรณ์',      'ห้องประชุม 2',       'ขอยืมโปรเจกเตอร์สำหรับนำเสนอโครงงาน',     'normal', 'in-progress'),
  ('REQ-003', 1, 'บริการบัญชีผู้ใช้', 'อาคาร 3 ชั้น 2',     'เข้าใช้งานระบบสารสนเทศไม่ได้ แจ้งรหัสผ่านผิด', 'urgent', 'completed'),
  ('REQ-004', 3, 'แจ้งซ่อม',          'ห้อง 405',           'หลอดไฟกระพริบ ต้องการเปลี่ยนหลอดใหม่',    'normal', 'pending'),
  ('REQ-005', 4, 'อื่น ๆ',            'หน้าอาคารเรียนรวม',   'ขออนุญาตติดป้ายประชาสัมพันธ์กิจกรรม',     'normal', 'pending'),
  ('REQ-006', 2, 'แจ้งซ่อม',          'ห้องปฏิบัติการ 401', 'ไฟในห้องกะพริบตลอดเวลา',                  'normal', 'pending'),
  ('REQ-007', 3, 'บริการบัญชีผู้ใช้', 'อาคาร 1',             'ลืมรหัสผ่านอีเมลมหาวิทยาลัย',             'normal', 'completed'),
  ('REQ-008', 4, 'อื่น ๆ',            'ลานจอดรถ',           'ขอเพิ่มไฟส่องสว่างตอนกลางคืน',             'urgent', 'in-progress');

-- ⭐ Challenge · Indexes
CREATE INDEX IF NOT EXISTS idx_requests_status ON requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_requester ON requests(requester_id);
