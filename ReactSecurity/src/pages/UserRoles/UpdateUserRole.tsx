// src/pages/UserRoles/UpdateUserRole.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/BreadCrumb";
import GenericForm from "../../components/Form/GenericForm";
import { UserRole } from "../../models/UserRole";
import { userRoleService } from "../../services/userRolesService";

/**
 * Página: Actualizar una relación Usuario-Rol existente.
 * - Permite modificar las fechas de inicio y fin.
 */
const UpdateUserRole: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Partial<UserRole> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) fetchData(Number(id));
  }, [id]);

  const fetchData = async (id: number) => {
    try {
      const res = await userRoleService.getUserRoles();
      const found = res.find((u) => u.id === id);
      setData(found || null);
    } catch (error) {
      console.error("Error obteniendo relación usuario-rol:", error);
      Swal.fire("Error", "No fue posible obtener la asignación.", "error");
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      if (!id) return;
      await userRoleService.updateUserRole(Number(id), values);

      await Swal.fire({
        title: "Éxito",
        text: "Asignación actualizada correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/userroles/list");
    } catch (error: any) {
      console.error("Error actualizando relación:", error);
      const msg =
        error?.response?.data?.message || error?.message || "Error al actualizar la asignación.";
      Swal.fire("Error", msg, "error");
    }
  };

  if (!data) return <div>Cargando...</div>;

  return (
    <div>
      <Breadcrumb pageName="Actualizar Asignación Usuario-Rol" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Editar Asignación</h2>
        <GenericForm mode={2} data={data} handleUpdate={handleUpdate} />
      </div>
    </div>
  );
};

export default UpdateUserRole;
