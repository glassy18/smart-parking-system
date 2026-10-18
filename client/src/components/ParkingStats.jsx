import React from 'react';
import { Layers, CheckCircle2, XCircle, Percent, Crown, Zap, Accessibility } from 'lucide-react';

/**
 * ParkingStats Component
 * Displays slot status counts and category totals (Regular, EV, VIP, Disability).
 */
export default function ParkingStats({ stats }) {
  const {
    totalSpaces = 18,
    availableSpaces = 0,
    occupiedSpaces = 0,
    vipSpaces = 3,
    evSpaces = 3,
    accessibleSpaces = 3,
    regularSpaces = 9,
    occupancyPercentage = 0
  } = stats || {};

  return (
    <div className="stats-grid">
      {/* Total Spaces */}
      <div className="stat-card" style={{ '--card-accent': '#6366f1' }}>
        <div className="stat-header">
          <span>Total Slots</span>
          <div className="stat-icon">
            <Layers size={18} />
          </div>
        </div>
        <div className="stat-value">{totalSpaces}</div>
        <div className="stat-subtext">3 rows × 6 columns layout</div>
      </div>

      {/* Available Spaces */}
      <div className="stat-card" style={{ '--card-accent': '#10b981' }}>
        <div className="stat-header">
          <span>Available</span>
          <div className="stat-icon" style={{ color: '#10b981' }}>
            <CheckCircle2 size={18} />
          </div>
        </div>
        <div className="stat-value" style={{ color: '#34d399' }}>
          {availableSpaces}
        </div>
        <div className="stat-subtext">Ready for booking</div>
      </div>

      {/* Occupied Spaces */}
      <div className="stat-card" style={{ '--card-accent': '#f43f5e' }}>
        <div className="stat-header">
          <span>Occupied</span>
          <div className="stat-icon" style={{ color: '#f43f5e' }}>
            <XCircle size={18} />
          </div>
        </div>
        <div className="stat-value" style={{ color: '#fb7185' }}>
          {occupiedSpaces}
        </div>
        <div className="stat-subtext">Parked vehicles</div>
      </div>

      {/* Occupancy Rate & Category Summary */}
      <div className="stat-card" style={{ '--card-accent': '#f59e0b' }}>
        <div className="stat-header">
          <span>Occupancy</span>
          <div className="stat-icon" style={{ color: '#f59e0b' }}>
            <Percent size={18} />
          </div>
        </div>
        <div className="stat-value">
          {occupancyPercentage}
          <span style={{ fontSize: '1rem', color: '#94a3b8' }}>%</span>
        </div>
        <div className="stat-progress-bar">
          <div
            className="stat-progress-fill"
            style={{
              width: `${Math.min(100, Math.max(0, occupancyPercentage))}%`,
              background: occupancyPercentage > 85 ? '#f43f5e' : occupancyPercentage > 60 ? '#f59e0b' : '#10b981'
            }}
          />
        </div>
        <div className="stat-subtext" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.2rem' }}>
          <span>{occupiedSpaces} of {totalSpaces} slots</span>
          <span style={{ fontSize: '0.72rem', color: '#cbd5e1' }}>
            3 ♿ • 3 👑 • 3 ⚡ • 9 🚗
          </span>
        </div>
      </div>
    </div>
  );
}
