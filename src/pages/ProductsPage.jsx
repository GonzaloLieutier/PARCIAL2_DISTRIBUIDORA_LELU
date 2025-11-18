
import { useMemo, useState } from "react";
import { Button, Col, Container, Form, Row, ButtonGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useProducts } from "../contexts/ProductContext";
import { useCart } from "../contexts/CartContext";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import CartDrawer from "../components/CartDrawer";
import { FaPlus, FaMinus } from "react-icons/fa";
import "../assets/ProductsPage.css";

export default function ProductsPage() {
  const { hasRole, isLogged } = useAuth();
  const admin = hasRole(["ADMIN"]);
  const { items, addProduct, updateProduct, removeProduct, categories } = useProducts();
  const { addItem } = useCart(); 

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [quantities, setQuantities] = useState({});
  const [showCart, setShowCart] = useState(false);
  const [addedProducts, setAddedProducts] = useState({}); 

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();
    return items.filter(p => {
      const byText = !text || [p.nombre, p.categoria].some(s => s.toLowerCase().includes(text));
      const byCat = !cat || p.categoria === cat;
      return byText && byCat;
    });
  }, [items, q, cat]);

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setShowForm(true); };
  const closeForm = () => setShowForm(false);

  const onSubmit = (payload) => {
    if (editing) {
      updateProduct(editing.id, payload);
    } else {
      addProduct(payload);
    }
    closeForm();
  };

  return (
    <Container className="page-container">
      <Row className="align-items-center g-3 mb-4">
        <Col md={8}>
          <Form.Control
            placeholder="Buscar productos..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            size="lg"
          />
        </Col>
        <Col md={4} className="text-md-end">
          {admin && <Button onClick={openNew}>Nuevo producto</Button>}
        </Col>
      </Row>

      <Row>
        <Col md={3} lg={2} className="mb-4">
          <div className="filters-sidebar bg-light p-3 rounded">
            <h5 className="mb-3">Filtros</h5>

            <div className="mb-3">
              <Form.Label className="fw-bold">Categoría</Form.Label>
              <div className="d-flex flex-column gap-2">
                <Form.Check
                  type="radio"
                  id="cat-all"
                  label="Todas"
                  checked={cat === ""}
                  onChange={() => setCat("")}
                />
                {categories.map(c => (
                  <Form.Check
                    key={c}
                    type="radio"
                    id={`cat-${c}`}
                    label={c}
                    checked={cat === c}
                    onChange={() => setCat(c)}
                  />
                ))}
              </div>
            </div>

            {(q || cat) && (
              <Button
                variant="outline-secondary"
                size="sm"
                className="w-100"
                onClick={() => {
                  setQ("");
                  setCat("");
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </Col>

        <Col md={9} lg={10}>
          <Row className="g-3">
            {filtered.map(p => (
              <Col key={p.id} xs={12} sm={6} md={6} lg={4} xl={3}>
    <ProductCard
      producto={p}
      footer={
        <>
          {admin ? (
            <div className="d-flex gap-2">
              <Button size="sm" variant="outline-primary" onClick={() => openEdit(p)}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => removeProduct(p.id)}
              >
                Eliminar
              </Button>
            </div>
          ) : isLogged ? (
            <div>
              <div className="d-flex gap-2 mb-2 align-items-center">
                <Button
                  size="sm"
                  variant={
                    p.stock === 0
                      ? "secondary"
                      : addedProducts[p.id]
                        ? "success"
                        : "outline-success"
                  }
                  disabled={p.stock === 0}
                  onClick={() => {
                    const qty = quantities[p.id] || 1;
                    addItem(p, qty); 

                    setAddedProducts({ ...addedProducts, [p.id]: true });

                    setTimeout(() => {
                      setAddedProducts(prev => {
                        const updated = { ...prev };
                        delete updated[p.id];
                        return updated;
                      });
                    }, 2000);
                  }}
                  className="flex-grow-1"
                >
                  {addedProducts[p.id] ? "✓ Agregado al carrito" : "Agregar al carrito"}
                </Button>
                <ButtonGroup size="sm">
                  <Button
                    variant="outline-secondary"
                    disabled={p.stock === 0 || (quantities[p.id] || 1) <= 1}
                    onClick={() => {
                      const currentQty = quantities[p.id] || 1;
                      setQuantities({ ...quantities, [p.id]: Math.max(currentQty - 1, 1) });
                    }}
                  >
                    <FaMinus size={10} />
                  </Button>
                  <Form.Control
                    type="number"
                    min="1"
                    max={p.stock}
                    value={quantities[p.id] || 1}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 1;
                      setQuantities({ ...quantities, [p.id]: Math.min(Math.max(val, 1), p.stock) });
                    }}
                    size="sm"
                    style={{ width: "50px", textAlign: "center" }}
                    disabled={p.stock === 0}
                  />
                  <Button
                    variant="outline-secondary"
                    disabled={p.stock === 0 || (quantities[p.id] || 1) >= p.stock}
                    onClick={() => {
                      const currentQty = quantities[p.id] || 1;
                      setQuantities({ ...quantities, [p.id]: Math.min(currentQty + 1, p.stock) });
                    }}
                  >
                    <FaPlus size={10} />
                  </Button>
                </ButtonGroup>
              </div>
              <Button
                size="sm"
                variant="outline-secondary"
                onClick={() => setShowCart(true)}
                className="w-100"
              >
                Ver carrito
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-muted small mb-2">Inicia sesión para comprar</p>
              <Button size="sm" variant="outline-primary" as={Link} to="/productos?login=true" className="w-100">
                Iniciar sesión
              </Button>
            </div>
          )}
        </>
      }
    />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      <ProductForm
        show={showForm}
        onHide={closeForm}
        onSubmit={onSubmit}
        initial={editing}
      />

      <CartDrawer
        show={showCart}
        onHide={() => setShowCart(false)}
        onConfirm={() => setShowCart(false)}
      />
    </Container>
  );
}
