En el presente proyecto se desarrollará una aplicación frontend utilizando ReactJS, con el objetivo de implementar un sistema de seguridad que permita gestionar usuarios, roles, permisos y otras entidades necesarias para el control de acceso dentro de un entorno de microservicios

# Estructura de mi proyecto

/Proyect-React-Security
│
├── package.json — metadatos del repo
├── README.md — documentación del proyecto
└── ReactSecurity/
├── package.json — dependencias y scripts de la app
├── postcss.config.js — config PostCSS (Tailwind)
├── tailwind.config.js — config Tailwind CSS
├── public/
│ ├── index.html — plantilla HTML
│ ├── manifest.json — PWA / metadatos
│ └── robots.txt — reglas para crawlers
└── src/
├── App.tsx — router y layout global
├── index.tsx — punto de entrada React
├── index.css — estilos globales
├── App.css — estilos de la app
├── common/Loader/index.tsx — spinner/loader reutilizable
├── components/
│ ├── Login.tsx — formulario de login
│ ├── Navbar.tsx — header / acciones (logout)
│ ├── Navigation.tsx — navegación secundaria (opcional)
│ └── Sidebar.tsx — menú lateral / info usuario
├── layout/
│ └── DashboardLayout.tsx — combina Navbar + Sidebar
├── pages/
│ └── Demo.tsx — página de ejemplo / demo
├── routes/
│ └── index.ts — definición de rutas (lazy)
├── services/
│ ├── userService.ts — login/logout/isAuthenticated/validateSession
│ └── Auth/ProtectedRoute.tsx — protege rutas (muestra Loader)
├── models/ — interfaces / tipos (User, Role, etc.)
└── styles/ — CSS/Tailwind extra

Paso 1: Para ingresar a la terminal cd ReactSecurity (Dentro de esta carpeta se instala todo para que las instalaciones no se hagan afuera de la carpeta)

# Ir a carpeta del frontend

cd .\ReactSecurity

Nota: Si ya estás dentro de la carpeta `ReactSecurity`, no vuelvas a ejecutar este comando o intentará entrar en `ReactSecurity/ReactSecurity` y fallará. En PowerShell puedes verificar tu ubicación con:

```powershell
Get-Location
```

Para subir una carpeta usa:

```powershell
cd ..
```

# Instalar dependencias del frontend

npm install

Paso : Instalar la libreria Node.Modules --> "npm install"

Paso: Instalar Tailwind CSS "npm install -D tailwindcss@latest"
Paso: Instalar plugin PostCSS de Tailwind (v4) "npm install -D @tailwindcss/postcss"

Paso: Instalar TypeScript --> "npm install -D typescript"

Paso: Instalar Prettier (formateador) --> "npm install -D prettier"
Nota: "prettier-plugin" no es un paquete válido. Si quieres ordenar clases de Tailwind, puedes instalar opcionalmente "npm install -D prettier-plugin-tailwindcss".

Paso : Usar "npm install firebase" Para los logins

Paso : Instalar tambien "npm install -g firebase-tools"

Paso: Instalar: npm i sweetalert2

Paso: Instalar: "npm install @reduxjs/toolkit react-redux -s"
"npm install -D @types/react-redux -s"

Paso: Instalar: "npm install yup formik --save"

Paso: Instalar: "npm install @mui/material @emotion/react @emotion/styled @mui/icons-material formik yup"

Paso: Istalar: npm install leaflet react-leaflet

#Este proyecto se ejecuta de la siguiente manera:
cd .\ReactSecurity
npm start


