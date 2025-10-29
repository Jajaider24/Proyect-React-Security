// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => (
  <nav className="bg-white dark:bg-gray-800 shadow-sm rounded-md p-3">
    <ul className="flex space-x-4">
      <li>
        <Link to="/demo" className="text-sm font-medium text-primary dark:text-white hover:underline">
          Demo
        </Link>
      </li>
      {/* Agrega más enlaces según las rutas de tu proyecto */}
    </ul>
  </nav>
);

export default Navigation;
