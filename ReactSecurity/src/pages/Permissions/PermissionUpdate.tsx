import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { permissionService, type Permission } from "../../services/permissionService.ts";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePermission: React.FC = () => {
  const [form, setForm] = useState<Permission | null>(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPermission();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPermission = async () => {
    try {
      const data = await permissionService.getPermissionById(Number(id));
      setForm(data);
    } catch (error) {
      Swal.fire("Error", "No fue posible cargar el permiso", "error");
      navigate("/permissions");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...(p as Permission), [name]: value } as Permission));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    try {
      if (!form.url?.trim() || !form.method?.trim() || !form.entity?.trim()) {
        throw new Error("URL, Método y Entidad son requeridos");
      }
      setSaving(true);
      await permissionService.updatePermission(Number(id), {
        url: form.url.trim(),
        method: form.method.toUpperCase() as any,
        entity: form.entity.trim(),
      });
      await Swal.fire({
        title: "Permiso actualizado",
        text: "El permiso se ha actualizado correctamente",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      navigate("/permissions");
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || "No fue posible actualizar el permiso";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <div>Cargando permiso...</div>;

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Editar Permiso</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">URL</label>
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Entidad</label>
          <input
            name="entity"
            value={form.entity}
            onChange={handleChange}
            className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Método</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={() => navigate("/permissions")} className="rounded-md border border-stroke py-2 px-4 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white">Cancelar</button>
          <button type="submit" disabled={saving} className="rounded-md bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90 disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePermission;