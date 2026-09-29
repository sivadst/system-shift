# SYSTEM//SHIFT

> **The machine has the data. Humans need the context.**

[![PS05](https://img.shields.io/badge/Hackathon-PS05%3A%20The%20Human--Machine%20Gap-FF3333?style=for-the-badge)](https://github.com)
[![Status](https://img.shields.io/badge/Status-Operational%20%2F%20Live-00E575?style=for-the-badge)](http://localhost:5173)
[![Records](https://img.shields.io/badge/Telemetry-100%2C000%2B%20Records-FFE500?style=for-the-badge&logoColor=black)](http://localhost:5173/#/data)
[![UI](https://img.shields.io/badge/Aesthetic-Neo--Brutalist-000000?style=for-the-badge)](http://localhost:5173)

---

## 1. Executive Summary & Problem Statement

### PS05 — The Human–Machine Gap
Technology is increasingly capable of collecting, processing, and analyzing enormous amounts of information. However, people often struggle to understand, operate, and act on the information produced by complex systems.

**SYSTEM//SHIFT** bridges this gap by transforming complex campus operational data into an interactive, human-centered operations interface.

The user should not have to understand relational schemas, time-series aggregations, statistics, or queuing equations.

They should simply be able to ask:
1. **“What is happening?”** *(Live campus pressure detection)*
2. **“Why is it happening?”** *(Data-grounded AI causality engine)*
3. **“What happens if I change something?”** *(Deterministic What-If simulator with trade-off detection)*

---

## 2. Core Product Principles

### What SYSTEM//SHIFT Is NOT:
* ❌ Not another generic AI chatbot making unverified claims.
* ❌ Not a standard SaaS analytics dashboard with 50 isolated charts.
* ❌ Not a CRUD application or static mockup.

### What SYSTEM//SHIFT IS:
* An **interactive interface between humans and complex systems**.
* **The AI explains actual backend data** via a **Telemetry-Grounded Reasoning Protocol** with auditable database citations and verified evidence coverage.
* **The simulator uses calibrated mathematical equations** (queuing delays, fleet cost functions, cross-system propagation) that reproduce baseline ground truth (18.4m / 78% / ₹18,400) to the single rupee and decimal.
* **100K+ Synthetic Operational Telemetry**: Modeled on university campus dynamics, designed with modular adapters ready to swap directly with live GTFS/AVL GPS and turnstile feeds.
* **The human remains the sole decision-maker**: the system detects trade-offs (e.g. *“Lower waiting time (-60%) comes with higher operating cost (+₹6,440/day)”*) without taking agency away from the operator.

---

## 3. Visual Identity: Neo-Brutalist Design Language

SYSTEM//SHIFT deliberately rejects generic modern SaaS templates (excessive purple gradients, soft blurs, and glassmorphism) in favor of a serious, high-contrast, editorial operations console:
* **Thick Black Borders** (`3px - 4px solid #000`)
* **Hard Offset Shadows** (`4px 4px 0px #000`, `6px 6px 0px #000`)
* **Semantic High-Contrast Palette**:
  * **Off-White / Warm White** (`#F4F3EE`) background & pure black text
  * **Electric Yellow** (`#FFE500`) for interaction & highlight
  * **Signal Red** (`#FF3333`) for critical pressure & bottlenecks
  * **Acid Green** (`#00E575`) for nominal status & improvements
  * **Bright Blue** (`#2266FF`) for telemetry inspection
  * **Orange** (`#FF7A00`) for elevated warnings
* **Large Editorial Typography** (`Space Grotesk` headings + `JetBrains Mono` code accents) with oversized key metric numbers (`18.4 MIN`, `91% LOAD`).

---

## 4. Key Pages & Routes

| Route | View | Description |
|---|---|---|
| `/` | **Dashboard** | Command center, live simulation ticker, 3 system pressures detected, cross-system cascade visualizer. |
| `/system` | **System Map** | Interactive topology network (Students, Transport, Canteen, Library, Classrooms, Network, Facilities) with animated flow lines & node inspector. |
| `/transport` | **Transport Intelligence** | Fleet capacity, demand, average & peak wait times, hourly chronological trend bars, and route health table from database records. |
| `/simulation` | **What-If Simulator** | **Hero feature**: Interactive sliders (Active buses, Headway, Demand modifier, Peak window), animated calculation, side-by-side comparison, and Trade-Off Engine. |
| `/insights` | **Ask the System (AI)** | Grounded reasoning console powered by Gemini with deterministic telemetry fallback. Explains system state citing exact database numbers. |
| `/events` | **System Events Feed** | Real-time audit log filterable by severity, subsystem, and keyword search across 100,000+ records. |
| `/data` | **Data Explorer** | Technical judge inspection console verifying database scale, schema, 30-day temporal distribution, and raw telemetry logs. |
| `/about` | **PS05 Manifesto** | Detailed explanation of The Gap, The Problem, The Solution, and The Difference. |
| `/demo` | **3-Minute Judge Tour** | Guided step-by-step walkthrough covering the entire critical journey from pressure detection to simulation trade-off. |

---

## 5. Technology Stack

* **Backend**: Python 3.13, **FastAPI**, **SQLAlchemy ORM**, **Pydantic v2**, **Uvicorn**, **SQLite** (WAL mode / high-speed B-Trees; optional PostgreSQL compatibility).
* **AI Reasoning Layer**: **Google Gemini API** (`gemini-2.5-flash` / `gemini-1.5-flash`) via `httpx` + **Grounded Telemetry Reasoner** fallback engine (ensuring 100% demo reliability offline or without API keys).
* **Frontend**: **React 19 / 18**, **Vite 8**, **Vanilla Neo-Brutalist CSS tokens**, **Lucide Icons**.
* **Synthetic Data Generator**: Fast transaction bulk-engine producing **100,000+ operational records** across 30 days with diurnal morning/lunch/afternoon curves and injected anomalies.

---

## 6. Quick Start & Setup Instructions

### Prerequisites
* **Node.js** (v18+) and **npm**
* **Python** (v3.10+)

### Automated Setup & Launch (Windows)

#### Option 1: Double-click `start.bat`
```bat
start.bat
```

#### Option 2: PowerShell
```powershell
.\start.ps1
```

### Manual Setup

#### 1. Backend Setup
```bash
cd backend
# Install dependencies (if not globally installed)
pip install fastapi uvicorn sqlalchemy pydantic httpx python-dotenv

# Run backend (auto-seeds 100,000 synthetic records on initial startup)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
Backend will be available at: **http://127.0.0.1:8000** (Swagger Docs: `http://127.0.0.1:8000/docs`).

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend will be available at: **http://127.0.0.1:5173**.

---

## 7. The 3-Minute Hackathon Demo Script

For hackathon judges evaluating **PS05: The Human–Machine Gap**:

1. **Step 1 — The Gap**: Open `http://127.0.0.1:5173/#/demo` (or click `3-MIN JUDGE DEMO` in the top header).
2. **Step 2 — Detection**: Notice the alert: **3 SYSTEM PRESSURES DETECTED**. Transport is critical at 91% load with an 18.4 min wait.
3. **Step 3 — Investigate**: Click into Transport intelligence. Observe that Route 3 (Metro Link) absorbs 38% of demand but operates with only 3 buses.
4. **Step 4 — Ask Why**: Click **ASK AI WHY**. The grounded reasoning engine retrieves backend telemetry and explains:
   > *“The main bottleneck is peak-hour transport capacity. Demand surged 23% between 08:00 and 09:00 while available fleet capacity decreased 8%. Route 3 is operating at 97% utilization and contributes 68% of the queuing pressure.”*
5. **Step 5 — What-If Hypothesis**: Open the **WHAT IF?** Simulator. Adjust the active fleet from **10 buses → 14 buses** (frequency: 8 min).
6. **Step 6 — Simulation & Trade-Off**: Click **RUN SIMULATION**. The calibrated engine calculates:
   * Waiting time: **18.4 min → 7.4 min (-60%)**
   * Overcrowding: **78% → 27.5% (-65%)**
   * Route 3 load: **97.3% (CRITICAL) → 58.4% (HEALTHY)**
   * Fleet Operating Cost: **₹18,400 → ₹24,840/day (+₹6,440 / +35%)**
7. **Step 7 — Decision Agency**: Notice the banner: **TRADE-OFF DETECTED**. The system does not say *"You must add 4 buses"*; it describes the fiscal vs service quality consequence so the human decides.
8. **Step 8 — Cross-System Cascade**: Observe how transit relief cascades downstream, smoothing the Central Canteen queue from 14.2 min to ~9.2 min.

---

## 8. API Documentation

| Endpoint | Method | Parameters | Description |
|---|---|---|---|
| `/api/dashboard` | `GET` | — | Returns live campus state, detected pressures, and metric cards. |
| `/api/system-map` | `GET` | — | Returns graph nodes, dependency edges, and active cascade paths. |
| `/api/transport` | `GET` | — | Returns fleet metrics, route breakdowns, and hourly trend series. |
| `/api/transport/routes` | `GET` | — | Detailed route telemetry table from database records. |
| `/api/simulation` | `POST` | `active_buses`, `bus_frequency_min`, `student_demand_mod_pct`, `peak_window_min` | Runs calibrated queuing & route dispatch model and stores scenario. |
| `/api/simulation/presets` | `GET` | — | Returns curated operational scenarios. |
| `/api/ai/query` | `POST` | `question` | Telemetry-grounded natural language explanation with evidence layer. |
| `/api/insights` | `GET` | — | Proactive cross-system insights. |
| `/api/events` | `GET` | `page`, `limit`, `system`, `severity`, `search` | Filterable, paginated audit feed. |
| `/api/data/summary` | `GET` | — | Database scale verification (100k+ records, disk size, date span). |

---

## 9. Limitations & Production Readiness

* **Enterprise IoT Ingress**: Architecture designed with modular ingestion connectors so the 100K+ synthetic generator can be swapped directly for live GTFS-RT (AVL GPS vehicle tracking), RFID turnstile logs, and MQTT/BACnet smart facility meters.
* **Multi-Modal Transit**: Expansion to e-scooter sharing corridors, bicycle lanes, and parking garage load balancing.
* **Reinforcement Learning Scenarios**: Providing policy exploration spaces while maintaining the non-normative human-in-the-loop guarantee.

---

## 10. License
Built for the Google Hackathon 2026. Distributed under the MIT License.
