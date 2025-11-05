import api from "../interceptors/axiosInterceptor.ts";

export interface DigitalSignaturePayload { photo: File }

class DigitalSignatureService {
	async getSignatureByUser(userId: number): Promise<any | null> {
		try {
			const res = await api.get(`/api/digital-signatures/user/${userId}`);
			return res.data ?? null;
		} catch (err: any) {
			if (err?.response?.status === 404) return null; // normalizar a estado vacío
			throw err;
		}
	}

	async createSignature(userId: number, photo: File): Promise<any> {
		const fd = new FormData();
		fd.append("photo", photo);
		const res = await api.post(`/api/digital-signatures/user/${userId}`, fd);
		return res.data;
	}

	async updateSignature(id: number, photo: File): Promise<any> {
		const fd = new FormData();
		fd.append("photo", photo);
		const res = await api.put(`/api/digital-signatures/${id}`, fd);
		return res.data;
	}
}

export const digitalSignatureService = new DigitalSignatureService();

