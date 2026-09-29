import React, { useState, useEffect } from 'react';
import { fetchEvents } from '../api';
import { Bell, Filter, Search, RefreshCw, AlertTriangle, ShieldCheck, MapPin, Clock } from 'lucide-react';

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Filters
  const [selectedSystem, setSelectedSystem] = useState("ALL");
  const [selectedSeverity, setSelectedSeverity] = useState("ALL");
  const [search, setSearch] = useState("");

  const systems = ["ALL", "TRANSPORT", "CANTEEN", "LIBRARY", "NETWORK", "FACILITIES", "CLASSROOMS", "STUDENTS"];
  const severities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  useEffect(() => {
    loadEvents();
  }, [page, selectedSystem, selectedSeverity]);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 25,
        system: selectedSystem !== "ALL" ? selectedSystem : undefined,
        severity: selectedSeverity !== "ALL" ? selectedSeverity : undefined,
        search: search.trim() ? search.trim() : undefined
      };
      const res = await fetchEvents(params);
      setEvents(res.events || []);
      setTotal(res.total || 0);
    } catch (err) {
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadEvents();
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL': return <span className="brutal-badge badge-red">CRITICAL</span>;
      case 'HIGH': return <span className="brutal-badge badge-orange">HIGH</span>;
      case 'MEDIUM': return <span className="brutal-badge badge-yellow">MEDIUM</span>;
      default: return <span className="brutal-badge badge-green">LOW</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1380px', margin: '0 auto', padding: '1.5rem' }}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="live-pulse"></span>
            <span className="brutal-badge badge-yellow">REAL-TIME OPERATIONAL LOG</span>
            <span className="brutal-badge badge-white">{total.toLocaleString()} EVENTS IN DATABASE</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>SYSTEM EVENTS & INCIDENTS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Chronological audit feed of pressure triggers, capacity alerts, and infrastructure logs across campus.
          </p>
        </div>

        <button
          onClick={() => loadEvents()}
          disabled={loading}
          className="brutal-btn brutal-btn-primary"
        >
          <RefreshCw size={16} className={loading ? "live-pulse" : ""} /> REFRESH FEED
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="brutal-card" style={{
        background: '#FFFFFF',
        border: 'var(--border-thick) solid #000',
        padding: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'flex-end'
        }}>
          {/* Search Box */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              SEARCH INCIDENT / DESCRIPTION:
            </label>
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex' }}>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter by keyword (e.g., Route 3, Canteen)..."
                style={{
                  width: '100%',
                  padding: '0.5rem 0.75rem',
                  fontFamily: 'var(--font-heading)',
                  border: '2px solid #000',
                  outline: 'none',
                  fontSize: '0.9rem'
                }}
              />
              <button
                type="submit"
                className="brutal-btn brutal-btn-dark"
                style={{ padding: '0.5rem 0.85rem' }}
              >
                <Search size={16} />
              </button>
            </form>
          </div>

          {/* System Filter */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              FILTER BY SUBSYSTEM:
            </label>
            <select
              value={selectedSystem}
              onChange={(e) => { setSelectedSystem(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                border: '2px solid #000',
                background: '#FFF',
                outline: 'none'
              }}
            >
              {systems.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Severity Filter */}
          <div>
            <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>
              SEVERITY LEVEL:
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => { setSelectedSeverity(e.target.value); setPage(1); }}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                border: '2px solid #000',
                background: '#FFF',
                outline: 'none'
              }}
            >
              {severities.map(sev => <option key={sev} value={sev}>{sev}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Events Feed List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {events.length === 0 ? (
          <div className="brutal-card-flat" style={{ textAlign: 'center', padding: '3rem', background: '#FFF' }}>
            <AlertTriangle size={36} color="#888" style={{ margin: '0 auto 0.5rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>NO EVENTS MATCHING FILTER CRITERIA</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>Try clearing filters or adjusting your search term.</p>
          </div>
        ) : (
          events.map((evt) => {
            const isCrit = evt.severity === 'CRITICAL';
            return (
              <div
                key={evt.id}
                className="brutal-card"
                style={{
                  background: isCrit ? '#FFF5F5' : '#FFFFFF',
                  borderLeft: `8px solid ${isCrit ? 'var(--accent-red)' : (evt.severity === 'HIGH' ? 'var(--accent-orange)' : '#0C0C0C')}`,
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      background: '#0C0C0C',
                      color: '#FFF',
                      padding: '0.2rem 0.5rem'
                    }}>
                      {evt.timestamp ? new Date(evt.timestamp).toLocaleTimeString() : '08:30:00'}
                    </span>
                    <span className="brutal-badge badge-white">
                      {evt.system_affected}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.78rem', color: '#666', fontFamily: 'var(--font-mono)' }}>
                      <MapPin size={13} /> {evt.location}
                    </span>
                  </div>

                  <div>
                    {getSeverityBadge(evt.severity)}
                  </div>
                </div>

                <div style={{ fontSize: '1.15rem', fontWeight: 900, marginBottom: '0.35rem' }}>
                  {evt.title}
                </div>

                <p style={{ fontSize: '0.9rem', color: '#333', lineHeight: 1.45, marginBottom: '0.65rem' }}>
                  {evt.description}
                </p>

                {evt.impact_summary && (
                  <div style={{
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#666',
                    borderTop: '1px dashed #DDD',
                    paddingTop: '0.4rem'
                  }}>
                    <strong>OPERATIONAL IMPACT:</strong> {evt.impact_summary}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        background: '#FFF',
        border: '3px solid #000',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
          Showing page <strong>{page}</strong> of <strong>{Math.max(1, Math.ceil(total / 25))}</strong> ({total.toLocaleString()} total logged events)
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="brutal-btn"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem', background: '#EEE' }}
          >
            ← PREV
          </button>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page >= Math.ceil(total / 25)}
            className="brutal-btn brutal-btn-primary"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.8rem' }}
          >
            NEXT →
          </button>
        </div>
      </div>

    </div>
  );
}
