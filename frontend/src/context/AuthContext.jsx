import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../api/api"; // تأكد من مسار الـ API الخاص بك

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // لمنع وميض الشاشة عند التحديث
  const [showLogin, setShowLogin] = useState(false);

  // التحقق من حالة تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const checkAuth = () => {
      try {
        const savedUser = localStorage.getItem("galaxy_user");
        const savedToken = localStorage.getItem("galaxy_token");

        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setIsAuthenticated(true);
          
          // أهم خطوة: إرفاق التوكن بالـ API ليتم إرساله مع كل الطلبات القادمة
          API.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }
      } catch (error) {
        console.error("Erreur de restauration de la session:", error);
        logout(); // مسح البيانات في حال كانت تالفة
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // دوال التحكم في نافذة تسجيل الدخول (Modal)
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  /**
   * دالة تسجيل الدخول لتحديث الحالة وحفظ البيانات
   * @param {Object} userData - بيانات المستخدم من الباك اند (id, name, email, role)
   * @param {string} token - رمز JWT 
   */
  const login = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("galaxy_token", token);
    localStorage.setItem("galaxy_user", JSON.stringify(userData));
    
    // إرفاق التوكن بالـ API للطلبات المستقبلية
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  /**
   * دالة تسجيل الخروج لمسح جميع بيانات الجلسة
   */
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Déconnecté avec succès 👋", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    localStorage.removeItem("galaxy_token");
    localStorage.removeItem("galaxy_user");
    
    // إزالة التوكن من الـ API
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        showLogin,
        openLogin,
        closeLogin,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook مخصص لتسهيل الوصول للبيانات
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};