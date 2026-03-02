import { createBrowserRouter } from 'react-router';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import CampaignList from './pages/CampaignList';
import CampaignDetailGlass from './pages/CampaignDetailGlass';
import Invoices from './pages/Invoices';
import Payment from './pages/Payment';
import Account from './pages/Account';
import ReportsPage from './pages/ReportsPage';
import LeadsPage from './pages/LeadsPage';
import LeadUploadDashboard from './pages/LeadUploadDashboard';
import Documents from './pages/Documents';
import Support from './pages/Support';
import InternalDashboard from './pages/InternalDashboard';
import InternalCampaignList from './pages/InternalCampaignList';
import InternalCampaignDetail from './pages/InternalCampaignDetail';
import InternalReports from './pages/InternalReports';
import OpsOverviewPage from './pages/OpsOverviewPage';
import ManagerDashboardPage from './pages/ManagerDashboardPage';
import TeamManagementPage from './pages/TeamManagementPage';
import ErrorBoundary from './pages/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/dashboard',
    Component: HomePage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/dashboard/ops',
    Component: OpsOverviewPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/dashboard/ops/team',
    Component: TeamManagementPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/dashboard/manager',
    Component: ManagerDashboardPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/campaigns',
    Component: Dashboard,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/campaigns/:id',
    Component: CampaignDetailGlass,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/leads',
    Component: LeadsPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/reports',
    Component: ReportsPage,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/invoices',
    Component: Invoices,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/payment/:invoiceId',
    Component: Payment,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/documents',
    Component: Documents,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/support',
    Component: Support,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/account',
    Component: Account,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/dashboard',
    Component: InternalDashboard,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/campaigns',
    Component: InternalCampaignList,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/campaigns/:id',
    Component: InternalCampaignDetail,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/reports',
    Component: InternalReports,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/leads',
    Component: LeadUploadDashboard,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '/internal/uploads',
    Component: LeadUploadDashboard,
    ErrorBoundary: ErrorBoundary,
  },
  {
    path: '*',
    Component: ErrorBoundary,
  },
]);