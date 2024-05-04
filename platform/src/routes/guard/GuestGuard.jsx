import { Navigate } from "react-router-dom";
import { getAccessTokenFromLS } from "@/services/auth.service.js";

export default function GuestGuard({ children }) {
  const isAuthenticated = getAccessTokenFromLS();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
