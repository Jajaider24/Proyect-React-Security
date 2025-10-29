// src/pages/Demo.tsx
import React, { useEffect, useState } from "react";
import GenericTable, { Action } from "../components/GenericTable.tsx";
import { User } from "../models/User.ts";
import usersService from "../services/usersService.ts";

const Demo: React.FC = () => {
  // Estado y responsabilidad de datos: Demo actúa como controlador (M in MCP)
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const list = await usersService.list();
      setUsers(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const actions: Action[] = [
    { name: "view", label: "Ver" },
    { name: "edit", label: "Editar" },
    { name: "delete", label: "Eliminar" },
  ];

  const handleAction = async (name: string, item: User) => {
    switch (name) {
      case "view":
        // Presentación / UI logic debería separarse si se vuelve compleja
        // Use window.alert to avoid ESLint 'no-restricted-globals' for `alert`.
        window.alert(`Ver usuario: ${item.name} (${item.email})`);
        break;
      case "edit": {
        const updated = await usersService.update(item.id || 0, { name: (item.name || "") + " (edit)" });
        if (updated) await loadUsers();
        break;
      }
      case "delete": {
        if (!item.id) return;
  // Use window.confirm to avoid ESLint 'no-restricted-globals' for `confirm`.
  const ok = window.confirm(`¿Eliminar usuario ${item.name}?`);
        if (!ok) return;
        await usersService.remove(item.id);
        await loadUsers();
        break;
      }
      default:
        console.log("Acción no manejada", name, item);
    }
  };

  const handleAddSample = async () => {
    await usersService.create({ name: "Nuevo usuario", email: "nuevo@example.com" });
    await loadUsers();
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Demo - Lista de Usuarios</h1>

      <div className="mb-4">
        <button
          onClick={handleAddSample}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Agregar usuario de ejemplo"}
        </button>
      </div>

      <GenericTable<User>
        data={users}
        columns={["id", "name", "email"]}
        actions={actions}
        onAction={handleAction}
      />
    </div>
  );
};

export default Demo;
