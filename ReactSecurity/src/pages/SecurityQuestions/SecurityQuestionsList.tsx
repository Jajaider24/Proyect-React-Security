import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { getErrorMessage } from "../../lib/errors.ts";
import GenericTable from "../../components/GenericTable.tsx";
import { securityQuestionService } from "../../services/securityQuestionService.ts";
import type { SecurityQuestion } from "../../models/SecurityQuestion.ts";

export default function SecurityQuestionsList() {
  const [items, setItems] = useState<SecurityQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<SecurityQuestion>>({ name: "", description: "" });
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setError(null);
    try {
      const data = await securityQuestionService.getAll();
      setItems(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error obteniendo preguntas";
      setError(message);
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  }

  function openCreate() { setForm({ name: "", description: "" }); setShowForm(true); }
  function openEdit(it: SecurityQuestion) { setForm({ id: it.id, name: it.name || "", description: it.description || "" }); setShowForm(true); }
  function closeForm() { setShowForm(false); }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) { const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value })); }

  async function saveForm(e: React.FormEvent) {
    e.preventDefault();
    const payload = { name: String(form.name || "").trim(), description: String(form.description || "").trim() };
    if (!payload.name) return Swal.fire("Validación", "El nombre es obligatorio", "warning");
    try {
      setLoading(true);
      if (form.id) await securityQuestionService.update(Number(form.id), payload);
      else await securityQuestionService.create(payload);
      Swal.fire("Éxito", "Pregunta guardada", "success");
      closeForm();
      fetchAll();
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando pregunta";
      Swal.fire("Error", message, "error");
    } finally { setLoading(false); }
  }

  async function onDelete(it: SecurityQuestion) {
    if (!it.id) return;
    const res = await Swal.fire({ title: "Eliminar", text: `¿Eliminar pregunta '${it.name}'?`, icon: "warning", showCancelButton: true });
    if (!res.isConfirmed) return;
    try {
      setLoading(true);
      await securityQuestionService.delete(Number(it.id));
      Swal.fire("Eliminada", "Pregunta eliminada", "success");
      fetchAll();
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error eliminando pregunta";
      Swal.fire("Error", message, "error");
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">Security Questions</h2>
          <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2.5 px-4 text-center font-medium text-white hover:bg-opacity-90">Crear</button>
        </div>
        {error && <div className="px-6 pb-2 text-red-600 text-sm">{error}</div>}
        {loading && <div className="px-6 pb-4 text-gray-500 text-sm">Cargando...</div>}
        <div className="px-4 md:px-6 xl:px-7.5 pb-6">
          <GenericTable<SecurityQuestion>
            data={items}
            columns={["id", "name", "description"] as any}
            actions={[{ name: "edit", label: "Editar" }, { name: "delete", label: "Eliminar" }]}
            onAction={(action, item) => { if (action === "edit") openEdit(item); if (action === "delete") onDelete(item); }}
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">{form.id ? "Editar" : "Crear"} pregunta</h3>
            <form onSubmit={saveForm} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Nombre</label>
                <input name="name" value={String(form.name || "")} onChange={handleChange} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Descripción</label>
                <input name="description" value={String(form.description || "")} onChange={handleChange} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeForm} className="rounded-md border border-stroke py-2 px-4 text-black hover:bg-gray-100 dark:border-strokedark dark:text-white">Cancelar</button>
                <button type="submit" className="rounded-md bg-primary py-2 px-4 font-medium text-white hover:bg-opacity-90">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
