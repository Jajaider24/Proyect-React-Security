import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { permissionService } from "../../services/permissionService.ts";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePermission: React.FC = () => {
  const [permission, setPermission] = useState<any | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchPermission();
  }, [id]);

  const fetchPermission = async () => {
    try {
      const data = await permissionService.getPermissionById(Number(id));
      setPermission(data);
      console.log("📦 Permiso obtenido:", data);
    } catch (error) {
      console.error("Error obteniendo permiso:", error);
      Swal.fire("Error", "No fue posible cargar el permiso", "error");
      navigate("/permissions/list");
    }
  };

  const handleUpdate = async (values: any) => {
    try {
      await permissionService.updatePermission(Number(id), values);
      await Swal.fire({
        title: "Permiso actualizado",
        text: "El permiso se ha actualizado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/permissions/list");
    } catch (error: any) {
      console.error("Error actualizando permiso:", error);
      Swal.fire(
        "Error",
        error?.response?.data?.error || "No fue posible actualizar el permiso",
        "error"
      );
    }
  };

  if (!permission) return <div>Cargando permiso...</div>;


    
}

export default UpdatePermission;