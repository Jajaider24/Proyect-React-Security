// src/services/securityService.ts
import api from "../interceptors/axiosInterceptor.ts";
import type { User } from "../models/User";
import { store } from "../store/store.ts";
import { setUser } from "../store/userSlice.ts";
// Allow access to process.env injected by CRA without requiring @types/node
declare const process: any;

/**
 * SecurityService
 * - Centraliza manejo de token y usuario en localStorage.
 * - Permite login normal y login OAuth (Google/GitHub) con backend.
 * - Diseñado para coexistir con autenticación de Firebase sin conflictos.
 */
class SecurityService extends EventTarget {
  // Use same token key used across the app (auth_token)
  private readonly KEY = "auth_token";
  private user: Partial<User> = {};
  // Use CRA environment variable prefix REACT_APP_ (import.meta is for Vite)
  private readonly API_URL = process.env.REACT_APP_API_URL || "";

  constructor() {
    super();
    const raw = localStorage.getItem("user");
    if (raw) {
      try {
        this.user = JSON.parse(raw) as Partial<User>;
      } catch {
        this.user = {};
      }
    }
  }

  /**
   * 🔹 Login clásico (usuario y contraseña)
   */
  async login(payload: { email?: string; password?: string }) {
    const res = await api.post("/login", payload, {
      headers: { "Content-Type": "application/json" },
    });
    const data = res.data;
    const backendUser = data?.user ?? null;
    const token = data?.token ?? null;

    if (token) this.setToken(token);
    if (backendUser) this.setUserLocal(backendUser);

    return data;
  }

  /**
   * 🔹 Login con Google (OAuth)
   * Envía el idToken de Firebase al backend /login/google
   */
  async loginWithGoogle(idToken: string) {
    return await this._loginWithOAuth(idToken, "google");
  }

  /**
   * 🔹 Login con GitHub (OAuth)
   * Envía el idToken de Firebase al backend /login/github
   */
  async loginWithGitHub(idToken: string) {
    return await this._loginWithOAuth(idToken, "github");
  }

  /**
   * 🔸 Función privada reutilizada para ambos proveedores OAuth
   */
  private async _loginWithOAuth(idToken: string, provider: string) {
    try {
      console.log(`📡 Enviando ID token de ${provider} al backend...`);
      const response = await api.post(`/login/${provider}`, { idToken });

      const data = response.data;
      const backendUser = data?.user ?? null;
      const token = data?.token ?? null;

      if (token) this.setToken(token);
      if (backendUser) this.setUserLocal(backendUser);

      console.log(`✅ Login con ${provider} validado en backend:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error durante login con ${provider}:`, error);
      throw error;
    }
  }

  // ===================================================================

  setToken(token: string | null) {
    if (!token) {
      localStorage.removeItem(this.KEY);
    } else {
      localStorage.setItem(this.KEY, token);
    }
    this.dispatchEvent(new CustomEvent("tokenChange", { detail: token }));
  }

  setUserLocal(u: Partial<User> | null) {
    if (u) {
      try {
        localStorage.setItem("user", JSON.stringify(u));
        this.user = u;
      } catch {
        this.user = u;
      }
    } else {
      localStorage.removeItem("user");
      this.user = {};
    }

    try {
      store.dispatch(setUser((u as unknown as User) ?? null));
    } catch {}

    this.dispatchEvent(new CustomEvent("userChange", { detail: u }));
  }

  getToken(): string | null {
    return localStorage.getItem(this.KEY);
  }

  getUser(): Partial<User> | null {
    const raw = localStorage.getItem("user");
    if (!raw) return this.user || null;
    try {
      return JSON.parse(raw) as Partial<User>;
    } catch {
      return this.user || null;
    }
  }

  logout() {
    try {
      localStorage.removeItem(this.KEY);
      localStorage.removeItem("user");
    } catch {}
    this.user = {};
    try {
      store.dispatch(setUser(null));
    } catch {}
    this.dispatchEvent(new CustomEvent("userChange", { detail: null }));
  }
}

const securityService = new SecurityService();
export default securityService;