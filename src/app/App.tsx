import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';

// Main App Component - DatamaticsBPM Client Portal (Light Mode Only)
// Router properly configured with react-router v7
export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}