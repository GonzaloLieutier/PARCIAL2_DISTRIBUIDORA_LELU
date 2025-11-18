import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProductProvider } from "./contexts/ProductContext";
import { CartProvider } from "./contexts/CartContext";
import { OrderProvider } from "./contexts/OrderContext";
import { UserProvider } from "./contexts/UserContext";
import NavbarLelu from "./components/NavbarLelu";
import FooterLelu from "./components/FooterLelu";
import ProtectedRoute from "./contexts/ProtectedRoute";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import DashboardPage from "./pages/DashboardPage";
import AyudaPage from "./pages/AyudaPage";
import NotFoundPage from "./pages/NotFoundPage";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider>
        <OrderProvider>
        <UserProvider>
        <BrowserRouter>
        <div className="app-container">
          <NavbarLelu />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
              <Route path="/productos" element={<ProductsPage />} />
              <Route path="/ayuda" element={<AyudaPage />} />

              <Route
                path="/pedidos"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/usuarios"
                element={
                  <ProtectedRoute roles={["ADMIN"]}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute roles={["ADMIN", "VENDEDOR"]}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <FooterLelu />
        </div>
        </BrowserRouter>
        </UserProvider>
        </OrderProvider>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}
