import api from "../lib/http.ts";
import { UserRole } from "../models/UserRole.ts";

type CreatePayload = Partial<UserRole> & { userId?: number; roleId?: number; startAt?: string; endAt?: string };

// in-memory mock
let _userRoles: any[] = [
  {
    id: 1,
    user: { id: 1, name: "Juan Perez" },
    role: { id: 1, name: "Admin" },
    startAt: "2024-01-01T00:00:00",
    endAt: null,
  },
];

const USE_API = Boolean((api as any)?.defaults?.baseURL);

export const userRoleService = {
  async getUserRoles(): Promise<any[]> {
    if (USE_API) {
      const res = await api.get("/user-roles");
      return res.data;
    }
    await new Promise((r) => setTimeout(r, 150));
    return _userRoles;
  },

  async createUserRole(payload: CreatePayload): Promise<any> {
    if (USE_API) {
      const res = await api.post("/user-roles", payload);
      return res.data;
    }

    const nextId = Math.max(0, ..._userRoles.map((p) => p.id || 0)) + 1;
    const newItem = {
      id: nextId,
      user: payload.userId ? { id: payload.userId, name: `User ${payload.userId}` } : null,
      role: payload.roleId ? { id: payload.roleId, name: `Role ${payload.roleId}` } : null,
      startAt: payload.startAt ?? null,
      endAt: payload.endAt ?? null,
    };
    _userRoles.push(newItem);
    return newItem;
  },

  async updateUserRole(id: number, payload: CreatePayload): Promise<any> {
    if (USE_API) {
      const res = await api.put(`/user-roles/${id}`, payload);
      return res.data;
    }

    const idx = _userRoles.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error("Not found");
    _userRoles[idx] = { ..._userRoles[idx], ...payload };
    return _userRoles[idx];
  },

  async deleteUserRole(id?: number): Promise<boolean> {
    if (!id) return false;
    if (USE_API) {
      const res = await api.delete(`/user-roles/${id}`);
      return res.status === 200 || res.status === 204;
    }
    const before = _userRoles.length;
    _userRoles = _userRoles.filter((u) => u.id !== id);
    return _userRoles.length < before;
  },
};

export default userRoleService;
