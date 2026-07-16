import { Navigate } from "react-router-dom";
import { useAuth, type Role } from "../context/AuthContext";
import type { ReactNode } from "react";

export default function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { role: currentRole } = useAuth();
  if (currentRole !== role) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
