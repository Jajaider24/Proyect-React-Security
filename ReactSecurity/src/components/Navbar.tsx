interface HeaderProps {
  title: string;
  onChangeView: (view: "crear" | "listar") => void;
}

export function Header({ title, onChangeView }: HeaderProps) {


  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-primary">{title}</h1>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChangeView("crear")}
          className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-blue-600 transition"
        >
          Crear solicitud
        </button>
        <button
          onClick={() => onChangeView("listar")}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition"
        >
          Mis solicitudes
        </button>
        <button
          className="px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
}