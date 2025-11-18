
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const LS_KEY = "lelu_orders";
const OrderContext = createContext();

export function OrderProvider({ children }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      try { setOrders(JSON.parse(saved)); return; } catch {}
    }
    localStorage.setItem(LS_KEY, JSON.stringify([]));
  }, []);

  const persist = (next) => {
    setOrders(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const createOrder = (items) => {
    if (!user) return;
    const newOrder = {
      id: crypto.randomUUID(),
      clienteId: user.id,
      estado: "PENDIENTE",
      fecha: new Date().toISOString(),
      items,
      total: items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
    };
    persist([...orders, newOrder]);
  };

  const updateStatus = (id, estado) => {
    const next = orders.map(o => o.id === id ? { ...o, estado } : o);
    persist(next);
  };

  const removeOrder = (id) => {
    const next = orders.filter(o => o.id !== id);
    persist(next);
  };

  const myOrders = user
    ? orders.filter(o => user.role === "CLIENTE" ? o.clienteId === user.id : true)
    : [];

  return (
    <OrderContext.Provider value={{
      orders, createOrder, updateStatus, removeOrder, myOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
