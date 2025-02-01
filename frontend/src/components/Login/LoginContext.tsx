import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  role: string | null;
  setRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  role: null,
  setRole: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedInState] = useState<boolean>(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  const [role, setRoleState] = useState<string | null>(() => {
    return localStorage.getItem("userRole") || null;
  });

  const setIsLoggedIn = (value: boolean) => {
    setIsLoggedInState(value);
    localStorage.setItem("isLoggedIn", value.toString());
  };

  const setRole = (newRole: string) => {
    setRoleState(newRole);
    localStorage.setItem("userRole", newRole);
  };

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) setRoleState(storedRole);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
