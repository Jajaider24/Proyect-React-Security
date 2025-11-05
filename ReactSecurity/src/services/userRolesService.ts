import api from "../interceptors/axiosInterceptor.ts";

// Helper: format datetime-local or Date to "%Y-%m-%d %H:%M:%S"
function fmt(dt?: string | Date | null): string | undefined {
  if (!dt) return undefined;
  const d = typeof dt === "string" ? new Date(dt) : dt;
  if (Number.isNaN(d.getTime())) return undefined;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export type UserRoleRecord = {
  id: string;
  user_id: number;
  role_id: number;
  startAt?: string;
  endAt?: string;
  created_at?: string;
  updated_at?: string;
};

class UserRolesService {
  async getByUser(userId: number): Promise<UserRoleRecord[]> {
    const res = await api.get(`/api/user-roles/user/${userId}`);
    return res.data || [];
  }

  async assign(userId: number, roleId: number, payload: { startAt?: string | Date; endAt?: string | Date }): Promise<UserRoleRecord> {
    const body: any = { startAt: fmt(payload.startAt), endAt: fmt(payload.endAt) };
    const res = await api.post(`/api/user-roles/user/${userId}/role/${roleId}`, body);
    return res.data;
  }

  async unassign(userRoleId: string): Promise<void> {
    await api.delete(`/api/user-roles/${userRoleId}`);
  }
}

export const userRoleService = new UserRolesService();
export default userRoleService;
