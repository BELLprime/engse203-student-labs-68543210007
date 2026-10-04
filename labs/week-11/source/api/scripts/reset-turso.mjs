import DatabaseSync from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const API_ROOT = path.resolve(HERE, '..');
const SCHEMA_FILE = path.join(API_ROOT, 'data', 'schema.sql');
const sql = fs.readFileSync(SCHEMA_FILE, 'utf8');

const url = process.env.TURSO_DATABASE_URL;
if (url) {
  const { default: Libsql } = await import('libsql');
  const db = new Libsql(url, { authToken: process.env.TURSO_AUTH_TOKEN });
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(sql);
  console.log('✓ รีเซ็ตข้อมูลบน Turso Cloud Database สำเร็จแล้ว!');
} else {
  const DB_FILE = process.env.DB_FILE ?? path.join(API_ROOT, 'data', 'campus.db');
  const db = new DatabaseSync.DatabaseSync(DB_FILE);
  db.exec('PRAGMA foreign_keys = ON');
  db.exec(sql);
  console.log('✓ รีเซ็ตข้อมูลบน Local SQLite (campus.db) สำเร็จแล้ว!');
}
