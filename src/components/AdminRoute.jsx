import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = sessionStorage.getItem("token");
  const rol = sessionStorage.getItem("rol");

  if (!token || rol !== "ADMIN") {
    return <Navigate to="/inicio-sesion?forceLogin=true" />;
  }

  return children;
}
