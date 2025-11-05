import api from "../interceptors/axiosInterceptor.ts";
import type { Device } from "../models/Device";

// Helpers to map between frontend and backend field names
function toApiPayload(payload: Partial<Device>) {
	const body: any = {};
	if (payload.name !== undefined) body.name = payload.name;
	if (payload.ip !== undefined) body.ip = payload.ip;
	if (payload.operatingSystem !== undefined)
		body.operating_system = payload.operatingSystem;
	return body;
}

class DeviceService {
	async getDevicesByUser(userId: number): Promise<Device[]> {
		const res = await api.get(`/api/devices/user/${userId}`);
		// map operating_system -> operatingSystem
		return (res.data || []).map((d: any) => ({
			id: d.id,
			name: d.name,
			ip: d.ip,
			operatingSystem: d.operating_system ?? d.operatingSystem ?? d.operating_system,
		}));
	}

	async createDevice(userId: number, payload: Partial<Device>): Promise<Device> {
		const res = await api.post(`/api/devices/user/${userId}`, toApiPayload(payload));
		const d = res.data;
		return {
			id: d.id,
			name: d.name,
			ip: d.ip,
			operatingSystem: d.operating_system ?? d.operatingSystem,
		} as Device;
	}

	async updateDevice(id: number, payload: Partial<Device>): Promise<Device> {
		const res = await api.put(`/api/devices/${id}`, toApiPayload(payload));
		const d = res.data;
		return {
			id: d.id,
			name: d.name,
			ip: d.ip,
			operatingSystem: d.operating_system ?? d.operatingSystem,
		} as Device;
	}

	async deleteDevice(id: number): Promise<void> {
		await api.delete(`/api/devices/${id}`);
	}
}

export const deviceService = new DeviceService();
