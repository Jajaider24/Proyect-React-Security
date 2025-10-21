import { DashboardLayout } from "./layout/DashboardLayout.tsx";


export default function App() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Aquí va el contenido principal del sistema.
        </p>
      </div>
    </DashboardLayout>
  );
}
