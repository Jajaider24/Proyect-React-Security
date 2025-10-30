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
        {/* UI dropdown (Tailwind / Material UI / Bootstrap) */}
        <UIDropdown />

        {/* Theme toggle (simple, SRP: uses useTheme hook) */}
        <ThemeToggle />
      </div>
    </header>
  );
}

function UIDropdown() {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const items = [
    { id: "tailwind", label: "Tailwind" },
    { id: "mui", label: "Material UI" },
    { id: "bootstrap", label: "Bootstrap" },
  ];
  const itemRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const [focusIndex, setFocusIndex] = React.useState<number>(-1);

  React.useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocumentClick);
    return () => document.removeEventListener("click", onDocumentClick);
  }, []);

  React.useEffect(() => {
    if (open) {
      setFocusIndex(0);
      // focus first item when menu opens
      setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 0);
    } else {
      setFocusIndex(-1);
      // return focus to button
      buttonRef.current?.focus();
    }
  }, [open]);

  const onButtonKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(true);
    }
  };

  const onMenuKeyDown = (e: React.KeyboardEvent) => {
    const max = items.length - 1;
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = focusIndex >= max ? 0 : focusIndex + 1;
      setFocusIndex(next);
      itemRefs.current[next]?.focus();
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = focusIndex <= 0 ? max : focusIndex - 1;
      setFocusIndex(prev);
      itemRefs.current[prev]?.focus();
      return;
    }
    if (e.key === "Home") {
      e.preventDefault();
      setFocusIndex(0);
      itemRefs.current[0]?.focus();
      return;
    }
    if (e.key === "End") {
      e.preventDefault();
      setFocusIndex(max);
      itemRefs.current[max]?.focus();
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      // trigger current focused item
      const idx = focusIndex;
      if (idx >= 0 && itemRefs.current[idx]) {
        itemRefs.current[idx]?.click();
      }
      return;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onButtonKeyDown}
        className="px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:opacity-90 transition-colors focus:outline-none"
        aria-haspopup="menu"
        aria-expanded={open}
        title="UI libraries"
      >
        UI
      </button>

      {open && (
        <div
          role="menu"
          aria-label="UI libraries"
          onKeyDown={onMenuKeyDown}
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50"
        >
          <ul className="py-1">
            {items.map((it, i) => (
              <li key={it.id}>
                <button
                  role="menuitem"
                  ref={((el: HTMLButtonElement | null) => {
                    itemRefs.current[i] = el;
                  }) as React.Ref<HTMLButtonElement>}
                  onClick={() => {
                    console.log(`${it.label} clicked (no action)`);
                    setOpen(false);
                  }}
                  tabIndex={-1}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
