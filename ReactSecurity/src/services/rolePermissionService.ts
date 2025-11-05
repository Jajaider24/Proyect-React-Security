import api from "../interceptors/axiosInterceptor.ts";

export interface RolePermission {
  id: string;
  role_id: number;
  permission_id: number;
  created_at?: string;
  updated_at?: string;
}

class RolePermissionService {
  async getByRole(roleId: number): Promise<RolePermission[]> {
    const res = await api.get(`/api/role-permissions/role/${roleId}`);
    return res.data;
  }

  async assign(roleId: number, permissionId: number): Promise<RolePermission> {
    const res = await api.post(`/api/role-permissions/role/${roleId}/permission/${permissionId}`, {});
    return res.data;
  }

  async unassign(roleId: number, permissionId: number): Promise<boolean> {
    const res = await api.delete(`/api/role-permissions/role/${roleId}/permission/${permissionId}`);
    return res.status === 200 || res.status === 204;
  }
}

export const rolePermissionService = new RolePermissionService();
