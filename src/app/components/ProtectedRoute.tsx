import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  requireOps?: boolean;
  requireManager?: boolean;
  blockClient?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireOps = false, 
  requireManager = false,
  blockClient = false 
}: ProtectedRouteProps) {
  const { currentUser, canAccessOps } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Block clients from ops and manager routes
    if (blockClient && currentUser.role === 'client') {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Require ops manager permission
    if (requireOps && !canAccessOps()) {
      navigate('/dashboard', { replace: true });
      return;
    }

    // Require manager or ops permission
    if (requireManager && 
        !['ops_manager', 'campaign_manager', 'campaign_backup'].includes(currentUser.role)) {
      navigate('/dashboard', { replace: true });
      return;
    }
  }, [currentUser.role, requireOps, requireManager, blockClient, canAccessOps, navigate]);

  return <>{children}</>;
}
