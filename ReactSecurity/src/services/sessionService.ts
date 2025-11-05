import api from "../interceptors/axiosInterceptor.ts";
import type { Session } from "../models/Session";

// Backend expects expiration as string "%Y-%m-%d %H:%M:%S"
function formatDateTime(dt: string | Date | undefined | null): string | undefined {
	if (!dt) return undefined;
	const d = typeof dt === "string" ? new Date(dt) : dt;
	if (Number.isNaN(d.getTime())) return undefined;
	const pad = (n: number) => String(n).padStart(2, "0");
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

class SessionService {
	async getSessionsByUser(userId: number): Promise<Session[]> {
		const res = await api.get(`/api/sessions/user/${userId}`);
		return (res.data || []).map((s: any) => ({
			id: s.id,
			token: s.token,
			expiration: s.expiration,
			FACode: s.FACode,
			state: s.state,
		}));
	}

		async createSession(
			userId: number,
			payload: Partial<Omit<Session, "expiration">> & { expiration?: string | Date }
		): Promise<Session> {
		const body: any = {
			token: payload.token,
			expiration: formatDateTime(payload.expiration) || formatDateTime(new Date(Date.now() + 24 * 60 * 60 * 1000)),
			FACode: payload.FACode,
			state: payload.state || "active",
		};
		const res = await api.post(`/api/sessions/user/${userId}`, body);
		return res.data;
	}

		async updateSession(
			id: string,
			payload: Partial<Omit<Session, "expiration">> & { expiration?: string | Date }
		): Promise<Session> {
		const body: any = {
			token: payload.token,
			expiration: formatDateTime(payload.expiration),
			FACode: payload.FACode,
			state: payload.state,
		};
		const res = await api.put(`/api/sessions/${id}`, body);
		return res.data;
	}

	async deleteSession(id: string): Promise<void> {
		await api.delete(`/api/sessions/${id}`);
	}
}

export const sessionService = new SessionService();
