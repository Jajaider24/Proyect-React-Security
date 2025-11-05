import api from "../interceptors/axiosInterceptor.ts";
import type { SecurityQuestion } from "../models/SecurityQuestion.ts";

class SecurityQuestionService {
  async getAll(): Promise<SecurityQuestion[]> {
    const res = await api.get("/api/security-questions/");
    return res.data;
  }
  async getById(id: number): Promise<SecurityQuestion> {
    const res = await api.get(`/api/security-questions/${id}`);
    return res.data;
  }
  async create(payload: { name: string; description?: string }): Promise<SecurityQuestion> {
    if (!payload?.name?.trim()) throw new Error("El nombre es requerido");
    const res = await api.post("/api/security-questions/", { name: payload.name.trim(), description: payload.description || "" });
    return res.data;
  }
  async update(id: number, payload: Partial<SecurityQuestion>): Promise<SecurityQuestion> {
    const body: any = {};
    if (payload.name != null) body.name = String(payload.name);
    if (payload.description != null) body.description = String(payload.description);
    const res = await api.put(`/api/security-questions/${id}`, body);
    return res.data;
  }
  async delete(id: number): Promise<boolean> {
    const res = await api.delete(`/api/security-questions/${id}`);
    return res.status === 200 || res.status === 204;
  }
}

export const securityQuestionService = new SecurityQuestionService();
