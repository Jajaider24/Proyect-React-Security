import api from "../interceptors/axiosInterceptor.ts";

export interface Permission {
  id?: number;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  
}

class PermissionService {
  async getPermissions(): Promise<Permission[]> {
    const res = await api.get("api/permissions");
    return res.data;
  }

  async getPermissionById(id: number): Promise<Permission> {
    const res = await api.get(`api/permissions/${id}`);
    return res.data;
  }

async createPermission(payload: any): Promise<any> {
  console.log("🔍 Payload recibido:", JSON.stringify(payload, null, 2));
  
  // Verificaciones
  if (!payload.url) {
    throw new Error("La URL es requerida");
  }
  if (!payload.method) {
    throw new Error("El método es requerido");
  }

  // Aseguramos que el método esté en mayúsculas
  const method = payload.method.toUpperCase();


  // Enviamos ambos campos (url y entity) para cubrir ambos casos
  const mappedPayload = {
    url: payload.url,
    entity: payload.url,
    method: method,
   
  };

  console.log("➡ Enviando permiso al backend:", JSON.stringify(mappedPayload, null, 2));

  const res = await api.post("api/permissions/", mappedPayload, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  console.log("✅ Respuesta del backend:", JSON.stringify(res.data, null, 2));
  return res.data;
}




  async updatePermission(id: number, payload: Permission): Promise<Permission> {
    const res = await api.put(`api/permissions/${id}`, payload);
    return res.data;
  }

  async deletePermission(id: number): Promise<boolean> {
    const res = await api.delete(`api/permissions/${id}`);
    return res.status === 200 || res.status === 204;
  }
}

export const permissionService = new PermissionService();