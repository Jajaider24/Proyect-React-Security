// src/components/Navigation.tsx
import React from "react";
import { Link } from "react-router-dom";

const Navigation: React.FC = () => (
  <nav>
    <ul>
      <li>
        <Link to="/demo">Demo</Link>
      </li>
      {/* Agrega más enlaces según las rutas de tu proyecto */}
    </ul>
  </nav>
);

export default Navigation;
