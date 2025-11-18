
import { createContext, useContext, useEffect, useState } from "react";
import { users as seedUsers } from "../assets/datos";
import { useAuth } from "./AuthContext";

const LS_KEY = "lelu_users";
const UserContext = createContext();

export function UserProvider({ children }) {
  const { user: sessionUser } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY);
    if (cached) {
      try { setUsers(JSON.parse(cached)); return; } catch {}
    }
    localStorage.setItem(LS_KEY, JSON.stringify(seedUsers));
    setUsers(seedUsers);
  }, []);

  const persist = (next) => {
    setUsers(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const createUser = ({ username, password, nombre, role }) => {
    if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
      return { ok: false, error: "Ya existe un usuario con ese nombre" };
    }
    const newUser = { id: crypto.randomUUID(), username, password, nombre, role };
    persist([...users, newUser]);
    return { ok: true };
  };

  const updateUser = (id, partial) => {
    const next = users.map(u => (u.id === id ? { ...u, ...partial } : u));
    persist(next);
  };

  const removeUser = (id) => {
    if (sessionUser && sessionUser.id === id) return { ok: false, error: "No podés borrarte a vos mismo" };
    persist(users.filter(u => u.id !== id));
    return { ok: true };
  };

  const resetPassword = (id, newPass = "1234") => {
    const u = users.find(u => u.id === id);
    if (!u) return;
    updateUser(id, { password: newPass });
  };

  return (
    <UserContext.Provider value={{ users, createUser, updateUser, removeUser, resetPassword }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  return useContext(UserContext);
}
