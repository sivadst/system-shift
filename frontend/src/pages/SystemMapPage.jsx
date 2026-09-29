import React, { useState } from 'react';
import { ArrowRight, AlertTriangle, Info, Zap, Layers, RefreshCw } from 'lucide-react';

export default function SystemMapPage({ onNavigate, onAskAI }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const [filterMode, setFilterMode] = useState('ALL'); // 'ALL', 'PRESSURE', 'CASCADES'

  const nodes = [
    {
      id: "STUDENTS",
      label: "STUDENT MOVEMENT",
      x: 120,
      y: 200,
      width: 220,
      height: 140,
      load: 88,
      status: "ELEVATED",
      pressure: true,
      category: "COMMUTER INFLUX",
      summary: "Peak morning arrival wave entering campus via Metro Hub and South Hostels.",
      metrics: {
        "Active in transit": "4,250 students",
        "Arrival flux": "+23% over baseline",
        "Peak window": "08:00 - 09:30 AM"
      },
      upstream: [],
      downstream: ["TRANSPORT", "LIBRARY", "CANTEEN"]
    },
    {
      id: "TRANSPORT",
      label: "CAMPUS TRANSPORT",
      x: 440,
      y: 80,
      width: 230,
      height: 155,
      load: 91,
      status: "CRITICAL",
      pressure: true,
      category: "PRIMARY LOGISTICS",
      summary: "Severe platform bottleneck at Metro Hub. Fleet capacity saturated on Route 3.",
      metrics: {
        "Active buses": "10 / 10 active",
        "Fleet utilization": "91.0%",
        "Average wait": "18.4 min",
        "Peak wait": "26.5 min",
        "Delayed passengers": "142 students"
      },
      upstream: ["STUDENTS"],
      downstream: ["CANTEEN", "CLASSROOMS"]
    },
    {
      id: "CANTEEN",
      label: "CANTEEN & DINING",
      x: 770,
      y: 90,
      width: 220,
      height: 145,
      load: 74,
      status: "ELEVATED",
      pressure: true,
      category: "FOOD SERVICES",
      summary: "Downstream dining queue bottleneck caused by late-arriving student transit waves.",
      metrics: {
        "Seating occupancy": "74%",
        "Counter queue time": "14.2 min",
        "Arrival shift": "+22 min postponement"
      },
      upstream: ["TRANSPORT", "STUDENTS"],
      downstream: ["FACILITIES"]
    },
    {
      id: "LIBRARY",
      label: "CENTRAL LIBRARY",
      x: 440,
      y: 350,
      width: 230,
      height: 145,
      load: 96,
      status: "CRITICAL",
      pressure: true,
      category: "STUDY FACILITY",
      summary: "Mid-term examination surge. High dwell time and low seating turnover rate.",
      metrics: {
        "Desk occupancy": "96.0%",
        "Available seats": "16 seats left",
        "Noise level": "44.5 dB (Nominal)"
      },
      upstream: ["STUDENTS"],
      downstream: ["NETWORK"]
    },
    {
      id: "CLASSROOMS",
      label: "CLASSROOMS & LABS",
      x: 770,
      y: 340,
      width: 220,
      height: 140,
      load: 62,
      status: "NORMAL",
      pressure: false,
      category: "ACADEMIC",
      summary: "Lecture halls operating normally. 8.4% student arrival delay observed in period 1.",
      metrics: {
        "Active halls": "84 / 120 in use",
        "Attendance rate": "91.6%",
        "Schedule slip": "+8.2 min late arrival"
      },
      upstream: ["TRANSPORT"],
      downstream: ["NETWORK"]
    },
    {
      id: "NETWORK",
      label: "CAMPUS NETWORK & IT",
      x: 1070,
      y: 190,
      width: 210,
      height: 140,
      load: 68,
      status: "NORMAL",
      pressure: false,
      category: "DIGITAL INFRA",
      summary: "Core routing and AP bandwidth operating within nominal headroom.",
      metrics: {
        "Bandwidth throughput": "1.4 Gbps",
        "Latency": "14 ms",
        "Connected devices": "5,840 clients"
      },
      upstream: ["LIBRARY", "CLASSROOMS"],
      downstream: []
    },
    {
      id: "FACILITIES",
      label: "FACILITIES & POWER",
      x: 1070,
      y: 390,
      width: 210,
      height: 135,
      load: 45,
      status: "NORMAL",
      pressure: false,
      category: "PHYSICAL INFRA",
      summary: "HVAC chillers and electrical substations operating normally.",
      metrics: {
        "Chiller load": "45%",
        "Grid draw": "1.2 MW",
        "Solar generation": "42 kW"
      },
      upstream: ["CANTEEN"],
      downstream: []
    }
  ];

  // Edges connecting systems
  const edges = [
    { from: "STUDENTS", to: "TRANSPORT", label: "Surge Influx (+23%)", pressure: true, bottleneck: true },
    { from: "TRANSPORT", to: "CANTEEN", label: "Transit Delay Waves (18.4m)", pressure: true, bottleneck: true },
    { from: "STUDENTS", to: "LIBRARY", label: "Mid-term Study Rush", pressure: true, bottleneck: false },
    { from: "TRANSPORT", to: "CLASSROOMS", label: "Arrival Delay (8.2m)", pressure: false, bottleneck: false },
    { from: "CANTEEN", to: "FACILITIES", label: "Kitchen Power & HVAC", pressure: false, bottleneck: false },
    { from: "LIBRARY", to: "NETWORK", label: "WiFi Concurrent Clients", pressure: false, bottleneck: false },
    { from: "CLASSROOMS", to: "NETWORK", label: "LMS & Video Feeds", pressure: false, bottleneck: false }
  ];

  const filteredNodes = nodes.filter(n => {
    if (filterMode === 'PRESSURE') return n.pressure;
    return true;
  });

  const getNodeCenter = (id) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2
    };
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Header bar */}
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
            <span className="brutal-badge badge-yellow">INTERACTIVE SYSTEM TOPOLOGY</span>
            <span className="brutal-badge badge-red">3 ACTIVE SYSTEM PRESSURES</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 900 }}>CAMPUS RELATIONSHIP GRAPH</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '750px' }}>
            Systems do not exist in isolation. Click any node to inspect telemetry, upstream causes, and downstream cascading ripples.
          </p>
        </div>

        {/* Filter controls */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setFilterMode('ALL')}
            className={`brutal-btn ${filterMode === 'ALL' ? 'brutal-btn-dark' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            ALL SYSTEMS (7)
          </button>
          <button
            onClick={() => setFilterMode('PRESSURE')}
            className={`brutal-btn ${filterMode === 'PRESSURE' ? 'brutal-btn-red' : ''}`}
            style={{ fontSize: '0.85rem' }}
          >
            ACTIVE PRESSURES (3)
          </button>
        </div>
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="brutal-card" style={{
        background: '#FAF9F5',
        position: 'relative',
        minHeight: '600px',
        overflowX: 'auto',
        border: 'var(--border-thick) solid #0C0C0C',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        
        {/* SVG Edge Connection Layer */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '1350px',
          height: '600px',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <defs>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#FF2A2A" />
            </marker>
            <marker id="arrow-normal" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#0C0C0C" />
            </marker>
          </defs>

          {edges.map((e, idx) => {
            const start = getNodeCenter(e.from);
            const end = getNodeCenter(e.to);
            const isBottleneck = e.bottleneck;
            const midX = (start.x + end.x) / 2;
            const midY = (start.y + end.y) / 2 - 10;

            return (
              <g key={idx}>
                {/* Connection Line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={isBottleneck ? "#FF2A2A" : "#0C0C0C"}
                  strokeWidth={isBottleneck ? "4" : "2.5"}
                  strokeDasharray={isBottleneck ? "8 4" : "none"}
                  markerEnd={isBottleneck ? "url(#arrow-active)" : "url(#arrow-normal)"}
                >
                  {isBottleneck && (
                    <animate
                      attributeName="stroke-dashoffset"
                      from="24"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  )}
                </line>

                {/* Relationship Tag pill */}
                <rect
                  x={midX - 70}
                  y={midY - 10}
                  width="140"
                  height="20"
                  fill={isBottleneck ? "#FFE500" : "#FFFFFF"}
                  stroke="#0C0C0C"
                  strokeWidth="1.5"
                  rx="0"
                />
                <text
                  x={midX}
                  y={midY + 4}
                  textAnchor="middle"
                  fontFamily="Space Grotesk, sans-serif"
                  fontSize="9.5"
                  fontWeight="800"
                  fill="#0C0C0C"
                >
                  {e.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* HTML Nodes Layer */}
        <div style={{ position: 'relative', width: '1350px', height: '580px', zIndex: 2 }}>
          {filteredNodes.map((n) => {
            const isSelected = selectedNode?.id === n.id;
            const isCritical = n.status === 'CRITICAL';
            const isElevated = n.status === 'ELEVATED';

            return (
              <div
                key={n.id}
                onClick={() => setSelectedNode(n)}
                className="brutal-card"
                style={{
                  position: 'absolute',
                  left: `${n.x}px`,
                  top: `${n.y}px`,
                  width: `${n.width}px`,
                  minHeight: `${n.height}px`,
                  padding: '1rem',
                  cursor: 'pointer',
                  background: isSelected ? 'var(--accent-yellow)' : '#FFFFFF',
                  borderColor: isCritical ? 'var(--accent-red)' : '#0C0C0C',
                  borderWidth: isSelected ? '4px' : '3px',
                  boxShadow: isSelected 
                    ? '8px 8px 0px #0C0C0C' 
                    : (isCritical ? '5px 5px 0px var(--accent-red)' : '4px 4px 0px #0C0C0C'),
                  transform: isSelected ? 'scale(1.03) translate(-2px, -2px)' : 'none',
                  zIndex: isSelected ? 10 : 3
                }}
              >
                {/* Node Category & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 800 }}>
                    {n.category}
                  </span>
                  <span className={`brutal-badge ${isCritical ? 'badge-red' : (isElevated ? 'badge-orange' : 'badge-green')}`}>
                    {n.status}
                  </span>
                </div>

                {/* Node Label */}
                <div style={{ fontSize: '1.05rem', fontWeight: 900, lineHeight: 1.15, marginBottom: '0.4rem' }}>
                  {n.label}
                </div>

                {/* Load Meter */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '1.8rem', fontWeight: 900 }}>{n.load}%</span>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>LOAD</span>
                </div>

                {/* Mini progress bar */}
                <div style={{
                  height: '8px',
                  width: '100%',
                  background: '#E0DFD5',
                  border: '2px solid #0C0C0C',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min(100, n.load)}%`,
                    height: '100%',
                    background: isCritical ? 'var(--accent-red)' : (isElevated ? 'var(--accent-orange)' : 'var(--accent-green)')
                  }}></div>
                </div>

                {n.pressure && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    color: isCritical ? 'var(--accent-red)' : '#B85500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    <AlertTriangle size={12} />
                    <span>ACTIVE PRESSURE DETECTED</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      {selectedNode && (
        <section className="brutal-card" style={{
          background: '#FFFFFF',
          border: 'var(--border-thick) solid #000',
          boxShadow: 'var(--shadow-lg)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span className="brutal-badge badge-blue">SYSTEM TELEMETRY INSPECTOR</span>
                <span className={`brutal-badge ${selectedNode.status === 'CRITICAL' ? 'badge-red' : 'badge-orange'}`}>
                  {selectedNode.status} // {selectedNode.load}% LOAD
                </span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 900 }}>
                {selectedNode.label}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {selectedNode.id === 'TRANSPORT' && (
                <button
                  onClick={() => onNavigate('transport')}
                  className="brutal-btn brutal-btn-primary"
                >
                  DEEP-DIVE TRANSPORT FLEET →
                </button>
              )}
              <button
                onClick={() => onAskAI(`Why is ${selectedNode.label} experiencing ${selectedNode.status.toLowerCase()} load?`)}
                className="brutal-btn brutal-btn-dark"
              >
                ASK AI ABOUT THIS NODE →
              </button>
              <button
                onClick={() => setSelectedNode(null)}
                className="brutal-btn"
                style={{ background: '#EEEEEE' }}
              >
                CLOSE [✕]
              </button>
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', fontWeight: 600, color: '#333', marginBottom: '1.5rem' }}>
            {selectedNode.summary}
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            {Object.entries(selectedNode.metrics).map(([k, v], idx) => (
              <div key={idx} style={{
                background: '#FAF9F5',
                border: '2px solid #000',
                padding: '0.85rem',
                boxShadow: '3px 3px 0 #000'
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#666', textTransform: 'uppercase' }}>
                  {k}
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, marginTop: '0.2rem' }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          {/* Upstream & Downstream Relationship Paths */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            paddingTop: '1rem',
            borderTop: '2px dashed #000'
          }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                UPSTREAM INFLUENCERS (SOURCES):
              </div>
              {selectedNode.upstream.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedNode.upstream.map(u => (
                    <span key={u} className="brutal-badge badge-white" style={{ fontSize: '0.8rem' }}>
                      ← {u}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#777' }}>Root system ingress point</span>
              )}
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                DOWNSTREAM CASCADE TARGETS:
              </div>
              {selectedNode.downstream.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {selectedNode.downstream.map(d => (
                    <span key={d} className="brutal-badge badge-yellow" style={{ fontSize: '0.8rem' }}>
                      → {d}
                    </span>
                  ))}
                </div>
              ) : (
                <span style={{ fontSize: '0.85rem', color: '#777' }}>Terminal leaf node</span>
              )}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
