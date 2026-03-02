import { createContext, useContext, ReactNode, useState } from 'react';

// ============================================
// TYPES
// ============================================

export type UserRole = 'ops_manager' | 'campaign_manager' | 'campaign_backup' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  assignedClients: string[]; // Only relevant for campaign_manager and campaign_backup
  company?: string; // For client role
}

interface AuthContextValue {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  canUploadLeads: () => boolean;
  canAccessOps: () => boolean;
  canManageTeam: () => boolean;
  canEditCampaigns: () => boolean;
  getDefaultRoute: () => string;
}

// ============================================
// MOCK USERS - Available for selection on login
// ============================================

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Mitchell',
    email: 'client@acmecorp.com',
    role: 'client',
    assignedClients: [],
    company: 'Acme Corp',
  },
  {
    id: 'u2',
    name: 'John Davies',
    email: 'john.davies@datamatics.com',
    role: 'campaign_manager',
    assignedClients: ['client_1', 'client_2'],
  },
  {
    id: 'u3',
    name: 'Lisa Park',
    email: 'lisa.park@datamatics.com',
    role: 'campaign_backup',
    assignedClients: ['client_1', 'client_3'],
  },
  {
    id: 'u4',
    name: 'Robert Chen',
    email: 'robert.chen@datamatics.com',
    role: 'ops_manager',
    assignedClients: [],
  },
];

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to first user (client) initially
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);

  // Permission helpers
  const canUploadLeads = () => {
    return currentUser.role === 'ops_manager' || currentUser.role === 'campaign_manager';
  };

  const canAccessOps = () => {
    return currentUser.role === 'ops_manager';
  };

  const canManageTeam = () => {
    return currentUser.role === 'ops_manager';
  };

  const canEditCampaigns = () => {
    return currentUser.role === 'ops_manager' || currentUser.role === 'campaign_manager';
  };

  const getDefaultRoute = () => {
    switch (currentUser.role) {
      case 'ops_manager':
        return '/dashboard/ops';
      case 'campaign_manager':
      case 'campaign_backup':
        return '/dashboard/manager';
      case 'client':
      default:
        return '/dashboard';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        canUploadLeads,
        canAccessOps,
        canManageTeam,
        canEditCampaigns,
        getDefaultRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}