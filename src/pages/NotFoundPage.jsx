import { Container } from "react-bootstrap";

export default function Error404() {
  return (
    <Container className="page-container text-center">
      <h1>404 - Página no encontrada</h1>
      <p className="text-muted">La página que buscas no existe</p>
    </Container>
  );
}