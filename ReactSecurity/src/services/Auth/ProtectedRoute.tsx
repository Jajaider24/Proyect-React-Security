import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loader from "../../common/Loader/index.tsx";
import userService from "../userService.ts";


interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ok =
          typeof (userService as any).validateSession === "function"
            ? await (userService as any).validateSession()
            : userService.isAuthenticated();
        if (mounted) setIsAuth(Boolean(ok));
      } catch (err) {
        if (mounted) setIsAuth(false);
      } finally {
        if (mounted) setChecking(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (checking) return <Loader />;
  if (!isAuth) return <Navigate to="/login" replace />;
  return <>{children}</>;
}



