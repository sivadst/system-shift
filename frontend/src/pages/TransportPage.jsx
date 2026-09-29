import React from 'react';
import { Bus, Clock, Users, DollarSign, AlertTriangle, ArrowRight, Activity, TrendingUp, Sliders } from 'lucide-react';

export default function TransportPage({ transportData, onNavigate, onAskAI }) {
  const t = transportData || {
    active_buses: 10,
    total_capacity: 500,
    current_demand: 455,
    utilization_pct: 91.0,
    avg_wait_min: 18.4,
    peak_wait_min: 26.5,
    overcrowding_pct: 78.0,
    daily_cost: 18400.0,
    delayed_passengers: 142,
    routes: []
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CRITICAL': return <span className="brutal-badge badge-red">CRITICAL</span>;
      case 'WARNING': return <span className="brutal-badge badge-orange">WARNING</span>;
      default: return <span className="brutal-badge badge-green">HEALTHY</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Page Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="brutal-badge badge-yellow">SYSTEM INVESTIGATION</span>
            <span className="brutal-badge badge-red">CORRIDOR BOTTLENECK</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>TRANSPORTATION INTELLIGENCE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px' }}>
            Telemetry breakdown for campus transit fleet. Current load reveals severe platform queuing on Route 3 (Metro Link).
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onAskAI("Why are students waiting so long?")}
            className="brutal-btn brutal-btn-dark"
          >
            ASK AI WHY →
          </button>
          <button
            onClick={() => onNavigate('simulation')}
            className="brutal-btn brutal-btn-primary"
          >
            OPEN WHAT-IF SIMULATOR <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* Critical Bottleneck Alert Banner */}
      <div style={{
        background: 'var(--accent-red)',
        color: '#FFFFFF',
        border: 'var(--border-thick) solid #000',
        boxShadow: 'var(--shadow-md)',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertTriangle size={36} color="#FFFFFF" strokeWidth={2.5} />
          <div>
            <div style={{ fontSize: '1.3rem', fontWeight: 900 }}>
              ROUTE 3 METRO CORRIDOR REACHED CRITICAL CAPACITY (97.3%)
            </div>
            <div style={{ fontSize: '0.88rem', fontFamily: 'var(--font-mono)' }}>
              142 passengers currently delayed. Headway queuing expanded average wait to <strong>18.4 min</strong> (peak 26.5 min).
            </div>
          </div>
        </div>
        <button
          onClick={() => onNavigate('simulation')}
          className="brutal-btn"
          style={{ background: '#FFE500', color: '#000', fontSize: '0.88rem' }}
        >
          SIMULATE FLEET ADDITION →
        </button>
      </div>

      {/* Key Metric Indicators Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {/* Metric 1 */}
        <div className="brutal-card-flat" style={{ borderLeft: '6px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            <span>AVG WAITING TIME</span>
            <Clock size={16} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0 0.2rem' }}>
            {t.avg_wait_min} <span style={{ fontSize: '1.2rem' }}>MIN</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 800 }}>
            Peak wait: {t.peak_wait_min} min (+42% over normal)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="brutal-card-flat" style={{ borderLeft: '6px solid var(--accent-orange)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            <span>FLEET UTILIZATION</span>
            <Activity size={16} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0 0.2rem' }}>
            {t.utilization_pct}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Demand: {t.current_demand} / {t.total_capacity} capacity
          </div>
        </div>

        {/* Metric 3 */}
        <div className="brutal-card-flat" style={{ borderLeft: '6px solid var(--accent-red)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            <span>OVERCROWDING</span>
            <Users size={16} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0 0.2rem' }}>
            {t.overcrowding_pct}%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-red)', fontWeight: 800 }}>
            {t.delayed_passengers} students queued at platforms
          </div>
        </div>

        {/* Metric 4 */}
        <div className="brutal-card-flat" style={{ borderLeft: '6px solid var(--accent-blue)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            <span>ACTIVE FLEET</span>
            <Bus size={16} />
          </div>
          <div style={{ fontSize: '2.8rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0 0.2rem' }}>
            {t.active_buses} <span style={{ fontSize: '1.2rem' }}>BUSES</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Operating capacity: 50 seats / bus
          </div>
        </div>

        {/* Metric 5 */}
        <div className="brutal-card-flat" style={{ borderLeft: '6px solid #000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
            <span>DAILY COST</span>
            <DollarSign size={16} />
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, lineHeight: 1, margin: '0.5rem 0 0.2rem' }}>
            ₹{Number(t.daily_cost).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700 }}>
            Depot, drivers & fuel / day
          </div>
        </div>
      </div>

      {/* Hourly Trend Visualizer (Pure CSS & SVG) */}
      <div className="brutal-card" style={{ marginBottom: '2.5rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="brutal-badge badge-blue" style={{ marginBottom: '0.25rem' }}>CHRONOLOGICAL TELEMETRY</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>DEMAND VS CAPACITY OVER TIME</h3>
          </div>
          <div style={{ display: 'flex', gap: '1rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', background: 'var(--accent-red)', border: '1px solid #000' }}></span>
              Demand (Students)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '12px', height: '12px', background: '#000', border: '1px solid #000' }}></span>
              Total Capacity (Seats)
            </span>
          </div>
        </div>

        {/* Hourly Bars */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(14, 1fr)',
          gap: '0.5rem',
          height: '220px',
          alignItems: 'flex-end',
          padding: '1rem 0 0.5rem',
          borderBottom: '3px solid #000'
        }}>
          {[
            { hour: "06:00", demand: 80, cap: 300, wait: 4.2 },
            { hour: "07:00", demand: 190, cap: 400, wait: 6.8 },
            { hour: "08:00", demand: 380, cap: 500, wait: 14.1 },
            { hour: "08:30", demand: 455, cap: 500, wait: 18.4, spike: true },
            { hour: "09:00", demand: 440, cap: 500, wait: 17.2 },
            { hour: "10:00", demand: 260, cap: 450, wait: 8.5 },
            { hour: "11:00", demand: 210, cap: 400, wait: 7.0 },
            { hour: "12:00", demand: 320, cap: 450, wait: 11.4 },
            { hour: "13:00", demand: 340, cap: 450, wait: 12.0 },
            { hour: "14:00", demand: 220, cap: 400, wait: 7.2 },
            { hour: "15:00", demand: 240, cap: 400, wait: 7.5 },
            { hour: "16:00", demand: 290, cap: 450, wait: 9.8 },
            { hour: "17:00", demand: 410, cap: 500, wait: 16.0 },
            { hour: "18:00", demand: 430, cap: 500, wait: 17.5 },
          ].map((bar, idx) => {
            const demandHeight = Math.min(100, (bar.demand / 500) * 100);
            const capHeight = Math.min(100, (bar.cap / 500) * 100);
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                {bar.spike && (
                  <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', fontWeight: 900, color: 'var(--accent-red)', marginBottom: '0.2rem' }}>
                    NOW
                  </span>
                )}
                <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '160px', width: '100%', justifyContent: 'center' }}>
                  {/* Demand bar */}
                  <div style={{
                    width: '42%',
                    height: `${demandHeight}%`,
                    background: bar.spike ? 'var(--accent-red)' : (bar.demand > 350 ? 'var(--accent-orange)' : '#444'),
                    border: '2px solid #000',
                    boxShadow: bar.spike ? '2px 2px 0 #000' : 'none'
                  }}></div>
                  {/* Capacity bar */}
                  <div style={{
                    width: '42%',
                    height: `${capHeight}%`,
                    background: '#E5E3D8',
                    border: '2px solid #000'
                  }}></div>
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: bar.spike ? 900 : 700,
                  marginTop: '0.4rem',
                  color: bar.spike ? 'var(--accent-red)' : '#555'
                }}>
                  {bar.hour}
                </div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          * Notice the acute morning bottleneck at 08:30 where demand (455) approaches maximum total capacity (500), pushing average wait time to 18.4 min.
        </div>
      </div>

      {/* Route Health Table (from actual DB records) */}
      <div className="brutal-card" style={{ background: '#FFFFFF' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <div className="brutal-badge badge-yellow" style={{ marginBottom: '0.25rem' }}>ACTUAL DATABASE RECORDS</div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900 }}>ROUTE TELEMETRY TABLE</h3>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
            4 ACTIVE ROUTES MONITORED
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontFamily: 'var(--font-heading)',
            textAlign: 'left'
          }}>
            <thead>
              <tr style={{ background: '#0C0C0C', color: '#FFFFFF', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>ROUTE</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>CORRIDOR</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>BUSES</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>PASSENGERS / CAP</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>UTILIZATION</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>AVG WAIT</th>
                <th style={{ padding: '0.75rem 1rem', border: '2px solid #0C0C0C' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {t.routes?.map((route) => {
                const isCrit = route.status === 'CRITICAL';
                return (
                  <tr 
                    key={route.id}
                    style={{
                      background: isCrit ? '#FFF2F2' : '#FFFFFF',
                      fontWeight: isCrit ? 700 : 500,
                      borderBottom: '2px solid #0C0C0C'
                    }}
                  >
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C', fontWeight: 800 }}>
                      {route.route_code}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C' }}>
                      <div style={{ fontWeight: 800 }}>{route.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                        {route.source} → {route.destination} ({route.stops_count} stops)
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C', fontFamily: 'var(--font-mono)' }}>
                      <strong>{route.active_buses}</strong> buses
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C', fontFamily: 'var(--font-mono)' }}>
                      {route.current_passengers} / {route.capacity}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 900, fontSize: '1.1rem' }}>{route.utilization_pct}%</span>
                        <div style={{ width: '60px', height: '8px', background: '#DDD', border: '1px solid #000' }}>
                          <div style={{
                            width: `${Math.min(100, route.utilization_pct)}%`,
                            height: '100%',
                            background: isCrit ? 'var(--accent-red)' : (route.utilization_pct > 80 ? 'var(--accent-orange)' : 'var(--accent-green)')
                          }}></div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                      {route.avg_wait_min} min
                    </td>
                    <td style={{ padding: '0.85rem 1rem', border: '2px solid #0C0C0C' }}>
                      {getStatusBadge(route.status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
