import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  role: string | null;
  setRole: (role: string) => void;
  teacherID: string | null;
  setTeacherId: (id: string | null) => void;
  studentID: string | null;
  setStudentId: (id: string | null) => void;
  teacherSubject: string | null;
  setTeacherSubject: (value: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  role: null,
  setRole: () => {},
  teacherID: null,
  setTeacherId: () => {},
  studentID: null,
  setStudentId: () => {},
  teacherSubject: null,
  setTeacherSubject: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [role, setRoleState] = useState<string | null>(() => {
    return localStorage.getItem("userRole") || null;
  });

  const [teacherID, setTeacherIdState] = useState<string | null>(() => {
    return localStorage.getItem("teacherID") || null;
  });

  const [studentID, setStudentIdState] = useState<string | null>(() => {
    return localStorage.getItem("studentID") || null;
  });

  const [teacherSubject, setTeacherSubjectState] = useState<string | null>(() => {
    return localStorage.getItem("teacherSubject") || null;
  })

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
      localStorage.setItem("teacherID", id);
    } else {
      localStorage.removeItem("teacherID"); 
    }
  };

  const setStudentId = (id: string | null) => {
    setStudentIdState(id);
    if (id) {
      localStorage.setItem("studentID", id);
    } else {
      localStorage.removeItem("studentID"); 
    }
  };

  const setTeacherSubject = (value: string) => {
    setTeacherSubjectState(value);
    localStorage.setItem("teacherSubject", value.toString());
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole, teacherID, setTeacherId, studentID, setStudentId, teacherSubject, setTeacherSubject }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
