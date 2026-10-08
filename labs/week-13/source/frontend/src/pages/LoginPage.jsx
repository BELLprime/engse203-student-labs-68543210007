import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      // เข้าสู่ระบบสำเร็จ -> นำทางกลับหน้าแรก Dashboard
      navigate('/');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'เข้าสู่ระบบไม่สำเร็จ');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section data-testid="page-login">
      <div className="page-heading">
        <div>
          <p className="eyebrow dark">STAFF ONLY</p>
          <h1>เข้าสู่ระบบเจ้าหน้าที่</h1>
          <p>เปลี่ยนสถานะและลบคำร้องได้หลังเข้าสู่ระบบ</p>
        </div>
      </div>

      <section className="panel form-panel" style={{ maxWidth: '24rem' }}>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">อีเมล</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="staff@rmutl.ac.th"
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="staff1234"
              required
            />
          </div>

          {errorMessage && (
            <p className="error" role="alert" style={{ marginBottom: '1rem' }}>
              {errorMessage}
            </p>
          )}

          <button className="button primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'กำลังเข้าสู่ระบบ…' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </section>
    </section>
  );
}

export default LoginPage;