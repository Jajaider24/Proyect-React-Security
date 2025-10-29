import React from "react";

export interface Action {
  name: string;
  label: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: (keyof T | string)[];
  actions?: Action[];
  onAction?: (name: string, item: T) => void;
}

/**
 * GenericTable: un componente reutilizable que muestra cualquier lista de objetos.
 * - Mantiene la responsabilidad única de renderizar una tabla a partir de `data` y `columns`.
 * - La lógica (fetch, mutaciones) debe vivir fuera del componente (SRP / MCP).
 */
const GenericTable = <T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  onAction = () => {},
}: GenericTableProps<T>) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4">
            {columns.map((col) => (
              <th
                key={String(col)}
                className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11"
              >
                {String(col).charAt(0).toUpperCase() + String(col).slice(1)}
              </th>
            ))}
            <th className="py-4 px-4 font-medium text-black dark:text-white">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="text-center py-5 px-4 text-black dark:text-white">
                No hay datos disponibles
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index} className="border-b border-stroke dark:border-strokedark">
                {columns.map((col) => (
                  <td key={String(col)} className="py-5 px-4 pl-9 xl:pl-11 text-black dark:text-white">
                    {String((item as any)[col as string] ?? "")}
                  </td>
                ))}
                <td className="py-5 px-4">
                  <div className="flex items-center space-x-3.5">
                    {actions.map((action) => {
                      const isEdit = action.name === "edit";
                      const isDelete = action.name === "delete";

                      return (
                        <button
                          key={action.name}
                          onClick={() => onAction(action.name, item)}
                          className={`hover:text-primary ${isDelete ? "text-danger hover:text-red-700" : ""} ${isEdit ? "text-primary" : ""}`}
                          title={action.label}
                        >
                          {action.label}
                        </button>
                      );
                    })}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
