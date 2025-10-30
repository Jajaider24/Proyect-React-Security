import React from "react";
import { useParams } from "react-router-dom";

const displayNames: Record<string, string> = {
  address: "Address",
  answer: "Answer",
  device: "Device",
  digitalsignature: "Digital Signature",
  password: "Password",
  permission: "Permission",
  profile: "Profile",
  role: "Role",
  rolepermission: "Role Permission",
  securityquestion: "Security Question",
  session: "Session",
  user: "User",
  userrole: "User Role",
};

export default function ModelList() {
  const { name } = useParams<{ name: string }>();
  const key = (name || "").toLowerCase();
  const title = displayNames[key] ?? name ?? "Model";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2 text-primary dark:text-white">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300">Componente unificado para el modelo <strong>{title}</strong>. Aquí iría el listado, filtros y acciones específicas del modelo.</p>
    </div>
  );
}
