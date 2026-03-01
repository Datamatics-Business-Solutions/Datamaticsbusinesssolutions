import { Link, useLocation } from 'react-router';

interface NavigationProps {
  userType: 'client' | 'internal';
}

export function Navigation({ userType }: NavigationProps) {
  const location = useLocation();
  
  const tabs = userType === 'client' 
    ? [
        { name: 'Campaigns', path: '/campaigns' },
        { name: 'Invoices', path: '/invoices' },
        { name: 'Account', path: '/account' }
      ]
    : [
        { name: 'Dashboard', path: '/internal/dashboard' },
        { name: 'Campaigns', path: '/internal/campaigns' },
        { name: 'Reports', path: '/internal/reports' }
      ];

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={userType === 'client' ? '/campaigns' : '/internal/campaigns'} className="flex items-center">
              <div className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                DatamaticsBPM
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path || 
                             (tab.path !== '/campaigns' && location.pathname.startsWith(tab.path));
              return (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-purple-600 border-b-2 border-purple-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
