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
  const [view, setView] = useState<"crear" | "listar">("listar");
  const navigate = useNavigate();

  const handleLogout = () => {
    userService.logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray5 dark:bg-black2 dark:text-white flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
  <Header title="Sistema de Seguridad de Usuarios" onChangeView={setView} onLogout={handleLogout} />

        <main className="p-6 flex-1 overflow-y-auto">
          {view === "crear" ? (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2 text-primary dark:text-white">Crear Solicitud</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá el formulario de creación.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2 text-primary dark:text-white">Mis Solicitudes</h2>
              <p className="text-gray-600 dark:text-gray-300">Aquí irá la lista de solicitudes.</p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
