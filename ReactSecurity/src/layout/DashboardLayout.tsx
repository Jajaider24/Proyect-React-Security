//layout/DashboardLayout.tsx
import { useState } from "react";
import { Header } from "../components/Navbar.tsx";
import { Sidebar } from "../components/Sidebar.tsx";

interface DashboardLayoutProps {
  children: React.ReactNode;
  onChangeView: (view: "crear" | "listar") => void;
}

export function DashboardLayout({ children, onChangeView }: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray5 flex">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col">
        <Header title="SG Tickets" onChangeView={onChangeView} />
        <main className="p-6 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}