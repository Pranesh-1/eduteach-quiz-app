import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const PUBLIC_PAGES = ['/login', '/register'];

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const isPublicPage = PUBLIC_PAGES.includes(router.pathname);
  const [authorized, setAuthorized] = useState(isPublicPage); // public pages are pre-authorized

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      if (!isPublicPage) {
        router.replace('/login');
      } else {
        setAuthorized(true);
      }
    } else {
      if (isPublicPage) {
        // Already logged in — redirect away from login/register
        router.replace('/');
      } else {
        setAuthorized(true);
      }
    }
  }, [router.pathname]);

  if (!authorized) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6c63ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', backgroundAttachment: 'fixed', display: 'flex', flexDirection: 'column' }}>
      {!isPublicPage && <Navbar />}
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
