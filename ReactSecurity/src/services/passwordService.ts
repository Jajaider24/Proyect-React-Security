import api from "../interceptors/axiosInterceptor.ts";
import { Password } from "../models/Password";

class PasswordService {
  async getPasswords(): Promise<Password[]> {
    const res = await api.get("/api/passwords/");
    return res.data;
  }

  async getPasswordById(id: number): Promise<Password> {
    const res = await api.get(`/api/passwords/${id}`);
    return res.data;
  }

  async getPasswordsByUser(userId: number): Promise<Password[]> {
    const res = await api.get(`/api/passwords/user/${userId}`);
    return res.data;
  }

  async createPassword(userId: number, payload: Partial<Password>): Promise<Password> {
    const res = await api.post(`/api/passwords/user/${userId}`, payload);
    return res.data;
  }

  async updatePassword(id: number, payload: Partial<Password>): Promise<Password> {
    const res = await api.put(`/api/passwords/${id}`, payload);
    return res.data;
  }

  async deletePassword(id: number): Promise<void> {
    await api.delete(`/api/passwords/${id}`);
  }
}

export const passwordService = new PasswordService();