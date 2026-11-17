import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext.jsx';

export default function ProtectedRoute() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container state-container">
        <div className="spinner" aria-hidden="true" />
        <p>Carregando sua sessão...</p>
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

  return <Outlet />;
}
