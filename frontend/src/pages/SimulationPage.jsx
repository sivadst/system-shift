import React, { useState, useEffect } from 'react';
import { runSimulation, fetchSimulationPresets } from '../api';
import { Sliders, Play, RefreshCw, ArrowRight, TrendingDown, TrendingUp, AlertTriangle, CheckCircle, ShieldAlert, Sparkles, Scale } from 'lucide-react';

export default function SimulationPage({ onAskAI }) {
  // Input parameters
  const [buses, setBuses] = useState(14); // Hero scenario default
  const [frequency, setFrequency] = useState(8.0);
  const [demandMod, setDemandMod] = useState(0);
  const [peakWindow, setPeakWindow] = useState(90);
  const [scenarioName, setScenarioName] = useState("Hero Scenario: Add 4 Peak Buses");

  const [presets, setPresets] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchSimulationPresets().then(res => setPresets(res));
    // Run initial default simulation on mount
    handleExecuteSimulation(14, 8.0, 0, 90, "Hero Scenario: Add 4 Peak Buses");
  }, []);

  const handleApplyPreset = (p) => {
    setBuses(p.active_buses);
    setFrequency(p.bus_frequency_min);
    setDemandMod(p.student_demand_mod_pct);
    setPeakWindow(p.peak_window_min);
    setScenarioName(p.name);
    handleExecuteSimulation(p.active_buses, p.bus_frequency_min, p.student_demand_mod_pct, p.peak_window_min, p.name);
  };

  const handleExecuteSimulation = async (
    b = buses, 
    f = frequency, 
    d = demandMod, 
    pw = peakWindow, 
    name = scenarioName
  ) => {
    setIsSimulating(true);
    setErrorMsg(null);

    try {
      // Simulate realistic engine processing delay for dramatic effect
      await new Promise(r => setTimeout(r, 600));

      const payload = {
        scenario_name: name || "Custom Fleet Simulation",
        active_buses: Number(b),
        bus_frequency_min: Number(f),
        student_demand_mod_pct: Number(d),
        peak_window_min: Number(pw)
      };

      const result = await runSimulation(payload);
      setSimResult(result);
    } catch (err) {
      console.error("Simulation error:", err);
      setErrorMsg("SIMULATION ENGINE FAILED: Verify scenario boundary parameters.");
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Title & Philosophy */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="brutal-badge badge-yellow">HERO FEATURE // PREDICTIVE OPERATIONS</span>
          <span className="brutal-badge badge-blue">DETERMINISTIC QUEUING ENGINE</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 900, lineHeight: 1 }}>
          WHAT IF?
        </h1>
        <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.4rem' }}>
          Test the consequence before changing the real system.
        </p>
      </div>

      {/* Preset Quick-Buttons */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem' }}>
          PRESET SCENARIOS:
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => handleApplyPreset(p)}
            className="brutal-btn"
            style={{
              fontSize: '0.82rem',
              padding: '0.4rem 0.8rem',
              background: buses === p.active_buses && demandMod === p.student_demand_mod_pct ? '#0C0C0C' : '#FFFFFF',
              color: buses === p.active_buses && demandMod === p.student_demand_mod_pct ? '#FFFFFF' : '#0C0C0C'
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Interactive Controls & Parameters Card */}
      <div className="brutal-card" style={{
        background: '#FFFFFF',
        border: 'var(--border-thick) solid #0C0C0C',
        boxShadow: 'var(--shadow-lg)',
        padding: '2rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sliders size={22} />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900 }}>OPERATIONAL CONTROL LEVERS</h2>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#666' }}>
            ADJUST VARIABLES → CLICK RUN SIMULATION
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          
          {/* Lever 1: Active Buses */}
          <div style={{
            background: '#FAF9F5',
            border: '2px solid #000',
            padding: '1.25rem',
            boxShadow: '3px 3px 0 #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>ACTIVE BUSES</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: buses !== 10 ? 'var(--accent-blue)' : '#000'
              }}>
                {buses} <span style={{ fontSize: '0.8rem' }}>(was 10)</span>
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="24"
              step="1"
              value={buses}
              onChange={(e) => setBuses(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666', marginTop: '0.35rem' }}>
              <span>4 buses (min)</span>
              <span>10 (baseline)</span>
              <span>24 buses (max)</span>
            </div>
          </div>

          {/* Lever 2: Bus Frequency */}
          <div style={{
            background: '#FAF9F5',
            border: '2px solid #000',
            padding: '1.25rem',
            boxShadow: '3px 3px 0 #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>BUS FREQUENCY</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: frequency !== 10.0 ? 'var(--accent-blue)' : '#000'
              }}>
                {frequency} <span style={{ fontSize: '0.8rem' }}>MIN</span>
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="20"
              step="1"
              value={frequency}
              onChange={(e) => setFrequency(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666', marginTop: '0.35rem' }}>
              <span>4 min (rapid)</span>
              <span>10 min (baseline)</span>
              <span>20 min (slow)</span>
            </div>
          </div>

          {/* Lever 3: Student Demand Modifier */}
          <div style={{
            background: '#FAF9F5',
            border: '2px solid #000',
            padding: '1.25rem',
            boxShadow: '3px 3px 0 #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>STUDENT DEMAND</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.6rem',
                fontWeight: 900,
                color: demandMod > 0 ? 'var(--accent-red)' : (demandMod < 0 ? 'var(--accent-green)' : '#000')
              }}>
                {demandMod > 0 ? `+${demandMod}` : demandMod}%
              </span>
            </div>
            <input
              type="range"
              min="-40"
              max="50"
              step="5"
              value={demandMod}
              onChange={(e) => setDemandMod(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666', marginTop: '0.35rem' }}>
              <span>-40% (off-peak)</span>
              <span>0% (current)</span>
              <span>+50% (surge)</span>
            </div>
          </div>

          {/* Lever 4: Peak Window Duration */}
          <div style={{
            background: '#FAF9F5',
            border: '2px solid #000',
            padding: '1.25rem',
            boxShadow: '3px 3px 0 #000'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>PEAK WINDOW</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '1.6rem',
                fontWeight: 900
              }}>
                {peakWindow} <span style={{ fontSize: '0.8rem' }}>MIN</span>
              </span>
            </div>
            <input
              type="range"
              min="45"
              max="180"
              step="15"
              value={peakWindow}
              onChange={(e) => setPeakWindow(Number(e.target.value))}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666', marginTop: '0.35rem' }}>
              <span>45 min</span>
              <span>90 min (baseline)</span>
              <span>180 min</span>
            </div>
          </div>

        </div>

        {/* RUN SIMULATION Action Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem' }}>
            <span>Testing: </span>
            <strong>{buses} buses @ {frequency}m headway ({demandMod >= 0 ? `+${demandMod}%` : `${demandMod}%`} demand)</strong>
          </div>

          <button
            onClick={() => handleExecuteSimulation()}
            disabled={isSimulating}
            className="brutal-btn brutal-btn-primary"
            style={{
              fontSize: '1.25rem',
              padding: '1rem 2.5rem',
              letterSpacing: '0.02em',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            {isSimulating ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <RefreshCw size={22} className="live-pulse" /> SIMULATING SYSTEM...
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Play size={22} /> RUN SIMULATION
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div style={{
          background: 'var(--accent-red)',
          color: '#FFF',
          padding: '1rem',
          border: '3px solid #000',
          marginBottom: '2rem',
          fontWeight: 800
        }}>
          {errorMsg}
        </div>
      )}

      {/* Simulation Result Presentation */}
      {simResult && (
        <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          
          {/* Hero Trade-Off Banner (Section 14) */}
          <div className="brutal-card" style={{
            background: simResult.trade_off_type === 'TRADE_OFF_DETECTED' ? 'var(--accent-yellow)' : '#FFFFFF',
            border: 'var(--border-thick) solid #0C0C0C',
            boxShadow: 'var(--shadow-lg)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <Scale size={32} color="#000" strokeWidth={2.5} />
              <div style={{ fontSize: '1.8rem', fontWeight: 900 }}>
                {simResult.trade_off_title}
              </div>
            </div>

            <p style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.45, marginBottom: '1.25rem', color: '#111' }}>
              {simResult.trade_off_description}
            </p>

            {/* Human in the loop prompt - Critical Rule: Never say "You should add 4 buses" */}
            <div style={{
              background: '#0C0C0C',
              color: '#FFFFFF',
              border: '2px solid #0C0C0C',
              padding: '1.25rem',
              boxShadow: '4px 4px 0 #FFF',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <ShieldAlert size={26} color="var(--accent-yellow)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--accent-yellow)', fontWeight: 800 }}>
                  HUMAN IN THE LOOP // DECISION BOUNDARY
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 600, marginTop: '0.2rem', lineHeight: 1.4 }}>
                  {simResult.human_decision_prompt}
                </div>
              </div>
            </div>
          </div>

          {/* Section 13: Scenario Comparison (Current State vs Simulated State) */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div className="brutal-badge badge-blue" style={{ marginBottom: '0.25rem' }}>SCENARIO COMPARISON</div>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900 }}>CURRENT STATE vs SIMULATED STATE</h3>
              </div>
              <span className="brutal-badge badge-yellow">
                SIMULATED ESTIMATE
              </span>
            </div>

            {/* Comparison Cards Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem'
            }}>
              {simResult.comparisons?.map((c, idx) => {
                const isImproved = c.impact === 'POSITIVE';
                const isDegraded = c.impact === 'NEGATIVE';

                return (
                  <div
                    key={idx}
                    className="brutal-card"
                    style={{
                      background: '#FFFFFF',
                      borderLeft: `8px solid ${isImproved ? 'var(--accent-green)' : (isDegraded ? 'var(--accent-red)' : '#0C0C0C')}`
                    }}
                  >
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                      {c.metric.toUpperCase()}
                    </div>

                    {/* Side by side comparison */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0.75rem 0' }}>
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#666', fontFamily: 'var(--font-mono)' }}>CURRENT</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
                          {c.current_value} <span style={{ fontSize: '0.85rem' }}>{c.unit}</span>
                        </div>
                      </div>

                      <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#999' }}>
                        →
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.72rem', color: isImproved ? 'var(--accent-green)' : (isDegraded ? 'var(--accent-red)' : '#666'), fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                          SIMULATED
                        </div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: isImproved ? '#009944' : (isDegraded ? '#CC0000' : '#000') }}>
                          {c.simulated_value} <span style={{ fontSize: '0.9rem' }}>{c.unit}</span>
                        </div>
                      </div>
                    </div>

                    {/* Percentage Difference Pill */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '0.6rem',
                      borderTop: '2px dashed #0C0C0C',
                      fontSize: '0.85rem',
                      fontFamily: 'var(--font-mono)'
                    }}>
                      <span>DELTA:</span>
                      <strong style={{
                        color: isImproved ? '#009944' : (isDegraded ? '#CC0000' : '#000'),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.2rem'
                      }}>
                        {c.diff_pct > 0 ? `+${c.diff_pct}%` : `${c.diff_pct}%`} 
                        {c.diff_pct < 0 ? <TrendingDown size={15} /> : <TrendingUp size={15} />}
                      </strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cascading Cross-System Impact */}
          {simResult.cascading_impact && (
            <div className="brutal-card" style={{
              background: '#F9F8F3',
              border: 'var(--border-thick) solid #0C0C0C',
              padding: '1.75rem',
              marginBottom: '2.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={22} />
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>
                  CASCADING CROSS-SYSTEM RIPPLE EFFECTS
                </h3>
              </div>

              <p style={{ fontSize: '1rem', fontWeight: 600, color: '#333', marginBottom: '1rem', lineHeight: 1.45 }}>
                {simResult.cascading_impact.cascade_summary}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem'
              }}>
                <div style={{ background: '#FFF', border: '2px solid #000', padding: '0.85rem', boxShadow: '2px 2px 0 #000' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666' }}>CANTEEN LOAD ESTIMATE</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.2rem' }}>
                    {simResult.cascading_impact.simulated_canteen_load_pct}%
                  </div>
                </div>

                <div style={{ background: '#FFF', border: '2px solid #000', padding: '0.85rem', boxShadow: '2px 2px 0 #000' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666' }}>DINING QUEUE DURATION</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.2rem' }}>
                    ~{simResult.cascading_impact.canteen_queue_estimate_min} min wait
                  </div>
                </div>

                <div style={{ background: '#FFF', border: '2px solid #000', padding: '0.85rem', boxShadow: '2px 2px 0 #000' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#666' }}>LIBRARY BUFFER IMPACT</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '0.2rem' }}>
                    {simResult.cascading_impact.simulated_library_load_pct}% occupancy
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Route by Route Breakdown */}
          <div className="brutal-card" style={{ background: '#FFFFFF', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '1rem' }}>
              SIMULATED IMPACT ON INDIVIDUAL BUS ROUTES
            </h3>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#0C0C0C', color: '#FFF', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>ROUTE</th>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>BASELINE UTILIZATION</th>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>SIMULATED UTILIZATION</th>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>BASELINE WAIT</th>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>SIMULATED WAIT</th>
                    <th style={{ padding: '0.65rem 0.85rem', border: '2px solid #000' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {simResult.route_impacts?.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '2px solid #000' }}>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000', fontWeight: 800 }}>
                        {r.route_code}
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000', fontFamily: 'var(--font-mono)' }}>
                        {r.current_utilization}%
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000', fontFamily: 'var(--font-mono)', fontWeight: 800, color: r.simulated_utilization < r.current_utilization ? '#009944' : '#CC0000' }}>
                        {r.simulated_utilization}%
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000', fontFamily: 'var(--font-mono)' }}>
                        {r.current_wait} min
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000', fontFamily: 'var(--font-mono)', fontWeight: 800, color: r.simulated_wait < r.current_wait ? '#009944' : '#CC0000' }}>
                        {r.simulated_wait} min
                      </td>
                      <td style={{ padding: '0.75rem 0.85rem', border: '2px solid #000' }}>
                        <span className={`brutal-badge ${r.status === 'CRITICAL' ? 'badge-red' : (r.status === 'WARNING' ? 'badge-orange' : 'badge-green')}`}>
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
