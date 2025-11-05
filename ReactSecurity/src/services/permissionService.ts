import api from "../interceptors/axiosInterceptor.ts";

export interface Permission {
  id?: number;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  entity: string;
}

class PermissionService {
  async getPermissions(): Promise<Permission[]> {
    // Flask collections usan slash final: evita redirects innecesarios
    const res = await api.get("/api/permissions/");
    return res.data;
  }

  async getPermissionById(id: number): Promise<Permission> {
    const res = await api.get(`/api/permissions/${id}`);
    return res.data;
  }
  async createPermission(payload: Permission | { url: string; method: string; entity: string }): Promise<Permission> {
    if (!payload?.url) throw new Error("La URL es requerida");
    if (!payload?.method) throw new Error("El método es requerido");
    if (!(payload as any)?.entity) throw new Error("La entidad es requerida");

    const mapped = {
      url: payload.url,
      method: String(payload.method).toUpperCase(),
      entity: (payload as any).entity,
    };

    const res = await api.post("/api/permissions/", mapped, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  }




  async updatePermission(id: number, payload: Partial<Permission>): Promise<Permission> {
    const mapped: any = { ...payload };
    if (mapped.method) mapped.method = String(mapped.method).toUpperCase();
    const res = await api.put(`/api/permissions/${id}`, mapped);
    return res.data;
  }

  async deletePermission(id: number): Promise<boolean> {
    const res = await api.delete(`/api/permissions/${id}`);
    return res.status === 200 || res.status === 204;
  }
}

export const permissionService = new PermissionService();