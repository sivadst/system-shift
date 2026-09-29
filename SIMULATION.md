# SYSTEM//SHIFT — Simulation & Mathematical Engine

This document defines the mathematical models, queuing physics, fleet cost structures, and trade-off classification logic powering the **What-If Simulator**.

---

## 1. Mathematical Model Formulation

The simulation engine is **deterministic, explainable, and internally consistent**. It replaces arbitrary hardcoded demo numbers with a continuous parametric model.

### 1.1 Inputs

| Parameter | Symbol | Range | Default Baseline | Description |
|---|---|---|---|---|
| Active Buses | $B$ | $4 \dots 30$ | $10$ | Total vehicles deployed in service |
| Bus Frequency (Headway) | $H$ | $3.0 \dots 30.0$ min | $10.0$ min | Scheduled interval between bus arrivals |
| Student Demand Modifier | $\Delta D$ | $-50\% \dots +100\%$ | $0\%$ | Percentage shift in commuter arrival volume |
| Peak Window Duration | $T_{peak}$ | $30 \dots 240$ min | $90$ min | Duration of concentrated morning influx |

---

### 1.2 Capacity & Demand Physics

Let $C_{bus} = 50$ passengers per vehicle (rated seating plus regulated standing room).

$$\text{Total Fleet Capacity } C_{total} = B \times C_{bus}$$

With a baseline morning peak arrival volume $D_{base} = 455$ students:

$$\text{Effective Demand } D_{eff} = D_{base} \times \left(1 + \frac{\Delta D}{100}\right)$$

$$\text{Fleet Utilization } U = \min\left(150.0, \frac{D_{eff}}{C_{total}} \times 100\right)\%$$

---

### 1.3 Waiting Time Calculation

Average waiting time consists of two components: **scheduled headway arrival delay** and **congestion queuing backlog**:

$$W_{avg} = \left( W_{headway} + W_{congestion} \right) \times \left(\frac{T_{peak}}{90}\right)^{0.4}$$

Where:
* **Scheduled Headway Wait**: Assuming uniform student arrivals:
  $$W_{headway} = \frac{H}{2}$$
* **Congestion Delay ($W_{congestion}$)**: Non-linear queuing penalty derived from system saturation:
  * If $U \le 60\%$:
    $$W_{congestion} = \max\left(0.8, \frac{U}{60} \times 2.2\right)$$
  * If $60\% < U \le 75\%$:
    $$W_{congestion} = 2.2 + \left(\frac{U - 60}{15}\right) \times 3.5$$
  * If $75\% < U \le 91.0\%$:
    $$W_{congestion} = 5.7 + \left(\frac{U - 75}{16.0}\right)^{1.35} \times 7.7$$
  * If $U > 91.0\%$ (Severe platform spillover):
    $$W_{congestion} = 13.4 + (U - 91.0) \times 0.9$$

---

### 1.4 Overcrowding Index

The percentage of passengers experiencing severe platform overcrowding or standing-only congestion:

* If $U \le 60\%$:
  $$O = \max\left(5.0, \frac{U}{60} \times 20.0\right)\%$$
* If $60\% < U \le 70\%$:
  $$O = \left(20.0 + \frac{U - 60}{10} \times 15.0\right)\%$$
* If $70\% < U \le 91.0\%$:
  $$O = \left(35.0 + \frac{U - 70}{21.0} \times 43.0\right)\%$$
* If $U > 91.0\%$:
  $$O = \min\left(99.0, 78.0 + (U - 91.0) \times 1.5\right)\%$$

---

### 1.5 Daily Operating Cost Model (INR)

Operating a transit fleet incurs fixed facility depot costs, driver/depreciation costs per active bus, and variable mileage/fuel costs linked to frequency cycles:

$$\text{Daily Cost } (\text{₹}) = F_{depot} + (B \times V_{bus}) + \left(\frac{60}{H} \times B \times M_{cycle}\right)$$

Where:
* $F_{depot} = \text{₹}3,980$ (Fixed depot overhead, charging stations, dispatch telemetry)
* $V_{bus} = \text{₹}1,250$ / bus / day (Driver shift wages, insurance, maintenance reserve)
* $M_{cycle} = \text{₹}32$ / cycle (Fuel, tire wear, per-mile depreciation)

