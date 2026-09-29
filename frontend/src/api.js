const API_BASE = '/api';

export async function fetchDashboard() {
  try {
    const res = await fetch(`${API_BASE}/dashboard`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend unavailable, using local telemetry fallback:", err);
    return {
      system_status: "3 SYSTEM PRESSURES DETECTED",
      live_simulation_time: new Date().toLocaleTimeString(),
      pressures_count: 3,
      pressures: [
        {
          system: "TRANSPORT",
          load_pct: 91.0,
          status: "CRITICAL",
          pressure_label: "Transport Overload",
          detail: "Route 3 Metro Link operating at 97% capacity. Average waiting time 18.4 min.",
          cascade_target: "CANTEEN",
          severity: "CRITICAL"
        },
        {
          system: "LIBRARY",
          load_pct: 96.0,
          status: "CRITICAL",
          pressure_label: "Library Overcrowding",
          detail: "Mid-term exam surge. Silent study desks at 96% occupancy (16 seats left).",
          cascade_target: "STUDENTS",
          severity: "CRITICAL"
        },
        {
          system: "CANTEEN",
          load_pct: 74.0,
          status: "ELEVATED",
          pressure_label: "Canteen Demand Spike",
          detail: "Transit delay postponement shifting lunch arrival waves into dining halls (14.2 min queue).",
          cascade_target: "FACILITIES",
          severity: "WARNING"
        }
      ],
      system_cards: [
        { id: 1, system_name: "TRANSPORT", load_pct: 91.0, status: "CRITICAL", pressure_active: true, metric_label: "Fleet Utilization", metric_value: "91% (18.4 min wait)", notes: "Route 3 capacity bottleneck" },
        { id: 2, system_name: "CANTEEN", load_pct: 74.0, status: "ELEVATED", pressure_active: true, metric_label: "Dining Queue", metric_value: "74% (14.2 min wait)", notes: "Downstream transit delay wave" },
        { id: 3, system_name: "LIBRARY", load_pct: 96.0, status: "CRITICAL", pressure_active: true, metric_label: "Seat Occupancy", metric_value: "96% (16 seats left)", notes: "Mid-term study revisions" },
        { id: 4, system_name: "NETWORK", load_pct: 68.0, status: "NORMAL", pressure_active: false, metric_label: "WiFi Bandwidth", metric_value: "68% (1.4 Gbps)", notes: "Optimal operations" },
        { id: 5, system_name: "CLASSROOMS", load_pct: 62.0, status: "NORMAL", pressure_active: false, metric_label: "Lecture Halls", metric_value: "62% (84/120 halls)", notes: "Morning lectures in session" },
        { id: 6, system_name: "FACILITIES", load_pct: 45.0, status: "NORMAL", pressure_active: false, metric_label: "HVAC & Power", metric_value: "45% nominal", notes: "Substations stable" }
      ],
      active_bottleneck: "Route 3 (Metro Link) Transit Capacity Strained",
      summary: "Interconnected system telemetry indicates incoming student arrival spike is propagating through campus transport into downstream dining facilities."
    };
  }
}

export async function fetchSystemMap() {
  try {
    const res = await fetch(`${API_BASE}/system-map`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Using fallback system map data:", err);
    return null;
  }
}

export async function fetchTransport() {
  try {
    const res = await fetch(`${API_BASE}/transport`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Using fallback transport data:", err);
    return {
      active_buses: 10,
      total_capacity: 500,
      current_demand: 455,
      utilization_pct: 91.0,
      avg_wait_min: 18.4,
      peak_wait_min: 26.5,
      overcrowding_pct: 78.0,
      daily_cost: 18400.0,
      delayed_passengers: 142,
      routes: [
        { id: 1, route_code: "Route 1", name: "Campus Circular", source: "Campus Center", destination: "South Hostels", stops_count: 8, active_buses: 3, capacity: 150, current_passengers: 122, utilization_pct: 81.3, avg_wait_min: 11.2, status: "WARNING", delay_min: 3.4 },
        { id: 2, route_code: "Route 2", name: "Hostel Express", source: "South Hostels", destination: "Academic Quad", stops_count: 6, active_buses: 2, capacity: 100, current_passengers: 88, utilization_pct: 88.0, avg_wait_min: 14.5, status: "WARNING", delay_min: 5.1 },
        { id: 3, route_code: "Route 3", name: "Metro Rail Link (Critical)", source: "Metro Transit Hub", destination: "Engineering Quad", stops_count: 10, active_buses: 3, capacity: 150, current_passengers: 146, utilization_pct: 97.3, avg_wait_min: 24.8, status: "CRITICAL", delay_min: 12.6 },
        { id: 4, route_code: "Route 4", name: "Research Park Shuttle", source: "Campus Center", destination: "Research Park", stops_count: 5, active_buses: 2, capacity: 100, current_passengers: 68, utilization_pct: 68.0, avg_wait_min: 7.4, status: "HEALTHY", delay_min: 1.2 }
      ],
      hourly_trends: []
    };
  }
}

export async function runSimulation(payload) {
  const res = await fetch(`${API_BASE}/simulation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Simulation failed with code ${res.status}`);
  return await res.json();
}

export async function fetchSimulationPresets() {
  try {
    const res = await fetch(`${API_BASE}/simulation/presets`);
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function askAI(question) {
  const res = await fetch(`${API_BASE}/ai/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error(`AI query error ${res.status}`);
  return await res.json();
}

export async function fetchInsights() {
  const res = await fetch(`${API_BASE}/insights`);
  if (!res.ok) throw new Error(`Insights error ${res.status}`);
  return await res.json();
}

export async function fetchEvents(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/events?${query}`);
  if (!res.ok) throw new Error(`Events error ${res.status}`);
  return await res.json();
}

export async function fetchDataSummary() {
  const res = await fetch(`${API_BASE}/data/summary`);
  if (!res.ok) throw new Error(`Data summary error ${res.status}`);
  return await res.json();
}

export async function fetchRawRecords(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_BASE}/data/records?${query}`);
  if (!res.ok) throw new Error(`Records error ${res.status}`);
  return await res.json();
}
