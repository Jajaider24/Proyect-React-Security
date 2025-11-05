// Contexto global que controla qué librería de estilos (Tailwind, Bootstrap o UI) está activa en la app.

import React, { createContext, useContext, useState, useEffect } from 'react';

// Definimos el tipo posible de librerías.
// Solo se puede usar uno de estos tres valores exactos.
type Libreria = 'tailwind' | 'bootstrap' | 'ui';

// Definimos la forma (interfaz) de los datos que manejará el contexto.
// Incluye:
// - libreria: el valor actual (qué estilo se está usando)
// - setLibreria: función para cambiarlo
interface LibreriaContextType {
  libreria: Libreria;
  setLibreria: (l: Libreria) => void;
}

// Creamos el contexto sin valor inicial.
// Si alguien lo usa fuera del Provider, será undefined (y lanzaremos un error controlado).
const LibreriaContext = createContext<LibreriaContextType | undefined>(undefined);

// Provider global del contexto. Debe envolver <App /> en el main.tsx
export const LibreriaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado local que guarda la librería actual
  const [libreria, setLibreria] = useState<Libreria>(() => {
    // Al iniciar, intentamos leer la última elección guardada en localStorage
    const guardada = localStorage.getItem('libreria') as Libreria | null;
    return guardada || 'tailwind'; // Tailwind por defecto
  });

  // Efecto: cada vez que cambie la librería, guardamos la nueva selección en localStorage
  useEffect(() => {
    localStorage.setItem('libreria', libreria);
  }, [libreria]);

  // Retornamos el contexto con los valores disponibles para toda la app
  // children= representa todo lo que este proveedor va a envolver, son como los componentes hijos
  return (
    <LibreriaContext.Provider value={{ libreria, setLibreria }}>
      {children}
    </LibreriaContext.Provider>
  );
};

// Hook personalizado para consumir el contexto de forma más cómoda.
// Si se usa fuera del Provider, lanzamos un error explicativo.
export const useLibreria = (): LibreriaContextType => {
  const context = useContext(LibreriaContext);
  if (!context) throw new Error('useLibreria debe usarse dentro de LibreriaProvider');
  return context;
};

// El Provider= "Provee" (de ahí su nombre) un valor global a toda la aplicación.
// Cualquier componente dentro del Provider puede acceder o modificar ese valor usando el hook useLibreria().
// Un hook en React es una función especial que te permite usar características de React (como estado o ciclo de vida) dentro de componentes funcionales.
// Así, podemos cambiar dinámicamente la librería de estilos en toda la app desde cualquier componente.