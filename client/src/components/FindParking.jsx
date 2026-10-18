import React, { useState } from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Car, Zap, Crown, Accessibility } from 'lucide-react';

/**
 * FindParking Component
 * Allows booking a parking slot based on categorized criteria:
 * 1. Regular / Standard
 * 2. EV (Electric Vehicle Charging)
 * 3. VIP / Executive
 * 4. Disabilities / Accessible
 */
export default function FindParking({ onAssign, isLoading }) {
  const [regNo, setRegNo] = useState('');
  const [vehicleType, setVehicleType] = useState('Car');
  const [category, setCategory] = useState('regular'); // 'regular' | 'ev' | 'vip' | 'accessible'
  const [validationError, setValidationError] = useState('');

  // Generates a realistic sample registration plate for quick testing
  const generateRandomPlate = () => {
    const states = ['KA', 'DL', 'MH', 'TS', 'TN', 'HR', 'UP', 'KL'];
    const randomState = states[Math.floor(Math.random() * states.length)];
    const districtNum = String(Math.floor(Math.random() * 98) + 1).padStart(2, '0');
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randLetters = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
    const number = String(Math.floor(Math.random() * 9000) + 1000);
    setRegNo(`${randomState}-${districtNum}-${randLetters}-${number}`);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const trimmed = regNo.trim().toUpperCase();
    if (!trimmed) {
      setValidationError('Please enter a vehicle registration number.');
      return;
    }

    const regex = /^[A-Z0-9- ]{2,20}$/;
    if (!regex.test(trimmed)) {
      setValidationError('Invalid format. Use 2-20 alphanumeric characters (e.g. KA-01-AB-1234).');
      return;
    }

    onAssign({
      registrationNumber: trimmed,
      vehicleType,
      category,
      isEv: category === 'ev',
      isVip: category === 'vip',
      requiresAccessible: category === 'accessible'
    });
  };

  return (
    <div className="panel-card">
      <div className="panel-header">
        <h3 className="panel-title">
          <Car size={18} style={{ color: '#818cf8' }} />
          Book Parking Slot
        </h3>
        <button
          type="button"
          className="quick-fill-btn"
          onClick={generateRandomPlate}
          title="Autogenerate valid registration plate for testing"
        >
          <Sparkles size={12} style={{ display: 'inline', marginRight: '3px' }} />
          Generate Plate
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Registration Number */}
        <div className="form-group">
          <label className="form-label" htmlFor="regNumberInput">
            Registration Number
          </label>
          <input
            id="regNumberInput"
            type="text"
            className="form-input"
            placeholder="e.g. KA-05-MJ-2024"
            value={regNo}
            onChange={(e) => {
              setRegNo(e.target.value);
              setValidationError('');
            }}
            maxLength={20}
            disabled={isLoading}
          />
        </div>

        {/* Vehicle Type */}
        <div className="form-group">
          <label className="form-label" htmlFor="vehicleTypeSelect">
            Vehicle Type
          </label>
          <select
            id="vehicleTypeSelect"
            className="form-select"
            value={vehicleType}
            onChange={(e) => {
              const val = e.target.value;
              setVehicleType(val);
              if (val === 'EV') setCategory('ev');
            }}
            disabled={isLoading}
          >
            <option value="Car">Sedan / Hatchback (Car)</option>
            <option value="SUV">SUV / Compact SUV</option>
            <option value="EV">Electric Vehicle (EV)</option>
            <option value="Motorcycle">Motorcycle / Two-Wheeler</option>
            <option value="Van">Van / Commercial</option>
          </select>
        </div>

        {/* Slot Category Selection (Regular, EV, VIP, Disabilities) */}
        <div className="form-group" style={{ gap: '0.5rem' }}>
          <span className="form-label">Slot Category Criteria</span>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {/* Regular */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${category === 'regular' ? '#6366f1' : 'rgba(255,255,255,0.08)'}`,
                background: category === 'regular' ? 'rgba(99,102,241,0.15)' : 'rgba(15,23,42,0.6)',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              <input
                type="radio"
                name="slotCategory"
                value="regular"
                checked={category === 'regular'}
                onChange={() => setCategory('regular')}
                disabled={isLoading}
              />
              <span style={{ fontWeight: 600 }}>🚗 Regular</span>
            </label>

            {/* EV Charging */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${category === 'ev' ? '#10b981' : 'rgba(255,255,255,0.08)'}`,
                background: category === 'ev' ? 'rgba(16,185,129,0.15)' : 'rgba(15,23,42,0.6)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: category === 'ev' ? '#34d399' : 'inherit'
              }}
            >
              <input
                type="radio"
                name="slotCategory"
                value="ev"
                checked={category === 'ev'}
                onChange={() => setCategory('ev')}
                disabled={isLoading}
              />
              <span style={{ fontWeight: 600 }}>⚡ EV Charge</span>
            </label>

            {/* VIP Executive */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${category === 'vip' ? '#f59e0b' : 'rgba(255,255,255,0.08)'}`,
                background: category === 'vip' ? 'rgba(245,158,11,0.15)' : 'rgba(15,23,42,0.6)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: category === 'vip' ? '#fbbf24' : 'inherit'
              }}
            >
              <input
                type="radio"
                name="slotCategory"
                value="vip"
                checked={category === 'vip'}
                onChange={() => setCategory('vip')}
                disabled={isLoading}
              />
              <span style={{ fontWeight: 600 }}>👑 VIP Bay</span>
            </label>

            {/* Disabilities */}
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 0.75rem',
                borderRadius: '8px',
                border: `1px solid ${category === 'accessible' ? '#06b6d4' : 'rgba(255,255,255,0.08)'}`,
                background: category === 'accessible' ? 'rgba(6,182,212,0.15)' : 'rgba(15,23,42,0.6)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                color: category === 'accessible' ? '#38bdf8' : 'inherit'
              }}
            >
              <input
                type="radio"
                name="slotCategory"
                value="accessible"
                checked={category === 'accessible'}
                onChange={() => setCategory('accessible')}
                disabled={isLoading}
              />
              <span style={{ fontWeight: 600 }}>♿ Disability</span>
            </label>
          </div>
        </div>

        {validationError && (
          <div style={{ color: '#fb7185', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertCircle size={14} />
            <span>{validationError}</span>
          </div>
        )}

        {/* Submit Button renamed to "Book Slot" */}
        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '0.2rem', padding: '0.75rem', fontSize: '0.95rem' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <span>Finding Nearest Slot...</span>
          ) : (
            <>
              <CheckCircle2 size={18} />
              <span>Book Slot</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
