import React, { useState } from 'react';
import {
  Activity,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Car
} from 'lucide-react';

import ParkingStats from './ParkingStats';
import ParkingGrid from './ParkingGrid';
import FindParking from './FindParking';
import VehicleExit from './VehicleExit';

/**
 * Dashboard Component
 * Clean, single-page operational view for the Smart Parking System.
 */
export default function Dashboard({
  spaces,
  stats,
  activeVehicles,
  latestAllocatedSpace,
  recentActivities,
  onAssign,
  onExit,
  isLoading,
  alertMessage,
  onDismissAlert
}) {
  const [highlightedSpaceId, setHighlightedSpaceId] = useState(
    latestAllocatedSpace ? latestAllocatedSpace.id : null
  );

  const handleSelectSlot = (slot) => {
    setHighlightedSpaceId(slot.id);
  };

  return (
    <div className="main-content">
      {/* Alert Notification Banner */}
      {alertMessage && (
        <div
          className={`alert-banner ${
            alertMessage.type === 'error'
              ? 'alert-error'
              : alertMessage.type === 'info'
              ? 'alert-info'
              : 'alert-success'
          }`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {alertMessage.type === 'error' ? (
              <AlertCircle size={18} />
            ) : alertMessage.type === 'info' ? (
              <RotateCcw size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button
            type="button"
            className="alert-close"
            onClick={onDismissAlert}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <ParkingStats stats={stats} />

      {/* Main Operations Grid Layout */}
      <div className="dashboard-grid-layout">
        {/* Left Column: Booking & Exit Panels */}
        <div className="actions-column">
          <FindParking onAssign={onAssign} isLoading={isLoading} />
          <VehicleExit
            onExit={onExit}
            activeVehicles={activeVehicles}
            isLoading={isLoading}
          />
        </div>

        {/* Right Column: 3x6 Parking Lot Layout & Event Log */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <ParkingGrid
            spaces={spaces}
            highlightedSpaceId={highlightedSpaceId}
            onSelectSlot={handleSelectSlot}
          />

          {/* Recent Activity Section */}
          <div className="panel-card">
            <div className="panel-header">
              <h3 className="panel-title">
                <Activity size={18} style={{ color: '#38bdf8' }} />
                Recent Lot Activity
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Live Event Feed</span>
            </div>

            <div className="activity-list">
              {recentActivities.length === 0 ? (
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontStyle: 'italic', padding: '0.5rem 0' }}>
                  No recent activities recorded yet.
                </div>
              ) : (
                recentActivities.slice(0, 5).map((act, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-left">
                      {act.type === 'assign' ? (
                        <div style={{ color: '#10b981' }}>
                          <CheckCircle2 size={16} />
                        </div>
                      ) : act.type === 'exit' ? (
                        <div style={{ color: '#fb7185' }}>
                          <Car size={16} />
                        </div>
                      ) : (
                        <div style={{ color: '#f59e0b' }}>
                          <RotateCcw size={16} />
                        </div>
                      )}
                      <span>{act.message}</span>
                    </div>
                    <div className="activity-time">{act.time}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
