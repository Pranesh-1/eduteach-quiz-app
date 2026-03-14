import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import Link from 'next/link';
import { CheckCircle, XCircle, Trophy, RotateCcw, Clock, Lightbulb, RefreshCw, MinusCircle } from 'lucide-react';

export default function AttemptResult() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    if (!id) return;
    const fetchResult = async () => {
      try {
        const res = await api.get(`/attempt/${id}`);
        setResult(res.data);
      } catch (err) {
        if (err.response?.status === 401) router.push('/login');
      } finally { setLoading(false); }
    };
    fetchResult();
  }, [id]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid rgba(108,99,255,0.3)', borderTop: '3px solid #6c63ff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!result) return <div style={{ textAlign: 'center', marginTop: '80px', color: 'rgba(255,255,255,0.4)' }}>Result not found</div>;

  const percentage = Math.round((result.score / result.total) * 100);
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;
  const scoreColor = isExcellent ? '#34d399' : isGood ? '#fbbf24' : '#f87171';
  const scoreLabel = isExcellent ? '🏆 Excellent!' : isGood ? '👍 Good job!' : '💪 Keep practicing!';

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(400px, 1fr) minmax(500px, 1.5fr)', minHeight: 'calc(100vh - 65px)', background: '#0a0a0a' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes dashAnim { from { stroke-dashoffset: ${circumference}; } to { stroke-dashoffset: ${strokeDashoffset}; } }`}</style>

      {/* LEFT COLUMN: Fixed Score Hero */}
      <div style={{ position: 'sticky', top: '64px', height: 'calc(100vh - 65px)', padding: '60px 40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid rgba(255,255,255,0.05)', background: `linear-gradient(180deg, rgba(15,12,41,0.5) 0%, ${scoreColor}08 100%)`, overflowY: 'auto' }}>
        <div className="fade-in-up" style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>Quiz Complete</p>
          {result.quiz_topic && <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'white', marginBottom: '48px', lineHeight: 1.2 }}>{result.quiz_topic}</h1>}

          {/* Circular Progress */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg width="180" height="180" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                <circle cx="90" cy="90" r="80" fill="none" stroke={scoreColor} strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 80} strokeDashoffset={(2 * Math.PI * 80) - (percentage / 100) * (2 * Math.PI * 80)}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 12px ${scoreColor}60)` }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '42px', fontWeight: 900, color: scoreColor }}>{percentage}%</span>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>{scoreLabel}</div>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px' }}>You scored <strong style={{ color: 'white' }}>{result.score}</strong> out of <strong style={{ color: 'white' }}>{result.total}</strong> questions correctly.</p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '48px' }}>
            <Link href={`/quiz/${result.quiz}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '14px', background: 'linear-gradient(135deg, #6c63ff, #a78bfa)', color: 'white', textDecoration: 'none', fontSize: '15px', fontWeight: 700, boxShadow: '0 8px 25px -8px rgba(108,99,255,0.5)' }}>
              <RefreshCw size={18} /> Retake Quiz
            </Link>
            <Link href="/" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>
              <RotateCcw size={18} /> Generate New Quiz
            </Link>
            <Link href="/history" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '16px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'rgba(255,255,255,0.45)', textDecoration: 'none', fontSize: '14px', fontWeight: 600 }}>
              <Clock size={16} /> View History
            </Link>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Scrollable Answer Feed */}
      <div style={{ padding: '60px 8%', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '700px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={20} color="#a78bfa" />
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'white' }}>Detailed Review</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {result.answers.map((ans, idx) => {
              const isCorrect = ans.is_correct;
              const isMissed = ans.selected_option === "" || ans.selected_option === null || ans.selected_option === undefined;
              const color = isCorrect ? '#34d399' : isMissed ? '#fbbf24' : '#f87171';
              const isOpen = expanded[idx];
              
              return (
                <div key={idx} className="glass fade-in-up" style={{ borderLeft: `5px solid ${color}`, overflow: 'hidden', padding: 0 }}>
                  <div onClick={() => setExpanded(p => ({ ...p, [idx]: !p[idx] }))} style={{ padding: '24px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '16px', background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent', transition: 'background 0.2s' }}>
                    <div style={{ marginTop: '2px' }}>
                      {isCorrect ? <CheckCircle size={24} color="#34d399" /> : isMissed ? <MinusCircle size={24} color="#fbbf24" /> : <XCircle size={24} color="#f87171" />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'rgba(255,255,255,0.3)', padding: '2px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)' }}>Q{idx + 1}</span>
                        {isMissed && <span style={{ fontSize: '11px', fontWeight: 800, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Missed</span>}
                      </div>
                      <span style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)', fontWeight: 500, lineHeight: 1.5 }}>{ans.question_text}</span>
                    </div>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.3s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '18px', display: 'flex' }}>▾</span>
                    </div>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                        <div style={{ padding: '16px', borderRadius: '12px', background: isCorrect ? 'rgba(52,211,153,0.1)' : isMissed ? 'rgba(251,191,36,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${isCorrect ? 'rgba(52,211,153,0.2)' : isMissed ? 'rgba(251,191,36,0.2)' : 'rgba(248,113,113,0.2)'}` }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Your Answer</p>
                          <p style={{ fontWeight: 700, fontSize: '15px', color: isCorrect ? '#34d399' : isMissed ? '#fbbf24' : '#f87171' }}>
                            {isMissed ? 'NOT ANSWERED' : `Option ${ans.selected_option}`}
                          </p>
                        </div>
                        {!isCorrect && (
                          <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
                            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>Correct Answer</p>
                            <p style={{ fontWeight: 700, fontSize: '15px', color: '#34d399' }}>Option {ans.correct_answer}</p>
                          </div>
                        )}
                      </div>
                      {ans.explanation && (
                        <div style={{ marginTop: '16px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                          <div style={{ width: '28px', height: '28px', minWidth: '28px', borderRadius: '8px', background: 'rgba(167,139,250,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lightbulb size={16} color="#a78bfa" />
                          </div>
                          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, paddingTop: '3px' }}>{ans.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
