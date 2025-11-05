import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/BreadCrumb";
import GenericTable from "../../components/GenericTable";
import { UserRole } from "../../models/UserRole";
import { userRoleService } from "../../services/userRolesService";

/**
 * Página: Listado de relaciones Usuario–Rol
 * Permite ver, eliminar y asignar roles a usuarios.
 */
const ListUserRole: React.FC = () => {
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await userRoleService.getUserRoles();
      setUserRoles(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error al obtener relaciones usuario–rol:", error);
      Swal.fire("Error", "No fue posible obtener las relaciones usuario–rol.", "error");
    }
  };

  const handleAction = async (action: string, item: UserRole) => {
    switch (action) {
      case "delete":
        await deleteRelation(item);
        break;
    }
  };

  const deleteRelation = async (item: UserRole) => {
    const result = await Swal.fire({
      title: "Eliminar asignación",
      text: `¿Seguro que deseas quitar el rol "${item.role?.name}" al usuario "${item.user?.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await userRoleService.deleteUserRole(item.id);
      Swal.fire("Eliminado", "Asignación eliminada correctamente", "success");
      fetchData();
    } catch (error) {
      Swal.fire("Error", "No fue posible eliminar la asignación.", "error");
    }
  };

  // Botón para asignar un nuevo rol
  const renderBotonAsignar = () => (
    <button
      onClick={() => navigate("/userroles/create")}
      className="bg-primary text-white rounded-md px-4 py-2 hover:bg-opacity-90"
    >
      + Asignar Rol
    </button>
  );

  // Botón para crear un nuevo rol
  const renderBotonCrearRol = () => (
    <button
      onClick={() => navigate("/roles/create")}
      className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-opacity-90"
    >
      + Crear Rol
    </button>
  );

  return (
    <div className="p-4">
      <Breadcrumb pageName="Asignación de Roles" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Relaciones Usuario–Rol</h2>
        <div className="flex gap-2">
          {renderBotonCrearRol()}
          {renderBotonAsignar()}
        </div>
      </div>

      <GenericTable
        data={userRoles}
        columns={["id", "user", "role", "startAt", "endAt"]}
        actions={[{ name: "delete", label: "Eliminar" }]}
        onAction={handleAction}
      />
    </div>
  );
};

export default ListUserRole;
