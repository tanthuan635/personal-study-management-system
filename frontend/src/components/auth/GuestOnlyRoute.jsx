import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../../lib/auth";

function GuestOnlyRoute({ children }) {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default GuestOnlyRoute;
