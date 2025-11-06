import React, { lazy } from "react";
import { Navigate } from "react-router-dom";
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
const SignatureView = lazy(() => import("../pages/Signatures/SignatureView.tsx"));
const ProfileView = lazy(() => import("../pages/Profiles/ProfileView.tsx"));


const routes = [
  {
    path: "/demo", // Redirige /demo a /users
    title: "Demo",
    component: () => React.createElement(Navigate, { to: "/users", replace: true }),
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
  { path: "/users/:id/edit", title: "UserDetailEdit", component: UserDetail },
  { path: "/roles", title: "Roles", component: RolesList },
  { path: "/permissions", title: "Permissions", component: PermissionList },
  { path: "/permissions/create", title: "PermissionCreate", component: PermissionCreate },
  { path: "/permissions/update/:id", title: "PermissionUpdate", component: PermissionUpdate },
  { path: "/security-questions", title: "SecurityQuestions", component: SecurityQuestionsList },
  // Public signature viewer
  { path: "/signature/:id", title: "SignatureView", component: SignatureView },
  // Public profile viewer
  { path: "/profile/:id", title: "ProfileView", component: ProfileView },

];

export default routes;