#### Numerical Verification:
* **Baseline** ($B=10$, $H=10$ min):
  $$\text{Cost} = 3980 + (10 \times 1250) + (6 \times 10 \times 32) = 3980 + 12500 + 1920 = \text{₹}18,400 / \text{day}$$
* **Hero Scenario** ($B=14$, $H=8$ min):
  $$\text{Cost} = 3980 + (14 \times 1250) + (7.5 \times 14 \times 32) = 3980 + 17500 + 3360 = \text{₹}24,840 / \text{day}$$
  $$\Delta \text{Cost} = \text{₹}24,840 - \text{₹}18,400 = +\text{₹}6,440 / \text{day} \text{ (+35.0\%)}$$

---

### 1.6 Route-Level Dynamic Fleet Dispatch

Rather than distributing fleet capacity uniformly (25% per route), the simulation engine mirrors actual campus dispatch:
* **Baseline Allocation**: Route 1 (3 buses, 122 pax, 81.3%), Route 2 (2 buses, 88 pax, 88.0%), Route 3 (3 buses, 146 pax, 97.3%), Route 4 (2 buses, 68 pax, 68.0%).
* **Greedy Congestion Dispatch**: When the fleet expands (e.g. 10 $\rightarrow$ 14 buses), additional vehicles are prioritized towards the highest-load corridors:
  * Bus 11 $\rightarrow$ Route 3 (Metro Link bottleneck)
  * Bus 12 $\rightarrow$ Route 2 (Hostel Express)
  * Bus 13 $\rightarrow$ Route 1 (Campus Circular)
  * Bus 14 $\rightarrow$ Route 3 (Metro Link peak relief)
* **Outcome**: Under the 14-bus hero scenario, Route 3 expands from 3 to 5 buses (250 capacity), reducing utilization from **97.3% (CRITICAL)** to **58.4% (HEALTHY)** and wait time from 24.8 min to 11.9 min.

---

## 2. Cross-System Cascading Model

Changes in transit waiting times directly affect downstream academic and dining facilities:

$$\Delta W = W_{simulated} - W_{baseline}$$

$$\text{Canteen Queue Duration } Q_{canteen} = \max\left(3.0, 14.2 + (\Delta W \times 0.7)\right)\text{ min}$$

$$\text{Canteen Peak Occupancy } O_{canteen} = \min\left(98.0, \max(45.0, 74.0 + (\Delta W \times 1.2))\right)\%$$

* When $\Delta W < 0$ (faster transit), arriving students spread normally throughout the academic day, avoiding compressed lunch rushes.
* When $\Delta W > 0$ (delayed transit), arrival clusters clump together, postponing the lunchtime wave and overloading food counters.

---

## 3. Trade-Off Detection Engine

The system evaluates operational delta values:
* $\Delta W = W_{simulated} - W_{baseline}$
* $\Delta C = \text{Cost}_{simulated} - \text{Cost}_{baseline}$

### Classification Rules

1. **`TRADE_OFF_DETECTED`** ($\Delta W \le -1.0$ min and $\Delta C > \text{₹}600$):
   * **Title**: `TRADE-OFF DETECTED`
   * **Description**: *"Lower waiting time (-X min / -Y%) comes with higher operating cost (+₹Z/day / +W%). Overcrowding drops, but fleet operating expenditure expands."*
   * **Human Decision Boundary**: *"The system does not prescribe a choice. Evaluate whether reducing student waiting time from 18.4 min to {X} min justifies an operational cost increase of ₹{Y}/day."*
2. **`SERVICE_DEGRADED`** ($\Delta W \ge +1.0$ min and $\Delta C < -\text{₹}600$):
   * **Title**: `BUDGET REDUCTION TRADE-OFF`
   * **Description**: *"Trims daily expenditure by ₹{Z}/day, but inflates student waiting times by +{X} min and creates severe platform crowding."*
3. **`CAPACITY_IMPROVED`** ($\Delta W \le -0.5$ min and $\Delta C \le \text{₹}600$):
   * **Title**: `EFFICIENCY GAIN DETECTED`
   * **Description**: *"Scenario reduces congestion within existing cost boundaries."*

### The Ethical Principle
Under no circumstances does the engine say *"You should add 4 buses"* or *"Action required"*. The system illuminates the trade-off with mathematical clarity. The human remains the sole decision-maker.
