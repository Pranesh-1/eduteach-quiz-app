import { useEffect, useState } from 'react';
import api from '../services/api';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { History, ArrowRight, BookOpen, Clock, Award, Target, Zap, RefreshCw } from 'lucide-react';

export default function QuizHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/attempt/history/');
        setAttempts(res.data);
      } catch (err) {
        if (err.response?.status === 401) router.push('/login');
      } finally { setLoading(false); }
    };
    fetchHistory();
  }, []);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6c63ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const avgScore = attempts.length 
    ? Math.round(attempts.reduce((acc, curr) => acc + (curr.score / curr.total), 0) / attempts.length * 100) 
    : 0;

  return (
    <div style={{ minHeight: 'calc(100vh - 65px)', background: '#0a0a0a', width: '100%' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 20px', zIndex: 1, position: 'relative' }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, #6c63ff, transparent)', top: '-200px', left: '50%', transform: 'translateX(-50%)', opacity: 0.1, filter: 'blur(100px)', zIndex: -1, pointerEvents: 'none' }} />

      {/* Header section with Stats */}
      <div className="fade-in-up" style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(108,99,255,0.15)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: '100px', padding: '8px 20px', marginBottom: '24px' }}>
          <History size={16} color="#a78bfa" />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Performance Tracking</span>
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 900, color: 'white', marginBottom: '32px' }}>Your Learning Journey</h1>

        {attempts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '700px', margin: '0 auto' }}>
            <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15,12,41,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <Target size={24} color="#60a5fa" style={{ marginBottom: '12px' }} />
               <div style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: 1 }}>{attempts.length}</div>
               <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px', fontWeight: 600 }}>Quizzes Taken</div>
            </div>
            <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15,12,41,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <Award size={24} color="#34d399" style={{ marginBottom: '12px' }} />
               <div style={{ fontSize: '32px', fontWeight: 800, color: '#34d399', lineHeight: 1 }}>{avgScore}%</div>
               <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px', fontWeight: 600 }}>Average Score</div>
            </div>
            <div className="glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(15,12,41,0.5)', border: '1px solid rgba(255,255,255,0.05)' }}>
               <Clock size={24} color="#fbbf24" style={{ marginBottom: '12px' }} />
               <div style={{ fontSize: '32px', fontWeight: 800, color: 'white', lineHeight: 1 }}>
                 {attempts.reduce((acc, curr) => acc + curr.total, 0)}
               </div>
               <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '8px', fontWeight: 600 }}>Questions Answered</div>
            </div>
          </div>
        )}
      </div>

      {attempts.length === 0 ? (
        <div className="glass fade-in-up" style={{ padding: '64px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'rgba(108,99,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <BookOpen size={40} color="#a78bfa" />
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>No quizzes yet</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '32px', fontSize: '16px' }}>Generate your first AI-powered quiz and start accelerating your learning.</p>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', color: 'white', textDecoration: 'none', fontSize: '16px', fontWeight: 700, boxShadow: '0 8px 25px -8px rgba(108,99,255,0.5)' }}>
            <Zap size={18} fill="white" /> Start Your First Quiz
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {attempts.map((attempt, idx) => {
            const percentage = Math.round((attempt.score / attempt.total) * 100);
            const isExcellent = percentage >= 80;
            const isGood = percentage >= 60;
            const scoreColor = isExcellent ? '#34d399' : isGood ? '#fbbf24' : '#f87171';
            const date = new Date(attempt.completed_at);
            
            return (
              <div key={attempt.id} className="fade-in-up">
                <div className="glass" style={{ padding: '24px 32px', display: 'flex', alignItems: 'center', gap: '24px', borderLeft: `6px solid ${scoreColor}`, background: 'rgba(15,12,41,0.5)' }}>
                  
                  {/* Score Indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '80px', paddingRight: '24px', borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '32px', fontWeight: 900, color: scoreColor, lineHeight: 1, filter: `drop-shadow(0 0 10px ${scoreColor}40)` }}>{percentage}%</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score</div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 700, color: 'white', marginBottom: '8px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                      {attempt.quiz_topic || `Quiz #${attempt.quiz}`}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Target size={14} /> {attempt.score} / {attempt.total} Correct</span>
                      {date && !isNaN(date) && <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <Link
                      href={`/quiz/${attempt.quiz}`}
                      title="Retake this quiz"
                      style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', transition: 'all 0.2s', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.25)'; e.currentTarget.style.transform = 'rotate(-15deg) scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(167,139,250,0.1)'; e.currentTarget.style.transform = 'rotate(0deg) scale(1)'; }}
                    >
                      <RefreshCw size={18} />
                    </Link>
                    <Link
                      href={`/result/${attempt.id}`}
                      title="View results"
                      style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.5)', transition: 'all 0.2s', textDecoration: 'none' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateX(3px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
