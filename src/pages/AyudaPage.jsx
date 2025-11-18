import { useEffect, useState } from "react";
import { Container, Card, Accordion, Alert, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";

export default function AyudaPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("0");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const seccion = params.get("seccion");

    const seccionMap = {
      "como-comprar": "0",
      "registro": "1",
      "pedidos": "2",
      "contacto": "3",
    };

    if (seccion && seccionMap[seccion]) {
      setActiveKey(seccionMap[seccion]);
    }
  }, [location]);

  return (
    <Container className="page-container">
      <div className="text-center mb-5">
        <h1 className="mb-3">Centro de Ayuda</h1>
        <p className="lead text-muted">
          Encuentra respuestas a las preguntas más frecuentes
        </p>
      </div>

      <Alert variant="info" className="mb-4">
        <strong>Tip:</strong> Si no encontras lo que buscas, no dudes en contactarnos.
      </Alert>

      <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <strong>¿Cómo comprar en Distribuidora Lelu?</strong>
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="mb-3">Proceso de compra paso a paso:</h5>

            <div className="mb-4">
              <h6>1. Crear una cuenta / Iniciar sesión</h6>
              <p>
                Para realizar compras, necesitas tener una cuenta activa. Puedes:
              </p>
              <ul>
                <li>Hacer clic en el botón <strong>"Iniciar sesión"</strong> en el navbar</li>
                <li>Usar las credenciales de prueba si aún no tienes cuenta</li>
              </ul>
              <Alert variant="warning" className="mt-2">
                <strong>Importante:</strong> Sin iniciar sesión, solo puedes ver los productos pero no agregarlos al carrito.
              </Alert>
            </div>

            <div className="mb-4">
              <h6>2. Explorar productos</h6>
              <p>
                Ve a la sección <strong>"Productos"</strong> en el menú principal. Allí podrás:
              </p>
              <ul>
                <li>Ver todos nuestros productos disponibles</li>
                <li>Usar el buscador para encontrar productos específicos</li>
                <li>Filtrar por categoría (Cereales, Infusiones, etc.)</li>
                <li>Verificar el stock disponible</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>3. Agregar al carrito</h6>
              <p>
                Una vez que hayas iniciado sesión:
              </p>
              <ul>
                <li>Selecciona la cantidad deseada del producto</li>
                <li>Haz clic en <strong>"Agregar al carrito"</strong></li>
                <li>Verás una confirmación en pantalla</li>
                <li>El ícono del carrito mostrará la cantidad de productos</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>4. Revisar el carrito</h6>
              <p>
                Puedes revisar tu carrito en cualquier momento:
              </p>
              <ul>
                <li>Haz clic en el botón <strong>"Carrito"</strong> en el navbar</li>
                <li>Se abrirá un panel lateral con tus productos</li>
                <li>Puedes eliminar productos si lo deseas</li>
                <li>Verás el total a pagar</li>
              </ul>
            </div>

            <div>
              <h6>5. Confirmar pedido</h6>
              <p>
                Para finalizar tu compra:
              </p>
              <ul>
                <li>Desde el carrito, haz clic en <strong>"Confirmar pedido"</strong></li>
                <li>Tu pedido se registrará como PENDIENTE</li>
                <li>Puedes ver el estado en la sección <strong>"Pedidos"</strong></li>
              </ul>
            </div>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="1">
          <Accordion.Header>
            <strong>¿Cómo crear una cuenta?</strong>
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="mb-3">Credenciales de prueba disponibles:</h5>

            <Card className="mb-3">
              <Card.Body>
                <h6>Cliente</h6>
                <p className="mb-1"><strong>Usuario:</strong> cliente</p>
                <p className="mb-0"><strong>Contraseña:</strong> 1234</p>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <h6>Vendedor</h6>
                <p className="mb-1"><strong>Usuario:</strong> vendedor</p>
                <p className="mb-0"><strong>Contraseña:</strong> 1234</p>
              </Card.Body>
            </Card>

            <Card className="mb-3">
              <Card.Body>
                <h6>Administrador</h6>
                <p className="mb-1"><strong>Usuario:</strong> admin</p>
                <p className="mb-0"><strong>Contraseña:</strong> admin</p>
              </Card.Body>
            </Card>

            <Alert variant="info" className="mt-3">
              <strong>Nota:</strong> Estas son credenciales de demostración. En producción, deberías crear tu propia cuenta con datos personales.
            </Alert>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="2">
          <Accordion.Header>
              <strong>Seguimiento de pedidos</strong>
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="mb-3">¿Cómo ver mis pedidos?</h5>

            <p>
              Una vez que hayas confirmado un pedido, podrás hacer seguimiento en la sección <strong>"Pedidos"</strong>:
            </p>

            <div className="mb-4">
              <h6>Estados del pedido:</h6>
              <ul>
                <li><strong>PENDIENTE:</strong> El pedido ha sido registrado y está esperando procesamiento</li>
                <li><strong>LISTO:</strong> El pedido ha sido preparado y está listo para entrega</li>
              </ul>
            </div>

            <div className="mb-4">
              <h6>Acciones disponibles:</h6>
              <ul>
                <li><strong>Ver detalle:</strong> Haz clic en "Ver" para ver los productos del pedido</li>
                <li><strong>Cancelar:</strong> Puedes cancelar pedidos en estado PENDIENTE</li>
              </ul>
            </div>

            <Alert variant="warning">
              <strong>Importante:</strong> Al cancelar un pedido, el stock de los productos se restaurará automáticamente.
            </Alert>
          </Accordion.Body>
        </Accordion.Item>

        <Accordion.Item eventKey="3">
          <Accordion.Header>
            <strong>Contacto</strong>
          </Accordion.Header>
          <Accordion.Body>
            <h5 className="mb-3">¿Necesitas ayuda adicional?</h5>

            <p className="mb-3">
              Si tienes alguna pregunta o problema que no se resuelve en esta guía, puedes contactarnos:
            </p>

            <Card>
              <Card.Body>
                <p className="mb-2"><strong>Email:</strong> ayuda@distribuidoralelu.com</p>
                <p className="mb-2"><strong>WhatsApp:</strong> +54 9 11 1234-5678</p>
                <p className="mb-2"><strong>Horario de atención:</strong> Lunes a Viernes, 9:00 - 18:00 hs</p>
                <p className="mb-0"><strong>Dirección:</strong> Av. Corrientes 1234, CABA, Argentina</p>
              </Card.Body>
            </Card>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      <div className="text-center mt-5">
        <Button variant="primary" size="lg" onClick={() => navigate("/productos")}>
          Ir a Productos
        </Button>
      </div>
    </Container>
  );
}
