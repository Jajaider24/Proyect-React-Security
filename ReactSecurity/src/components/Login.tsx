import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService.ts";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: unknown) => {
    if (!err) return "Error al iniciar sesión";
    if (err instanceof Error) return err.message;
    try {
      return String(err);
    } catch {
      return "Error al iniciar sesión";
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await userService.login(username, password);
      // Redirigir al menú/dashboard (ruta ya envuelta en DashboardLayout en App.tsx)
      navigate("/demo", { replace: true });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Usuario o correo</label>
          <input
            type="text"
            placeholder="Ingrese su usuario o correo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 px-3 py-2"
          />

          <label className="block text-sm font-medium text-gray-700 mt-3">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 px-3 py-2"
          />

          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600 disabled:opacity-60"
          >
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
            aria-label="Continuar con Microsoft"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <rect x="3" y="3" width="8" height="8" fill="#F35325" />
              <rect x="13" y="3" width="8" height="8" fill="#81BC06" />
              <rect x="3" y="13" width="8" height="8" fill="#05A6F0" />
              <rect x="13" y="13" width="8" height="8" fill="#FFBA08" />
            </svg>
            <span className="text-sm font-medium">Continuar con Microsoft</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
            aria-label="Continuar con GitHub"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .5z" />
            </svg>
            <span className="text-sm font-medium">Continuar con GitHub</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
            aria-label="Continuar con Google"
          >
            <img src="/Google__G__logo.svg.png" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium">Continuar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
