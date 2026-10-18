import React, { useState } from 'react';
import { LogOut, AlertCircle, CheckCircle2, Car } from 'lucide-react';

/**
 * VehicleExit Component
 * Allows releasing an occupied parking space when a vehicle leaves the facility.
 */
export default function VehicleExit({ onExit, activeVehicles = [], isLoading }) {
  const [exitRegNo, setExitRegNo] = useState('');
  const [exitError, setExitError] = useState('');

  const handleExitSubmit = (e) => {
    e.preventDefault();
    setExitError('');

    const trimmed = exitRegNo.trim().toUpperCase();
    if (!trimmed) {
      setExitError('Please enter or select a vehicle registration number to exit.');
      return;
    }

    onExit(trimmed);
    setExitRegNo('');
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">
          <LogOut size={18} style={{ color: '#fb7185' }} />
          Vehicle Exit & Space Release
        </h3>
      </div>

      <form onSubmit={handleExitSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        {/* Quick select from parked vehicles */}
        {activeVehicles.length > 0 && (
          <div className="form-group">
            <label className="form-label" htmlFor="parkedVehicleDropdown">
              Quick Pick Parked Vehicle ({activeVehicles.length})
            </label>
            <select
              id="parkedVehicleDropdown"
              className="form-select"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  setExitRegNo(e.target.value);
                  setExitError('');
                }
              }}
              disabled={isLoading}
            >
              <option value="">-- Choose currently parked vehicle --</option>
              {activeVehicles.map((v) => (
                <option key={v.registrationNumber} value={v.registrationNumber}>
                  {v.registrationNumber} ({v.vehicleType} in {v.spaceId})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Manual registration input */}
        <div className="form-group">
          <label className="form-label" htmlFor="exitRegInput">
            Registration Plate to Exit
          </label>
          <input
            id="exitRegInput"
            type="text"
            className="form-input"
            placeholder="e.g. KA-01-AB-1234"
            value={exitRegNo}
            onChange={(e) => {
              setExitRegNo(e.target.value);
              setExitError('');
            }}
            disabled={isLoading}
          />
        </div>

        {exitError && (
          <div style={{ color: '#fb7185', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={14} />
            <span>{exitError}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-outline-danger"
          style={{ width: '100%', marginTop: '0.2rem' }}
          disabled={isLoading || !exitRegNo.trim()}
        >
          <LogOut size={16} />
          <span>Release Space</span>
        </button>
      </form>
    </div>
  );
}
