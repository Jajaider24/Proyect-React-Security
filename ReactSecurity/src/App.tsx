import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom"; // No necesitas BrowserRouter aquí, solo Routes y Route
import routes from "./routes/index.ts"; // Importa las rutas definidas en index.tsx

const App: React.FC = () => {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.component />} />
        ))}
      </Routes>
    </Suspense>
  );
};

export default App;
