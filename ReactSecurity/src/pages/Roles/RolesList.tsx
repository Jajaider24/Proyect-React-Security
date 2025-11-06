import React, { useEffect, useMemo, useRef, useState } from "react";
import Swal from "sweetalert2";
import GenericTable from "../../components/GenericTable.tsx";
import UI from "../../components/UI/index.tsx";
import { getErrorMessage } from "../../lib/errors.ts";
import type { Role } from "../../models/Role.ts";
import { permissionService, type Permission } from "../../services/permissionService.ts";
import { rolePermissionService } from "../../services/rolePermissionService.ts";
import { roleService } from "../../services/roleService.ts";

export default function RolesList() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<Role>>({ name: "", description: "" } as any);
  // Permissions modal state
  const [showPerms, setShowPerms] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermIds, setAssignedPermIds] = useState<Set<number>>(new Set());
  const [loadingPerms, setLoadingPerms] = useState(false);
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchRoles();
  }, []);

  async function fetchRoles() {
    setLoading(true);
    setError(null);
    try {
      const data = await roleService.getRoles();
      setRoles(Array.isArray(data) ? data : []);
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error obteniendo roles";
      setError(message);
      Swal.fire("Error", message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function openPermissions(r: Role) {
    setSelectedRole(r);
    setShowPerms(true);
    setLoadingPerms(true);
    try {
      // Load all permissions
      const perms = await permissionService.getPermissions();
      setAllPermissions(Array.isArray(perms) ? perms : []);
      // Load role-permissions for this role
      const rps = await rolePermissionService.getByRole(r.id!);
      const ids = new Set<number>(rps.map((rp) => rp.permission_id));
      setAssignedPermIds(ids);
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error cargando permisos del rol";
      Swal.fire("Error", message, "error");
    } finally {
      setLoadingPerms(false);
    }
  }
  function closePermissions() {
    setShowPerms(false);
    setSelectedRole(null);
    setAllPermissions([]);
    setAssignedPermIds(new Set());
  }
  async function togglePermission(permission: Permission) {
    if (!selectedRole?.id) return;
    const roleId = selectedRole.id;
    const permissionId = permission.id!;
    const isAssigned = assignedPermIds.has(permissionId);
    try {
      setLoadingPerms(true);
      if (isAssigned) {
        await rolePermissionService.unassign(roleId, permissionId);
        const next = new Set(assignedPermIds);
        next.delete(permissionId);
        setAssignedPermIds(next);
      } else {
        await rolePermissionService.assign(roleId, permissionId);
        const next = new Set(assignedPermIds);
        next.add(permissionId);
        setAssignedPermIds(next);
      }
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error actualizando permisos";
      Swal.fire("Error", message, "error");
    } finally {
      setLoadingPerms(false);
    }
  }

  // Group permissions by entity for a nicer UI
  const groupedPermissions = useMemo(() => {
    const groups: Record<string, Permission[]> = {};
    for (const p of allPermissions) {
      const key = p.entity || "Otros";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    // sort methods by common order
    const order = ["GET", "POST", "PUT", "DELETE"];
    Object.keys(groups).forEach((k) => {
      groups[k].sort((a, b) => {
        const ea = String(a.method).toUpperCase();
        const eb = String(b.method).toUpperCase();
        const ia = order.indexOf(ea);
        const ib = order.indexOf(eb);
        return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
      });
    });
    return groups;
  }, [allPermissions]);

  function openCreate() {
    setForm({ name: "", description: "" } as any);
    setShowForm(true);
  }
  function openEdit(r: Role) {
    setForm({ id: r.id, name: (r as any).name || "", description: (r as any).description || "" } as any);
    setShowForm(true);
  }
  function closeForm() { setShowForm(false); }
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target; setForm((p) => ({ ...p, [name]: value }));
  }
  async function saveForm(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = { name: (form as any).name?.trim(), description: (form as any).description?.trim() };
    if (!payload.name) return Swal.fire("Validación", "El nombre es obligatorio", "warning");
    try {
      setLoading(true);
      if (form.id) await roleService.updateRole(form.id, payload);
      else await roleService.createRole(payload);
      Swal.fire("Éxito", "Rol guardado", "success");
      closeForm();
      fetchRoles();
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando rol";
      Swal.fire("Error", message, "error");
    } finally { setLoading(false); }
  }
  async function onDelete(r: Role) {
    const confirm = await Swal.fire({ title: "Eliminar", text: `¿Eliminar rol ${(r as any).name}?`, icon: "warning", showCancelButton: true });
    if (!confirm.isConfirmed) return;
    try { setLoading(true); await roleService.deleteRole(r.id!); Swal.fire("Eliminado", "Rol eliminado", "success"); fetchRoles(); }
    catch (err: any) { Swal.fire("Error", getErrorMessage(err) || "Error eliminando rol", "error"); }
    finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark flex flex-col min-h-0">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-black dark:text-white">Roles</h2>
          <UI.Button type="button" onClick={openCreate} variant="primary" className="inline-flex items-center justify-center gap-2.5">Crear Rol</UI.Button>
        </div>
        {error && <div className="px-6 pb-2 text-red-600 text-sm">{error}</div>}
        {loading && <div className="px-6 pb-4 text-gray-500 text-sm">Cargando...</div>}
        <div className="px-4 md:px-6 xl:px-7.5 pb-6 flex-1 min-h-0 overflow-auto">
          <GenericTable<Role>
            data={roles}
            columns={["id", "name", "description"] as any}
            actions={[{ name: "permissions", label: "Permisos" }, { name: "edit", label: "Editar" }, { name: "delete", label: "Eliminar" }]}
            onAction={(action, item) => {
              if (action === "edit") openEdit(item);
              if (action === "delete") onDelete(item);
              if (action === "permissions") openPermissions(item);
            }}
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg dark:bg-boxdark">
            <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">{form.id ? "Editar Rol" : "Crear Rol"}</h3>
            <form onSubmit={saveForm} className="space-y-4">
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Nombre</label>
                <UI.Input name="name" value={(form as any).name || ""} onChange={handleChange} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
              </div>
              <div>
                <label className="block text-sm text-black mb-1 dark:text-white">Descripción</label>
                <UI.Input name="description" value={(form as any).description || ""} onChange={handleChange} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <UI.Button type="button" onClick={closeForm} variant="secondary" className="rounded-md">Cancelar</UI.Button>
                <UI.Button type="submit" variant="primary" className="rounded-md">Guardar</UI.Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPerms && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-3xl rounded-md bg-white p-6 shadow-lg dark:bg-boxdark">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black dark:text-white">
                Permisos del rol: {(selectedRole as any)?.name || selectedRole?.id}
              </h3>
              <button onClick={closePermissions} className="text-black dark:text-white hover:text-primary">Cerrar</button>
            </div>

            {loadingPerms ? (
              <div className="text-gray-600 dark:text-gray-300">Cargando permisos...</div>
            ) : (
              <div className="max-h-[60vh] overflow-y-auto space-y-6">
                {Object.keys(groupedPermissions).length === 0 ? (
                  <div className="text-sm text-black dark:text-white">No hay permisos configurados.</div>
                ) : (
                  Object.entries(groupedPermissions).map(([entity, perms]) => (
                    <div key={entity} className="border border-stroke rounded-md p-4 dark:border-strokedark">
                      <h4 className="font-medium mb-3 text-black dark:text-white">{entity}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {perms.map((p) => {
                          const checked = assignedPermIds.has(p.id!);
                          return (
                            <label key={p.id} className="flex items-center gap-3 text-black dark:text-white">
                              <input
                                type="checkbox"
                                className="h-4 w-4"
                                checked={checked}
                                onChange={() => togglePermission(p)}
                              />
                              <span className="text-sm">
                                <span className="font-semibold">{p.method}</span>
                                <span className="mx-2 text-gray-500">•</span>
                                <span className="font-mono text-xs break-all">{p.url}</span>
                              </span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
