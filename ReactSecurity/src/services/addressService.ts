import api from "../interceptors/axiosInterceptor";
import { Address } from "../models/Address"; // ✅ el modelo viene de models, no se define aquí

class AddressService {
  async getAddresses(): Promise<Address[]> {
    const res = await api.get("/api/addresses");
    return res.data;
  }

  async getAddressById(id: number): Promise<Address> {
    const res = await api.get(`/api/addresses/${id}`);
    return res.data;
  }

  async getAddressesByUser(userId: number): Promise<Address[]> {
    const res = await api.get(`/api/addresses/user/${userId}`);
    return res.data;
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