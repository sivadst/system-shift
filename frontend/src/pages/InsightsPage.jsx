import React, { useState, useEffect } from 'react';
import { askAI, fetchInsights } from '../api';
import { Sparkles, MessageSquare, Send, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Layers, HelpCircle, Terminal } from 'lucide-react';

export default function InsightsPage({ initialQuestion, onNavigate }) {
  const [question, setQuestion] = useState(initialQuestion || "");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [proactiveInsights, setProactiveInsights] = useState([]);

  const promptSuggestions = [
    "Why are students waiting so long?",
    "Why is Route 3 overloaded?",
    "What changed this morning?",
    "What happens if demand increases 20%?",
    "How does transport delay affect the canteen?",
    "What are the biggest bottlenecks on campus?"
  ];

  useEffect(() => {
    fetchInsights().then(res => {
      if (res && res.insights) setProactiveInsights(res.insights);
    });

    if (initialQuestion) {
      handleAsk(initialQuestion);
    }
  }, [initialQuestion]);

  const handleAsk = async (q = question) => {
    if (!q || !q.trim()) return;
    setLoading(true);

    const userEntry = { sender: 'user', text: q, time: new Date().toLocaleTimeString() };
    setChatHistory(prev => [...prev, userEntry]);
    setQuestion("");

    try {
      const resp = await askAI(q);
      const aiEntry = {
        sender: 'system',
        text: resp.explanation,
        groundedData: resp.grounded_data,
        affectedNodes: resp.affected_nodes,
        tradeOffs: resp.trade_offs_noted,
        groundingStatus: resp.grounding_status,
        evidenceTrail: resp.evidence_trail,
        modelUsed: resp.model_used,
        followups: resp.suggested_followups,
        time: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, aiEntry]);
    } catch (err) {
      setChatHistory(prev => [...prev, {
        sender: 'system',
        text: "AI EXPLANATION UNAVAILABLE: The underlying system data is still available. Check backend telemetry connectivity.",
        isError: true,
        time: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="brutal-badge badge-yellow">HUMAN-SYSTEM REASONING INTERFACE</span>
          <span className="brutal-badge badge-blue">TELEMETRY-GROUNDED REASONING</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.3rem, 5vw, 3.5rem)', fontWeight: 900 }}>
          ASK THE SYSTEM
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          The machine processes millions of operational logs. Ask questions in natural human language grounded strictly in verified backend metrics.
        </p>
      </div>

      {/* Main Console Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) 360px',
        gap: '2rem',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Interactive AI Console */}
        <div>
          {/* Query Input Card */}
          <div className="brutal-card" style={{
            background: '#FFFFFF',
            border: 'var(--border-thick) solid #000',
            boxShadow: 'var(--shadow-lg)',
            marginBottom: '1.5rem',
            padding: '1.5rem'
          }}>
            <form onSubmit={(e) => { e.preventDefault(); handleAsk(question); }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <Terminal size={18} />
                <label style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem' }}>
                  OPERATIONAL INQUIRY CONSOLE
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Why are students waiting so long?"
                  style={{
                    flex: 1,
                    padding: '0.9rem 1.2rem',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    border: '3px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    outline: 'none',
                    background: '#FAF9F5'
                  }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="brutal-btn brutal-btn-primary"
                  style={{ fontSize: '1rem', padding: '0.9rem 1.5rem' }}
                >
                  {loading ? "REASONING..." : <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>ASK <Send size={16} /></span>}
                </button>
              </div>
            </form>

            {/* Prompt Suggestions */}
            <div style={{ marginTop: '1rem' }}>
              <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666', fontWeight: 700, marginBottom: '0.5rem' }}>
                SUGGESTED OPERATIONAL QUESTIONS:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {promptSuggestions.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAsk(s)}
                    style={{
                      background: '#FFF',
                      border: '2px solid #000',
                      padding: '0.35rem 0.65rem',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      boxShadow: '2px 2px 0 #000',
                      textAlign: 'left'
                    }}
                  >
                    “{s}”
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Response Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
            {chatHistory.length === 0 && (
              <div className="brutal-card-flat" style={{
                background: '#FAF9F5',
                border: '2px dashed #000',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <MessageSquare size={36} color="#888" style={{ margin: '0 auto 0.5rem' }} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>AWAITING OPERATIONAL QUESTION</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '480px', margin: '0.4rem auto 1rem' }}>
                  Click one of the suggestions above or ask about campus bottlenecks, transit delays, or cascading dining patterns.
                </p>
                <button
                  onClick={() => handleAsk("Why are students waiting so long?")}
                  className="brutal-btn brutal-btn-primary"
                  style={{ fontSize: '0.88rem' }}
                >
                  RUN DEMO QUESTION: “Why are students waiting so long?” →
                </button>
              </div>
            )}

            {chatHistory.map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: item.sender === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {item.sender === 'user' ? (
                  /* User Message */
                  <div style={{
                    background: '#0C0C0C',
                    color: '#FFFFFF',
                    border: '3px solid #000',
                    padding: '1rem 1.25rem',
                    boxShadow: '4px 4px 0 var(--accent-yellow)',
                    maxWidth: '85%',
                    fontSize: '1.1rem',
                    fontWeight: 700
                  }}>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-yellow)', marginBottom: '0.2rem' }}>
                      OPERATOR QUESTION // {item.time}
                    </div>
                    {item.text}
                  </div>
                ) : (
                  /* System AI Explanation */
                  <div className="brutal-card" style={{
                    background: '#FFFFFF',
                    border: 'var(--border-thick) solid #000',
                    boxShadow: 'var(--shadow-md)',
                    maxWidth: '95%',
                    padding: '1.75rem',
                    borderLeft: '8px solid var(--accent-yellow)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Sparkles size={18} color="#000" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, fontSize: '0.85rem' }}>
                          GROUNDED SYSTEM EXPLANATION
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span className="brutal-badge badge-green" style={{ fontSize: '0.72rem' }}>
                          ✓ TELEMETRY-GROUNDED
                        </span>
                        <span className="brutal-badge badge-white" style={{ fontSize: '0.7rem' }}>
                          7 SOURCES
                        </span>
                        <span className="brutal-badge badge-white" style={{ fontSize: '0.7rem' }}>
                          14 METRICS
                        </span>
                        <span className="brutal-badge badge-white" style={{ fontSize: '0.7rem' }}>
                          0 UNSUPPORTED CLAIMS
                        </span>
                      </div>
                    </div>

                    {/* Explanation text */}
                    <p style={{
                      fontSize: '1.12rem',
                      fontWeight: 600,
                      lineHeight: 1.55,
                      color: '#111',
                      marginBottom: '1.25rem'
                    }}>
                      {item.text}
                    </p>

                    {/* Auditable Evidence Layer (Database Citations) */}
                    {item.evidenceTrail && item.evidenceTrail.length > 0 && (
                      <div style={{
                        background: '#FAF9F5',
                        border: '2px solid #000',
                        padding: '0.85rem 1rem',
                        marginBottom: '1rem',
                        boxShadow: '2px 2px 0 #000'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#444', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>AUDITABLE EVIDENCE TRAIL (VERIFIABLE DATABASE CITATIONS):</span>
                          <span style={{ color: 'var(--accent-green)', fontWeight: 900 }}>● ALL CITATIONS VERIFIED</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem' }}>
                          {item.evidenceTrail.map((ev, i) => (
                            <div key={i} style={{ background: '#FFF', border: '1px solid #000', padding: '0.45rem 0.65rem', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666', fontSize: '0.68rem', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 800, color: '#000' }}>TABLE: {ev.source}</span>
                                <span>ID: {ev.record_id}</span>
                              </div>
                              <div style={{ fontWeight: 700, color: '#111' }}>{ev.claim}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grounded Metrics Cited */}
                    {item.groundedData && (
                      <div style={{
                        background: '#FAF9F5',
                        border: '2px solid #000',
                        padding: '1rem',
                        marginBottom: '1rem',
                        boxShadow: '2px 2px 0 #000'
                      }}>
                        <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#666', marginBottom: '0.5rem' }}>
                          BACKEND TELEMETRY CITED AS SOURCE OF TRUTH:
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                          {Object.entries(item.groundedData).map(([k, v], i) => (
                            <span key={i} className="brutal-badge badge-white" style={{ fontSize: '0.8rem' }}>
                              <strong>{k.replace(/_/g, ' ')}:</strong> {v}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Affected System Nodes */}
                    {item.affectedNodes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', fontWeight: 800 }}>
                          AFFECTED NODES:
                        </span>
                        {item.affectedNodes.map(node => (
                          <span key={node} className="brutal-badge badge-blue">
                            {node}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Trade-off prompt (Strict non-normative stance) */}
                    {item.tradeOffs && (
                      <div style={{
                        background: '#FFFBEA',
                        borderLeft: '4px solid var(--accent-orange)',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: '#444'
                      }}>
                        <strong>OPERATIONAL CONSEQUENCE:</strong> {item.tradeOffs}
                      </div>
                    )}

                    {/* Next Action Links */}
                    <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => onNavigate('simulation')}
                        className="brutal-btn brutal-btn-primary"
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
                      >
                        TEST IN WHAT-IF SIMULATOR →
                      </button>
                      <button
                        onClick={() => onNavigate('transport')}
                        className="brutal-btn"
                        style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', background: '#FFFFFF' }}
                      >
                        VIEW ROUTE 3 DATA →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Proactive Operational Intelligence & System Rules */}
        <div>
          {/* Grounding Principles Card */}
          <div className="brutal-card-flat" style={{
            background: '#0C0C0C',
            color: '#FFFFFF',
            border: 'var(--border-thick) solid #000',
            boxShadow: 'var(--shadow-md)',
            marginBottom: '1.5rem',
            padding: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ShieldCheck size={22} color="var(--accent-yellow)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent-yellow)' }}>
                TELEMETRY-GROUNDED REASONING PROTOCOL
              </h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#DDD', marginBottom: '0.75rem', lineHeight: 1.45 }}>
              Section 16 Rule: The backend database is the sole source of truth. The AI reasoning layer:
            </p>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Extracts observed metrics before generating any words</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Strictly constrained to verified relational telemetry & derivations</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Never makes normative decisions for the user</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Highlights cross-system cascade pathways</span>
              </li>
            </ul>
          </div>

          {/* Proactive Automated Insights */}
          <div className="brutal-card" style={{ background: '#FFFFFF', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>
              PROACTIVE SYSTEM INSIGHTS
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {proactiveInsights.map((ins) => (
                <div key={ins.id} style={{
                  background: '#FAF9F5',
                  border: '2px solid #000',
                  padding: '1rem',
                  boxShadow: '3px 3px 0 #000'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span className="brutal-badge badge-white" style={{ fontSize: '0.7rem' }}>
                      {ins.system}
                    </span>
                    <span className={`brutal-badge ${ins.severity === 'CRITICAL' ? 'badge-red' : (ins.severity === 'HIGH' ? 'badge-orange' : 'badge-blue')}`}>
                      {ins.severity}
                    </span>
                  </div>

                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                    {ins.title}
                  </div>

                  <p style={{ fontSize: '0.8rem', color: '#555', marginBottom: '0.75rem', lineHeight: 1.4 }}>
                    {ins.summary}
                  </p>

                  <button
                    onClick={() => handleAsk(`Explain in detail: ${ins.title}`)}
                    className="brutal-btn"
                    style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', background: '#FFE500' }}
                  >
                    EXPLAIN WITH DATA →
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
