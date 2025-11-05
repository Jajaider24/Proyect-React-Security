import api from "../interceptors/axiosInterceptor.ts";
import { Address } from "../models/Address"; // ✅ el modelo viene de models, no se define aquí

class AddressService {
  async getAddresses(): Promise<Address[]> {
    const res = await api.get("/api/addresses/");
    return res.data;
  }

  async getAddressById(id: number): Promise<Address> {
    const res = await api.get(`/api/addresses/${id}`);
    return res.data;
  }

  async getAddressesByUser(userId: number): Promise<Address[]> {
    try {
      const res = await api.get(`/api/addresses/user/${userId}`);
      // Backend devuelve un único objeto o 404; normalizamos a lista
      const data = res.data;
      if (Array.isArray(data)) return data;
      return data ? [data] : [];
    } catch (err: any) {
      if (err?.response?.status === 404) {
        // No address for this user → devolver lista vacía en vez de lanzar error
        return [];
      }
      throw err;
    }
  }

  async createAddress(userId: number, payload: Partial<Address>): Promise<Address> {
    const res = await api.post(`/api/addresses/user/${userId}`, payload);
    return res.data;
  }

  async updateAddress(id: number, payload: Partial<Address>): Promise<Address> {
    const res = await api.put(`/api/addresses/${id}`, payload);
    return res.data;
  }

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/api/addresses/${id}`);
  }
}

export const addressService = new AddressService();