import React from "react";
import SidebarItem from "./SidebarItem.tsx";

export function Sidebar({
  collapsed,
  onToggle,
  onSelectModel,
}: {
  collapsed: boolean;
  onToggle: () => void;
  // now the sidebar will pass route paths (e.g. '/users') to the parent
  onSelectModel?: (route: string) => void;
}) {
  const items = [
    { label: "Users", route: "/users" },
    { label: "Roles", route: "/roles" },
    { label: "Permissions", route: "/permissions" },
  ];

  const handleClick = (route: string) => {
    if (onSelectModel) onSelectModel(route);
  };

  return (
    <aside
      className={`bg-white dark:bg-gray-900 dark:border-gray-700 border-r border-gray-200 p-4 h-screen transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary dark:text-white">
          {collapsed ? "S" : "SECURITY"}
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
          {items.map((it) => (
            <SidebarItem
              key={it.route}
              id={`sidebar-${it.label.toLowerCase()}`}
              label={it.label}
              collapsed={collapsed}
              onClick={() => handleClick(it.route)}
            />
          ))}
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