import React from "react";
import { useLibreria } from "./context/LibreriaContext.tsx";
// Material UI components for the 'ui' variant
import Paper from "@mui/material/Paper";
import MuiTable from "@mui/material/Table";
import MuiTableBody from "@mui/material/TableBody";
import MuiTableCell from "@mui/material/TableCell";
import MuiTableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import UI from "./UI/index.tsx";

export interface Action {
  name: string;
  label: string;
}

interface GenericTableProps<T> {
  data: T[];
  columns: (keyof T | string)[];
  /**
   * Optional key to use for each row. If not provided, component will try
   * to use `item.id` when present, otherwise falls back to the array index.
   */
  rowKey?: keyof T | ((item: T) => string | number);
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
  rowKey,
  actions = [],
  onAction = () => {},
}: GenericTableProps<T>) => {
  const { libreria } = useLibreria();

  // Render helpers for action buttons per UI library
  const renderActions = (item: T) => {
    return (
      <div className={libreria === "bootstrap" ? "d-flex gap-2" : "flex items-center space-x-3.5"}>
        {actions.map((action) => (
          <UI.Button key={action.name} variant={action.name === "delete" ? "danger" : action.name === "edit" ? "primary" : "secondary"} size="sm" onClick={() => onAction(action.name, item)}>
            {action.label}
          </UI.Button>
        ))}
      </div>
    );
  };
  // Variant rendering
  if (libreria === "bootstrap") {
    return (
      <div className="w-full min-h-[320px] flex flex-col">
        <div className="table-responsive flex-1 overflow-auto">
          <table className="table table-striped table-hover w-100">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={String(col)} className="text-start px-3 py-2" style={{ backgroundColor: 'var(--brand)', color: 'var(--brand-contrast)' }}>
                  {String(col).charAt(0).toUpperCase() + String(col).slice(1)}
                </th>
              ))}
              <th className="px-3 py-2" style={{ backgroundColor: 'var(--brand)', color: 'var(--brand-contrast)' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-4">
                  No hay datos disponibles
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                let key: string | number = index;
                if (rowKey) {
                  if (typeof rowKey === "function") key = rowKey(item);
                  else key = String((item as any)[String(rowKey)]) || index;
                } else if ((item as any).id !== undefined) {
                  key = (item as any).id as string | number;
                }

                return (
                  <tr key={String(key)}>
                    {columns.map((col) => (
                      <td key={String(col)} className="px-3 py-3 align-middle">
                        {String(((item as Record<string, unknown>)[String(col)] as any) ?? "")}
                      </td>
                    ))}
                    <td className="px-3 py-3 align-middle">{renderActions(item)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (libreria === "ui") {
    return (
      <div className="w-full min-h-[320px] flex flex-col">
        <Paper elevation={1} style={{ padding: 12, overflow: "hidden", display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ overflow: 'auto', flex: 1 }}>
            <MuiTable size="small">
          <MuiTableHead>
            <MuiTableRow>
              {columns.map((col) => (
                <MuiTableCell key={String(col)} style={{ fontWeight: 600, backgroundColor: 'var(--brand)', color: 'var(--brand-contrast)' }}>
                  {String(col).charAt(0).toUpperCase() + String(col).slice(1)}
                </MuiTableCell>
              ))}
              <MuiTableCell style={{ backgroundColor: 'var(--brand)', color: 'var(--brand-contrast)' }}>Acciones</MuiTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {data.length === 0 ? (
              <MuiTableRow>
                <MuiTableCell colSpan={columns.length + 1} align="center">
                  No hay datos disponibles
                </MuiTableCell>
              </MuiTableRow>
            ) : (
              data.map((item, index) => {
                let key: string | number = index;
                if (rowKey) {
                  if (typeof rowKey === "function") key = rowKey(item);
                  else key = String((item as any)[String(rowKey)]) || index;
                } else if ((item as any).id !== undefined) {
                  key = (item as any).id as string | number;
                }

                return (
                  <MuiTableRow key={String(key)}>
                    {columns.map((col) => (
                      <MuiTableCell key={String(col)}>{String(((item as Record<string, unknown>)[String(col)] as any) ?? "")}</MuiTableCell>
                    ))}
                    <MuiTableCell>{renderActions(item)}</MuiTableCell>
                  </MuiTableRow>
                );
              })
            )}
          </MuiTableBody>
          </MuiTable>
          </div>
        </Paper>
      </div>
    );
  }

  // Default: tailwind version
  return (
    <div className="w-full min-h-[320px] flex flex-col">
      <div className="overflow-x-auto flex-1">
        <table className="w-full table-auto">
        <thead>
          <tr className="bg-gray-2 text-left dark:bg-meta-4" style={{ backgroundColor: 'var(--brand)', color: 'var(--brand-contrast)' }}>
            {columns.map((col) => (
              <th
                key={String(col)}
                className="min-w-[120px] py-4 px-4 font-medium xl:pl-11"
                style={{ color: 'var(--brand-contrast)' }}
              >
                {String(col).charAt(0).toUpperCase() + String(col).slice(1)}
              </th>
            ))}
            <th className="py-4 px-4 font-medium" style={{ color: 'var(--brand-contrast)' }}>Acciones</th>
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
              data.map((item, index) => {
                // compute a stable key: prefer `rowKey`, then item.id, then index
                let key: string | number = index;
                if (rowKey) {
                  if (typeof rowKey === "function") key = rowKey(item);
                  else key = String((item as any)[String(rowKey)]) || index;
                } else if ((item as any).id !== undefined) {
                  key = (item as any).id as string | number;
                }

                return (
                  <tr key={String(key)} className="border-b border-stroke dark:border-strokedark">
                    {columns.map((col) => (
                      <td key={String(col)} className="py-5 px-4 pl-9 xl:pl-11 text-black dark:text-white">
                        {String(((item as Record<string, unknown>)[String(col)] as any) ?? "")}
                      </td>
                    ))}
                    <td className="py-5 px-4">{renderActions(item)}</td>
                  </tr>
                );
              })
            )}
        </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;
