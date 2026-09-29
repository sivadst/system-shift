import React from 'react';
import { Activity, PlayCircle, Cpu, Network, Bus, Sliders, Lightbulb, Bell, Database, HelpCircle } from 'lucide-react';

export default function Header({ currentRoute, onNavigate, liveTime }) {
  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: Cpu },
    { id: 'system', label: 'SYSTEM MAP', icon: Network },
    { id: 'transport', label: 'TRANSPORT', icon: Bus },
    { id: 'simulation', label: 'WHAT IF?', icon: Sliders, highlight: true },
    { id: 'insights', label: 'INSIGHTS', icon: Lightbulb },
    { id: 'events', label: 'EVENTS', icon: Bell },
    { id: 'data', label: 'DATA', icon: Database },
    { id: 'about', label: 'ABOUT (PS05)', icon: HelpCircle },
  ];

  return (
    <header style={{
      background: 'var(--bg-card)',
      borderBottom: 'var(--border-thick) solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 0 #0C0C0C'
    }}>
      {/* Top Banner Ticker */}
      <div style={{
        background: '#0C0C0C',
        color: '#FFFFFF',
        padding: '0.35rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)',
        fontWeight: 700
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span className="live-pulse"></span>
          <span>CAMPUS OPS ENGINE // LIVE</span>
          <span style={{ color: 'var(--accent-yellow)' }}>|</span>
          <span style={{ color: '#AAAAAA' }}>PS05: THE HUMAN–MACHINE GAP</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span>TICK: <strong style={{ color: 'var(--accent-green)' }}>{liveTime || '08:30:14 UTC'}</strong></span>
          <span style={{ color: 'var(--accent-yellow)' }}>100K+ RECORDS ONLINE</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand / Logo */}
        <div 
          onClick={() => onNavigate('dashboard')}
          style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
        >
          <div style={{
            fontSize: '1.85rem',
            fontWeight: 900,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}>
            <span>SYSTEM</span>
            <span style={{ 
              background: 'var(--accent-yellow)', 
              padding: '0.1rem 0.4rem', 
              border: '2px solid #000',
              boxShadow: '2px 2px 0 #000'
            }}>//SHIFT</span>
          </div>
          <span style={{ 
            fontSize: '0.72rem', 
            fontFamily: 'var(--font-mono)', 
            color: 'var(--text-muted)', 
            fontWeight: 700,
            marginTop: '0.2rem' 
          }}>
            THE MACHINE HAS THE DATA. HUMANS NEED THE CONTEXT.
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: '2px solid #0C0C0C',
                  cursor: 'pointer',
                  background: isActive 
                    ? (item.highlight ? 'var(--accent-yellow)' : '#0C0C0C') 
                    : (item.highlight ? '#FFFCE0' : '#FFFFFF'),
                  color: isActive 
                    ? (item.highlight ? '#0C0C0C' : '#FFFFFF') 
                    : '#0C0C0C',
                  boxShadow: isActive ? 'none' : '2px 2px 0 #0C0C0C',
                  transform: isActive ? 'translate(2px, 2px)' : 'none',
                  transition: 'all 0.1s ease'
                }}
              >
                <Icon size={15} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Dedicated 3-Minute Demo Mode Button */}
          <button
            onClick={() => onNavigate('demo')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.5rem 1rem',
              fontFamily: 'var(--font-heading)',
              fontWeight: 900,
              fontSize: '0.88rem',
              border: '3px solid #0C0C0C',
              cursor: 'pointer',
              background: currentRoute === 'demo' ? '#FF2A2A' : 'var(--accent-yellow)',
              color: currentRoute === 'demo' ? '#FFFFFF' : '#0C0C0C',
              boxShadow: currentRoute === 'demo' ? '1px 1px 0 #000' : '4px 4px 0 #0C0C0C',
              transform: currentRoute === 'demo' ? 'translate(3px, 3px)' : 'none',
              marginLeft: '0.5rem'
            }}
          >
            <PlayCircle size={18} />
            <span>3-MIN JUDGE DEMO</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
