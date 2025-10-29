import React from "react";
import { useLocation } from "react-router-dom";

export function Sidebar({
  collapsed,
  onToggle,
  onSelectModel,
}: {
  collapsed: boolean;
  onToggle: () => void;
  onSelectModel?: (modelName: string) => void;
}) {
  // Lista de modelos basada en los archivos de src/models (sin extensión)
  const models = [
    "Address",
    "Answer",
    "Device",
    "DigitalSignature",
    "Password",
    "Permission",
    "Profile",
    "Role",
    "RolePermission",
    "SecurityQuestion",
    "Session",
    "User",
    "UserRole",
  ];

  const location = useLocation();

  const handleModelClick = (name: string) => {
    if (onSelectModel) onSelectModel(name);
    else console.log("Modelo seleccionado:", name);
  };

  const isModelActive = (name: string) => {
    const path = location.pathname.toLowerCase();
    return path.includes(`/models/${name.toLowerCase()}`);
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 dark:border-gray-700 border-r border-gray-200 p-4 h-screen transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary dark:text-white">
          {collapsed ? "�" : "MODELOS"}
        </h2>
        <button
          onClick={onToggle}
          className="text-gray-400 dark:text-gray-300 hover:text-primary text-sm"
          aria-label={collapsed ? "Abrir sidebar" : "Cerrar sidebar"}
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <nav className="space-y-2">
          {models.map((m) => {
            const active = isModelActive(m);
            return (
              <button
                key={m}
                onClick={() => handleModelClick(m)}
                title={m}
                className={`flex items-center w-full text-left px-3 py-2 rounded transition-colors text-sm focus:outline-none ${
                  collapsed ? "justify-center" : "justify-start"
                } ${
                  active
                    ? "bg-primary text-white dark:bg-primary"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-100"
                }`}
                aria-current={active ? "page" : undefined}
              >
                {/* Cuando está colapsado mostramos sólo la inicial */}
                <span className="font-medium">
                  {collapsed ? m.charAt(0) : m}
                </span>
              </button>
            );
          })}

          {/* (UI buttons moved to Navbar as a dropdown) */}
        </nav>
      </div>

      {!collapsed && (
        <div className="text-xs text-gray-400 dark:text-gray-400 text-center mt-4">
          SG Tickets © 2025
        </div>
      )}
    </aside>
  );
}