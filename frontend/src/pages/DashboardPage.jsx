import React from 'react';
import { AlertTriangle, ArrowRight, Bus, Coffee, BookOpen, Wifi, ShieldAlert, Sliders, Sparkles, HelpCircle } from 'lucide-react';

export default function DashboardPage({ dashboardData, onNavigate, onAskAI }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CRITICAL': return 'var(--accent-red)';
      case 'ELEVATED': case 'WARNING': return 'var(--accent-orange)';
      case 'HEALTHY': case 'NORMAL': return 'var(--accent-green)';
      default: return 'var(--accent-blue)';
    }
  };

  const getSystemIcon = (name) => {
    switch (name) {
      case 'TRANSPORT': return Bus;
      case 'CANTEEN': return Coffee;
      case 'LIBRARY': return BookOpen;
      case 'NETWORK': return Wifi;
      default: return ShieldAlert;
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Hero Neo-Brutalist Statement */}
      <section className="brutal-card" style={{
        background: '#FFFFFF',
        marginBottom: '2rem',
        border: 'var(--border-thick) solid #000',
        padding: '2.5rem 2rem'
      }}>
        <div style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
          <span className="brutal-badge badge-yellow" style={{ fontSize: '0.85rem' }}>
            PS05: THE HUMAN–MACHINE GAP // OPERATIONS CONSOLE
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.2rem, 5vw, 4rem)',
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
          maxWidth: '1000px'
        }}>
          THE MACHINE HAS THE DATA.<br />
          <span style={{ 
            background: 'var(--accent-yellow)', 
            padding: '0 0.4rem', 
            boxShadow: '4px 4px 0 #000',
            border: '2px solid #000'
          }}>
            YOU NEED THE CONTEXT.
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          fontWeight: 600,
          color: '#333333',
          maxWidth: '850px',
          marginBottom: '1.75rem',
          lineHeight: 1.5
        }}>
          Complex campus operations produce millions of data points across transport, dining, libraries, and facilities. 
          SYSTEM//SHIFT transforms raw machine telemetry into clear causal understanding—allowing operators to ask 
          <strong> What is happening?</strong>, <strong>Why is it happening?</strong>, and test 
          <strong> What happens if I change something?</strong> before making real-world commitments.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onNavigate('system')} 
            className="brutal-btn brutal-btn-primary"
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}
          >
            EXPLORE SYSTEM MAP <ArrowRight size={18} />
          </button>
          <button 
            onClick={() => onNavigate('simulation')} 
            className="brutal-btn brutal-btn-dark"
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem' }}
          >
            RUN WHAT-IF SIMULATOR <Sliders size={18} />
          </button>
          <button 
            onClick={() => onNavigate('demo')} 
            className="brutal-btn"
            style={{ fontSize: '1.05rem', padding: '0.85rem 1.75rem', background: '#FF4444', color: '#FFF' }}
          >
            START 3-MIN JUDGE TOUR ★
          </button>
        </div>
      </section>

      {/* Step 2 Callout: System Pressures Detected */}
      <section style={{ marginBottom: '2rem' }}>
        <div style={{
          background: 'var(--accent-red)',
          color: '#FFFFFF',
          border: 'var(--border-thick) solid #000',
          boxShadow: 'var(--shadow-md)',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={32} color="#FFFFFF" strokeWidth={2.5} />
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                3 SYSTEM PRESSURES DETECTED
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#FFE0E0' }}>
                Primary Root Bottleneck: Campus Transportation (Route 3 Metro Link Corridor)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => onNavigate('transport')}
              className="brutal-btn"
              style={{ background: '#FFFFFF', color: '#000', fontSize: '0.85rem', padding: '0.5rem 1rem' }}
            >
              INVESTIGATE TRANSPORT <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 3 Detected Pressure Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}>
          {dashboardData?.pressures?.map((p, idx) => {
            const Icon = getSystemIcon(p.system);
            return (
              <div 
                key={idx}
                className="brutal-card"
                style={{
                  borderTop: `8px solid ${getStatusColor(p.status)}`,
                  background: '#FFFFFF',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  if (p.system === 'TRANSPORT') onNavigate('transport');
                  else onNavigate('system');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      background: '#000', 
                      color: '#FFF', 
                      padding: '0.35rem', 
                      border: '2px solid #000' 
                    }}>
                      <Icon size={18} />
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.9rem' }}>
                      {p.system}
                    </span>
                  </div>
                  <span className={`brutal-badge ${p.status === 'CRITICAL' ? 'badge-red' : 'badge-orange'}`}>
                    {p.status}
                  </span>
                </div>

                <div style={{ fontSize: '2.5rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
                  {p.load_pct}%
                </div>

                <div style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                  {p.pressure_label}
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.4 }}>
                  {p.detail}
                </p>

                <div style={{
                  paddingTop: '0.75rem',
                  borderTop: '2px dashed #000',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-mono)'
                }}>
                  <span>Cascades to: <strong>{p.cascade_target}</strong></span>
                  <span style={{ fontWeight: 800, color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    DRILL DOWN <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Main Section: Campus Status Metric Grid */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>CAMPUS STATUS OVERVIEW</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Real-time load indicators across all monitored infrastructure subsystems.
            </p>
          </div>
          <button 
            onClick={() => onNavigate('system')}
            className="brutal-btn brutal-btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            VIEW SYSTEM RELATIONSHIPS <ArrowRight size={15} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1rem'
        }}>
          {dashboardData?.system_cards?.map((card) => {
            const isCritical = card.status === 'CRITICAL';
            const isElevated = card.status === 'ELEVATED';
            return (
              <div
                key={card.id}
                className="brutal-card-flat"
                style={{
                  background: isCritical ? '#FFF4F4' : '#FFFFFF',
                  borderColor: isCritical ? 'var(--accent-red)' : '#000',
                  boxShadow: isCritical ? '4px 4px 0 var(--accent-red)' : '3px 3px 0 #000'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem' }}>
                    {card.system_name}
                  </span>
                  <span className={`brutal-badge ${isCritical ? 'badge-red' : (isElevated ? 'badge-orange' : 'badge-green')}`}>
                    {card.status}
                  </span>
                </div>

                <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, marginBottom: '0.25rem' }}>
                  {card.load_pct}%
                </div>

                <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}>
                  {card.metric_label}: {card.metric_value}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {card.notes}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Cross-System Cascade Explanation Banner */}
      <section className="brutal-card" style={{
        background: 'var(--accent-yellow)',
        border: 'var(--border-thick) solid #000',
        marginBottom: '2rem',
        padding: '1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={22} color="#000" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900 }}>
            INTERCONNECTED SYSTEM CASCADE DETECTED
          </h3>
        </div>

        <p style={{ fontSize: '1rem', fontWeight: 600, color: '#0C0C0C', marginBottom: '1.25rem', lineHeight: 1.45 }}>
          Seemingly separate systems influence one another across time and space. An operational breakdown in one domain directly propagates friction downstream:
        </p>

        {/* Visual Cascade Flow Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.25rem'
        }}>
          {[
            { step: "01", title: "ARRIVAL SPIKE", desc: "Students arrive at Metro Hub (+23%)" },
            { step: "02", title: "TRANSPORT STRAIN", desc: "Fleet saturated at 91% capacity" },
            { step: "03", title: "WAIT QUEUE", desc: "Waiting time reaches 18.4 min" },
            { step: "04", title: "TRANSIT DELAY", desc: "Campus movement delayed 12+ min" },
            { step: "05", title: "DINING RUSH", desc: "Canteen wave compressed (14.2m wait)" }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: '#FFFFFF',
              border: '2px solid #000',
              padding: '0.85rem',
              boxShadow: '3px 3px 0 #000'
            }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--accent-red)', fontSize: '0.8rem' }}>
                STEP {item.step}
              </span>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', margin: '0.2rem 0' }}>
                {item.title}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#555' }}>
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => onAskAI("Why are students waiting so long?")} 
            className="brutal-btn brutal-btn-dark"
            style={{ fontSize: '0.9rem' }}
          >
            ASK AI: “Why are students waiting so long?” →
          </button>
          <button 
            onClick={() => onNavigate('simulation')} 
            className="brutal-btn"
            style={{ background: '#FFFFFF', fontSize: '0.9rem' }}
          >
            TEST MITIGATION IN WHAT-IF SIMULATOR →
          </button>
        </div>
      </section>

    </div>
  );
}
