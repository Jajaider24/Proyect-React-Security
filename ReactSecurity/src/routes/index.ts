import { lazy } from "react";

// Carga diferida del componente Demo
const Demo = lazy(() => import("../pages/Demo.tsx"));
// Carga diferida del componente Login (UI)
const Login = lazy(() => import("../components/Login.tsx"));
// Unified model page
const ModelList = lazy(() => import("../pages/Models/ModelList.tsx"));


const routes = [
  {
    path: "/demo", // Ruta para acceder al componente Demo
    title: "Demo",
    component: Demo,
  },
  {
    path: "/login", // Ruta para visualizar el Login
    title: "Login",
    component: Login,
  },
  // Unified model route
  { path: "/models/:name", title: "Model", component: ModelList },

];

export default routes;
