import { createContext, useContext, useState } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  role: string | null;
  setRole: (role: string) => void;
  teacherId: string | null;
  setTeacherId: (id: string | null) => void;
  studentId: string | null;
  setStudentId: (id: string | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  role: null,
  setRole: () => {},
  teacherId: null,
  setTeacherId: () => {},
  studentId: null,
  setStudentId: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [role, setRoleState] = useState<string | null>(() => {
    return localStorage.getItem("userRole") || null;
  });

  const [teacherId, setTeacherIdState] = useState<string | null>(() => {
    return localStorage.getItem("studentId") || null;
  });

  const [studentId, setStudentIdState] = useState<string | null>(() => {
    return localStorage.getItem("teacherId") || null;
  });

  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value);
    localStorage.setItem("isLoggedIn", value.toString());
  };

  const setRole = (newRole: string) => {
    setRoleState(newRole);
    localStorage.setItem("userRole", newRole);
  };

  const setTeacherId = (id: string | null) => {
    setTeacherIdState(id);
    if (id) {
      localStorage.setItem("teacherId", id);
    } else {
      localStorage.removeItem("teacherId"); 
    }
  };

  const setStudentId = (id: string | null) => {
    setStudentIdState(id);
    if (id) {
      localStorage.setItem("studentId", id);
    } else {
      localStorage.removeItem("studentId"); 
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, teacherId, setTeacherId, studentId, setStudentId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
