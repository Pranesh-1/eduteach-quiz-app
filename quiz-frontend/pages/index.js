import { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../services/api';
import { Sparkles, Brain, Timer, ToggleLeft, ToggleRight, Layers, Target, Zap } from 'lucide-react';

const DIFFICULTIES = [
  { label: 'Easy', color: '#34d399' },
  { label: 'Medium', color: '#fbbf24' },
  { label: 'Hard', color: '#f87171' },
];

export default function Dashboard() {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [numQuestions, setNumQuestions] = useState(10);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = {
        topic,
        difficulty,
        num_questions: numQuestions,
        ...(timerEnabled && { time_limit_minutes: timerMinutes }),
      };
      const res = await api.post('/quiz/generate', payload);
      router.push(`/quiz/${res.data.id}`);
    } catch (err) {
      if (err.response?.status === 401) { router.push('/login'); }
      else { setError(err.response?.data?.error || err.message || 'Failed to generate quiz.'); }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ height: 'calc(100vh - 65px)', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative' }}>
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-glow { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.05); } }
        .dash-input { width: 100%; background: rgba(255,255,255,0.04); border: 1.5px solid rgba(255,255,255,0.07); border-radius: 14px; color: white; outline: none; transition: border-color 0.2s, background 0.2s; font-family: inherit; }
        .dash-input::placeholder { color: rgba(255,255,255,0.2); }
        .dash-input:focus { border-color: rgba(167,139,250,0.5); background: rgba(255,255,255,0.06); }
      `}</style>

      {/* Background orbs */}
      <div style={{ position: 'absolute', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, #6c63ff, transparent)', top: '-400px', left: '-300px', opacity: 0.08, filter: 'blur(60px)', animation: 'pulse-glow 8s ease-in-out infinite', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, #a78bfa, transparent)', bottom: '-300px', right: '-200px', opacity: 0.07, filter: 'blur(80px)', animation: 'pulse-glow 10s ease-in-out infinite reverse', pointerEvents: 'none' }} />

      <div className="fade-in-up" style={{ width: '100%', maxWidth: '760px', padding: '0 20px', position: 'relative', zIndex: 1 }}>
        {/* Header text */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '44px', fontWeight: 900, lineHeight: 1.15, marginBottom: '16px', letterSpacing: '-0.02em', color: 'white' }}>
            Master any topic with<br/>
            <span className="gradient-text">intelligent quizzes</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '18px', lineHeight: 1.5 }}>
            Instantly generate comprehensive practice tests on absolutely any subject.
          </p>
        </div>

        {/* Main Card */}
        <div style={{ background: 'rgba(15,12,41,0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '60px 52px', backdropFilter: 'blur(20px)', boxShadow: '0 30px 80px -20px rgba(0,0,0,0.6)' }}>
          <form onSubmit={handleCreateQuiz} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {error && (
              <div style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.3)', borderRadius: '12px', padding: '14px 16px', color: '#fca5a5', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} /> {error}
              </div>
            )}

            {/* Topic Input */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
                <Brain size={20} color="#a78bfa" />
              </div>
              <input
                type="text" required value={topic} onChange={e => setTopic(e.target.value)}
                placeholder="What do you want to learn today? (e.g., Python, French History...)"
                className="dash-input"
                style={{ padding: '20px 20px 20px 52px', fontSize: '17px', fontWeight: 500 }}
              />
            </div>

            {/* Row: Difficulty + Questions + Timer */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr', gap: '16px' }}>
              
              {/* Difficulty */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={12} /> Difficulty
                </label>
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '5px', border: '1px solid rgba(255,255,255,0.05)', height: '56px' }}>
                  {DIFFICULTIES.map(d => {
                    const isSelected = difficulty === d.label;
                    return (
                      <button
                        type="button" key={d.label} onClick={() => setDifficulty(d.label)}
                        style={{ flex: 1, border: 'none', background: isSelected ? `${d.color}18` : 'transparent', borderRadius: '10px', color: isSelected ? d.color : 'rgba(255,255,255,0.35)', fontWeight: isSelected ? 700 : 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: isSelected ? `0 0 10px ${d.color}20` : 'none' }}>
                        {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Questions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={12} /> Questions
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', height: '56px' }}>
                  <input type="number" min="5" max="20" value={numQuestions}
                    onChange={e => setNumQuestions(Math.max(5, Math.min(20, Number(e.target.value))))}
                    style={{ width: '40px', background: 'none', border: 'none', borderBottom: '2px solid #a78bfa', fontSize: '18px', fontWeight: 800, color: 'white', textAlign: 'center', outline: 'none', padding: 0 }} />
                </div>
              </div>

              {/* Timer */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Timer size={12} /> Timer
                </label>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: timerEnabled ? 'rgba(167,139,250,0.07)' : 'rgba(255,255,255,0.03)', border: `1px solid ${timerEnabled ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', height: '56px', padding: '0 12px', transition: 'all 0.3s' }}>
                  {timerEnabled ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <input type="number" min="1" max="60" value={timerMinutes}
                        onChange={e => setTimerMinutes(Math.max(1, Number(e.target.value)))}
                        style={{ width: '32px', background: 'none', border: 'none', borderBottom: '2px solid #a78bfa', fontSize: '16px', fontWeight: 800, color: 'white', textAlign: 'center', outline: 'none', padding: 0 }} />
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>MIN</span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)' }}>Off</span>
                  )}
                  <div onClick={() => setTimerEnabled(!timerEnabled)} style={{ cursor: 'pointer', display: 'flex' }}>
                    {timerEnabled ? <ToggleRight size={28} color="#a78bfa" /> : <ToggleLeft size={28} color="rgba(255,255,255,0.15)" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '22px', borderRadius: '18px', border: 'none', background: loading ? 'rgba(108,99,255,0.4)' : 'linear-gradient(135deg, #6c63ff, #a78bfa)', color: 'white', fontSize: '18px', fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: loading ? 'none' : '0 8px 30px -8px rgba(108,99,255,0.6)', transition: 'all 0.2s' }}>
              {loading ? (
                <><svg style={{ animation: 'spin 1s linear infinite', width: '20px', height: '20px' }} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/></svg> Generating...</>
              ) : (
                <><Sparkles size={20} /> Generate Quiz →</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
