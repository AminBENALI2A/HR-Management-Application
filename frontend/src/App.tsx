import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Auth from './pages/auth/Auth';
import ResetPassword from './pages/auth/ResetPassword';
import UsersList from './pages/users/UsersList';
import PartenairesList from './pages/partenaires/PartenairesList';
import Navbar from './pages/NavBar/NavBar';
import { useState, ComponentType, JSX } from 'react';

// Define the props type for components that can be wrapped
interface WithNavbarProps {
  [key: string]: any;
}

// Higher-Order Component that wraps components with navbar
const withNavbar = <P extends WithNavbarProps>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> => {
  return function WithNavbarComponent(props: P) {
    const [isNavbarCollapsed, setIsNavbarCollapsed] = useState<boolean>(false);

    return (
      <div style={{ 
        position: 'fixed', // Force to viewport
        top: 0,
        left: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        padding: 0
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          width: isNavbarCollapsed ? '80px' : '280px',
          transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}>
          <Navbar onToggle={setIsNavbarCollapsed} />
        </div>
        <div 
          style={{ 
            position: 'absolute',
            top: 0, // Force to very top
            left: isNavbarCollapsed ? '80px' : '280px',
            transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            height: '100vh',
            width: `calc(100vw - ${isNavbarCollapsed ? '80px' : '280px'})`,
            overflow: 'auto',
            backgroundColor: '#f8f9fa',
            margin: 0,
            padding: 0, // Remove all padding initially
            boxSizing: 'border-box'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0, // Force content to absolute top
            left: 0,
            right: 0,
            padding: '20px', // Add padding here instead
            minHeight: 'calc(100vh - 40px)', // Account for padding
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch'
          }}>
            <WrappedComponent {...props} />
          </div>
        </div>
      </div>
    );
  };
};

// Wrap your protected page components with the navbar HOC
const UsersListWithNavbar = withNavbar(UsersList);
const PartenairesListWithNavbar = withNavbar(PartenairesList);

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes (no navbar) */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected routes with navbar HOC */}
        <Route path="/" element={<UsersListWithNavbar />} />
        <Route path="/users" element={<UsersListWithNavbar />} />
        <Route path="/partenaires" element={<PartenairesListWithNavbar />} />
        
        {/* Catch-all route for 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;