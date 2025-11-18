
import { useState } from "react";
import { Container, Table, Button, Badge, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { useUsers } from "../contexts/UserContext";
import UserForm from "../components/UserForm";

export default function UsersPage() {
  const { hasRole, user: sessionUser } = useAuth();
  const admin = hasRole(["ADMIN"]);
  const { users, createUser, updateUser, removeUser, resetPassword } = useUsers();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  if (!admin) return <Alert variant="danger">No tenés permisos para ver esta página.</Alert>;

  const openNew = () => { setEditing(null); setShowForm(true); };
  const openEdit = (u) => { setEditing(u); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setError(""); };

  const onSubmit = (payload) => {
    if (editing) {
      updateUser(editing.id, payload);
    } else {
      const res = createUser(payload);
      if (!res.ok) { setError(res.error || "Error al crear"); return; }
    }
    closeForm();
  };

  return (
    <Container className="page-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Usuarios</h2>
        <Button onClick={openNew}>Nuevo usuario</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.username}</td>
              <td>{u.nombre}</td>
              <td>
                <Badge bg={u.role === "ADMIN" ? "danger" : u.role === "VENDEDOR" ? "info" : "secondary"}>
                  {u.role}
                </Badge>
              </td>
              <td className="d-flex gap-2">
                <Button size="sm" variant="outline-primary" onClick={() => openEdit(u)}>Editar</Button>
                <Button
                  size="sm"
                  variant="outline-warning"
                  onClick={() => resetPassword(u.id)}
                >
                  Reset pass
                </Button>
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => {
                    const res = removeUser(u.id);
                    if (!res.ok) alert(res.error);
                  }}
                  disabled={sessionUser?.id === u.id}
                  title={sessionUser?.id === u.id ? "No podés borrarte a vos mismo" : ""}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <UserForm
        show={showForm}
        onHide={closeForm}
        onSubmit={onSubmit}
        initial={editing}
      />
    </Container>
  );
}
