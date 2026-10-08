import { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "./apiClient.js";

// 1. สร้าง Context กลาง
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user"); 
    const token = localStorage.getItem("token");  // เมื่อเคย login แล้ว
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("user");  //ยังไม่เคย
        localStorage.removeItem("token");
      }
    }
  }, []);
  
  async function login(email, password) {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // เซฟลง localStorage เพื่อให้กด F5 แล้วไม่หลุด
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    // อัปเดต React State เพื่อให้หน้าจอเปลี่ยนทันที
    setUser(data.user);
    return data;
  }
  // ฟังก์ชันออกจากระบบ
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }
  // ตัวแปรเช็คว่าเป็นเจ้าหน้าที่หรือไม่
  const isStaff = user?.role === "staff";
  return (
    <AuthContext.Provider value={{ user, isStaff, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
// Custom Hook เพื่อให้ไฟล์อื่นเรียกใช้ง่ายๆ: const { isStaff } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
