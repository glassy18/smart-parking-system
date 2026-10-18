import React from 'react';
import {
  BookOpen,
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

/**
 * AlgorithmAnalysis Component
 * Comprehensive DAA Academic Analysis, formal complexity proofs,
 * step-by-step dry run, and Viva examination preparation guide.
 */
export default function AlgorithmAnalysis() {
  return (
    <article className="daa-article">
      {/* Overview Card */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <BookOpen size={22} style={{ color: '#818cf8' }} />
          1. Problem Statement & Mathematical Formulation
        </h2>
        <p className="daa-p">
          Given a discrete set of <strong>n</strong> parking spaces in a facility, denoted as{' '}
          <code style={{ color: '#818cf8', fontFamily: 'var(--font-family-mono)' }}>
            S = &#123;s₁, s₂, ..., sₙ&#125;
          </code>
          , where each parking space <em>sᵢ</em> is characterized by:
        </p>

        <ul style={{ paddingLeft: '1.5rem', color: '#cbd5e1', lineHeight: '1.8' }}>
          <li>
            <strong>Distance:</strong> <code style={{ color: '#38bdf8' }}>d(sᵢ) ∈ ℝ⁺</code> representing the walking/driving distance from the primary entrance (reference point 0m).
          </li>
          <li>
            <strong>Status:</strong> <code style={{ color: '#38bdf8' }}>status(sᵢ) ∈ &#123;'available', 'occupied'&#125;</code>.
          </li>
          <li>
            <strong>Type & Restrictions:</strong> <code style={{ color: '#38bdf8' }}>type(sᵢ) ∈ &#123;'regular', 'accessible'&#125;</code> and a boolean flag <code style={{ color: '#38bdf8' }}>reserved(sᵢ)</code>.
          </li>
        </ul>

        <p className="daa-p">
          Upon the arrival of a vehicle request <code style={{ color: '#818cf8' }}>V = (plate, type, requiresAccessible, hasPermit)</code>,
          the system must assign an optimal space <code style={{ color: '#34d399' }}>s* ∈ S</code> such that:
        </p>

        <div className="code-box" style={{ textAlign: 'center', fontSize: '1rem', color: '#34d399' }}>
          s* = argmin &#123; d(sᵢ) | sᵢ ∈ S is Eligible(sᵢ, V) &#125;
        </div>
      </div>

      {/* Greedy Strategy & Theoretical Foundations */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <Sparkles size={22} style={{ color: '#f59e0b' }} />
          2. The Greedy Strategy & Choice Property
        </h2>
        <p className="daa-p">
          A <strong>Greedy Algorithm</strong> constructs a solution sequentially by making the locally optimal choice at each decision stage with the anticipation of finding a globally optimal solution.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#818cf8', marginBottom: '0.5rem', fontWeight: 700 }}>
              Greedy Choice Property
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              A globally optimal choice for the current vehicle can be achieved by greedily picking the candidate with the lowest distance value among all feasible spaces. We do not reconsider past decisions once verified.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#34d399', marginBottom: '0.5rem', fontWeight: 700 }}>
              Optimal Substructure
            </h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.6 }}>
              If <code style={{ color: '#34d399' }}>s*</code> is the closest space among spaces <code style={{ color: '#cbd5e1' }}>1..k</code>, then the closest space among <code style={{ color: '#cbd5e1' }}>1..(k+1)</code> is simply <code style={{ color: '#34d399' }}>min_distance(s*, s_(k+1))</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Complexity Analysis Table */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <TrendingUp size={22} style={{ color: '#10b981' }} />
          3. Time and Space Complexity Analysis
        </h2>

        <p className="daa-p">
          Let <strong>n</strong> be the total number of parking spaces in the lot.
        </p>

        <table className="daa-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Complexity</th>
              <th>DAA Justification / Derivation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Best-Case Time Complexity</strong></td>
              <td><code style={{ color: '#34d399', fontFamily: 'var(--font-family-mono)', fontSize: '0.95rem' }}>O(n)</code></td>
              <td>In a linear scan, every space must be evaluated to verify that no subsequent space has a smaller distance than the current candidate.</td>
            </tr>
            <tr>
              <td><strong>Worst-Case Time Complexity</strong></td>
              <td><code style={{ color: '#f43f5e', fontFamily: 'var(--font-family-mono)', fontSize: '0.95rem' }}>O(n)</code></td>
              <td>Exactly <em>n</em> iterations are executed. Each step performs constant-time <code style={{ color: '#cbd5e1' }}>O(1)</code> constraint checks and one scalar numeric comparison.</td>
            </tr>
            <tr>
              <td><strong>Average-Case Time Complexity</strong></td>
              <td><code style={{ color: '#38bdf8', fontFamily: 'var(--font-family-mono)', fontSize: '0.95rem' }}>O(n)</code></td>
              <td>Evaluation time remains linear across any distribution of occupied/available spaces.</td>
            </tr>
            <tr>
              <td><strong>Auxiliary Space Complexity</strong></td>
              <td><code style={{ color: '#818cf8', fontFamily: 'var(--font-family-mono)', fontSize: '0.95rem' }}>O(1)</code></td>
              <td>
                Strictly <code style={{ color: '#cbd5e1' }}>O(1)</code> auxiliary memory for the core algorithm logic. Only scalar pointers (<code style={{ color: '#34d399' }}>minDistance</code>, <code style={{ color: '#34d399' }}>bestSpace</code>, loop index) are maintained.
                <em>(The execution trace array returned for UI visualization is O(n) data logging, but auxiliary algorithmic memory is O(1)).</em>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Step-by-Step Dry Run */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <Layers size={22} style={{ color: '#38bdf8' }} />
          4. Step-by-Step Dry Run Example (Academic Trace)
        </h2>

        <p className="daa-p">
          Consider the baseline demonstration scenario where an incoming vehicle arrives with regular requirements:
        </p>

        <table className="daa-table">
          <thead>
            <tr>
              <th>Space</th>
              <th>Distance</th>
              <th>Initial Status</th>
              <th>Eligibility Check</th>
              <th>Greedy Comparison</th>
              <th>Current Best</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>P1</strong></td>
              <td>10 m</td>
              <td><span style={{ color: '#fb7185' }}>Occupied</span></td>
              <td>Ineligible (occupied)</td>
              <td>Skipped</td>
              <td><em>None</em></td>
            </tr>
            <tr>
              <td><strong>P2</strong></td>
              <td>20 m</td>
              <td><span style={{ color: '#34d399' }}>Available</span></td>
              <td>Eligible</td>
              <td>20m &lt; ∞ → New best candidate</td>
              <td><strong style={{ color: '#818cf8' }}>P2 (20m)</strong></td>
            </tr>
            <tr>
              <td><strong>P3</strong></td>
              <td>5 m</td>
              <td><span style={{ color: '#34d399' }}>Available</span></td>
              <td>Eligible</td>
              <td>5m &lt; 20m → Closer! Replaces P2</td>
              <td><strong style={{ color: '#34d399' }}>P3 (5m)</strong></td>
            </tr>
            <tr>
              <td><strong>P4</strong></td>
              <td>8 m</td>
              <td><span style={{ color: '#34d399' }}>Available</span></td>
              <td>Eligible</td>
              <td>8m &gt; 5m → Not closer than P3. Skipped.</td>
              <td><strong style={{ color: '#34d399' }}>P3 (5m)</strong></td>
            </tr>
            <tr>
              <td><strong>P5</strong></td>
              <td>15 m</td>
              <td><span style={{ color: '#fb7185' }}>Occupied</span></td>
              <td>Ineligible (occupied)</td>
              <td>Skipped</td>
              <td><strong style={{ color: '#34d399' }}>P3 (5m)</strong></td>
            </tr>
          </tbody>
        </table>

        <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: 'var(--radius-md)', marginTop: '1rem' }}>
          <strong style={{ color: '#34d399' }}>Final Algorithm Result:</strong> Space <strong>P3</strong> at 5 metres is selected and allocated to the vehicle.
        </div>
      </div>

      {/* Single-Vehicle vs Multi-Vehicle Global Optimum (DAA Theoretical Nuance) */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <AlertTriangle size={22} style={{ color: '#f59e0b' }} />
          5. Local vs. Global Optimum (Online Competitive Analysis)
        </h2>

        <p className="daa-p">
          A fundamental concept in DAA is understanding when a Greedy Algorithm achieves a <strong>global social optimum</strong> versus a <strong>local myopic optimum</strong>.
        </p>

        <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', lineHeight: 1.7 }}>
          <p style={{ color: '#cbd5e1', marginBottom: '0.75rem' }}>
            <strong>Theoretical Limitation:</strong> The algorithm optimizes for each vehicle <em>individually upon arrival</em> (online myopic greedy).
            However, it does <strong>not</strong> necessarily guarantee a globally minimal total walking distance for a fleet of multiple competing vehicles arriving over an extended time horizon.
          </p>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            <em>Counterexample:</em> If Vehicle A intends to park for only 2 minutes and takes the nearest space (P3 at 5m), while Vehicle B arrives 1 minute later intending to park for 8 hours with elderly passengers and is forced to walk 30m to P10, the total cumulative waiting/walking cost is non-optimal. Global social optimization would require future knowledge of departure times (offline optimal scheduling or dynamic programming).
          </p>
        </div>
      </div>

      {/* Advantages and Disadvantages */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <Cpu size={22} style={{ color: '#a855f7' }} />
          6. Trade-offs: Advantages vs. Disadvantages
        </h2>

        <div className="matrix-grid">
          <div className="matrix-card advantages">
            <h3 className="matrix-title" style={{ color: '#34d399' }}>
              <CheckCircle2 size={18} />
              Advantages
            </h3>
            <ul className="matrix-list">
              <li><strong>Simplicity:</strong> Extremely straightforward to implement, understand, and debug during academic review.</li>
              <li><strong>Zero External Storage Overhead:</strong> In-memory scalar pointers consume minimal auxiliary memory <code style={{ color: '#34d399' }}>O(1)</code>.</li>
              <li><strong>Instant Response:</strong> For typical parking lots (n = 100 to 1,000 spaces), an O(n) scan takes less than 0.1 milliseconds in modern V8 JavaScript engine.</li>
              <li><strong>Constraint Adaptability:</strong> Easy to add business rules (VIP permits, EV charging, accessibility) as boolean predicate filters.</li>
            </ul>
          </div>

          <div className="matrix-card disadvantages">
            <h3 className="matrix-title" style={{ color: '#fb7185' }}>
              <XCircle size={18} />
              Disadvantages
            </h3>
            <ul className="matrix-list">
              <li><strong>Linear Scaling:</strong> For ultra-massive smart cities with n &gt; 100,000 slots, a linear scan may become a bottleneck without spatial indexing (e.g. Min-Heap or KD-Tree <code style={{ color: '#cbd5e1' }}>O(log n)</code>).</li>
              <li><strong>No Reservation Lookahead:</strong> Greedy selection does not anticipate future demand or optimize overall parking revenue.</li>
              <li><strong>Online Competitive Ratio:</strong> Suffers from myopic decision-making when vehicles have drastically different parking durations.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Real-World Applications */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <ShieldCheck size={22} style={{ color: '#10b981' }} />
          7. Real-World Applications & Industry Context
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.4rem' }}>Airport & Terminal Hubs</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Allocating gates to flights and short-term parking stalls to incoming taxis closest to passenger exit concourses.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.4rem' }}>Automated Valet Parking (AVP)</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Autonomous electric vehicles guided to optimal induction charging pads minimizing transit battery consumption.
            </p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '0.4rem' }}>Smart Cities & IoT Lots</h4>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Municipal multi-tier parking structures directing drivers via electronic overhead LED boards to minimize intra-lot traffic congestion.
            </p>
          </div>
        </div>
      </div>

      {/* Viva Q&A Cheat Sheet */}
      <div className="daa-section-card">
        <h2 className="daa-section-title">
          <HelpCircle size={22} style={{ color: '#818cf8' }} />
          8. DAA Viva Examination Preparation Guide
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.35rem' }}>
              Q1: Why is this problem categorized under the Greedy Paradigm rather than Dynamic Programming?
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> Because the problem possesses the <em>Greedy Choice Property</em>. We do not need to evaluate future subproblems or maintain a dynamic programming memoization table; selecting the space with the minimum distance among all currently eligible spaces is sufficient to yield the optimal solution for the arriving vehicle.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.35rem' }}>
              Q2: What is the Time and Space Complexity?
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> Time Complexity is <strong>O(n)</strong> for a linear scan of <em>n</em> spaces. Space Complexity is <strong>O(1)</strong> auxiliary memory because only scalar tracking variables (<code style={{ color: '#34d399' }}>minDistance</code>, <code style={{ color: '#34d399' }}>bestSpace</code>) are required during computation.
            </p>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ color: '#818cf8', fontWeight: 700, marginBottom: '0.35rem' }}>
              Q3: Can this be optimized to O(log n)?
            </h4>
            <p style={{ color: '#cbd5e1', fontSize: '0.875rem', lineHeight: 1.6 }}>
              <strong>Answer:</strong> Yes. By maintaining an in-memory <em>Min-Heap (Priority Queue)</em> of available parking spaces keyed by distance, extracting the nearest available space takes <code style={{ color: '#34d399' }}>O(1)</code> or <code style={{ color: '#34d399' }}>O(log n)</code> with heap restoration. However, when multiple filtering constraints (such as accessibility and reserved badges) must be evaluated dynamically, a linear scan <code style={{ color: '#38bdf8' }}>O(n)</code> is simpler, highly deterministic, and avoids maintaining separate heap structures for each constraint type.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
