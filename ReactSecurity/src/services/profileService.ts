import api from "../interceptors/axiosInterceptor.ts";
import type { Profile } from "../models/Profile.ts";

class ProfileService {
	async getProfileByUser(userId: number): Promise<Profile | null> {
		try {
			const res = await api.get(`/api/profiles/user/${userId}`);
			return res.data ?? null;
		} catch (err: any) {
			if (err?.response?.status === 404) return null; // normalizar a estado vacío
			throw err;
		}
	}

	async createProfile(userId: number, payload: { phone?: string; photo?: File | null }): Promise<Profile> {
		const fd = new FormData();
		if (payload.phone) fd.append("phone", payload.phone);
		if (payload.photo) fd.append("photo", payload.photo);
		const res = await api.post(`/api/profiles/user/${userId}`, fd, {
			headers: { /* Content-Type: multipart/form-data auto-set by browser */ },
		});
		return res.data;
	}

	async updateProfile(id: number, payload: { phone?: string; photo?: File | null }): Promise<Profile> {
		const fd = new FormData();
		if (payload.phone !== undefined) fd.append("phone", payload.phone);
		if (payload.photo) fd.append("photo", payload.photo);
		const res = await api.put(`/api/profiles/${id}`, fd, {
			headers: { /* multipart handled by axios/browser */ },
		});
		return res.data;
	}
}

export const profileService = new ProfileService();

