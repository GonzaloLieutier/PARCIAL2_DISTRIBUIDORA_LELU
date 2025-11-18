import { useMemo } from "react";
import { Card, Container, Row, Col, Table, ProgressBar } from "react-bootstrap";
import { useOrders } from "../contexts/OrderContext";
import { useProducts } from "../contexts/ProductContext";

export default function DashboardPage() {
  const { orders } = useOrders();
  const { items: products } = useProducts();

  const kpi = useMemo(() => {
    const totalPedidos = orders.length;
    const pendientes = orders.filter(o => o.estado === "PENDIENTE").length;
    const listos = orders.filter(o => o.estado === "LISTO").length;
    const totalFacturado = orders.reduce((acc, o) => acc + o.total, 0);
    return { totalPedidos, pendientes, listos, totalFacturado };
  }, [orders]);

  const topProducts = useMemo(() => {
    const contador = {};
    orders.forEach(o =>
      o.items.forEach(i => {
        contador[i.nombre] = (contador[i.nombre] || 0) + i.cantidad;
      })
    );
    return Object.entries(contador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [orders]);

  const ventasPorCategoria = useMemo(() => {
    const catCounter = {};
    orders.forEach(o =>
      o.items.forEach(i => {
        const prod = products.find(p => p.id === i.id);
        const cat = prod ? prod.categoria : "Sin categoría";
        catCounter[cat] = (catCounter[cat] || 0) + i.precio * i.cantidad;
      })
    );
    return Object.entries(catCounter);
  }, [orders, products]);

  const maxVenta = Math.max(...ventasPorCategoria.map(v => v[1]), 1);

  return (
    <Container className="page-container">
      <h2 className="mb-4">Panel de Control</h2>

      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total de pedidos</Card.Title>
              <h3>{kpi.totalPedidos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Pendientes</Card.Title>
              <h3 className="text-warning">{kpi.pendientes}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Listos</Card.Title>
              <h3 className="text-success">{kpi.listos}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total facturado</Card.Title>
              <h3 className="text-primary">${kpi.totalFacturado}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

     
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header><strong>Top 5 productos más vendidos</strong></Card.Header>
            <Card.Body className="p-0">
              {topProducts.length === 0 ? (
                <p className="m-3 text-muted">Aún no hay ventas.</p>
              ) : (
                <Table hover responsive className="mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cantidad vendida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topProducts.map(([nombre, cant]) => (
                      <tr key={nombre}>
                        <td>{nombre}</td>
                        <td>{cant}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header><strong>Ventas por categoría</strong></Card.Header>
            <Card.Body>
              {ventasPorCategoria.length === 0 ? (
                <p className="text-muted">Sin datos aún.</p>
              ) : (
                ventasPorCategoria.map(([cat, total]) => (
                  <div key={cat} className="mb-2">
                    <div className="d-flex justify-content-between">
                      <span>{cat}</span>
                      <span>${total}</span>
                    </div>
                    <ProgressBar
                      now={(total / maxVenta) * 100}
                      variant="info"
                      style={{ height: "8px" }}
                    />
                  </div>
                ))
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
