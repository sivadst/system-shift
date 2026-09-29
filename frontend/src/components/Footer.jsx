import React from 'react';
import { Cpu, ArrowRight } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer style={{
      marginTop: '4rem',
      borderTop: 'var(--border-thick) solid #0C0C0C',
      background: '#FFFFFF',
      boxShadow: '0 -4px 0 #0C0C0C'
    }}>
      <div className="hazard-divider"></div>

      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '2.5rem 1.5rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem'
      }}>
        {/* Col 1 */}
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '0.5rem' }}>
            SYSTEM//SHIFT
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
            PS05 — The Human–Machine Gap: Technology produces enormous volumes of operational metrics. SYSTEM//SHIFT translates complex machine telemetry into actionable understanding without usurping human agency.
          </p>
          <div className="brutal-badge badge-yellow">
            BUILT FOR GOOGLE HACKATHON
          </div>
        </div>

        {/* Col 2 */}
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            THREE CORE HUMAN QUESTIONS
          </div>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.88rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brutal-badge badge-blue">1</span>
              <strong>“What is happening?”</strong> — Live campus state & detected pressures
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brutal-badge badge-yellow">2</span>
              <strong>“Why is it happening?”</strong> — Data-grounded AI causality engine
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="brutal-badge badge-red">3</span>
              <strong>“What happens if I change something?”</strong> — Deterministic What-If engine
            </li>
          </ul>
        </div>

        {/* Col 3 */}
        <div>
          <div style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            OPERATIONAL VERIFICATION
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div>Database: <strong>100,000+ Real Event Logs</strong></div>
            <div>Simulation: <strong>Deterministic Queuing & Fleet Models</strong></div>
            <div>AI Grounding: <strong>Strict Telemetry Context (No Hallucinations)</strong></div>
            <div>Decision Principle: <strong>Non-Normative Trade-Offs (Human in the loop)</strong></div>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => onNavigate('about')}
              className="brutal-btn brutal-btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            >
              READ FULL PS05 MANIFESTO <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div style={{
        background: '#0C0C0C',
        color: '#FFFFFF',
        padding: '0.85rem 1.5rem',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.78rem'
      }}>
        SYSTEM//SHIFT © 2026 // PS05: THE HUMAN–MACHINE GAP // THE MACHINE CAN CALCULATE. WE HELP HUMANS DECIDE.
      </div>
    </footer>
  );
}
