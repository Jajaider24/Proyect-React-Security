import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Navbar.tsx";
import { Sidebar } from "../components/Sidebar.tsx";
import userService from "../services/userService.ts";


interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    userService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray5 dark:bg-black2 dark:text-white flex">
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        onSelectModel={(routeOrName) => {
          // If Sidebar passes a route (starts with '/'), navigate directly.
          if (routeOrName && routeOrName.startsWith("/")) {
            navigate(routeOrName);
          } else {
            navigate(`/models/${routeOrName?.toLowerCase()}`);
          }
        }}
      />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
  <Header title="Sistema de Seguridad de Usuarios" onLogout={handleLogout} />

        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
