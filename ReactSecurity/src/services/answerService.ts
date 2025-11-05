import api from "../interceptors/axiosInterceptor.ts";
import type { Answer } from "../models/Answer.ts";

class AnswerService {
  async getByUser(userId: number): Promise<Answer[]> {
    const res = await api.get(`/api/answers/user/${userId}`);
    return res.data;
  }
  async getByQuestion(questionId: number): Promise<Answer[]> {
    const res = await api.get(`/api/answers/question/${questionId}`);
    return res.data;
  }
  async getByUserAndQuestion(userId: number, questionId: number): Promise<Answer | null> {
    try {
      const res = await api.get(`/api/answers/user/${userId}/question/${questionId}`);
      return res.data;
    } catch (err: any) {
      if (err?.response?.status === 404) return null;
      throw err;
    }
  }
  async create(userId: number, questionId: number, payload: { content: string }): Promise<Answer> {
    if (!payload?.content?.trim()) throw new Error("El contenido es requerido");
    const res = await api.post(`/api/answers/user/${userId}/question/${questionId}`, { content: payload.content.trim() });
    return res.data;
  }
  async update(id: number, payload: { content: string }): Promise<Answer> {
    const res = await api.put(`/api/answers/${id}`, { content: String(payload.content || "") });
    return res.data;
  }
  async delete(id: number): Promise<boolean> {
    const res = await api.delete(`/api/answers/${id}`);
    return res.status === 200 || res.status === 204;
  }
}

export const answerService = new AnswerService();
