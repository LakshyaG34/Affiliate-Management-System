import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import useAuth from "@/hooks/useAuth";

interface Props {
  children: ReactNode;
}

const PublicRoute = ({ children }: Props) => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;