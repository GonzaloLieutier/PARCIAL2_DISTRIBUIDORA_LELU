import { useState, useEffect } from "react";
import { Navbar, Nav, Container, Button, Badge } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import CartDrawer from "./CartDrawer";
import LoginDrawer from "./LoginDrawer";
import { FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";

export default function NavbarLelu() {
  const { user, isLogged, logout, hasRole } = useAuth();
  const { cart, clearCart } = useCart(); 
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('login') === 'true' && !isLogged) {
      setShowLogin(true);
      navigate(location.pathname, { replace: true });
    }
  }, [location, isLogged, navigate]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="navbar-green">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold">🌿 Distribuidora Lelu</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="flex-grow-1" />

            <Nav className="mx-auto navbar-center">
              <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              {isLogged && <Nav.Link as={Link} to="/pedidos">Pedidos</Nav.Link>}
              {hasRole(["ADMIN"]) && <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>}
              {hasRole(["ADMIN","VENDEDOR"]) && <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>}
            </Nav>

            <Nav className="flex-grow-1 justify-content-end align-items-center gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={() => setShowCart(true)}
                className="position-relative"
              >
                <FaShoppingCart size={18} />
                {cartItemCount > 0 && (
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle"
                  >
                    {cartItemCount}
                  </Badge>
                )}
              </Button>

              {isLogged ? (
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => {
                    logout();
                    clearCart();
                  }}
                >
                  <FaSignOutAlt size={16} className="me-1" />
                  Cerrar sesión
                </Button>
              ) : (
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setShowLogin(true)}
                >
                  <FaUser size={16} className="me-1" />
                  Iniciar sesión
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CartDrawer
        show={showCart}
        onHide={() => setShowCart(false)}
        onConfirm={() => {
          setShowCart(false);
        }}
      />

      <LoginDrawer
        show={showLogin}
        onHide={() => setShowLogin(false)}
      />
    </>
  );
}
