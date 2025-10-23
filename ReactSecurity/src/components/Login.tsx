import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Usuario o correo</label>
          <input
            type="text"
            placeholder="Ingrese su usuario o correo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 px-3 py-2"
          />

          <label className="block text-sm font-medium text-gray-700 mt-3">Contraseña</label>
          <input
            type="password"
            placeholder="Ingrese su contraseña"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary/50 px-3 py-2"
          />

          <button
            type="button"
            className="mt-4 w-full bg-primary text-white py-2 rounded-md hover:bg-blue-600"
          >
            Iniciar sesión
          </button>
        </div>

        <div className="border-t pt-4 space-y-3">
          <p className="text-center text-sm text-gray-500">O iniciar con</p>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            <img src="/icons/microsoft.svg" alt="Microsoft" className="w-5 h-5" />
            <span className="text-sm font-medium">Continuar con Microsoft</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            <img src="/icons/github.svg" alt="GitHub" className="w-5 h-5" />
            <span className="text-sm font-medium">Continuar con GitHub</span>
          </button>

          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            <span className="text-sm font-medium">Continuar con Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
