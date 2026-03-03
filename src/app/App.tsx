import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// DatamaticsBPM Client Portal - Main App Component
export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}