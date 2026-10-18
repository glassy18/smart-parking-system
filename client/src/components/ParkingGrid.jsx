import React from 'react';
import {
  Car,
  CheckCircle2,
  XCircle,
  Accessibility,
  Crown,
  Zap,
  Compass,
  ArrowDown,
  LogOut
} from 'lucide-react';

/**
 * ParkingGrid Component - 3x6 Grid Layout (18 Slots)
 * Displays 3 Accessible, 3 VIP, 3 EV Charging, and 9 Regular slots,
 * with clear routing from Entrance (0m) to Exit.
 */
export default function ParkingGrid({
  spaces = [],
  highlightedSpaceId = null,
  onSelectSlot = () => {}
}) {
  return (
    <div className="parking-lot-section">
      <div className="lot-header">
        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
            3 × 6 Smart Parking Grid (18 Slots)
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Row 1: Priority Ingress (3 Disability + 3 VIP) • Row 2: EV Charging & Core Regular • Row 3: Fast Exit Aisle
          </p>
        </div>

        {/* Legend */}
        <div className="legend-group">
          <div className="legend-item">
            <span className="legend-pill pill-available"></span>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-pill pill-occupied"></span>
            <span>Occupied</span>
          </div>
          <div className="legend-item">
            <span className="legend-pill pill-accessible"></span>
            <span>♿ Disability (3)</span>
          </div>
          <div className="legend-item">
            <span className="legend-pill pill-vip"></span>
            <span style={{ color: '#fbbf24', fontWeight: 600 }}>👑 VIP (3)</span>
          </div>
          <div className="legend-item">
            <span className="legend-pill pill-ev"></span>
            <span style={{ color: '#34d399', fontWeight: 600 }}>⚡ EV (3)</span>
          </div>
        </div>
      </div>

      <div className="lot-canvas-container">
        {/* Entrance Gate Representation */}
        <div className="entrance-banner">
          <Compass size={16} />
          <span>⬇ INGRESS / ENTRANCE GATE [Distance Reference: 0 Metres] ⬇</span>
        </div>

        {/* 3x6 Parking Slots Grid */}
        <div className="parking-slots-grid">
          {spaces.map((space) => {
            const isAvailable = space.status === 'available';
            const isOccupied = space.status === 'occupied';
            const isVip = space.type === 'vip';
            const isEv = space.type === 'ev';
            const isAccessible = space.type === 'accessible';
            const isHighlighted = highlightedSpaceId === space.id;

            return (
              <div
                key={space.id}
                id={`parking-space-${space.id}`}
                className={`parking-slot-card ${
                  isAvailable ? 'status-available' : 'status-occupied'
                } ${isVip ? 'is-vip' : ''} ${isEv ? 'is-ev' : ''} ${
                  isHighlighted ? 'highlight-selected' : ''
                }`}
                onClick={() => onSelectSlot(space)}
                title={`Click to inspect slot ${space.id}`}
              >
                {/* Top Row: Slot ID & Distance */}
                <div className="slot-top-row">
                  <div
                    className="slot-id"
                    style={{
                      color: isVip ? '#fbbf24' : isEv ? '#34d399' : isAccessible ? '#38bdf8' : '#ffffff'
                    }}
                  >
                    {space.id}
                  </div>
                  <div className="slot-distance-badge">{space.distance}m</div>
                </div>

                {/* Status Indicator */}
                <div
                  className={`slot-status-indicator ${
                    isAvailable ? 'available' : 'occupied'
                  }`}
                >
                  {isAvailable ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Available</span>
                    </>
                  ) : (
                    <>
                      <XCircle size={13} />
                      <span>Occupied</span>
                    </>
                  )}
                </div>

                {/* Metadata Badges */}
                <div className="slot-meta-tags">
                  {isAccessible && (
                    <span className="badge-tag tag-accessible" title="Disability / Accessible Bay">
                      <Accessibility size={11} style={{ display: 'inline', marginRight: '2px' }} />
                      Disability
                    </span>
                  )}
                  {isVip && (
                    <span className="badge-tag tag-vip" title="VIP / Executive Bay">
                      <Crown size={11} style={{ display: 'inline', marginRight: '2px' }} />
                      VIP
                    </span>
                  )}
                  {isEv && (
                    <span className="badge-tag tag-ev" title="Electric Vehicle Charging Bay">
                      <Zap size={11} style={{ display: 'inline', marginRight: '2px' }} />
                      EV Charge
                    </span>
                  )}
                  {space.type === 'regular' && (
                    <span
                      className="badge-tag"
                      style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}
                    >
                      Regular
                    </span>
                  )}
                </div>

                {/* Occupant Details if occupied */}
                {isOccupied && space.occupiedBy ? (
                  <div className="slot-occupant-info">
                    <div className="occupant-plate">
                      {space.occupiedBy.registrationNumber}
                    </div>
                    <div className="occupant-vehicle">
                      <Car size={11} style={{ display: 'inline', marginRight: '3px' }} />
                      {space.occupiedBy.vehicleType || 'Vehicle'}
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      fontSize: '0.72rem',
                      color: isVip ? '#fbbf24' : isEv ? '#34d399' : isAccessible ? '#38bdf8' : '#10b981',
                      marginTop: '0.35rem',
                      fontStyle: 'italic'
                    }}
                  >
                    Open Slot
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Exit Gate Representation */}
        <div className="exit-banner">
          <LogOut size={16} />
          <span>⬆ EGRESS / EXIT GATE [Shortest Exit Path for Row 3 & Central Aisle] ⬆</span>
        </div>
      </div>
    </div>
  );
}
