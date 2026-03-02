import { RouterProvider } from 'react-router';
import { router } from './routes.tsx';
import { AuthProvider } from './context/AuthContext';

// Main App Component - DatamaticsBPM Client Portal (Light Mode Only)
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}