import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, isAdmin, isApplicant } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin) {
      return <Navigate to="/login" replace />;
    }
    if (requiredRole === 'applicant' && !isApplicant) {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
