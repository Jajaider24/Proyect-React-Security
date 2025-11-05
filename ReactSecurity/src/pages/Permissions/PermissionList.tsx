import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import GenericTable from "../../components/GenericTable.tsx";
import { permissionService } from "../../services/permissionService.ts";

const ListPermissions: React.FC = () => {
  const [permissions, setPermissions] = useState<any[]>([]);
  const navigate = useNavigate();
  // If you have a UI library selector, replace this with the context hook.
  const didFetch = useRef(false);

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await permissionService.getPermissions();
      console.log("📦 Permisos obtenidos desde API:", data);
      setPermissions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error obteniendo permisos:", error);
      Swal.fire("Error", "No fue posible obtener los permisos", "error");
    }
  };

  const handleAction = async (action: string, item: any) => {
    if (action === "edit") {
      navigate(`/permissions/update/${item.id}`);
    } else if (action === "delete") {
      await deletePermission(item);
    }
  };

  const deletePermission = async (item: any) => {
    const result = await Swal.fire({
      title: "Eliminación",
      text: "¿Está seguro de eliminar este permiso?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await permissionService.deletePermission(item.id);
      await Swal.fire({
        title: "Eliminado",
        text: "El permiso ha sido eliminado correctamente",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
    } catch (err: any) {
      console.error("Error eliminando permiso:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.detail ||
        err?.message ||
        "Error al eliminar permiso";
      Swal.fire("Error", message, "error");
    }
  };

  const renderBotonCrear = () => {
    const onCrear = () => navigate("/permissions/create");
    return (
      <button
        type="button"
        onClick={onCrear}
        className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-3 px-6 text-center font-medium text-white hover:bg-opacity-90"
      >
        <svg
          className="fill-current"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M10.0001 0.5625C4.7876 0.5625 0.562622 4.7875 0.562622 10C0.562622 15.2125 4.7876 19.4375 10.0001 19.4375C15.2126 19.4375 19.4376 15.2125 19.4376 10C19.4376 4.7875 15.2126 0.5625 10.0001 0.5625ZM10.0001 18.0625C5.55012 18.0625 1.93762 14.45 1.93762 10C1.93762 5.55 5.55012 1.9375 10.0001 1.9375C14.4501 1.9375 18.0626 5.55 18.0626 10C18.0626 14.45 14.4501 18.0625 10.0001 18.0625Z" />
          <path d="M13.7501 9.3125H10.6876V6.25C10.6876 5.86875 10.3813 5.5625 10.0001 5.5625C9.61887 5.5625 9.31262 5.86875 9.31262 6.25V9.3125H6.25012C5.86887 9.3125 5.56262 9.61875 5.56262 10C5.56262 10.3813 5.86887 10.6875 6.25012 10.6875H9.31262V13.75C9.31262 14.1313 9.61887 14.4375 10.0001 14.4375C10.3813 14.4375 10.6876 14.1313 10.6876 13.75V10.6875H13.7501C14.1313 10.6875 14.4376 10.3813 14.4376 10C14.4376 9.61875 14.1313 9.3125 13.7501 9.3125Z" />
        </svg>
        Crear Permiso
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="py-6 px-4 md:px-6 xl:px-7.5 flex justify-between items-center">
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Permissions
          </h4>
          {renderBotonCrear()}
        </div>

        <GenericTable
          data={permissions}
          columns={["id", "url", "method"]}
          actions={[
            { name: "edit", label: "Update" },
            { name: "delete", label: "Delete" },
          ]}
          onAction={handleAction}
        />
      </div>
    </div>
  );
};

export default ListPermissions;