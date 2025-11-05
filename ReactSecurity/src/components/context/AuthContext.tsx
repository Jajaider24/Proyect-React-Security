// src/context/AuthContext.tsx
// -----------------------------------------------------------------------------
// Contexto global de autenticación con Firebase y proveedores externos.
// Administra el login, logout y persistencia del usuario y token.
// -----------------------------------------------------------------------------

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  getIdToken,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, googleProvider, githubProvider, microsoftProvider } from "../../firebaseConfig";
import SecurityService from "../../services/securityService.ts";
import { User } from "../../models/User.ts";

// Definimos la estructura del usuario mínimo que vamos a manejar en el frontend
interface ClientUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
}

// Definimos qué funciones y estados estarán disponibles en el contexto
interface AuthContextType {
  user: ClientUser | null;
  token: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  loginWithMicrosoft: () => Promise<void>;
  logout: () => Promise<void>;
}

// Creamos el contexto con valores iniciales
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithGitHub: async () => {},
  loginWithMicrosoft: async () => {},
  logout: async () => {},
});

// Hook personalizado para acceder al contexto más fácil
export const useAuth = () => useContext(AuthContext);

// -----------------------------------------------------------------------------
// AuthProvider: Componente que envuelve toda la app y gestiona la autenticación
// -----------------------------------------------------------------------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ClientUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // 🌀 Escucha los cambios de estado en Firebase (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Si hay un usuario logueado, obtenemos su token de Firebase
        const idToken = await getIdToken(firebaseUser, true);

        // Creamos un objeto más pequeño con solo lo que necesitamos
        const minimalUser: ClientUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          displayName: firebaseUser.displayName ?? undefined,
          photoURL: firebaseUser.photoURL ?? undefined,
        };

        // Guardamos todo localmente
        setUser(minimalUser);
        setToken(idToken);

        // También lo guardamos en el servicio de seguridad (localStorage)
        SecurityService.setToken(idToken);
        SecurityService.setUserLocal(minimalUser as unknown as Partial<User>);

        console.log("✅ Usuario autenticado desde Firebase:", firebaseUser);
      } else {
        // Si no hay usuario (logout)
        console.log("🚪 Usuario cerró sesión o no está autenticado.");
        setUser(null);
        setToken(null);
        SecurityService.logout();
      }
      setLoading(false);
    });

    // Cuando el componente se desmonta, detiene la suscripción
    return () => unsubscribe();
  }, []);

  // 🌐 Login con Google
  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    const minimalUser: ClientUser = {
      uid: result.user.uid,
      email: result.user.email ?? undefined,
      displayName: result.user.displayName ?? undefined,
      photoURL: result.user.photoURL ?? undefined,
    };

    setUser(minimalUser);
    setToken(idToken);
    SecurityService.setToken(idToken);
    SecurityService.setUserLocal(minimalUser as unknown as Partial<User>);

    console.log("🎉 Login con Google exitoso:", result.user);
  };

  // 🐙 Login con GitHub
  const loginWithGitHub = async () => {
    const result = await signInWithPopup(auth, githubProvider);
    const idToken = await result.user.getIdToken();

    const minimalUser: ClientUser = {
      uid: result.user.uid,
      email: result.user.email ?? undefined,
      displayName: result.user.displayName ?? undefined,
      photoURL: result.user.photoURL ?? undefined,
    };

    setUser(minimalUser);
    setToken(idToken);
    SecurityService.setToken(idToken);
    SecurityService.setUserLocal(minimalUser as unknown as Partial<User>);

    console.log("🐙 Login con GitHub exitoso:", result.user);
  };

  // 🪟 Login con Microsoft
  const loginWithMicrosoft = async () => {
    try {
      const result = await signInWithPopup(auth, microsoftProvider);
      const idToken = await result.user.getIdToken();

      const minimalUser: ClientUser = {
        uid: result.user.uid,
        email: result.user.email ?? undefined,
        displayName: result.user.displayName ?? undefined,
        photoURL: result.user.photoURL ?? undefined,
      };

      setUser(minimalUser);
      setToken(idToken);
      SecurityService.setToken(idToken);
      SecurityService.setUserLocal(minimalUser as unknown as Partial<User>);

      console.log("🪟 Login con Microsoft exitoso:", result.user.email);
    } catch (error: any) {
      // ⚠ Este error pasa cuando el correo ya está registrado con otro proveedor
      if (error.code === "auth/account-exists-with-different-credential") {
        const email = error.customData?.email;
        if (email) {
          const methods = await fetchSignInMethodsForEmail(auth, email);
          alert(
            `La cuenta ${email} ya está registrada con otro método: ${methods.join(
              ", "
            )}. Inicia sesión con ese proveedor.`
          );
        } else {
          alert("Esta cuenta ya existe con otro método de autenticación.");
        }
      } else {
        console.error("❌ Error en login con Microsoft:", error);
        alert("Error al iniciar sesión con Microsoft. Intenta de nuevo.");
      }
    }
  };

  // 🚪 Logout general
  const logout = async () => {
    console.log("🚪 Cerrando sesión...");
    await signOut(auth);
    setUser(null);
    setToken(null);
    SecurityService.logout();
  };

  // Retornamos el contexto con todas las funciones y estados
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        loginWithGoogle,
        loginWithGitHub,
        loginWithMicrosoft,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};