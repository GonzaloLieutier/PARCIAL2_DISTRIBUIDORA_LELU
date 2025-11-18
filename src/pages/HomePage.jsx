import { useEffect, useState } from "react";
import { Button, Card, Container, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useProducts } from "../contexts/ProductContext";
import "../assets/HomePage.css";
import croppersBanner from "../assets/img/banners/croppers.jpg";
import sonderBanner from "../assets/img/banners/sonder.jpg";
import trymsBanner from "../assets/img/banners/tryms.jpg";
import notcoBanner from "../assets/img/banners/notco.jpg";
import chiaGraalBanner from "../assets/img/banners/chia-graal.jpg";

const PROMO_BANNERS = [
  { id: 1, title: "Croppers", image: croppersBanner },
  { id: 2, title: "Jugos Naturales - Sonder", image: sonderBanner },
  { id: 3, title: "Tryms", image: trymsBanner },
  { id: 4, title: "NotCo", image: notcoBanner },
  { id: 5, title: "Chia Graal", image: chiaGraalBanner }
];

export default function HomePage() {
  const { items } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [promoIndex, setPromoIndex] = useState(0);

  const featuredProducts = items.slice(0, 6);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % PROMO_BANNERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []); 

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [items]); 

  const getVisibleProducts = () => {
    if (featuredProducts.length === 0) return [];
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(featuredProducts[(currentIndex + i) % featuredProducts.length]);
    }
    return visible;
  };

  const visibleProducts = getVisibleProducts();

  return (
    <>
      <div className="promo-slides-container">
        {PROMO_BANNERS.map((banner, idx) => (
          <div
            key={banner.id}
            className={`promo-slide ${idx === promoIndex ? "active" : ""}`}
            style={{ backgroundImage: `url(${banner.image})` }}
          >
            <Link to="/productos" className="promo-link">
              <div className="promo-overlay">
                <h2 className="promo-title">{banner.title}</h2>
              </div>
            </Link>
          </div>
        ))}

        <div className="promo-indicators">
          {PROMO_BANNERS.map((_, idx) => (
            <button
              key={idx}
              className={`promo-indicator ${idx === promoIndex ? "active" : ""}`}
              onClick={() => setPromoIndex(idx)}
              aria-label={`Ir a banner ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <Container>
        <section className="productos-destacados-section mb-5">
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <div className="carousel-container">
            <Row className="carousel-track g-3">
              {visibleProducts.map((producto, idx) => (
                <Col key={`${producto.id}-${idx}`} xs={12} md={4}>
                  <Card className="h-100 shadow-sm carousel-card">
                    <Card.Body>
                      <Card.Title className="d-flex justify-content-between align-items-start">
                        <span>{producto.nombre}</span>
                        <Badge bg={producto.stock === 0 ? "secondary" : "success"}>
                          {producto.stock === 0 ? "Sin stock" : `Stock: ${producto.stock}`}
                        </Badge>
                      </Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {producto.categoria}
                      </Card.Subtitle>
                      <Card.Text className="fs-4 fw-semibold text-primary">
                        ${producto.precio}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-transparent border-0">
                      <Button
                        as={Link}
                        to="/productos"
                        variant="outline-primary"
                        className="w-100"
                      >
                        Ver más
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className="custom-carousel-indicators">
            {featuredProducts.map((_, idx) => (
              <button
                key={idx}
                className={`custom-indicator ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Ir a producto ${idx + 1}`}
              />
            ))}
          </div>
        </section>

        <section className="mb-5">
          <h2 className="text-center mb-4">Nuestras Categorías</h2>
          <Row className="g-3">
            <Col xs={12} md={6}>
              <Card className="category-card text-white">
                <Card.Body className="p-4 text-center category-cereales">
                  <h3>Cereales</h3>
                  <p>Granolas y productos naturales</p>
                  <Button as={Link} to="/productos" variant="light">
                    Explorar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={12} md={6}>
              <Card className="category-card text-white">
                <Card.Body className="p-4 text-center category-infusiones">
                  <h3>Infusiones</h3>
                  <p>Yerbas, tés y más</p>
                  <Button as={Link} to="/productos" variant="light">
                    Explorar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        <section className="text-center py-5 mb-4 cta-section">
          <h2 className="mb-3">¿Listo para hacer tu pedido?</h2>
          <p className="lead mb-4">
            Explora nuestro catálogo completo y encuentra lo que necesitas
          </p>
          <Button as={Link} to="/productos" variant="primary" size="lg">
            Ir a Productos
          </Button>
        </section>
      </Container>
    </>
  );
}