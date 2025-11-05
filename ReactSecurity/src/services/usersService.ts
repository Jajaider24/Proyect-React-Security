// src/services/usersService.ts
import api from "../interceptors/axiosInterceptor.ts";
import { User } from "../models/User.ts";
import { userRoleService } from "./userRolesService.ts";

/**
 * Servicio principal de usuarios - SIEMPRE usa la API real.
 * Eliminamos el modo mock para evitar datos no persistentes e inconsistencias.
 */
class UserService {
  async getUsers(): Promise<User[]> {
    const res = await api.get("/api/users/");
    return res.data;
  }

  async getUserById(id: number): Promise<User> {
    const res = await api.get(`/api/users/${id}`);
    return res.data;
  }

  async createUser(payload: Partial<User>): Promise<User> {
    // Usa ruta con slash final para evitar redirects 308 en POST
    const res = await api.post("/api/users/", payload);
    return res.data;
  }

  async updateUser(id: number, payload: Partial<User>): Promise<User> {
    const res = await api.put(`/api/users/${id}`, payload);
    return res.data;
  }

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/api/users/${id}`);
  }

  /**
   * Crea un usuario y asigna roles utilizando el servicio real de user-roles del backend.
   */
  async createUserWithRoles(payload: Partial<User>, roles: number[]) {
    const createdUser = await this.createUser(payload);
    const userRoles: any[] = [];
    for (const roleId of roles) {
      try {
        const relation = await userRoleService.assign(createdUser.id!, roleId, {});
        userRoles.push(relation);
      } catch (error) {
        console.warn(`Error assigning role ${roleId} to user ${createdUser.id}:`, error);
      }
    }
    return { user: createdUser, userRoles };
  }
}

export const userService = new UserService();