// src/pages/Demo.tsx
import React, { useState, useEffect } from "react";

const Demo: React.FC = () => {
  // Aquí es la lógica
  let [name, setName] = useState<string>("Jaider");
  let colores = ["rojo", "verde", "azul"];
  let flag = true;

  useEffect(() => {
    console.log("Componente montado");
    // Llamar al backend solicitando información
  }, []);

  // Función para manejar los cambios en la caja de texto
  const manejarCambio = (event: any) => {
    setName(event.target.value); // Actualiza el estado con el valor de la caja de texto
  };

  // Aquí es el HTML
  return (
    <div>
      <h1>Hola {name}</h1>
      {flag ? <h2>El valor es verdadero</h2> : <h2>El valor es falso</h2>}
      <input
        type="text"
        value={name} // El valor de la caja de texto es el estado name
        onChange={manejarCambio} // Cuando el valor cambia, llama a manejarCambio
      />
      <ul>
        {colores.map((color, index) => (
          <li key={index}>{color}</li>
        ))}
      </ul>
    </div>
  );
};

export default Demo;
