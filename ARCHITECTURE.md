# SYSTEM//SHIFT — System Architecture

This document details the architectural design, data pipelines, reasoning mechanisms, and component interactions of **SYSTEM//SHIFT**.

---

## 1. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  OPERATOR (HUMAN)                                 |
+-----------------------------------------------------------------------------------+
                                         │
                                         ▼
+-----------------------------------------------------------------------------------+
|                        FRONTEND CLIENT (React 19 + Vite)                          |
|  - Neo-Brutalist Design System (CSS Tokens, High-Contrast Palette, Hard Shadows)  |
|  - Real-Time Simulation Poller (6s tick interval)                                 |
|  - Interactive System Topology Graph & Cascade Visualizer                         |
|  - What-If Predictive Simulator & Trade-Off Detection Interface                   |
|  - Natural Language Telemetry Reasoning Console ("Ask the System")                |
+-----------------------------------------------------------------------------------+
                                         │  HTTP / JSON Proxy (/api)
                                         ▼
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND SERVICE                                |
|  - RESTful Routers: Dashboard, SystemMap, Transport, Simulation, AI, Events, Data |
|  - Pydantic v2 Request/Response Validation                                        |
|  - CORS & Error Handling Middleware                                               |
+-----------------------------------------------------------------------------------+
                 │                                                   │
                 ▼                                                   ▼
+------------------------------------+             +--------------------------------+
|     DETERMINISTIC SIMULATION       |             |      AI REASONING LAYER        |
|  - Queuing Physics Model           |             |  - Telemetry Context Collector |
|  - Headway Arrival Calculations    |             |  - Google Gemini API (REST)    |
|  - Fleet Operating Cost Engine     |             |  - Deterministic Grounded      |
|  - Route Bottleneck Allocator      |             |    Reasoner (Offline Fallback) |
|  - Trade-Off Detection Logic       |             |  - Non-Normative Guardrails    |
+------------------------------------+             +--------------------------------+
                 │                                                   │
                 └─────────────────────────┬─────────────────────────┘
                                           │
                                           ▼
+-----------------------------------------------------------------------------------+
|                            DATABASE STORAGE LAYER                                 |
|  - SQLite (WAL Mode, 64MB Cache) / Optional PostgreSQL                            |
|  - SQLAlchemy ORM with Connection Pooling & Indexed B-Trees                       |
|  - 100,000+ Synthetic Event Records Spanning 30 Days                              |
|  - Tables: locations, routes, buses, system_metrics, transport_metrics,           |
|            incidents, simulations, ai_queries                                     |
+-----------------------------------------------------------------------------------+
```

---

## 2. Cross-System Causal Coupling

In real physical systems, operations do not exist in departmental silos. SYSTEM//SHIFT models interconnected operational cascades:

```
[08:00–09:30 Morning Rush]
          │
          ▼
Incoming Student Arrival Surge (+23% over baseline)
          │
          ▼
Metro Hub Platform Queuing -> Fleet Saturated (91.0% utilization)
          │
          ▼
Route 3 Bottleneck (97.3% load) -> Average Wait Expands to 18.4 min
          │
          ▼
Late Student Delivery to Academic Quad (+8.2 min schedule slip)
          │
          ▼
Class Transitions Postponed -> Arrival Cohorts Shift Later into Lunch
          │
          ▼
Secondary Central Canteen Congestion (12:45–13:30 surge, 14.2 min queue)
```

The system map visualizes these dependency paths dynamically with animated signal arrows when pressure conditions are met.

---

## 3. Data Ingestion & Storage Architecture

### High-Performance Synthetic Telemetry & Live IoT Adapter Layer
To prove technical credibility without enterprise infrastructure overhead, SYSTEM//SHIFT generates **100,000+ operational records** upon first boot using transactional batch insertion:
* **Time Span**: 30 days of simulated operation.
* **Diurnal Modeling**: Temporal distribution follows empirical campus mobility curves:
  * Morning Peak (07:30–09:30): 45% transport weight.
  * Lunch Peak (11:30–14:00): 45% dining/canteen weight.
  * Study Peak (14:30–18:00): 40% library weight.
  * Evening Peak (18:00–20:30): 40% outbound transit weight.
* **Anomalies Injected**: The database contains realistic incidents such as vehicle turnstile sensor lag, peak corridor surges, and the primary **08:30 Route 3 morning bottleneck**.
* **Live Feed Compatibility**: Ingestion schemas strictly follow industry standards: GTFS-RT (automatic vehicle location), RFID badge turnstiles, and MQTT/BACnet smart facility meters. The synthetic data generator is a modular drop-in that can be replaced directly with live IoT sensor feeds in production.

---

## 4. AI Grounding Architecture: Telemetry-Grounded Reasoning Protocol

A core failure mode of modern AI applications is inventing metrics. SYSTEM//SHIFT implements a strict **4-phase grounding pipeline**:

1. **Context Harvesting**: When the user asks a question, the backend queries the database for actual values:
   * Current fleet utilization (`91.0%`)
   * Active wait times (`18.4 min` avg, `26.5 min` peak)
   * Route-level breakdown (`Route 3: 97.3% utilization`, `Route 1: 81.3%`, `Route 2: 88.0%`)
   * Downstream pressure states (`Canteen: 74%`, `Library: 96%`)
2. **System Instruction Guardrails**:
   > *"You are explaining a complex operational system to a human decision-maker. Use ONLY the supplied structured backend telemetry. Base all claims strictly on the provided data. Distinguish observed data from simulated estimates. Explain causes and relationships clearly. NEVER make decisions on behalf of the user."*
3. **Auditable Evidence Layer & Grounding Status**:
   * Generates a verifiable **Grounding Status** (7 telemetry sources retrieved, 14 metrics referenced, 0 unsupported claims).
   * Generates an **Evidence Trail** mapping every cited statistic to its source table, record ID, and field.
4. **Dual Execution Engine**:
   * **Online**: Connects to the **Google Gemini API** (`gemini-2.5-flash`) with temperature `0.2` for structured reasoning.
   * **Offline Fallback**: If no API key is supplied or network is unavailable, an algorithmic **Deterministic Grounded Reasoner** parses telemetry context and produces exact data-cited explanations. The demo is 100% immune to API rate limits or network failures.
5. **Audit Logging**: Every AI query, context snapshot, cited metrics, and model response are persisted in the `ai_queries` database table.

---

## 5. Security & Engineering Best Practices

* **No Secret Exposure**: API keys (`GEMINI_API_KEY`) are managed strictly through server-side environment variables and never leaked to client bundles.
* **CORS Lockdown**: Middleware permits strictly configured client origins.
* **Input Validation**: All simulation and query parameters are bound to strict Pydantic schemas (e.g. `active_buses: int = Field(ge=4, le=30)`).
* **Graceful Degradation**: If backend services are unreachable, client modules use graceful local telemetry fallbacks rather than crashing.
