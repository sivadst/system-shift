import React from 'react';
import { ArrowRight, Sparkles, Scale, Compass, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AboutPage({ onNavigate }) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Title */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="brutal-badge badge-yellow">PS05: THE HUMAN–MACHINE GAP</span>
          <span className="brutal-badge badge-blue">PRODUCT MANIFESTO</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.05 }}>
          THE MACHINE HAS THE DATA.<br />
          HUMANS NEED THE CONTEXT.
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', fontWeight: 700, marginTop: '0.75rem' }}>
          SYSTEM//SHIFT was built to solve Problem Statement 05 by fundamentally redesigning how people interact with complex operational systems.
        </p>
      </div>

      {/* The 4-Part PS05 Framework Structure */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '3rem' }}>
        
        {/* 1. THE GAP */}
        <section className="brutal-card" style={{
          background: '#FFFFFF',
          borderLeft: '10px solid #0C0C0C',
          padding: '2rem'
        }}>
          <div className="brutal-badge badge-white" style={{ marginBottom: '0.5rem' }}>01 // THE FUNDAMENTAL REALITY</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            THE GAP
          </h2>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--accent-red)', marginBottom: '0.75rem' }}>
            Machines can process enormous amounts of information. Humans cannot consume all of it.
          </div>
          <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.6 }}>
            Modern infrastructure—from university campuses to municipal transport networks—generates millions of sensory telemetry points every single minute. Modern computers excel at collecting, indexing, and tabulating this flood. But the human operator is overwhelmed by cognitive overload, fragmented silos, and raw data fatigue.
          </p>
        </section>

        {/* 2. THE PROBLEM */}
        <section className="brutal-card" style={{
          background: '#FFFFFF',
          borderLeft: '10px solid var(--accent-orange)',
          padding: '2rem'
        }}>
          <div className="brutal-badge badge-orange" style={{ marginBottom: '0.5rem' }}>02 // WHY EXISTING TOOLS FAIL</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            THE PROBLEM
          </h2>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#994400', marginBottom: '0.75rem' }}>
            Traditional dashboards expose data but often leave humans responsible for interpreting complex relationships.
          </div>
          <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.6 }}>
            Traditional enterprise monitoring offers 50 separate charts: a chart for bus passengers, a chart for library turnstiles, a chart for dining queues. They treat these as isolated columns in a database. When a student arrival spike at the Metro causes a 20-minute bus delay, which cascades into delayed student movement, which then creates a sudden severe lunch rush at the central canteen, existing dashboards display separate red spikes without revealing the invisible connective tissue between them.
          </p>
        </section>

        {/* 3. THE SOLUTION */}
        <section className="brutal-card" style={{
          background: '#FFFFFF',
          borderLeft: '10px solid var(--accent-green)',
          padding: '2rem'
        }}>
          <div className="brutal-badge badge-green" style={{ marginBottom: '0.5rem' }}>03 // OUR ARCHITECTURE</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.75rem' }}>
            THE SOLUTION
          </h2>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#007A33', marginBottom: '0.75rem' }}>
            SYSTEM//SHIFT transforms complex system data into an interactive human interface.
          </div>
          <p style={{ fontSize: '1.05rem', color: '#333', lineHeight: 1.6 }}>
            Rather than forcing the user to decipher database schemas or mathematical queuing theory, SYSTEM//SHIFT models interconnected operational systems as an interactive, causal network. Telemetry from actual databases is continuously evaluated for system pressures. A grounded AI reasoning layer translates numerical friction into clear natural language, and a deterministic simulation engine allows operators to safely test intervention scenarios before making real-world commitments.
          </p>
        </section>

        {/* 4. THE DIFFERENCE */}
        <section className="brutal-card" style={{
          background: 'var(--accent-yellow)',
          border: 'var(--border-thick) solid #000',
          boxShadow: 'var(--shadow-lg)',
          padding: '2.5rem 2rem'
        }}>
          <div className="brutal-badge badge-white" style={{ marginBottom: '0.5rem' }}>04 // PARADIGM SHIFT</div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '1rem' }}>
            THE DIFFERENCE
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem',
            marginTop: '1.5rem'
          }}>
            {/* Old Way */}
            <div style={{
              background: '#FFFFFF',
              border: '3px solid #000',
              padding: '1.5rem',
              boxShadow: '4px 4px 0 #000'
            }}>
              <span className="brutal-badge badge-red" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                TRADITIONAL DASHBOARD PARADIGM
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0.5rem 0' }}>
                “What does the data say?”
              </div>
              <p style={{ fontSize: '0.9rem', color: '#555', lineHeight: 1.45 }}>
                Dozens of static charts, isolated silos, confusing aggregations, leaving the human to mentally reconstruct what went wrong.
              </p>
            </div>

            {/* SYSTEM//SHIFT Way */}
            <div style={{
              background: '#0C0C0C',
              color: '#FFFFFF',
              border: '3px solid #000',
              padding: '1.5rem',
              boxShadow: '4px 4px 0 #FFF'
            }}>
              <span className="brutal-badge badge-yellow" style={{ fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                SYSTEM//SHIFT PARADIGM
              </span>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, margin: '0.5rem 0', color: 'var(--accent-yellow)' }}>
                “What is happening?”<br />
                “Why is it happening?”<br />
                “What happens if I change it?”
              </div>
              <p style={{ fontSize: '0.9rem', color: '#DDD', lineHeight: 1.45 }}>
                Contextual causal graphs, grounded explanations, and a predictive What-If simulator where the human remains the definitive decision-maker.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Human in the loop Manifesto */}
      <section className="brutal-card" style={{
        background: '#FFFFFF',
        border: 'var(--border-thick) solid #000',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <Scale size={24} />
          <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>
            THE HUMAN REMAINS THE DECISION-MAKER
          </h3>
        </div>

        <p style={{ fontSize: '1.05rem', color: '#222', lineHeight: 1.6, marginBottom: '1.25rem' }}>
          A critical flaw in modern "AI-driven" systems is attempting to automate human governance out of the loop. SYSTEM//SHIFT explicitly rejects normative AI recommendations. 
          When testing a scenario (e.g. adding 4 buses), the system does NOT declare <em>“You should add 4 buses.”</em> 
          Instead, it illuminates the trade-off: 
          <strong> “This scenario reduces estimated student waiting time from 18.4 min to 7.4 min, but increases daily fleet operating costs by ₹6,440.”</strong>
        </p>

        <p style={{ fontSize: '1rem', color: '#555', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          The machine computes probabilities and physics. The human weighs priorities, values, and budgets.
        </p>

        <button
          onClick={() => onNavigate('demo')}
          className="brutal-btn brutal-btn-primary"
          style={{ fontSize: '1rem', padding: '0.85rem 1.5rem' }}
        >
          EXPERIENCE THE 3-MINUTE GUIDED JUDGE DEMO <ArrowRight size={18} />
        </button>
      </section>

    </div>
  );
}
