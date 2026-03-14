import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import Link from 'next/link';
import { UserPlus, Zap, Eye, EyeOff, User, Mail, Lock, Trophy, Clock, BarChart2 } from 'lucide-react';

const PERKS = [
  { icon: <Trophy size={20} />, title: 'Challenge Yourself', desc: 'Easy, Medium, or Hard — your choice' },
  { icon: <Clock size={20} />, title: 'Timed Quizzes', desc: 'Race against the clock to test recall' },
  { icon: <BarChart2 size={20} />, title: 'Score History', desc: 'See how you improve over time' },
];

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await api.post('/auth/register', { username, email, password });
      router.push('/login?registered=true');
    } catch (err) {
      if (!err.response) {
        setErrors({ general: 'Could not connect to the server. Please try again.' });
      } else {
        const data = err.response?.data;
        if (data && typeof data === 'object') {
          const fieldErrors = {};
          if (data.username) fieldErrors.username = Array.isArray(data.username) ? data.username[0] : data.username;
          if (data.email) fieldErrors.email = Array.isArray(data.email) ? data.email[0] : data.email;
          if (data.password) fieldErrors.password = Array.isArray(data.password) ? data.password[0] : data.password;
          if (data.non_field_errors) fieldErrors.general = Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
          if (data.detail) fieldErrors.general = data.detail;
          if (Object.keys(fieldErrors).length === 0) fieldErrors.general = `Error ${err.response.status}. Registration failed.`;
          setErrors(fieldErrors);
        } else {
          setErrors({ general: `Error ${err.response?.status || 'unknown'}. Registration failed.` });
        }
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', background: '#0a0a0a', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-16px)} }
        @keyframes pulse-ring { 0%{transform:scale(0.9);opacity:0.6} 100%{transform:scale(1.3);opacity:0} }
        .auth-input { width: 100%; padding: 14px 16px 14px 48px; font-size: 15px; background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.08); border-radius: 14px; color: white; outline: none; transition: all 0.2s; font-family: inherit; box-sizing: border-box; }
        .auth-input::placeholder { color: rgba(255,255,255,0.2); }
        .auth-input:focus { border-color: rgba(52,211,153,0.5); background: rgba(52,211,153,0.04); }
        .auth-input.err { border-color: rgba(248,113,113,0.5) !important; }
      `}</style>

      {/* LEFT: Visual Panel — teal/green theme */}
      <div style={{ flex: '0 0 48%', background: 'linear-gradient(135deg, #061a14 0%, #0a2e22 50%, #071c18 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px', position: 'relative', overflow: 'hidden', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, #34d399, transparent)', top: '-200px', left: '-200px', opacity: 0.2, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, #6ee7b7, transparent)', bottom: '-150px', right: '-150px', opacity: 0.15, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '50px 50px', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '48px' }}>
            <div style={{ position: 'absolute', inset: '-12px', borderRadius: '28px', background: 'rgba(52,211,153,0.3)', animation: 'pulse-ring 2s ease-out infinite' }} />
            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'linear-gradient(135deg, #34d399, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 60px rgba(52,211,153,0.5)', position: 'relative', animation: 'float 4s ease-in-out infinite' }}>
              <Zap size={36} color="white" fill="white" />
            </div>
          </div>

          <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'white', marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
            Join <span style={{ background: 'linear-gradient(135deg, #34d399, #6ee7b7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>QuizAI</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '17px', lineHeight: 1.6, marginBottom: '56px' }}>
            Start your journey to mastering any subject with AI-powered quizzes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            {PERKS.map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '18px 20px', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ width: '40px', height: '40px', minWidth: '40px', borderRadius: '12px', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>{p.icon}</div>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px' }}>{p.title}</div>
                  <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Form Panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 48px', overflowY: 'auto' }}>
        <div className="fade-in-up" style={{ width: '100%', maxWidth: '400px' }}>
          <div style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '30px', fontWeight: 900, color: 'white', marginBottom: '8px', letterSpacing: '-0.01em' }}>Create Account</h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px' }}>Fill in your details to get started</p>
          </div>

          {errors.general && (
            <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#fca5a5', fontSize: '14px', marginBottom: '24px' }}>⚠️ {errors.general}</div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Username</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: errors.username ? '#f87171' : '#34d399' }}><User size={18} /></div>
                <input type="text" required value={username} onChange={e => setUsername(e.target.value)} placeholder="your_username" className={`auth-input${errors.username ? ' err' : ''}`} />
              </div>
              {errors.username && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '6px' }}>⚠ {errors.username}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: errors.email ? '#f87171' : '#34d399' }}><Mail size={18} /></div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className={`auth-input${errors.email ? ' err' : ''}`} />
              </div>
              {errors.email && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '6px' }}>⚠ {errors.email}</p>}
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: errors.password ? '#f87171' : '#34d399' }}><Lock size={18} /></div>
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 8 characters" className={`auth-input${errors.password ? ' err' : ''}`} style={{ paddingRight: '48px' }} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', display: 'flex', padding: 0 }}>
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#f87171', fontSize: '13px', marginTop: '6px' }}>⚠ {errors.password}</p>}
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '17px', borderRadius: '14px', border: 'none', background: loading ? 'rgba(52,211,153,0.3)' : 'linear-gradient(135deg, #34d399, #059669)', color: 'white', fontSize: '16px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: loading ? 'none' : '0 8px 30px -8px rgba(52,211,153,0.5)', transition: 'all 0.2s', marginTop: '8px' }}>
              {loading ? <><svg style={{ animation: 'spin 1s linear infinite', width: '18px', height: '18px' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Creating...</> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '32px', fontSize: '14px', color: 'rgba(255,255,255,0.35)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#34d399', fontWeight: 700, textDecoration: 'none' }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
