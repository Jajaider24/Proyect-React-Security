// src/components/layout/Header.tsx

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
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
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
      </div>
    </header>
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
