
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user) {
      const key = `lelu_cart_${user.username}`;
      try {
        const saved = localStorage.getItem(key);
        setCart(saved ? JSON.parse(saved) : []);
      } catch (error) {
        console.error("Error cargando carrito:", error);
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [user]);

  const persist = useCallback((newCart) => {
    setCart(newCart);
    if (user) {
      const key = `lelu_cart_${user.username}`;
      try {
        localStorage.setItem(key, JSON.stringify(newCart));
      } catch (error) {
        console.error("Error guardando carrito:", error);
      }
    }
  }, [user]);

  const addItem = useCallback((product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("Producto inválido");
      return;
    }

    const exist = cart.find(i => i.id === product.id);
    let newCart;

    if (exist) {
      newCart = cart.map(i =>
        i.id === product.id
          ? {
              ...i,
              cantidad: i.cantidad + quantity,
              stock: product.stock 
            }
          : i
      );
    } else {
      newCart = [...cart, {
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: quantity,
        stock: product.stock
      }];
    }

    persist(newCart);
    return newCart;
  }, [cart, persist]);

  const removeItem = useCallback((productId) => {
    const newCart = cart.filter(i => i.id !== productId);
    persist(newCart);
  }, [cart, persist]);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;

    const newCart = cart.map(item => {
      if (item.id === productId) {
        const maxStock = item.stock || 999;
        const validQuantity = Math.min(Math.max(quantity, 1), maxStock);
        return { ...item, cantidad: validQuantity };
      }
      return item;
    });

    persist(newCart);
  }, [cart, persist]);

  const clearCart = useCallback(() => {
    persist([]);
    if (user) {
      const key = `lelu_cart_${user.username}`;
      localStorage.removeItem(key);
    }
  }, [persist, user]);

  const total = cart.reduce((sum, i) => sum + (i.precio * i.cantidad), 0);
  const itemCount = cart.reduce((sum, i) => sum + i.cantidad, 0);

  const value = {
    cart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    setCart: persist 
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
