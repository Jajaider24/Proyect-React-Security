import api from "../lib/http";
import { Role } from "../models/Role";

class RoleService {
  async getRoles(): Promise<Role[]> {
    const res = await api.get("/api/roles");
    return res.data;
  }

  async getRoleById(id: number): Promise<Role> {
    const res = await api.get(`/api/roles/${id}`);
    return res.data;
  }

  async createRole(payload: Partial<Role>): Promise<Role> {
    const res = await api.post("/api/roles", payload);
    return res.data;
  }

  async updateRole(id: number, payload: Partial<Role>): Promise<Role> {
    const res = await api.put(`/api/roles/${id}`, payload);
    return res.data;
  }

  async deleteRole(id: number): Promise<void> {
    await api.delete(`/api/roles/${id}`);
  }
}

export const roleService = new RoleService();