import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/authService.jsx';

const links = [
  ['/', 'Dashboard'],
  ['/requests/new', 'New Request'],
  ['/about', 'About'],
];

function AppHeader() {
   // 👈 2. ดึงสถานะเจ้าหน้าที่, ข้อมูลผู้ใช้ และฟังก์ชัน logout ออกมาจาก Context
  const { isStaff, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();      // clear token in localStorage and React state
    navigate('/'); // retun to Dashboard page
  }
  
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div>
          <p className="eyebrow">ENGSE203 • LAB 05</p>
          <p className="brand">Campus Service Request</p>
        </div>
        <nav aria-label="เมนูหลัก">
          {links.map(([to, label]) => (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              end={to === '/'}
              key={to}
              to={to}
            >
              {label}
            </NavLink>
          ))}
          {/* เลือกว่าจะแสดงปุ่มไหนตามเงื่อนไข isStaff */}
          {isStaff ? (
            <button
              className="nav-link"
              type="button"
              onClick={handleLogout}
              style={{ background: 'transparent', cursor: 'pointer' }}
            >
              ออกจากระบบ ({user?.name || 'เจ้าหน้าที่ฝ่ายบริการ'})
            </button>
          ) : (
            <NavLink
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              to="/login"
            >
              เจ้าหน้าที่
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}

export default AppHeader;
