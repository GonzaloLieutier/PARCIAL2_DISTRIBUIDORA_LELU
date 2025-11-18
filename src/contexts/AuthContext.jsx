
import { createContext, useContext, useEffect, useState } from "react";
import { users } from "../assets/datos";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); 


  useEffect(() => {
    const raw = localStorage.getItem("lelu_auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
      } catch {}
    }
  }, []);

  const login = (username, password) => {
    const found = users.find(u => u.username === username && u.password === password);
    if (!found) return { ok: false, error: "Usuario o contraseña incorrectos" };

    const session = { id: found.id, username: found.username, role: found.role, nombre: found.nombre };
      localStorage.setItem("lelu_auth", JSON.stringify(session)); 
    setUser(session);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("lelu_auth"); 
    setUser(null);
  };

  const hasRole = (roles = []) => (user ? roles.includes(user.role) : false);

  return (
    <AuthContext.Provider value={{ user, isLogged: !!user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
