import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import GenericTable from "../../components/GenericTable.tsx";
import UI from "../../components/UI/index.tsx";
import type { User } from "../../models/User.ts";
import { userService } from "../../services/usersService.ts";

type FormState = { id?: number; name: string; email: string };

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple form modal state
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "" });
  const isEdit = useMemo(() => Boolean(form.id), [form.id]);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      const message =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error obteniendo usuarios";
      setError(message);
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setForm({ name: "", email: "" });
    setShowForm(true);
  }

  // Edición desde lista ahora redirige a /users/:id/edit. Se deja el modal para uso futuro manual si se requiere.

  function closeForm() {
    setShowForm(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault();
    const payload: Partial<User> = { name: form.name?.trim(), email: form.email?.trim() };
    if (!payload.name || !payload.email) {
      Swal.fire("Validación", "Nombre y correo son obligatorios", "warning");
      return;
    }

    try {
      setLoading(true);
      if (form.id) {
        await userService.updateUser(form.id, payload);
        Swal.fire("Actualizado", "Usuario actualizado", "success");
      } else {
        await userService.createUser(payload);
        Swal.fire("Creado", "Usuario creado", "success");
      }
      closeForm();
      fetchUsers();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error guardando usuario";
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  }

  async function onDelete(u: User) {
    const confirm = await Swal.fire({
      title: "Eliminar",
      text: `¿Eliminar usuario ${u.email}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (!confirm.isConfirmed) return;
    try {
      setLoading(true);
      await userService.deleteUser(u.id!);
      Swal.fire("Eliminado", "Usuario eliminado", "success");
      fetchUsers();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || err?.response?.data?.error || err?.message || "Error eliminando usuario";
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">Users</h2>
          <UI.Button type="button" onClick={openCreate} variant="primary" className="inline-flex items-center justify-center gap-2.5">
            Crear Usuario
          </UI.Button>
        </div>

        {error && (
          <div className="px-6 pb-2 text-red-600 text-sm">{error}</div>
        )}

        {loading && (
          <div className="px-6 pb-4 text-gray-500 text-sm">Cargando...</div>
        )}

        <div className="px-4 md:px-6 xl:px-7.5 pb-6">
          <GenericTable<User>
            data={users}
            columns={["id", "name", "email", "created_at"]}
            actions={[
              { name: "detail", label: "Detalle" },
              { name: "edit", label: "Editar" },
              { name: "delete", label: "Eliminar" },
            ]}
            onAction={(action, item) => {
              if (action === "detail") {
                if (item.id) window.location.href = `/users/${item.id}`;
                return;
              }
              if (action === "edit") {
                if (item.id) window.location.href = `/users/${item.id}/edit`;
                return;
              }
              if (action === "delete") onDelete(item);
            }}
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
              {isEdit ? "Editar Usuario" : "Crear Usuario"}
            </h3>
            <form onSubmit={saveForm} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Nombre</label>
                <UI.Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Email</label>
                <UI.Input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
                  placeholder="correo@dominio.com"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <UI.Button type="button" onClick={closeForm} variant="secondary" className="rounded-md">
                  Cancelar
                </UI.Button>
                <UI.Button type="submit" variant="primary" className="rounded-md">
                  Guardar
                </UI.Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
