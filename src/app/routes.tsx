import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';

// Lazy load all pages
const Login = lazy(() => import('./pages/Login'));
const HomePage = lazy(() => import('./pages/HomePage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CampaignList = lazy(() => import('./pages/CampaignList'));
const CampaignDetailGlass = lazy(() => import('./pages/CampaignDetailGlass'));
const Invoices = lazy(() => import('./pages/Invoices'));
const Payment = lazy(() => import('./pages/Payment'));
const Account = lazy(() => import('./pages/Account'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const LeadsPage = lazy(() => import('./pages/LeadsPage'));
const LeadUploadDashboard = lazy(() => import('./pages/LeadUploadDashboard'));
const Documents = lazy(() => import('./pages/Documents'));
const Support = lazy(() => import('./pages/Support'));
const InternalDashboard = lazy(() => import('./pages/InternalDashboard'));
const InternalCampaignList = lazy(() => import('./pages/InternalCampaignList'));
const InternalCampaignDetail = lazy(() => import('./pages/InternalCampaignDetail'));
const InternalReports = lazy(() => import('./pages/InternalReports'));
const OpsOverviewPage = lazy(() => import('./pages/OpsOverviewPage'));
const ManagerDashboardPage = lazy(() => import('./pages/ManagerDashboardPage'));
const TeamManagementPage = lazy(() => import('./pages/TeamManagementPage'));
const ErrorBoundary = lazy(() => import('./pages/ErrorBoundary'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      border: '3px solid #F3F4F6',
      borderTop: '3px solid #BA2027',
      borderRadius: '50%',
      animation: 'spin 600ms linear infinite'
    }} />
  </div>
);

// Wrapper component that adds Suspense to each route
const withSuspense = (Component: React.LazyExoticComponent<any>) => {
  return () => (
    <Suspense fallback={<LoadingFallback />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: withSuspense(Login),
  },
  {
    path: '/dashboard',
    Component: withSuspense(HomePage),
  },
  {
    path: '/dashboard/ops',
    Component: withSuspense(OpsOverviewPage),
  },
  {
    path: '/dashboard/ops/team',
    Component: withSuspense(TeamManagementPage),
  },
  {
    path: '/dashboard/manager',
    Component: withSuspense(ManagerDashboardPage),
  },
  {
    path: '/campaigns',
    Component: withSuspense(Dashboard),
  },
  {
    path: '/campaigns/:id',
    Component: withSuspense(CampaignDetailGlass),
  },
  {
    path: '/leads',
    Component: withSuspense(LeadsPage),
  },
  {
    path: '/reports',
    Component: withSuspense(ReportsPage),
  },
  {
    path: '/invoices',
    Component: withSuspense(Invoices),
  },
  {
    path: '/payment',
    Component: withSuspense(Payment),
  },
  {
    path: '/payment/:invoiceId',
    Component: withSuspense(Payment),
  },
  {
    path: '/documents',
    Component: withSuspense(Documents),
  },
  {
    path: '/support',
    Component: withSuspense(Support),
  },
  {
    path: '/account',
    Component: withSuspense(Account),
  },
  {
    path: '/internal/dashboard',
    Component: withSuspense(InternalDashboard),
  },
  {
    path: '/internal/campaigns',
    Component: withSuspense(InternalCampaignList),
  },
  {
    path: '/internal/campaigns/:id',
    Component: withSuspense(InternalCampaignDetail),
  },
  {
    path: '/internal/reports',
    Component: withSuspense(InternalReports),
  },
  {
    path: '/internal/leads',
    Component: withSuspense(LeadUploadDashboard),
  },
  {
    path: '/internal/uploads',
    Component: withSuspense(LeadUploadDashboard),
  },
  {
    path: '*',
    Component: withSuspense(ErrorBoundary),
  },
]);