export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {

  return (
    <aside
      className={`bg-white border-r border-gray-200 p-4 h-screen transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary">
          {collapsed ? "👤" : "Mi perfil"}
        </h2>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-primary text-sm"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {!collapsed && (
        <div className="text-sm space-y-2 text-gray-600 overflow-y-auto flex-1">
          <p><span className="font-medium text-gray-800">Nombre: </span></p>
          <p><span className="font-medium text-gray-800">Apellidos: </span></p>
          <p><span className="font-medium text-gray-800">Cédula: </span></p>
          <p><span className="font-medium text-gray-800">Rol: </span></p>
          <p><span className="font-medium text-gray-800">Sexo: </span></p>
          <p><span className="font-medium text-gray-800">Teléfono: </span></p>
          <p><span className="font-medium text-gray-800">Dependencia: </span> </p>
        </div>
      )}

      {!collapsed && (
        <div className="text-xs text-gray-400 text-center mt-4">
          SG Tickets © 2025
        </div>
      )}
    </aside>
  );
}