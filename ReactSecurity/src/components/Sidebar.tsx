export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {

  return (
    <aside
      className={`bg-white dark:bg-gray-900 dark:border-gray-700 border-r border-gray-200 p-4 h-screen transition-all duration-300 flex flex-col justify-between ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-primary dark:text-white">
          {collapsed ? "👤" : "USUARIO"}
        </h2>
        <button
          onClick={onToggle}
          className="text-gray-400 dark:text-gray-300 hover:text-primary text-sm"
        >
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {!collapsed && (
        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-300 overflow-y-auto flex-1">
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Nombre: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Apellidos: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Cédula: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Rol: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Sexo: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Teléfono: </span></p>
          <p><span className="font-medium text-gray-800 dark:text-gray-100">Dependencia: </span> </p>
        </div>
      )}

      {!collapsed && (
        <div className="text-xs text-gray-400 dark:text-gray-400 text-center mt-4">
          SG Tickets © 2025
        </div>
      )}
    </aside>
  );
}