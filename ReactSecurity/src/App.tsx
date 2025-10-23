import React, { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Loader from "./common/Loader/index.tsx";
import { DashboardLayout } from "./layout/DashboardLayout.tsx";
import routes from "./routes/index.ts";

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Mapear rutas definidas en src/routes/index.ts */}
          {routes.map((r) => {
            const Component = r.component as any;
            // Mostrar Login sin DashboardLayout, el resto dentro del layout
            if (r.path === "/login") {
              return <Route key={r.path} path={r.path} element={<Component />} />;
            }

            return (
              <Route
                key={r.path}
                path={r.path}
                element={
                  <DashboardLayout>
                    <Component />
                  </DashboardLayout>
                }
              />
            );
          })}

          {/* Redirección por defecto a /login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
