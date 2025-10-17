import { lazy } from "react";

// Carga diferida del componente Demo
const Demo = lazy(() => import("../pages/Demo.tsx"));

const routes = [
  {
    path: "/demo", // Ruta para acceder al componente Demo
    title: "Demo",
    component: Demo,
  },
];

export default routes;
