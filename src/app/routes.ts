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
import Documents from './pages/Documents';
import Support from './pages/Support';
import InternalDashboard from './pages/InternalDashboard';
import InternalCampaignList from './pages/InternalCampaignList';
import InternalCampaignDetail from './pages/InternalCampaignDetail';
import InternalReports from './pages/InternalReports';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Login,
  },
  {
    path: '/dashboard',
    Component: HomePage,
  },
  {
    path: '/campaigns',
    Component: Dashboard,
  },
  {
    path: '/campaigns/:id',
    Component: CampaignDetailGlass,
  },
  {
    path: '/leads',
    Component: LeadsPage,
  },
  {
    path: '/reports',
    Component: ReportsPage,
  },
  {
    path: '/invoices',
    Component: Invoices,
  },
  {
    path: '/payment/:invoiceId',
    Component: Payment,
  },
  {
    path: '/documents',
    Component: Documents,
  },
  {
    path: '/support',
    Component: Support,
  },
  {
    path: '/account',
    Component: Account,
  },
  {
    path: '/internal/dashboard',
    Component: InternalDashboard,
  },
  {
    path: '/internal/campaigns',
    Component: InternalCampaignList,
  },
  {
    path: '/internal/campaigns/:id',
    Component: InternalCampaignDetail,
  },
  {
    path: '/internal/reports',
    Component: InternalReports,
  },
]);