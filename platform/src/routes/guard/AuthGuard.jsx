import { Navigate } from "react-router-dom";
import { getAccessTokenFromLS } from "@/services/auth.service.js";

export default function AuthGuard({ children }) {
  const isAuthenticated = getAccessTokenFromLS();
  const redirectUrl = window.location.pathname;

  if(redirectUrl!=="/") {
    return isAuthenticated ? <>{children}</> : <Navigate to={`/auth/login?redirectUrl=${redirectUrl}`} />;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
}
