import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { permissionService } from "../../services/permissionService.ts";
import { useNavigate } from "react-router-dom";

const CreatePermission: React.FC = () => {
  const navigate = useNavigate();
  const [template, setTemplate] = useState<any | null>(null);

  // Cargar estructura inicial del permiso
  useEffect(() => {
    setTemplate({
      url: "/",
      method: "GET",  // Valor por defecto válido
    });
  }, []);

  const handleCreate = async (values: any) => {
    try {
      console.log("Creando permiso:", JSON.stringify(values, null, 2));
      
      // Validación local
      if (!values.url || !values.method) {
        throw new Error("La URL y el método son requeridos");
      }
      
      await permissionService.createPermission(values);
      await Swal.fire({
        title: "Permiso creado",
        text: "El permiso se ha creado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate("/permissions/list");
    } catch (error: any) {
      console.error("Error creando permiso:", error);
      Swal.fire(
        "Error",
        error?.response?.data?.error || "No fue posible crear el permiso",
        "error"
      );
    }
  };

  if (!template) return <div>Cargando...</div>;

  

  }

export default CreatePermission;