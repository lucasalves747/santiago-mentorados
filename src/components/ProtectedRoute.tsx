import { ReactNode } from "react";
import { useAuth } from "@/_core/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const auth = useAuth({ redirectOnUnauthenticated: true, redirectPath: "/login" });

  if (auth.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "1.25rem" }}>Verificando autenticação...</div>
        </div>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
