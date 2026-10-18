# Smart Parking System (DAA Academic Project)

A complete, full-stack **Smart Parking System** designed for the **Design and Analysis of Algorithms (DAA)** curriculum. The application demonstrates the practical implementation of a **Greedy Algorithm** to allocate the nearest eligible parking space to an incoming vehicle in $O(n)$ time complexity.

Built using a **MERN-style architecture without any database** (no MongoDB, SQL, Firebase, or ORMs). Authoritative state is kept strictly in server-side JavaScript memory (`Arrays`, `Objects`, and `Maps`).

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Folder Structure](#folder-structure)
5. [Greedy Algorithm & Pseudocode](#greedy-algorithm--pseudocode)
6. [Complexity Analysis (DAA)](#complexity-analysis-daa)
7. [In-Memory State Management](#in-memory-state-management)
8. [Backend REST API](#backend-rest-api)
9. [Installation & Setup](#installation--setup)
10. [Running the Application](#running-the-application)
11. [Demonstration Scenario (Example Input & Output)](#demonstration-scenario-example-input--output)
12. [Automated Testing](#automated-testing)
13. [Limitations & Competitive Analysis](#limitations--competitive-analysis)
14. [DAA Viva & Presentation Guide](#daa-viva--presentation-guide)

---

## Project Overview

In dense urban environments and commercial complexes, drivers circling for available parking cause traffic congestion and fuel waste. This simulated Smart Parking System solves the single-vehicle assignment problem:

1. **Space Availability**: Real-time visual 2D schematic of all parking spaces, distances from entrance, and occupancy.
2. **Nearest Space Allocation**: Computes and allocates the closest eligible bay using a Greedy search strategy.
3. **Multi-Constraint Filtering**: Accounts for vehicle categories, disability/accessibility requirements, and VIP/reserved permits.
4. **Vehicle Ingress & Egress**: Manages active vehicle registrations and releases spaces upon departure.
5. **Interactive Execution Trace**: Step-by-step playback of the backend algorithm's decision log, showing current minimum distances and skipped spaces.

---

## Technology Stack

### Frontend
- **Framework**: React.js 18
- **Build Tool**: Vite 5
- **Styling**: Vanilla CSS with modern Glassmorphism, CSS Custom Properties, and responsive grid layouts
- **Icons**: Lucide React
- **API Client**: Native `fetch` API with proxy routing

### Backend
- **Runtime**: Node.js (v18+)
- **Web Framework**: Express.js 4
- **CORS**: Cross-Origin Resource Sharing enabled
- **Testing**: Built-in `node:test` and `node:assert/strict` (zero external test dependencies)

### Storage (No Database)
- **Authoritative Data**: Server-side in-memory JavaScript structures (`Array`, `Map`)
- **No MongoDB, No SQL, No Firebase, No ORM, No Browser LocalStorage**
- State is preserved during the server lifecycle and safely resets when restarted or on `POST /api/parking/reset`.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       React Frontend                        │
│   (Vite Server: http://localhost:5173)                      │
│                                                             │
│   ┌───────────────┐  ┌────────────────┐  ┌──────────────┐   │
│   │ ParkingStats  │  │  ParkingGrid   │  │ FindParking  │   │
│   └───────────────┘  └────────────────┘  └──────────────┘   │
│   ┌───────────────┐  ┌────────────────┐  ┌──────────────┐   │
│   │  VehicleExit  │  │ AlgVisualizer  │  │ DAA Analysis │   │
│   └───────────────┘  └────────────────┘  └──────────────┘   │
└──────────────────────────────▲──────────────────────────────┘
                               │ JSON REST APIs
                               │ (Fetch / Proxy)
┌──────────────────────────────▼──────────────────────────────┐
│                    Express.js Backend                       │
│              (Node Server: http://localhost:5000)           │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                    REST Endpoints                   │   │
│   │   GET  /api/parking         GET  /api/parking/stats │   │
│   │   POST /api/parking/assign  POST /api/parking/exit  │   │
│   │   POST /api/parking/reset   GET  /api/parking/veh   │   │
│   └──────────────────────────▲──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │       Greedy Algorithm (server/algorithms/)         │   │
│   │       O(n) Single Linear Scan + Trace Generator     │   │
│   └──────────────────────────▲──────────────────────────┘   │
│                              │                              │
│   ┌──────────────────────────▼──────────────────────────┐   │
│   │    In-Memory State Store (server/data/parkingData)   │   │
│   │    - spaces: Array<Object>                          │   │
│   │    - activeVehicles: Map<RegNumber, Assignment>     │   │
│   │    - Atomic lock / Mutex for concurrency safety     │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
smart-parking-system/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── components/
│       │   ├── Dashboard.jsx
│       │   ├── FindParking.jsx
│       │   ├── GreedyAlgorithmVisualizer.jsx
│       │   ├── ParkingGrid.jsx
│       │   ├── ParkingStats.jsx
│       │   └── VehicleExit.jsx
│       ├── pages/
│       │   └── AlgorithmAnalysis.jsx
│       ├── services/
│       │   └── parkingApi.js
│       └── styles/
│           └── style.css
├── server/
│   ├── package.json
│   ├── server.js
│   ├── algorithms/
│   │   └── greedyParking.js
│   ├── data/
│   │   └── parkingData.js
│   ├── routes/
│   │   └── parkingRoutes.js
│   └── tests/
│       └── greedyParking.test.js
├── package.json
├── start-dev.js
└── README.md
```

---

## Greedy Algorithm & Pseudocode

### Greedy Choice Property
At each step of the iteration, the algorithm considers candidate space $s_i$. If $s_i$ is eligible (available, matches accessibility and reservation criteria) and its distance $d(s_i) < \text{minDistance}$, the algorithm immediately chooses $s_i$ as the new best candidate without reconsidering earlier rejected choices.

### Pseudocode

```text
Algorithm GreedyNearestParking(S, V):
Input: 
  S: Array of n parking spaces [s_1, s_2, ..., s_n]
  V: Vehicle request containing (regNo, type, requiresAccessible, hasReservationPermit)
Output: 
  bestSpace: Eligible space with minimum distance, or NULL if unavailable

1.  minDistance ← ∞
2.  bestSpace ← NULL
3.  trace ← []
4.
5.  for each space s in S do:
6.      isEligible ← true
7.      
8.      // Constraint 1: Check occupancy
9.      if s.status == "occupied" then:
10.         isEligible ← false
11.     
12.     // Constraint 2: Check VIP reservation requirement
13.     else if s.reserved == true and not V.hasReservationPermit then:
14.         isEligible ← false
15.     
16.     // Constraint 3: Check accessibility requirements
17.     else if s.type == "accessible" and not V.requiresAccessible then:
18.         isEligible ← false
19.     else if V.requiresAccessible and s.type != "accessible" then:
20.         isEligible ← false
21.     
22.     // Greedy Comparison
23.     if isEligible then:
24.         if s.distance < minDistance then:
25.             minDistance ← s.distance
26.             bestSpace ← s
27.             RecordStep(trace, s, becameBest=true, reason="New minimum distance")
28.         else:
29.             RecordStep(trace, s, becameBest=false, reason="Distance not closer")
30.     else:
31.         RecordStep(trace, s, becameBest=false, reason=SkipReason(s))
32.  end for
33.
34.  if bestSpace != NULL then:
35.      return { success: true, allocatedSpace: bestSpace, trace: trace }
36.  else:
37.      return { success: false, message: "No eligible space found", trace: trace }
```

---

## Complexity Analysis (DAA)

Where $n$ represents the total number of parking spaces in the lot:

| Complexity Dimension | Value | Explanation |
| :--- | :--- | :--- |
| **Best-Case Time** | **$O(n)$** | A full linear scan evaluates all $n$ spaces to guarantee no closer space exists. |
| **Worst-Case Time** | **$O(n)$** | Exactly $n$ iterations are executed. Each iteration performs $O(1)$ constant-time condition checks and a scalar comparison. |
| **Average-Case Time**| **$O(n)$** | Uniform across all space configurations. |
| **Auxiliary Space** | **$O(1)$** | Only scalar variables (`minDistance`, `bestSpace`, iteration pointers) are maintained in memory for the core algorithm logic. |

*Note on Execution Trace:* The step-by-step trace returned to the frontend for academic visualization consumes $O(n)$ memory in the JSON response, but the core decision-making algorithm requires strictly $O(1)$ auxiliary memory.

---

## In-Memory State Management

All authoritative data lives in Node.js server memory in `server/data/parkingData.js`:
- `parkingSpaces`: JavaScript Array of space objects.
- `activeVehicles`: JavaScript `Map<RegistrationNumber, AssignmentData>` providing $O(1)$ lookup for vehicle assignments and preventing duplicate registrations.
- **Race Condition Prevention**: An in-process transactional mutex lock ensures that concurrent or closely timed requests cannot allocate the same parking bay twice.
- **Volatile Lifecycle**: When the Node.js process terminates or restarts, data resets to its baseline.
- **Demo Reset Endpoint**: `POST /api/parking/reset` deep-clones the default baseline state.

---

## Backend REST API

Base URL: `http://localhost:5000/api/parking`

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/parking` | Returns all parking spaces and active assignments | None |
| `GET` | `/api/parking/stats` | Returns total, available, occupied, and occupancy % | None |
| `GET` | `/api/parking/vehicles` | Returns list of currently parked vehicles | None |
| `POST`| `/api/parking/assign` | Executes Greedy Algorithm & allocates space | `{ registrationNumber, vehicleType, requiresAccessible, hasReservationPermit }` |
| `POST`| `/api/parking/exit` | Releases a parked vehicle's assigned space | `{ registrationNumber }` |
| `POST`| `/api/parking/reset` | Resets in-memory state to demonstration baseline | None |

---

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm (version 8 or higher)

### 1. Install Backend Dependencies
```bash
cd server
npm install
```

### 2. Install Frontend Dependencies
```bash
cd ../client
npm install
```

---

## Running the Application

### Option A: Simultaneous Start (Recommended)
From the root workspace directory:
```bash
npm run dev
```
This executes `start-dev.js`, concurrently launching both the Express server on port 5000 and the Vite dev server on port 5173.

### Option B: Separate Terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*Backend runs at:* `http://localhost:5000`

**Terminal 2 (React Frontend):**
```bash
cd client
npm run dev
```
*Frontend runs at:* `http://localhost:5173`

Open your browser and navigate to **`http://localhost:5173`**.

---

## Demonstration Scenario (Example Input & Output)

### Initial Demonstration State:
- `P1`: 10m, occupied (by `KA-01-AB-1234`)
- `P2`: 20m, available
- `P3`: 5m, available
- `P4`: 8m, available
- `P5`: 15m, occupied (by `MH-02-CD-5678`)
- `P6`: 12m, available (Accessible)
- `P7`: 25m, available
- `P8`: 4m, occupied
- `P9`: 18m, available (Reserved)
- `P10` through `P16`: Additional spaces with varying distances

### Example Request:
- **Vehicle**: `KA-05-MJ-2024` (Regular Car)
- **Available Candidates**: `P2` (20m), `P3` (5m), `P4` (8m)

### Algorithm Execution Trace:
1. `P1` (10m): **Occupied** — Skipped.
2. `P2` (20m): **Available** — Initial best candidate. Current min: `20m`.
3. `P3` (5m): **Available** — Closer than `20m` ($5 < 20$). Becomes new best candidate! Current min: `5m`.
4. `P4` (8m): **Available** — Not closer than `P3` ($8 > 5$). Skipped.
5. `P5` (15m): **Occupied** — Skipped.
...
**Final Output**: Space **`P3`** is allocated at **5 metres**.

---

## Automated Testing

A comprehensive test suite in `server/tests/greedyParking.test.js` verifies all 10 core DAA scenarios:
1. Nearest eligible available space is selected.
2. Occupied spaces are skipped.
3. Appropriate response when no spaces are available.
4. Duplicate active vehicle registrations are rejected (HTTP 409).
5. Invalid/malformed inputs are rejected (HTTP 400).
6. Vehicle exit releases space and clears active assignment.
7. Released space is immediately eligible for new assignments.
8. Reserved and accessible-space rules are enforced.
9. Dashboard statistics remain consistent across state transitions.
10. Concurrency protection prevents duplicate allocation of the same space.

### Run Tests:
```bash
cd server
npm test
```
*Output: 10 tests passed (0 failures).*

---

## Limitations & Competitive Analysis

In academic DAA discussions, it is crucial to explain that a single-vehicle Greedy Algorithm is an **online heuristic**:
- **Local vs. Global Optimum**: The algorithm guarantees the minimum walking distance for the *currently arriving vehicle*. However, over a sequence of vehicle arrivals with differing parking durations, it does not guarantee the minimum cumulative walking distance for the entire fleet (the online competitive ratio is bounded).
- **Alternative Data Structures**: For huge parking networks ($n > 100,000$ spaces), maintaining an in-memory **Min-Heap (Priority Queue)** allows $O(\log n)$ minimum extraction. However, dynamic predicate filtering (accessible bays, vehicle dimensions, VIP permits) renders a linear scan $O(n)$ more practical and predictable for standard parking structures.

---

## DAA Viva & Presentation Guide

When presenting this project to your examiner, highlight:
1. **Algorithm Classification**: Explain why this is Greedy (Greedy Choice Property: local minimum distance at each step without backtracking).
2. **Complexity Proof**: Walk through why time complexity is $O(n)$ and auxiliary space complexity is $O(1)$.
3. **Execution Trace**: Switch to the **Algorithm Visualizer** tab in the UI and click **Play Trace** to showcase step-by-step decisions (showing how `P1` is skipped, `P2` becomes the best candidate, `P3` supersedes it, and `P4` is rejected).
4. **No Database Justification**: Explain that maintaining in-memory JavaScript state eliminates disk I/O latency and aligns with real-world embedded controllers/microcontrollers running local parking lot logic.
5. **Edge Cases**: Demonstrate that entering an already-parked vehicle returns a duplicate registration error, and entering a non-parked vehicle in the exit form returns a not-found error.
