import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/auth";
import LoadingDots from "./LoadingDots";

const PrivateRoute = ({ roles }) => {
  const { user, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
