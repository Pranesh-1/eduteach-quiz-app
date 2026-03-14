import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';
import { ChevronLeft, ChevronRight, CheckCircle2, Zap, AlertCircle } from 'lucide-react';

export default function QuizAttempt() {
  const router = useRouter();
  const { id } = router.query;
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quiz/${id}`);
        setQuiz(res.data);
        if (res.data.time_limit_minutes) setTimeLeft(res.data.time_limit_minutes * 60);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err.response?.data?.error || 'Failed to load quiz. Please make sure the link is correct.');
        }
      } finally { setLoading(false); }
    };
    fetchQuiz();
  }, [id, router]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmitError('');
    const formattedAnswers = Object.entries(answers).map(([qId, opt], idx) => ({ question_id: parseInt(qId), selected_option: opt, order: idx }));
    try {
      const res = await api.post(`/quiz/${id}/submit`, { answers: formattedAnswers });
      router.push(`/result/${res.data.id}`);
    } catch (err) {
      console.error('Submit error:', err.response?.status, err.response?.data);
      if (err.response?.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        router.push('/login');
        return;
      }
      setSubmitError(err.response?.data?.error || 'Submission failed. Please try again.');
      setSubmitting(false);
    }
  }, [answers, id, submitting, router]);

  useEffect(() => {
    if (timeLeft === null || submitting) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitting, handleSubmit]);

  if (loading) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#0a0a0a' }}>
      <div style={{ width: '48px', height: '48px', border: '3px solid rgba(167,139,250,0.2)', borderTop: '3px solid #a78bfa', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', fontWeight: 600 }}>Loading Quiz environment...</p>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px', background: '#0a0a0a', padding: '24px', textAlign: 'center' }}>
      <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AlertCircle size={32} color="#fca5a5" />
      </div>
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: 'white', marginBottom: '8px' }}>Oops! Something went wrong</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '16px', maxWidth: '400px' }}>{error}</p>
      </div>
      <button 
        onClick={() => router.push('/')}
        style={{ padding: '12px 24px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, cursor: 'pointer' }}
      >
        Return to Dashboard
      </button>
    </div>
  );

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const progress = ((currentIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const isTimeLow = timeLeft !== null && timeLeft < 60;

  const OPTIONS = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 65px)', background: '#0a0a0a', overflow: 'hidden' }}>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }`}</style>
      
      {/* LEFT SIDEBAR */}
      <div style={{ width: '320px', borderRight: '1px solid rgba(255,255,255,0.05)', background: 'rgba(15,12,41,0.5)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)' }}>
        <div style={{ padding: '32px 24px', flex: 1, overflowY: 'auto' }}>
          
          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>Course</p>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'white', lineHeight: 1.3 }}>{quiz.topic}</h1>
            <div style={{ display: 'inline-block', marginTop: '10px', fontSize: '12px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>
              {quiz.difficulty} Level
            </div>
          </div>

          <div style={{ marginBottom: '32px' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progress</span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#a78bfa' }}>{answeredCount}/{quiz.questions.length}</span>
             </div>
             <div className="progress-track">
               <div className="progress-fill" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6c63ff, #a78bfa)' }} />
             </div>
          </div>

          <div>
             <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '16px' }}>Question Map</span>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {quiz.questions.map((q, idx) => {
                  const isCurrent = idx === currentIndex;
                  const isAnswered = !!answers[q.id];
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        aspectRatio: '1', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                        border: isCurrent ? '2px solid #a78bfa' : isAnswered ? '2px solid #34d399' : '2px solid transparent',
                        background: isCurrent ? 'rgba(167,139,250,0.15)' : isAnswered ? 'rgba(52,211,153,0.15)' : 'rgba(255,255,255,0.05)',
                        color: isCurrent ? '#a78bfa' : isAnswered ? '#34d399' : 'rgba(255,255,255,0.4)'
                      }}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
          <button
            onClick={() => {
              const unanswered = quiz.questions.filter(q => !answers[q.id]).length;
              if (unanswered > 0) { setShowConfirm(true); } else { handleSubmit(); }
            }}
            disabled={submitting}
            className="glow-btn"
            style={{ width: '100%', padding: '16px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'white', fontSize: '15px', fontWeight: 700 }}
          >
            {submitting ? <><svg style={{ animation: 'spin 1s linear infinite', width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Submitting...</> : <><Zap size={16} fill="white" /> Submit Exam</>}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: 'calc(100vh - 65px)' }}>
        
        {/* Fixed Header Timer Bar */}
        <div style={{ zIndex: 40, background: isTimeLow ? 'rgba(248,113,113,0.95)' : 'rgba(15,12,41,0.95)', borderBottom: `1px solid ${isTimeLow ? 'rgba(248,113,113,0.3)' : 'rgba(255,255,255,0.05)'}`, padding: '16px 40px', display: 'flex', justifyContent: 'center', transition: 'background 0.3s', opacity: timeLeft !== null ? 1 : 0, pointerEvents: timeLeft !== null ? 'auto' : 'none', flexShrink: 0 }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: isTimeLow ? '#fee2e2' : '#a78bfa', fontSize: '20px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', animation: isTimeLow ? 'shake 0.5s infinite' : 'none' }}>
             ⏱ {timeLeft !== null ? formatTime(timeLeft) : '00:00'} <span style={{ fontSize: '13px', fontWeight: 600, color: isTimeLow ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Remaining</span>
           </div>
        </div>

        {/* Scrollable question area */}
        <div style={{ flex: 1, padding: '32px 40px', display: 'flex', justifyContent: 'center', overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column' }}>
            
            {/* Error Banner */}
            {submitError && (
              <div style={{ marginBottom: '24px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.3)', color: '#fca5a5', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <AlertCircle size={18} />
                {submitError}
                <button onClick={() => setSubmitError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fca5a5', cursor: 'pointer', fontSize: '20px', lineHeight: 1 }}>×</button>
              </div>
            )}

            {/* Question Card — min-height ensures stable layout */}
            <div className="fade-in-up" key={currentIndex} style={{ flex: 1  }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', marginBottom: '40px' }}>
                <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                  <span style={{ minWidth: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color: 'rgba(255,255,255,0.5)' }}>Q{currentIndex + 1}</span>
                  <h2 style={{ fontSize: '24px', fontWeight: 600, color: 'white', lineHeight: 1.5, marginTop: '2px' }}>{currentQuestion.question_text}</h2>
                </div>
                
                {/* Unselect Button — always rendered to prevent layout shift */}
                <button 
                  onClick={() => {
                    const newAnswers = { ...answers };
                    delete newAnswers[currentQuestion.id];
                    setAnswers(newAnswers);
                  }}
                  style={{ padding: '8px 16px', borderRadius: '8px', background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#fca5a5', fontSize: '13px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', opacity: answers[currentQuestion.id] ? 1 : 0, pointerEvents: answers[currentQuestion.id] ? 'auto' : 'none', transition: 'opacity 0.2s' }}
                >
                  <span>✕</span> Clear Answer
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                {OPTIONS.map((label) => {
                  const text = currentQuestion[`option_${label.toLowerCase()}`];
                  if (!text) return null;
                  const isSelected = answers[currentQuestion.id] === label;
                  return (
                    <div key={label} onClick={() => setAnswers({ ...answers, [currentQuestion.id]: label })} className="option-card glass" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px', borderRadius: '16px', cursor: 'pointer', borderColor: isSelected ? '#a78bfa' : 'rgba(255,255,255,0.05)', background: isSelected ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.02)' }}>
                      <div style={{ width: '36px', height: '36px', minWidth: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '15px', background: isSelected ? 'linear-gradient(135deg, #6c63ff, #a78bfa)' : 'rgba(255,255,255,0.05)', color: isSelected ? 'white' : 'rgba(255,255,255,0.4)', transition: 'all 0.2s' }}>{label}</div>
                      <span style={{ color: isSelected ? 'white' : 'rgba(255,255,255,0.8)', fontSize: '17px', fontWeight: isSelected ? 600 : 400 }}>{text}</span>
                      {isSelected && <CheckCircle2 size={22} color="#a78bfa" style={{ marginLeft: 'auto' }} />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Bottom Nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: 'auto' }}>
              <button onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: currentIndex === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.8)', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer', fontSize: '15px', fontWeight: 600, transition: 'all 0.2s' }}>
                <ChevronLeft size={18} /> Previous
              </button>
              
              {!isLast ? (
                <button onClick={() => setCurrentIndex(i => i + 1)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 24px', borderRadius: '12px', background: 'rgba(108,99,255,0.2)', border: '1px solid rgba(108,99,255,0.3)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 700, transition: 'all 0.2s' }}>
                  Next <ChevronRight size={18} />
                </button>
              ) : (
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '14px', fontWeight: 600 }}>End of Questions</div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Unanswered Confirmation Modal */}
      {showConfirm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="glass" style={{ maxWidth: '420px', width: '100%', padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '28px' }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: 'white', marginBottom: '12px' }}>Unanswered Questions</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', lineHeight: 1.6, marginBottom: '8px' }}>
              You have <strong style={{ color: '#fbbf24', fontSize: '18px' }}>{quiz.questions.filter(q => !answers[q.id]).length}</strong> question(s) left unanswered.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', marginBottom: '32px' }}>
              Unanswered questions will be marked as incorrect. Are you sure you want to submit?
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirm(false)} style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', fontSize: '15px', fontWeight: 600 }}>
                Return to Quiz
              </button>
              <button onClick={() => { setShowConfirm(false); handleSubmit(); }} className="glow-btn" style={{ flex: 1, padding: '14px', borderRadius: '12px', color: 'white', fontSize: '15px', fontWeight: 700 }}>
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
