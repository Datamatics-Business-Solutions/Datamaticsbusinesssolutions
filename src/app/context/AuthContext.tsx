import { createContext, useContext, ReactNode, useState, useCallback } from 'react';

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
}

// ============================================
// MOCK USERS - Available for selection on login
// ============================================

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Sarah Mitchell',
    email: 'vishalpmehta@gmail.com',
    role: 'client',
    assignedClients: [],
    company: 'Acme Corp',
  },
  {
    id: 'u2',
    name: 'Anish Akkoat',
    email: 'anish.akkoat@datamaticsbpm.com',
    role: 'campaign_manager',
    assignedClients: ['client_1', 'client_2'],
  },
  {
    id: 'u3',
    name: 'Arjun Patel',
    email: 'arjun.patel@datamaticsbpm.com',
    role: 'campaign_backup',
    assignedClients: ['client_1', 'client_3'],
  },
  {
    id: 'u4',
    name: 'Praful Sanil',
    email: 'praful.sanil@datamaticsbpm.com',
    role: 'ops_manager',
    assignedClients: [],
  },
  {
    id: 'u5',
    name: 'Vishal Mehta',
    email: 'vishalpmehta@gmail.com',
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

  // Permission helpers — wrapped in useCallback so their identity stays stable
  // across re-renders. This prevents all context consumers from re-rendering
  // whenever AuthProvider re-renders for any unrelated reason.
  const canUploadLeads = useCallback(() => {
    return currentUser.role === 'ops_manager' || currentUser.role === 'campaign_manager';
  }, [currentUser.role]);

  const canAccessOps = useCallback(() => {
    return currentUser.role === 'ops_manager';
  }, [currentUser.role]);

  const canManageTeam = useCallback(() => {
    return currentUser.role === 'ops_manager';
  }, [currentUser.role]);

  const canEditCampaigns = useCallback(() => {
    return currentUser.role === 'ops_manager' || currentUser.role === 'campaign_manager';
  }, [currentUser.role]);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        canUploadLeads,
        canAccessOps,
        canManageTeam,
        canEditCampaigns,
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