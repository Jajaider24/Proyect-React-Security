import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import UI from "../../components/UI/index.tsx";
import api from "../../interceptors/axiosInterceptor.ts";
import { getErrorMessage } from "../../lib/errors.ts";
import type { Address } from "../../models/Address.ts";
import type { Device } from "../../models/Device";
import type { Password } from "../../models/Password";
import type { Profile } from "../../models/Profile.ts";
import type { Session } from "../../models/Session";
import { addressService } from "../../services/addressService.ts";
import { answerService } from "../../services/answerService.ts";
import { deviceService } from "../../services/deviceService.ts";
import { digitalSignatureService } from "../../services/digitalSignatureService.ts";
import { passwordService } from "../../services/passwordService.ts";
import { profileService } from "../../services/profileService.ts";
import { roleService } from "../../services/roleService.ts";
import { securityQuestionService } from "../../services/securityQuestionService.ts";
import { sessionService } from "../../services/sessionService.ts";
import { userRoleService } from "../../services/userRolesService.ts";
import { userService } from "../../services/usersService.ts";

type TabKey = "address" | "profile" | "signature" | "devices" | "passwords" | "sessions" | "roles" | "questions";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = /\/users\/(\d+)\/edit$/.test(location.pathname);
  const readOnly = !isEditMode;

  const [active, setActive] = useState<TabKey>("address");

  useEffect(() => {
    if (!userId) {
      Swal.fire("Error", "ID de usuario inválido", "error");
      navigate("/users");
    }
  }, [userId, navigate]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-white">Usuario #{userId}</h1>
        <UI.Button onClick={() => navigate("/users")} variant="secondary" className="rounded-md">
          Volver
        </UI.Button>
      </div>

      <div className="border-b border-stroke dark:border-strokedark">
        <nav className="-mb-px flex flex-wrap gap-4">
          {[
            { key: "address", label: "Address" },
            { key: "profile", label: "Profile" },
            { key: "signature", label: "Digital Signature" },
            { key: "devices", label: "Devices" },
            { key: "passwords", label: "Passwords" },
            { key: "sessions", label: "Sessions" },
            { key: "roles", label: "Roles" },
            { key: "questions", label: "Security Q&A" },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key as TabKey)}
              className={`pb-2 border-b-2 ${active === t.key ? "border-primary text-primary" : "border-transparent text-black dark:text-white"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

    {active === "address" && <AddressTab userId={userId} readOnly={readOnly} />} 
    {active === "profile" && <ProfileTab userId={userId} readOnly={readOnly} />} 
    {active === "signature" && <SignatureTab userId={userId} readOnly={readOnly} />} 
    {active === "devices" && <DevicesTab userId={userId} readOnly={readOnly} />} 
    {active === "passwords" && <PasswordsTab userId={userId} readOnly={readOnly} />} 
    {active === "sessions" && <SessionsTab userId={userId} readOnly={readOnly} />} 
    {active === "roles" && <RolesTab userId={userId} readOnly={readOnly} />}
    {active === "questions" && <SecurityAnswersTab userId={userId} readOnly={readOnly} />}
    </div>
  );
}

function SecurityAnswersTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Array<{ id: number; name: string; description?: string }>>([]);
  const [answersByQ, setAnswersByQ] = useState<Record<number, { id?: number; content: string }>>({});

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [qs, ans] = await Promise.all([
          securityQuestionService.getAll(),
          answerService.getByUser(userId),
        ]);
        const compactQ = (qs || []).filter((q: any) => q?.id != null && q?.name != null).map((q: any) => ({ id: Number(q.id), name: String(q.name), description: q.description || "" }));
        setQuestions(compactQ);
        const map: Record<number, { id?: number; content: string }> = {};
        (ans || []).forEach((a: any) => {
          const qid = Number(a.security_question_id);
          if (!Number.isNaN(qid)) map[qid] = { id: a.id, content: String(a.content || "") };
        });
        setAnswersByQ(map);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar preguntas y respuestas";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const updateLocal = (questionId: number, patch: Partial<{ content: string; id?: number }>) => {
    setAnswersByQ((prev) => ({ ...prev, [questionId]: { ...(prev[questionId] || { content: "" }), ...patch } }));
  };

  const onSave = async (qId: number) => {
    if (readOnly) return;
    const entry = answersByQ[qId] || { content: "" };
    const content = (entry.content || "").trim();
    if (!content) {
      Swal.fire("Validación", "La respuesta no puede estar vacía", "warning");
      return;
    }
    try {
      setSavingId(qId);
      if (entry.id) {
        await answerService.update(Number(entry.id), { content });
      } else {
        const created = await answerService.create(userId, qId, { content });
        updateLocal(qId, { id: Number((created as any).id) });
      }
      Swal.fire("Guardado", "Respuesta guardada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando respuesta";
      Swal.fire("Error", message, "error");
    } finally {
      setSavingId(null);
    }
  };

  const onDelete = async (qId: number) => {
    if (readOnly) return;
    const entry = answersByQ[qId];
    if (!entry?.id) return;
    const res = await Swal.fire({ title: "¿Eliminar respuesta?", text: "Esta acción no se puede deshacer", icon: "warning", showCancelButton: true });
    if (!res.isConfirmed) return;
    try {
      setSavingId(qId);
      await answerService.delete(Number(entry.id));
      const clone = { ...answersByQ };
      clone[qId] = { content: "" };
      setAnswersByQ(clone);
      Swal.fire("Eliminada", "Respuesta eliminada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error eliminando respuesta";
      Swal.fire("Error", message, "error");
    } finally { setSavingId(null); }
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Preguntas de seguridad</h3>
      {questions.length === 0 ? (
        <div className="text-gray-500">No hay preguntas configuradas.</div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div key={q.id} className="border border-stroke rounded-md p-3 dark:border-strokedark">
              <div className="font-medium text-black dark:text-white">{q.name}</div>
              {q.description && <div className="text-xs text-gray-500 mb-2">{q.description}</div>}
              <div className="flex gap-3 items-center">
                <UI.Input
                  placeholder="Tu respuesta"
                  value={answersByQ[q.id]?.content || ""}
                  onChange={(e) => updateLocal(q.id, { content: e.target.value })}
                  disabled={readOnly}
                  className="flex-1 rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white"
                />
                {!readOnly && (
                  <>
                    <UI.Button onClick={() => onSave(q.id)} disabled={savingId === q.id} variant="primary" className="">
                      {savingId === q.id ? "Guardando..." : (answersByQ[q.id]?.id ? "Actualizar" : "Guardar")}
                    </UI.Button>
                    {answersByQ[q.id]?.id && (
                      <UI.Button onClick={() => onDelete(q.id)} variant="danger" className="">Eliminar</UI.Button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [address, setAddress] = useState<Address | null>(null);
  const [form, setForm] = useState<Address>({ street: "", number: "", latitude: undefined, longitude: undefined });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // El backend devuelve lista (aunque 1:1), tomamos el primero si existiera
        const data = await addressService.getAddressesByUser(userId);
        const first = Array.isArray(data) ? (data[0] || null) : (data as any);
        setAddress(first);
        if (first) setForm({
          street: first.street || "",
          number: first.number || "",
          latitude: first.latitude ?? undefined,
          longitude: first.longitude ?? undefined,
        });
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar la dirección";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: name === "latitude" || name === "longitude" ? (value === "" ? undefined : Number(value)) : value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (!form.street?.trim() || !form.number?.trim()) {
      Swal.fire("Validación", "Street y Number son obligatorios", "warning");
      return;
    }
    try {
      setSaving(true);
      const payload: Partial<Address> = {
        street: form.street.trim(),
        number: form.number.trim(),
        latitude: form.latitude,
        longitude: form.longitude,
      };
      if (address?.id) {
        const updated = await addressService.updateAddress(address.id, payload);
        setAddress(updated);
        Swal.fire("Actualizado", "Dirección actualizada", "success");
      } else {
        const created = await addressService.createAddress(userId, payload);
        setAddress(created);
        Swal.fire("Creado", "Dirección creada", "success");
      }
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando dirección";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Address</h3>
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Street</label>
          <UI.Input name="street" value={form.street || ""} onChange={onChange} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Number</label>
          <UI.Input name="number" value={form.number || ""} onChange={onChange} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Latitude</label>
          <UI.Input name="latitude" type="number" step="0.000001" value={(form.latitude ?? "") as any} onChange={onChange} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
        </div>
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Longitude</label>
          <UI.Input name="longitude" type="number" step="0.000001" value={(form.longitude ?? "") as any} onChange={onChange} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
        </div>
        {!readOnly && (
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <UI.Button type="submit" disabled={saving} variant="primary" className="">
              {saving ? "Guardando..." : address?.id ? "Actualizar" : "Crear"}
            </UI.Button>
          </div>
        )}
      </form>
    </div>
  );
}

function ProfileTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [phone, setPhone] = useState("");
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [signature, setSignature] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_BASE: string = (api as any)?.defaults?.baseURL || "";

  // La imagen de Profile debe COINCIDIR con la de Digital Signature
  const currentImageUrl = (() => {
    const raw = (signature as any)?.photo as string | undefined;
    if (!raw) return null;
    const base = String(raw).split(/[/\\]/).pop();
    if (!base) return null;
    return `${API_BASE}/api/digital-signatures/${base}`;
  })();

  useEffect(() => {
    (async () => {
      try {
        const [u, data, sig] = await Promise.all([
          userService.getUserById(userId),
          profileService.getProfileByUser(userId),
          digitalSignatureService.getSignatureByUser(userId),
        ]);
        setUser(u || null);
        setProfile(data);
        setSignature(sig || null);
        if (data) setPhone(data.phone || "");
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar el perfil";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (profile?.id) {
        const updated = await profileService.updateProfile(profile.id, { phone: phone?.trim(), photo: null });
        setProfile(updated);
        Swal.fire("Actualizado", "Perfil actualizado", "success");
      } else {
        const created = await profileService.createProfile(userId, { phone: phone?.trim(), photo: null });
        setProfile(created);
        Swal.fire("Creado", "Perfil creado", "success");
      }
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando perfil";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
  <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Profile</h3>

      {/* Vista estilo wireframe */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-6">
        <div className="md:col-span-2 border border-stroke dark:border-strokedark rounded-md h-[320px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          {currentImageUrl ? (
            <img src={currentImageUrl} alt="Profile" className="max-h-[300px] object-contain" />
          ) : (
            <div className="w-[260px] h-[260px] border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Sin foto</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
            <div className="text-black dark:text-white">{user?.name || ""}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
            <div className="text-black dark:text-white">{user?.email || ""}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Phone</div>
            <div className="text-black dark:text-white">{phone || profile?.phone || ""}</div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-black mb-1 dark:text-white">Phone</label>
            <UI.Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
          </div>
        {/* La imagen se actualiza solo en Digital Signature. Aquí no hay input de archivo. */}
        {!readOnly && (
          <div className="md:col-span-2 flex justify-end gap-3 pt-2">
            <UI.Button type="submit" disabled={saving} variant="primary" className="">
              {saving ? "Guardando..." : profile?.id ? "Actualizar" : "Crear"}
            </UI.Button>
          </div>
        )}
      </form>
    </div>
  );
}

function SignatureTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [signature, setSignature] = useState<any | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const API_BASE: string = (api as any)?.defaults?.baseURL || "";

  useEffect(() => {
    (async () => {
      try {
        const [u, data] = await Promise.all([
          userService.getUserById(userId),
          digitalSignatureService.getSignatureByUser(userId),
        ]);
        setUser(u || null);
        setSignature(data);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar la firma";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (!file && !signature?.id) {
      Swal.fire("Validación", "Selecciona una imagen para la firma", "warning");
      return;
    }
    try {
      setSaving(true);
      if (signature?.id && file) {
        const updated = await digitalSignatureService.updateSignature(signature.id, file);
        setSignature(updated);
        Swal.fire("Actualizado", "Firma actualizada", "success");
      } else if (!signature?.id && file) {
        const created = await digitalSignatureService.createSignature(userId, file);
        setSignature(created);
        Swal.fire("Creado", "Firma creada", "success");
      }
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error guardando firma";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-gray-500">Cargando...</div>;

  const preview = file
    ? URL.createObjectURL(file)
    : (() => {
        const raw = (signature as any)?.photo as string | undefined;
        if (!raw) return null;
        const base = String(raw).split(/[/\\]/).pop();
        if (!base) return null;
        return `${API_BASE}/api/digital-signatures/${base}`;
      })();

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">Digital Signature</h3>

      {/* Vista estilo wireframe */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-6">
        <div className="md:col-span-2 border border-stroke dark:border-strokedark rounded-md h-[320px] flex items-center justify-center bg-gray-50 dark:bg-gray-800">
          {preview ? (
            <img src={preview} alt="Signature" className="max-h-[300px] object-contain" />
          ) : (
            <div className="w-[260px] h-[260px] border-2 border-dashed border-gray-300 dark:border-gray-600 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">Sin firma</div>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Name</div>
            <div className="text-black dark:text-white">{user?.name || ""}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Email</div>
            <div className="text-black dark:text-white">{user?.email || ""}</div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm text-black mb-1 dark:text-white">Imagen</label>
          <UI.Input type="file" accept="image/*" onChange={(e: any) => setFile(e.target.files?.[0] || null)} disabled={readOnly} className="w-full rounded border border-stroke py-2 px-3 outline-none focus:border-primary dark:border-strokedark dark:bg-form-input dark:text-white" />
        </div>
        {!readOnly && (
          <div className="flex justify-end gap-3 pt-2">
            <UI.Button type="submit" disabled={saving} variant="primary" className="">
              {saving ? "Guardando..." : signature?.id ? "Actualizar" : "Crear"}
            </UI.Button>
          </div>
        )}
      </form>
    </div>
  );
}

function RolesTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [allRoles, setAllRoles] = useState<Array<{ id: number; name: string }>>([]);
  const [assignments, setAssignments] = useState<Array<{ id: string; role_id: number; startAt?: string; endAt?: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [roleId, setRoleId] = useState<number | "">("");
  const [startAt, setStartAt] = useState<string>("");
  const [endAt, setEndAt] = useState<string>("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [roles, urs] = await Promise.all([
          roleService.getRoles(),
          userRoleService.getByUser(userId),
        ]);
        const compact = (roles || []).filter((r: any) => r?.id != null && r?.name != null).map((r: any) => ({ id: Number(r.id), name: String(r.name) }));
        setAllRoles(compact);
        setAssignments(urs || []);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar roles";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleId) {
      Swal.fire("Validación", "Selecciona un rol", "warning");
      return;
    }
    if (!startAt || !endAt) {
      Swal.fire("Validación", "Debes indicar start y end", "warning");
      return;
    }
    const sDate = new Date(startAt);
    const eDate = new Date(endAt);
    if (Number.isNaN(sDate.getTime()) || Number.isNaN(eDate.getTime()) || eDate <= sDate) {
      Swal.fire("Validación", "La fecha de fin debe ser posterior al inicio", "warning");
      return;
    }
    try {
      setSaving(true);
      await userRoleService.assign(userId, Number(roleId), { startAt, endAt });
      const urs = await userRoleService.getByUser(userId);
      setAssignments(urs || []);
      setRoleId("");
      setStartAt("");
      setEndAt("");
      Swal.fire("Asignado", "Rol asignado al usuario", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error asignando rol";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    const res = await Swal.fire({ title: "¿Eliminar?", text: "Quitar este rol del usuario", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar" });
    if (!res.isConfirmed) return;
    try {
      await userRoleService.unassign(id);
      setAssignments((prev) => prev.filter((x) => x.id !== id));
      Swal.fire("Eliminado", "Rol removido", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error removiendo rol";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Asignar rol</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select value={roleId} onChange={(e) => setRoleId(e.target.value ? Number(e.target.value) : "")} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white">
            <option value="">Selecciona un rol</option>
            {allRoles.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          {allRoles.length === 0 && (
            <div className="md:col-span-3 text-sm text-gray-500 self-center">
              No hay roles disponibles. Crea roles en la sección <a className="text-primary underline" href="/roles">Roles</a>.
            </div>
          )}
          <UI.Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          {!readOnly && (
            <div className="md:col-span-4 flex justify-end">
              <UI.Button type="submit" disabled={saving} variant="primary" className="">{saving ? "Guardando..." : "Asignar"}</UI.Button>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Roles del usuario</h3>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : assignments.length === 0 ? (
          <div className="text-gray-500">Sin roles asignados</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-black dark:text-white">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Rol</th>
                  <th className="py-2 pr-4">startAt</th>
                  <th className="py-2 pr-4">endAt</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((ur) => (
                  <tr key={ur.id} className="border-t border-stroke dark:border-strokedark">
                    <td className="py-2 pr-4 text-black dark:text-white">{ur.id}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{allRoles.find((r) => r.id === ur.role_id)?.name || ur.role_id}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String(ur.startAt || "")}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String(ur.endAt || "")}</td>
                    <td className="py-2 pr-4 text-right">
                      {!readOnly && (
                        <UI.Button onClick={() => onDelete(ur.id)} variant="danger" className="">Eliminar</UI.Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function DevicesTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [items, setItems] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Required<Pick<Device, "name" | "ip">> & { operatingSystem?: string }>(
    { name: "", ip: "", operatingSystem: "" }
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await deviceService.getDevicesByUser(userId);
        setItems(data);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar los dispositivos";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (!form.name.trim() || !form.ip.trim()) {
      Swal.fire("Validación", "Name e IP son obligatorios", "warning");
      return;
    }
    try {
      setSaving(true);
      await deviceService.createDevice(userId, {
        name: form.name.trim(),
        ip: form.ip.trim(),
        operatingSystem: form.operatingSystem?.trim() || undefined,
      });
      setForm({ name: "", ip: "", operatingSystem: "" });
      // reload
      setLoading(true);
      const data = await deviceService.getDevicesByUser(userId);
      setItems(data);
      setLoading(false);
      Swal.fire("Creado", "Dispositivo creado", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error creando dispositivo";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id?: number) => {
    if (!id) return;
    const res = await Swal.fire({ title: "¿Eliminar?", text: "Esta acción no se puede deshacer", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar" });
    if (!res.isConfirmed) return;
    try {
      await deviceService.deleteDevice(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      Swal.fire("Eliminado", "Dispositivo eliminado", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error eliminando dispositivo";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Nuevo dispositivo</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <UI.Input placeholder="Name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input placeholder="IP" value={form.ip} onChange={(e) => setForm((p) => ({ ...p, ip: e.target.value }))} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input placeholder="Operating System" value={form.operatingSystem || ""} onChange={(e) => setForm((p) => ({ ...p, operatingSystem: e.target.value }))} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          {!readOnly && (
            <div className="md:col-span-3 flex justify-end">
              <UI.Button type="submit" disabled={saving} variant="primary" className="">{saving ? "Guardando..." : "Crear"}</UI.Button>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Dispositivos</h3>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Sin registros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-black dark:text-white">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">IP</th>
                  <th className="py-2 pr-4">Operating System</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((d) => (
                  <tr key={d.id} className="border-t border-stroke dark:border-strokedark">
                    <td className="py-2 pr-4 text-black dark:text-white">{d.id}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{d.name}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{d.ip}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{d.operatingSystem || ""}</td>
                    <td className="py-2 pr-4 text-right">
                      {!readOnly && (
                        <UI.Button onClick={() => onDelete(d.id)} variant="danger" className="">Eliminar</UI.Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function PasswordsTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [items, setItems] = useState<Password[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState("");
  const [startAt, setStartAt] = useState<string>(""); // datetime-local
  const [endAt, setEndAt] = useState<string>(""); // datetime-local

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await passwordService.getPasswordsByUser(userId);
        setItems(data);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar contraseñas";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const formatDateTime = (s: string) => {
    if (!s) return "";
    const d = new Date(s);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    if (!content.trim() || !startAt || !endAt) {
      Swal.fire("Validación", "Content, start y end son obligatorios", "warning");
      return;
    }
    const sDate = new Date(startAt);
    const eDate = new Date(endAt);
    if (Number.isNaN(sDate.getTime()) || Number.isNaN(eDate.getTime()) || eDate <= sDate) {
      Swal.fire("Validación", "La fecha de fin debe ser posterior al inicio", "warning");
      return;
    }
    try {
      setSaving(true);
      await passwordService.createPassword(userId, {
        content: content.trim(),
        startsAt: undefined, // not used by API
        endsAt: undefined, // not used by API
        // backend expects startAt/endAt string keys
        // we'll send them via type cast to any
        ...( { startAt: formatDateTime(startAt), endAt: formatDateTime(endAt) } as any ),
      });
      setContent("");
      setStartAt("");
      setEndAt("");
      setLoading(true);
      const data = await passwordService.getPasswordsByUser(userId);
      setItems(data);
      setLoading(false);
      Swal.fire("Creado", "Contraseña registrada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error creando contraseña";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id?: number) => {
    if (!id) return;
    const res = await Swal.fire({ title: "¿Eliminar?", text: "Esta acción no se puede deshacer", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar" });
    if (!res.isConfirmed) return;
    try {
      await passwordService.deletePassword(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      Swal.fire("Eliminado", "Contraseña eliminada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error eliminando contraseña";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Nueva contraseña</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <UI.Input placeholder="Content" value={content} onChange={(e) => setContent(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          {!readOnly && (
            <div className="md:col-span-4 flex justify-end">
              <UI.Button type="submit" disabled={saving} variant="primary" className="">{saving ? "Guardando..." : "Crear"}</UI.Button>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Historial de contraseñas</h3>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Sin registros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-black dark:text-white">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Content</th>
                  <th className="py-2 pr-4">startAt</th>
                  <th className="py-2 pr-4">endAt</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-stroke dark:border-strokedark">
                    <td className="py-2 pr-4 text-black dark:text-white">{p.id}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String(p.content || "")}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String((p as any).startAt || (p as any).startsAt || "")}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String((p as any).endAt || (p as any).endsAt || "")}</td>
                    <td className="py-2 pr-4 text-right">
                      {!readOnly && (
                        <UI.Button onClick={() => onDelete(p.id)} variant="danger" className="">Eliminar</UI.Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function SessionsTab({ userId, readOnly }: { userId: number; readOnly?: boolean }) {
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [token, setToken] = useState<string>("");
  const [expiration, setExpiration] = useState<string>(() => {
    const d = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  });
  const [faCode, setFaCode] = useState<string>("");
  const [state, setState] = useState<string>("active");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await sessionService.getSessionsByUser(userId);
        setItems(data);
      } catch (err: any) {
        const message = getErrorMessage(err) || "No fue posible cargar sesiones";
        Swal.fire("Error", message, "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (readOnly) return;
    try {
      setSaving(true);
      await sessionService.createSession(userId, {
        token: token?.trim() || undefined,
        expiration,
        FACode: faCode?.trim() || undefined,
        state,
      });
      setToken("");
      setFaCode("");
      setLoading(true);
      const data = await sessionService.getSessionsByUser(userId);
      setItems(data);
      setLoading(false);
      Swal.fire("Creado", "Sesión creada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error creando sesión";
      Swal.fire("Error", message, "error");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id?: string) => {
    if (!id) return;
    const res = await Swal.fire({ title: "¿Eliminar?", text: "Esta acción no se puede deshacer", icon: "warning", showCancelButton: true, confirmButtonText: "Sí, eliminar" });
    if (!res.isConfirmed) return;
    try {
      await sessionService.deleteSession(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      Swal.fire("Eliminado", "Sesión eliminada", "success");
    } catch (err: any) {
      const message = getErrorMessage(err) || "Error eliminando sesión";
      Swal.fire("Error", message, "error");
    }
  };

  return (
    <div className="grid gap-6">
      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Nueva sesión</h3>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <UI.Input placeholder="Token (opcional)" value={token} onChange={(e) => setToken(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input type="datetime-local" value={expiration} onChange={(e) => setExpiration(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <UI.Input placeholder="FA Code" value={faCode} onChange={(e) => setFaCode(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white" />
          <select value={state} onChange={(e) => setState(e.target.value)} disabled={readOnly} className="rounded border border-stroke py-2 px-3 dark:border-strokedark dark:bg-form-input dark:text-white">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
          {!readOnly && (
            <div className="md:col-span-5 flex justify-end">
              <UI.Button type="submit" disabled={saving} variant="primary" className="">{saving ? "Guardando..." : "Crear"}</UI.Button>
            </div>
          )}
        </form>
      </div>

      <div className="rounded-sm border border-stroke bg-white p-4 shadow-default dark:border-strokedark dark:bg-boxdark">
        <h3 className="text-lg font-semibold mb-3 text-black dark:text-white">Sesiones</h3>
        {loading ? (
          <div className="text-gray-500">Cargando...</div>
        ) : items.length === 0 ? (
          <div className="text-gray-500">Sin registros</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="text-sm text-black dark:text-white">
                  <th className="py-2 pr-4">ID</th>
                  <th className="py-2 pr-4">Token</th>
                  <th className="py-2 pr-4">Expiration</th>
                  <th className="py-2 pr-4">FA Code</th>
                  <th className="py-2 pr-4">State</th>
                  <th className="py-2 pr-4"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} className="border-t border-stroke dark:border-strokedark">
                    <td className="py-2 pr-4 text-black dark:text-white">{s.id}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{s.token}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{String(s.expiration || "")}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{s.FACode || ""}</td>
                    <td className="py-2 pr-4 text-black dark:text-white">{s.state}</td>
                    <td className="py-2 pr-4 text-right">
                      {!readOnly && (
                        <UI.Button onClick={() => onDelete(s.id)} variant="danger" className="">Eliminar</UI.Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
