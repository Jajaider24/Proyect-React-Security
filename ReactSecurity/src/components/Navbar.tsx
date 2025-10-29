// src/components/layout/Header.tsx

import React from "react";
import useTheme from "../hooks/useTheme.ts";

interface HeaderProps {
  title: string;
  onCreate?: () => void;
  onList?: () => void;
  onLogout?: () => void;
  // Permitir el callback que usa DashboardLayout
  onChangeView?: (v: "crear" | "listar") => void;
}

export function Header({ title, onCreate, onList, onLogout, onChangeView }: HeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>

      <div className="flex items-center gap-3">
        <HeaderButton
          onClick={() => {
            onCreate?.();
            onChangeView?.("crear");
          }}
          variant="primary"
        >
          Crear solicitud
        </HeaderButton>

        <HeaderButton
          onClick={() => {
            onList?.();
            onChangeView?.("listar");
          }}
          variant="secondary"
        >
          Mis solicitudes
        </HeaderButton>

        <HeaderButton
          onClick={() => {
            onLogout?.();
          }}
          variant="danger"
        >
          Cerrar sesión
        </HeaderButton>
        {/* Theme toggle (simple, SRP: uses useTheme hook) */}
        <ThemeToggle />
      </div>
    </header>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
    >
      <span className="sr-only">{theme === "dark" ? "Activar modo claro" : "Activar modo oscuro"}</span>
      {theme === "dark" ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <line x1="12" y1="2" x2="12" y2="6" />
          <line x1="12" y1="18" x2="12" y2="22" />
          <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
          <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
          <line x1="2" y1="12" x2="6" y2="12" />
          <line x1="18" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
          <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
        </svg>
      )}
    </button>
  );
}

// 👇 Componente reutilizable (SRP)
interface HeaderButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant: "primary" | "secondary" | "danger";
}

function HeaderButton({ onClick, children, variant }: HeaderButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded-md text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-primary text-white hover:bg-blue-600 focus:ring-primary",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
  };

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
}
