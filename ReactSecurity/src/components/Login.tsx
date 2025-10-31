import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import userService from "../services/userService.ts";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string }>({ show: false, message: "" });

  // Auto-hide toast after a short delay
  useEffect(() => {
    if (!toast.show) return;
    const t = setTimeout(() => setToast({ show: false, message: "" }), 2500);
    return () => clearTimeout(t);
  }, [toast.show]);

  const getErrorMessage = (err: unknown) => {
    if (!err) return "Error al iniciar sesión";
    if (err instanceof Error) return err.message;
    try {
      return String(err);
    } catch {
      return "Error al iniciar sesión";
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await userService.login(username, password);
      // show success toast then navigate so user sees confirmation
      setToast({ show: true, message: "Inicio de sesión exitoso" });
      await new Promise((res) => setTimeout(res, 700));
      navigate("/demo", { replace: true });
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-12">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: illustration / branding */}
        <div className="hidden md:flex flex-col items-start justify-center p-8 rounded-lg text-white shadow-lg bg-white/5 backdrop-blur-sm border border-white/10">
          <h2 className="text-3xl font-bold mb-2">¡Bienvenido Felipe Buitrago!</h2>
          <p className="mb-6 opacity-90">Accede a tu panel de control y gestiona la seguridad de tus usuarios fácilmente.</p>
          <ul className="space-y-2 text-sm opacity-95">
            <li>• Gestión de perfiles y permisos</li>
            <li>• Sesiones y auditoría</li>
            <li>• Roles y permisos flexibles</li>
          </ul>
        </div>

        {/* Right: form (glass card, no white bg) */}
        <div className="relative rounded-lg p-8 bg-white/10 dark:bg-white/5 backdrop-blur-md border border-white/20 shadow-xl fade-in">
          {/* top progress indicator while loading */}
          {loading && (
            <div className="progress-wrap" aria-hidden>
              <div className="progress-bar" />
            </div>
          )}
          <h3 className="text-2xl font-semibold text-center mb-4 text-white">Iniciar sesión</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/90">Usuario o correo</label>
              <input
                type="text"
                placeholder="usuario@ejemplo.com"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-transparent bg-white/10 text-white placeholder-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/90">Contraseña</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-transparent bg-white/10 text-white placeholder-white/70 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
            </div>

            {error && <p className="text-sm text-red-300">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 text-white rounded-md btn-primary btn-icon disabled:opacity-60"
            >
              {loading ? (
                <svg className="svg-spinner" viewBox="0 0 24 24" aria-hidden>
                  <defs>
                    <linearGradient id="g1" x1="0%" x2="100%">
                      <stop offset="0%" stopColor="#fff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#ffd1f0" stopOpacity="0.9" />
                    </linearGradient>
                  </defs>
                  <circle cx="12" cy="12" r="8" stroke="url(#g1)" strokeDasharray="40" strokeDashoffset="10" fill="none" />
                </svg>
              ) : (
                <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 1a4 4 0 00-4 4v3H6a2 2 0 00-2 2v7a2 2 0 002 2h12a2 2 0 002-2v-7a2 2 0 00-2-2h-2V5a4 4 0 00-4-4z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}

              <span className="font-medium">{loading ? "Iniciando..." : "Iniciar sesión"}</span>
            </button>
          </form>

          <div className="mt-6">
            <p className="text-sm text-center text-white/80">o continúa con</p>

            <div className="mt-4 grid grid-cols-1 gap-3">
              <button
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await userService.loginWithMicrosoft();
                    setToast({ show: true, message: "Inicio de sesión exitoso" });
                    await new Promise((res) => setTimeout(res, 700));
                    navigate("/demo", { replace: true });
                  } catch (err: unknown) {
                    setError(getErrorMessage(err));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-white/20 rounded-md btn-social text-white transition"
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
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await userService.loginWithGitHub();
                    setToast({ show: true, message: "Inicio de sesión exitoso" });
                    await new Promise((res) => setTimeout(res, 700));
                    navigate("/demo", { replace: true });
                  } catch (err: unknown) {
                    setError(getErrorMessage(err));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-white/20 rounded-md btn-social text-white transition"
                aria-label="Continuar con GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.09-.75.08-.74.08-.74 1.2.08 1.83 1.24 1.83 1.24 1.07 1.84 2.8 1.31 3.48 1 .11-.78.42-1.31.76-1.61-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.3-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.47 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.82.58A12 12 0 0012 .5z" />
                </svg>
                <span className="text-sm font-medium">Continuar con GitHub</span>
              </button>
              <button
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await userService.loginWithGoogle();
                    setToast({ show: true, message: "Inicio de sesión exitoso" });
                    await new Promise((res) => setTimeout(res, 700));
                    navigate("/demo", { replace: true });
                  } catch (err: unknown) {
                    setError(getErrorMessage(err));
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-white/20 rounded-md btn-social text-white transition"
                aria-label="Continuar con Google"
              >
                <img src="/Google__G__logo.svg.png" alt="Google" className="w-5 h-5" />
                <span className="text-sm font-medium">Continuar con Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast (top centered, larger) */}
      <div aria-live="polite" className="fixed inset-0 pointer-events-none z-50">
        <div className="flex items-start justify-center pt-6 px-4">
          <div
            className={`pointer-events-auto transform transition-all duration-300 ease-out ${
              toast.show ? "opacity-100 -translate-y-0" : "opacity-0 -translate-y-6"
            }`}
          >
            <div className="flex items-center gap-3 max-w-md w-full toast-success px-6 py-3 rounded-lg shadow-2xl ring-1 ring-black/10">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <div className="text-left">
                <div className="text-lg font-semibold">{toast.message}</div>
                <div className="text-sm subtext">Has iniciado sesión correctamente.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
