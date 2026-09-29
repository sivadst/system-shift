import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import DashboardPage from './pages/DashboardPage';
import SystemMapPage from './pages/SystemMapPage';
import TransportPage from './pages/TransportPage';
import SimulationPage from './pages/SimulationPage';
import InsightsPage from './pages/InsightsPage';
import EventsPage from './pages/EventsPage';
import DataPage from './pages/DataPage';
import AboutPage from './pages/AboutPage';
import DemoModePage from './pages/DemoModePage';
import { fetchDashboard, fetchTransport } from './api';

export default function App() {
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    const valid = ['dashboard', 'system', 'transport', 'simulation', 'insights', 'events', 'data', 'about', 'demo'];
    return valid.includes(hash) ? hash : 'dashboard';
  };

  const [currentRoute, setCurrentRoute] = useState(getInitialRoute);
  const [dashboardData, setDashboardData] = useState(null);
  const [transportData, setTransportData] = useState(null);
  const [liveTime, setLiveTime] = useState("");
  const [aiInitialQuestion, setAiInitialQuestion] = useState("");

  // Sync route with browser hash for reliable bookmarking & refreshing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) setCurrentRoute(hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAIFromAnywhere = (question) => {
    setAiInitialQuestion(question);
    navigateTo('insights');
  };

  // Live telemetry polling
  useEffect(() => {
    const loadState = async () => {
      const d = await fetchDashboard();
      setDashboardData(d);
      setLiveTime(d.live_simulation_time || new Date().toLocaleTimeString());

      const t = await fetchTransport();
      setTransportData(t);
    };

    loadState();
    const interval = setInterval(loadState, 6000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLiveTime(now.toTimeString().split(' ')[0] + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        liveTime={liveTime}
      />

      <main style={{ flex: 1 }}>
        {currentRoute === 'dashboard' && (
          <DashboardPage
            dashboardData={dashboardData}
            onNavigate={navigateTo}
            onAskAI={handleAskAIFromAnywhere}
          />
        )}

        {currentRoute === 'system' && (
          <SystemMapPage
            onNavigate={navigateTo}
            onAskAI={handleAskAIFromAnywhere}
          />
        )}

        {currentRoute === 'transport' && (
          <TransportPage
            transportData={transportData}
            onNavigate={navigateTo}
            onAskAI={handleAskAIFromAnywhere}
          />
        )}

        {currentRoute === 'simulation' && (
          <SimulationPage
            onAskAI={handleAskAIFromAnywhere}
          />
        )}

        {currentRoute === 'insights' && (
          <InsightsPage
            initialQuestion={aiInitialQuestion}
            onNavigate={navigateTo}
          />
        )}

        {currentRoute === 'events' && (
          <EventsPage />
        )}

        {currentRoute === 'data' && (
          <DataPage />
        )}

        {currentRoute === 'about' && (
          <AboutPage
            onNavigate={navigateTo}
          />
        )}

        {currentRoute === 'demo' && (
          <DemoModePage
            onNavigate={navigateTo}
          />
        )}
      </main>

      <Footer
        onNavigate={navigateTo}
      />
    </div>
  );
}
