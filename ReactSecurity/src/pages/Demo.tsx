// src/pages/Demo.tsx
import React, { useEffect, useState } from "react";
import GenericTable, { Action } from "../components/GenericTable.tsx";
import { User } from "../models/User.ts";
import { userService } from "../services/usersService.ts";

const Demo: React.FC = () => {
  // Estado y responsabilidad de datos: Demo actúa como controlador (M in MCP)
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    const list = await userService.getUsers();
    setUsers(list || []);
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
        const updated = await userService.updateUser(item.id || 0, { name: (item.name || "") + " (edit)" });
        if (updated) await loadUsers();
        break;
      }
      case "delete": {
        if (!item.id) return;
  // Use window.confirm to avoid ESLint 'no-restricted-globals' for `confirm`.
  const ok = window.confirm(`¿Eliminar usuario ${item.name}?`);
        if (!ok) return;
        await userService.deleteUser(item.id);
        await loadUsers();
        break;
      }
      default:
        // acción no implementada: en producción podríamos enviar a un logger
        // o mostrar una notificación al usuario. Por ahora no hacemos nada.
        break;
    }
  };

  // handleAddSample removed: demo add-sample button disabled in production UI

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col min-h-0">
        <div className="px-4 md:px-6 xl:px-7.5 pb-6 flex-1 min-h-0 overflow-auto">
          <GenericTable<User>
            data={users}
            columns={["id", "name", "email"]}
            actions={actions}
            onAction={handleAction}
          />
        </div>
      </div>
    </div>
  );
};

export default Demo;
