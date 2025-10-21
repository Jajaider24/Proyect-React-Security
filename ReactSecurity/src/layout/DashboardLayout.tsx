import { useState } from "react";
import { Header } from "../components/Navbar.tsx";
import { Sidebar } from "../components/Sidebar.tsx";


interface DashboardLayoutProps {
  children?: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [view, setView] = useState<"crear" | "listar">("listar");

  return (
    <div className="min-h-screen bg-gray5 flex">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      {/* Contenedor principal */}
      <div className="flex-1 flex flex-col">
        <Header title="SG Tickets" onChangeView={setView} />

        <main className="p-6 flex-1 overflow-y-auto">
          {view === "crear" ? (
            <div className="bg-white rounded-md shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2 text-primary">Crear Solicitud</h2>
              <p className="text-gray-600">Aquí irá el formulario de creación.</p>
            </div>
          ) : (
            <div className="bg-white rounded-md shadow-md p-4">
              <h2 className="text-lg font-semibold mb-2 text-primary">Mis Solicitudes</h2>
              <p className="text-gray-600">Aquí irá la lista de solicitudes.</p>
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
