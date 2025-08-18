// src/hoc/withAuth.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../utils/checkCredentials';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const ProtectedComponent: React.FC<P> = (props) => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
      (async () => {
        try {
          await checkAuth();   // ✅ check if logged in
          setLoading(false);
          console.log('User is authenticated');
        } catch {
          navigate('/auth');  // ❌ redirect if not
        }
      })();
    }, [navigate]);

    return (
      <>
        <WrappedComponent {...props} />
        {loading && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // dim overlay
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}>
            <div className="spinner" />
          </div>
        )}

        {/* Spinner CSS can go in a global CSS file */}
        <style>
          {`
            .spinner {
              border: 6px solid #f3f3f3;
              border-top: 6px solid #3498db;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </>
    );
  };

  return ProtectedComponent;
}
