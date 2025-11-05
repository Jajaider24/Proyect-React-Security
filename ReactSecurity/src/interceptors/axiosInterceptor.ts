// src/services/axiosInterceptor.ts
import axios from "axios";
import SecurityService from "../services/securityService.ts";
// Allow access to process.env injected by CRA without requiring @types/node
declare const process: any;


/**
 * axiosInterceptor
 * Configura axios para:
 *  - Leer la URL base desde VITE_API_URL (.env)
 *  - Inyectar automáticamente el token de Firebase (o backend)
 *  - Manejar errores 401 globalmente
 */

const api = axios.create({
  // Use CRA env var; import.meta.env is Vite-specific and undefined in CRA.
  baseURL: (process as any).env.REACT_APP_API_URL || "",
});

// ✅ Interceptor de solicitud: agrega token si existe
api.interceptors.request.use(
  (config) => {
    const token = SecurityService.getToken();

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      // para depuración:
      console.log("🛰 Enviando request con token:", token.substring(0, 20) + "...");
    } else {
      console.warn("⚠ No hay token disponible, se enviará sin autenticación.");
    }

    // Asegurar Content-Type correcto: si enviamos FormData, dejar que el navegador ponga el boundary
    const isFormData = (value: any) =>
      typeof FormData !== "undefined" && value instanceof FormData;

    if (isFormData((config as any).data)) {
      // Eliminar Content-Type para que axios/navegador establezca multipart/form-data con boundary
      if (config.headers && "Content-Type" in config.headers) {
        delete (config.headers as any)["Content-Type"];
      }
    } else if (!config.headers || !("Content-Type" in config.headers)) {
      // Para objetos JSON normales, axios lo pondrá automáticamente; no forzar nada aquí
      // Dejar sin Content-Type explícito a menos que el caller lo haya indicado
    }

    return config;
  },
  (error) => {
    console.error("❌ Error en configuración de la solicitud:", error);
    return Promise.reject(error);
  }
);

// ✅ Interceptor de respuesta: maneja errores globales
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.warn("🔒 Token inválido o expirado. Cerrando sesión...");
        SecurityService.logout();
        // podrías redirigir al login si usas React Router:
        // window.location.href = "/login";
      } else {
        console.error(`❌ Error HTTP ${status}:`, error.response.data);
      }
    } else if (error.request) {
      console.error("🚨 No se recibió respuesta del servidor:", error.request);
    } else {
      console.error("⚙ Error en la configuración de Axios:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;