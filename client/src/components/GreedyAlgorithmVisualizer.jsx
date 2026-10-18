import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Code2,
  Trash2,
  CheckCircle,
  XCircle,
  Award,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';

/**
 * GreedyAlgorithmVisualizer Component
 * 
 * Interactive DAA visualization tool rendering the exact backend execution trace.
 * Includes step-by-step playback, state comparisons, pseudocode viewer,
 * and controls for academic presentations.
 */
export default function GreedyAlgorithmVisualizer({
  trace = [],
  allocatedSpace = null,
  onResetDemo = () => {},
  onClearTrace = () => {}
}) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(900); // ms per step
  const [showPseudocode, setShowPseudocode] = useState(false);

  // When a new trace arrives, set pointer to the end or start
  useEffect(() => {
    if (trace && trace.length > 0) {
      setCurrentStepIndex(trace.length - 1); // default to showing full result, user can replay
    } else {
      setCurrentStepIndex(0);
    }
  }, [trace]);

  // Autoplay loop
  useEffect(() => {
    let timer = null;
    if (isPlaying) {
      timer = setTimeout(() => {
        if (currentStepIndex < trace.length - 1) {
          setCurrentStepIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, playbackSpeed);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, trace, playbackSpeed]);

  if (!trace || trace.length === 0) {
    return (
      <div className="panel-card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.12)',
              color: '#818cf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem'
            }}
          >
            <Zap size={28} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            No Active Algorithm Trace
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Submit a vehicle request from the <strong>"Find & Allocate Parking"</strong> form to run the
            Greedy Algorithm on the Express backend. The exact step-by-step trace will be rendered here.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowPseudocode(true)}
            >
              <Code2 size={16} />
              <span>View Pseudocode</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={onResetDemo}
            >
              <RotateCcw size={16} />
              <span>Reset Baseline Demo</span>
            </button>
          </div>
        </div>

        {/* Pseudocode Modal */}
        {showPseudocode && <PseudocodeModal onClose={() => setShowPseudocode(false)} />}
      </div>
    );
  }

  const currentStep = trace[currentStepIndex] || trace[trace.length - 1];
  const isFinalStep = currentStepIndex === trace.length - 1;
  const isSelectedCandidate = allocatedSpace && currentStep.spaceId === allocatedSpace.id && isFinalStep;

  return (
    <div className="visualizer-container">
      {/* Visualizer Controls Bar */}
      <div className="visualizer-controls-bar">
        <div className="player-controls">
          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.75rem' }}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(0);
            }}
            title="Jump to Start"
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            className="btn btn-primary"
            style={{ padding: '0.5rem 1rem' }}
            onClick={() => {
              if (currentStepIndex >= trace.length - 1) {
                setCurrentStepIndex(0);
              }
              setIsPlaying(!isPlaying);
            }}
          >
            {isPlaying ? (
              <>
                <Pause size={15} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={15} />
                <span>{currentStepIndex >= trace.length - 1 ? 'Replay' : 'Play Trace'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-outline"
            style={{ padding: '0.5rem 0.75rem' }}
            disabled={currentStepIndex >= trace.length - 1}
            onClick={() => {
              setIsPlaying(false);
              setCurrentStepIndex(prev => Math.min(trace.length - 1, prev + 1));
            }}
            title="Next Step"
          >
            <SkipForward size={15} />
          </button>

          <span className="visualizer-step-status" style={{ marginLeft: '0.5rem' }}>
            Step {currentStepIndex + 1} of {trace.length}
          </span>
        </div>

        {/* Speed & Auxiliary Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
          >
            <option value="1500">Speed: 0.5x (Slow)</option>
            <option value="900">Speed: 1x (Normal)</option>
            <option value="400">Speed: 2x (Fast)</option>
          </select>

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowPseudocode(true)}
            title="Examine formal pseudocode"
          >
            <Code2 size={15} />
            <span>Pseudocode</span>
          </button>

          <button
            type="button"
            className="btn btn-outline"
            onClick={onClearTrace}
            title="Clear the displayed trace"
          >
            <Trash2 size={15} />
            <span>Clear Trace</span>
          </button>

          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={onResetDemo}
            title="Reset to default baseline lot data"
          >
            <RotateCcw size={15} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Real-time State Comparison Board */}
      <div className="trace-active-summary-card">
        <div className="summary-metric">
          <span className="summary-metric-label">Evaluating Space</span>
          <span className="summary-metric-value" style={{ color: '#818cf8' }}>
            {currentStep.spaceId} ({currentStep.distance}m)
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Status: {currentStep.status.toUpperCase()} | Type: {currentStep.type}
          </span>
        </div>

        <div className="summary-metric">
          <span className="summary-metric-label">Current Greedy Best</span>
          <span className="summary-metric-value" style={{ color: '#34d399' }}>
            {currentStep.currentBestSpaceId ? `${currentStep.currentBestSpaceId} (${currentStep.currentMinDistance}m)` : 'None'}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            Min distance tracked: {currentStep.currentMinDistance !== null ? `${currentStep.currentMinDistance} m` : '∞'}
          </span>
        </div>

        <div className="summary-metric" style={{ gridColumn: 'span 2' }}>
          <span className="summary-metric-label">Local Decision At This Step</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem' }}>
            {currentStep.becameBestCandidate ? (
              <span className="trace-badge badge-candidate">
                <Award size={13} />
                New Best Candidate
              </span>
            ) : !currentStep.isEligible ? (
              <span className="trace-badge badge-skipped">
                <XCircle size={13} />
                Skipped (Ineligible)
              </span>
            ) : (
              <span className="trace-badge" style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}>
                <ChevronRight size={13} />
                Not Closer
              </span>
            )}
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
              {currentStep.reason}
            </span>
          </div>
        </div>
      </div>

      {/* Step List Table */}
      <div className="panel-card">
        <div className="panel-header">
          <h3 className="panel-title">
            <Zap size={18} style={{ color: '#f59e0b' }} />
            Full Backend Algorithm Trace Log
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
            Linear scan evaluating all {trace.length} spaces (O(n) comparisons)
          </span>
        </div>

        <div className="trace-steps-list">
          {trace.slice(0, currentStepIndex + 1).map((step, idx) => {
            const isWinner = allocatedSpace && step.spaceId === allocatedSpace.id && idx === trace.length - 1;

            return (
              <div
                key={step.spaceId}
                className={`trace-step-item ${isWinner ? 'is-selected-candidate' : ''} ${
                  step.becameBestCandidate ? 'became-best' : ''
                }`}
              >
                <div className="trace-step-num">Step {step.step}</div>

                <div className="trace-step-space">
                  {step.spaceId}{' '}
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>
                    ({step.distance}m)
                  </span>
                </div>

                <div>
                  {isWinner ? (
                    <span className="trace-badge badge-winner">
                      <CheckCircle size={12} />
                      Final Pick
                    </span>
                  ) : step.becameBestCandidate ? (
                    <span className="trace-badge badge-candidate">
                      <Award size={12} />
                      Best So Far
                    </span>
                  ) : !step.isEligible ? (
                    <span className="trace-badge badge-skipped">
                      <XCircle size={12} />
                      Skipped
                    </span>
                  ) : (
                    <span
                      className="trace-badge"
                      style={{ background: 'rgba(255,255,255,0.06)', color: '#94a3b8' }}
                    >
                      Not Closer
                    </span>
                  )}
                </div>

                <div className="trace-reason-text">{step.reason}</div>

                <div className="trace-min-tracker">
                  Min: {step.currentMinDistance !== null ? `${step.currentMinDistance}m` : 'None'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pseudocode Modal */}
      {showPseudocode && <PseudocodeModal onClose={() => setShowPseudocode(false)} />}
    </div>
  );
}

/**
 * Pseudocode Modal component explaining the algorithm in clean academic format
 */
function PseudocodeModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
            Greedy Parking Space Selection Pseudocode
          </h3>
          <button type="button" className="alert-close" onClick={onClose} style={{ fontSize: '1.25rem' }}>
            ✕
          </button>
        </div>

        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          This algorithm performs a single linear pass over the set of parking spaces, making
          the local greedy choice of minimum Euclidean/walking distance from the entrance.
        </p>

        <pre className="code-box">
{`Algorithm GreedyNearestParking(S, V):
Input: 
  S: Array of n parking spaces [s_1, s_2, ..., s_n]
  V: Vehicle request containing (regNo, type, requiresAccessible, hasPermit)
Output: 
  bestSpace: Space with minimum distance satisfying all constraints, or NULL

1.  minDistance ← ∞
2.  bestSpace ← NULL
3.  trace ← []
4.
5.  for each space s in S do:
6.      isEligible ← true
7.      
8.      if s.status == "occupied" then:
9.          isEligible ← false  // Constraint 1
10.     else if s.reserved == true and not V.hasPermit then:
11.         isEligible ← false  // Constraint 2
12.     else if s.type == "accessible" and not V.requiresAccessible then:
13.         isEligible ← false  // Constraint 3
14.     else if V.requiresAccessible and s.type != "accessible" then:
15.         isEligible ← false  // Constraint 4
16.     
17.     if isEligible then:
18.         // GREEDY CHOICE: Local minimum distance
19.         if s.distance < minDistance then:
20.             minDistance ← s.distance
21.             bestSpace ← s
22.     
23.     RecordStep(trace, s, isEligible, minDistance, bestSpace)
24.  end for
25.
26.  if bestSpace != NULL then:
27.      return { status: SUCCESS, space: bestSpace, trace: trace }
28.  else:
29.      return { status: FAILURE, trace: trace }`}
        </pre>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
