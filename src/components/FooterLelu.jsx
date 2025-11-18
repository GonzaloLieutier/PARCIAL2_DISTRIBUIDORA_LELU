import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/FooterLelu.css";

export default function FooterLelu() {
  return (
    <footer className="footer-lelu">
      <Container>
        <Row className="py-5">
          {/*Columna 1 - Logo y descripción */}
          <Col md={4} className="mb-4 mb-md-0">
            <h4 className="footer-brand mb-3">🌿 Distribuidora Lelu</h4>
            <p className="text-white-50">
              Tu distribuidora de confianza para productos naturales y de calidad.
              Ofrecemos cereales, infusiones y superalimentos 100% orgánicos.
            </p>
          </Col>

          {/* Columna 2 - Menú */}
          <Col md={4} className="mb-4 mb-md-0">
            <h5 className="footer-title mb-3">Menú</h5>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/productos">Productos</Link></li>
              <li><Link to="/pedidos">Mis Pedidos</Link></li>
              <li><Link to="/ayuda">Centro de Ayuda</Link></li>
            </ul>
          </Col>

          {/*  Columna 3 - Ayuda */}
          <Col md={4}>
            <h5 className="footer-title mb-3">Ayuda</h5>
            <ul className="footer-links">
              <li><Link to="/ayuda?seccion=como-comprar">¿Cómo comprar?</Link></li>
              <li><Link to="/ayuda?seccion=registro">Crear cuenta</Link></li>
              <li><Link to="/ayuda?seccion=pedidos">Seguimiento de pedidos</Link></li>
              <li><Link to="/ayuda?seccion=contacto">Contacto</Link></li>
            </ul>
          </Col>
        </Row>

        {/*Footer bottom - Copyright*/}
        <Row className="border-top border-secondary pt-3 pb-3">
          <Col className="text-center">
            <p className="text-white-50 mb-0">
              © {new Date().getFullYear()} Distribuidora Lelu. Todos los derechos reservados.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
