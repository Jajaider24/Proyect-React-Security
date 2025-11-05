import { lazy } from "react";

// Carga diferida del componente Demo
const Demo = lazy(() => import("../pages/Demo.tsx"));
// Carga diferida del componente Login (UI)
const Login = lazy(() => import("../components/Login.tsx"));
// Unified model page
const ModelList = lazy(() => import("../pages/Models/ModelList.tsx"));
// Pages for Users, Roles, Permissions
const UsersList = lazy(() => import("../pages/Users/UsersList.tsx"));
const UserDetail = lazy(() => import("../pages/Users/UserDetail.tsx"));
const RolesList = lazy(() => import("../pages/Roles/RolesList.tsx"));
const PermissionList = lazy(() => import("../pages/Permissions/PermissionList.tsx"));
const PermissionCreate = lazy(() => import("../pages/Permissions/PermissionCreate.tsx"));
const PermissionUpdate = lazy(() => import("../pages/Permissions/PermissionUpdate.tsx"));
const SecurityQuestionsList = lazy(() => import("../pages/SecurityQuestions/SecurityQuestionsList.tsx"));


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

  // Security main routes
  { path: "/users", title: "Users", component: UsersList },
  { path: "/users/:id", title: "UserDetail", component: UserDetail },
  { path: "/roles", title: "Roles", component: RolesList },
  { path: "/permissions", title: "Permissions", component: PermissionList },
  { path: "/permissions/create", title: "PermissionCreate", component: PermissionCreate },
  { path: "/permissions/update/:id", title: "PermissionUpdate", component: PermissionUpdate },
  { path: "/security-questions", title: "SecurityQuestions", component: SecurityQuestionsList },

];

export default routes;
