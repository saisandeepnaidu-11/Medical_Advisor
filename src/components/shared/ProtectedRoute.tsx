import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import type { UserRole } from '../../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { currentUser, appUser } = useAuth();

  if (!currentUser || !appUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(appUser.role)) {
    // Redirect to the appropriate dashboard
    const rolePaths: Record<UserRole, string> = {
      admin: '/admin',
      doctor: '/doctor',
      patient: '/patient',
    };
    return <Navigate to={rolePaths[appUser.role]} replace />;
  }

  return <>{children}</>;
}
