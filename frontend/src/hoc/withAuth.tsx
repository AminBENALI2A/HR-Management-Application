// src/hoc/withAuth.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import checkAuth from '../scripts/checkCredentials';

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
          navigate('/Auth');  // ❌ redirect if not
        }
      })();
    }, [navigate]);

    if (loading) return <p>Checking authentication...</p>;

    return <WrappedComponent {...props} />;
  };

  return ProtectedComponent;
}
