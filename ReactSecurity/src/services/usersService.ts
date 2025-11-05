// src/services/usersService.ts
import api from "../lib/http.ts";
import { User } from "../models/User.ts";
import { userRoleService } from "./userRolesService.ts";

/**
 * Servicio principal de usuarios
 */
const API_BASE = ((globalThis as any)?.process?.env?.REACT_APP_API_URL as string) || "";

// Provide either a mock in-memory service (no API) or a real service backed by API.
let _userService: any;

if (!API_BASE) {
  let nextId = 1;
  const mockUsers: User[] = [
    { id: nextId++, name: "Admin User", email: "admin@example.com" },
    { id: nextId++, name: "Demo User", email: "demo@example.com" },
  ];

  _userService = {
    async getUsers(): Promise<User[]> {
      return Promise.resolve([...mockUsers]);
    },
    async getUserById(id: number): Promise<User | null> {
      return Promise.resolve(mockUsers.find((u) => u.id === id) || null);
    },
    async createUser(payload: Partial<User>): Promise<User> {
      const user: User = { id: nextId++, name: payload.name || "", email: payload.email || "" } as User;
      mockUsers.push(user);
      return Promise.resolve(user);
    },
    async updateUser(id: number, payload: Partial<User>): Promise<User | null> {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx === -1) return Promise.resolve(null);
      mockUsers[idx] = { ...mockUsers[idx], ...payload } as User;
      return Promise.resolve(mockUsers[idx]);
    },
    async deleteUser(id: number): Promise<void> {
      const idx = mockUsers.findIndex((u) => u.id === id);
      if (idx !== -1) mockUsers.splice(idx, 1);
      return Promise.resolve();
    },
    async createUserWithRoles(payload: Partial<User>, roles: number[]) {
      const user = await this.createUser(payload);
      const userRoles: any[] = [];
      for (const roleId of roles) {
        try {
          const relation = await userRoleService.createUserRole({ userId: user.id!, roleId });
          userRoles.push(relation);
        } catch (e) {
          // ignore per-user role failure in mock
        }
      }
      return { user, userRoles };
    },
  };
} else {
  class UserService {
    async getUsers(): Promise<User[]> {
      const res = await api.get("/api/users");
      return res.data;
    }

    async getUserById(id: number): Promise<User> {
      const res = await api.get(`/api/users/${id}`);
      return res.data;
    }

    async createUser(payload: Partial<User>): Promise<User> {
      const res = await api.post("/api/users", payload);
      return res.data;
    }

    async updateUser(id: number, payload: Partial<User>): Promise<User> {
      const res = await api.put(`/api/users/${id}`, payload);
      return res.data;
    }

    async deleteUser(id: number): Promise<void> {
      await api.delete(`/api/users/${id}`);
    }

    async createUserWithRoles(payload: Partial<User>, roles: number[]) {
      const createdUser = await this.createUser(payload);
      const userRoles: any[] = [];
      for (const roleId of roles) {
        try {
          const relation = await userRoleService.createUserRole({ userId: createdUser.id!, roleId });
          userRoles.push(relation);
        } catch (error) {
          console.warn(`Error assigning role ${roleId} to user ${createdUser.id}:`, error);
        }
      }
      return { user: createdUser, userRoles };
    }
  }

  _userService = new UserService();
}

export const userService = _userService;