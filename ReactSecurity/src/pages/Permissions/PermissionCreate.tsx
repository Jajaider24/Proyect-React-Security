import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import UI from "../../components/UI/index.tsx";
import { permissionService, type Permission } from "../../services/permissionService.ts";

const CreatePermission: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState<Permission>({ url: "/", method: "GET", entity: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // opcional: presets
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value } as Permission));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!form.url?.trim() || !form.method?.trim() || !form.entity?.trim()) {
        throw new Error("URL, Método y Entidad son requeridos");
      }
      setSaving(true);
      await permissionService.createPermission({
        url: form.url.trim(),
        method: form.method.toUpperCase() as any,
        entity: form.entity.trim(),
      });
      await Swal.fire({
        title: "Permiso creado",
        text: "El permiso se ha creado correctamente",
        icon: "success",
        timer: 1400,
        showConfirmButton: false,
      });
      navigate("/permissions");
    } catch (error: any) {
      const message = error?.response?.data?.error || error?.message || "No fue posible crear el permiso";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">Crear Permiso</h2>
      <form onSubmit={handleCreate} className="space-y-4">
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">URL</label>
          <input
            name="url"
            value={form.url}
            onChange={handleChange}
            className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
            placeholder="/api/users"
          />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Entidad</label>
          <input
            name="entity"
            value={form.entity}
            onChange={handleChange}
            className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white"
            placeholder="users"
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
          <UI.Button type="button" variant="secondary" className="rounded-md" onClick={() => navigate("/permissions")}>Cancelar</UI.Button>
          <UI.Button type="submit" variant="primary" disabled={saving}>{saving ? "Guardando..." : "Guardar"}</UI.Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePermission;