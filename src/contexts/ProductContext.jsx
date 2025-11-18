import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products as seedProducts } from "../assets/datos";

const LS_KEY = "lelu_products";
const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cached = localStorage.getItem(LS_KEY);
    let cachedProducts = [];

    if (cached) {
      try {
        cachedProducts = JSON.parse(cached);
      } catch {}
    }

    const merged = seedProducts.map(seedProd => {
      const cachedProd = cachedProducts.find(p => p.id === seedProd.id);
      return cachedProd ? { ...seedProd, stock: cachedProd.stock } : seedProd;
    });

    const customProducts = cachedProducts.filter(p => typeof p.id === 'string');
    const final = [...merged, ...customProducts];

    setItems(final);
    localStorage.setItem(LS_KEY, JSON.stringify(final));
  }, []);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const addProduct = (prod) => {
    const next = [...items, { ...prod, id: crypto.randomUUID() }];
    persist(next);
  };

  const updateProduct = (id, partial) => {
    const next = items.map(p => (p.id === id ? { ...p, ...partial } : p));
    persist(next);
  };

  const removeProduct = (id) => {
    const next = items.filter(p => p.id !== id);
    persist(next);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(items.map(p => p.categoria))).sort();
  }, [items]);

  return (
    <ProductContext.Provider value={{
      items, addProduct, updateProduct, removeProduct, categories
    }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
