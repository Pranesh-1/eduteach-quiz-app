import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, BookOpen, Clock, Zap } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav style={{
      background: 'rgba(15,12,41,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ width: '100%', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 16px rgba(108,99,255,0.5)'
          }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 800, background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Lumina
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Link href="/" style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            color: isActive('/') ? '#a78bfa' : 'rgba(255,255,255,0.6)',
            background: isActive('/') ? 'rgba(167,139,250,0.12)' : 'transparent',
            transition: 'all 0.2s ease',
          }}>
            <BookOpen size={15} /> Dashboard
          </Link>
          <Link href="/history" style={{
            display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
            color: isActive('/history') ? '#a78bfa' : 'rgba(255,255,255,0.6)',
            background: isActive('/history') ? 'rgba(167,139,250,0.12)' : 'transparent',
            transition: 'all 0.2s ease',
          }}>
            <Clock size={15} /> History
          </Link>
        </div>

        {/* Actions */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '14px', fontWeight: 500,
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; e.currentTarget.style.background = 'rgba(248,113,113,0.08)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
        >
          <LogOut size={15} /> Logout
        </button>
      </div>
    </nav>
  );
}
