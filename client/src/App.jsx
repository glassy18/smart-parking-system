import React, { useState, useEffect } from 'react';
import { RotateCcw, Car } from 'lucide-react';

import Dashboard from './components/Dashboard';
import {
  getParkingSpaces,
  getParkingStats,
  getActiveVehicles,
  assignParkingSpace,
  exitVehicle,
  resetParkingState
} from './services/parkingApi';

export default function App() {
  const [spaces, setSpaces] = useState([]);
  const [stats, setStats] = useState({
    totalSpaces: 18,
    availableSpaces: 0,
    occupiedSpaces: 0,
    accessibleSpaces: 3,
    vipSpaces: 3,
    evSpaces: 3,
    regularSpaces: 9,
    occupancyPercentage: 0
  });
  const [activeVehicles, setActiveVehicles] = useState([]);
  const [latestAllocatedSpace, setLatestAllocatedSpace] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const logActivity = (type, message) => {
    const time = new Date().toLocaleTimeString();
    setRecentActivities(prev => [{ type, message, time }, ...prev]);
  };

  const refreshLotData = async () => {
    try {
      const [spacesRes, statsRes, vehiclesRes] = await Promise.all([
        getParkingSpaces(),
        getParkingStats(),
        getActiveVehicles()
      ]);

      if (spacesRes?.data) setSpaces(spacesRes.data);
      if (statsRes?.data) setStats(statsRes.data);
      if (vehiclesRes?.data) setActiveVehicles(vehiclesRes.data);
    } catch (err) {
      console.error('Failed to sync parking data from backend:', err);
      setAlertMessage({
        type: 'error',
        text: `Backend connection issue: ${err.message}. Ensure the Express server is running on port 5000.`
      });
    }
  };

  useEffect(() => {
    refreshLotData();
  }, []);

  // Handle vehicle assignment / booking
  const handleAssign = async (vehicleRequest) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const response = await assignParkingSpace(vehicleRequest);

      if (response.success) {
        setLatestAllocatedSpace(response.allocatedSpace);

        const categoryTag = (response.allocatedSpace.type || 'regular').toUpperCase();
        logActivity(
          'assign',
          `Booked nearest ${categoryTag} slot ${response.allocatedSpace.id} (${response.distance}m) for ${vehicleRequest.registrationNumber}.`
        );

        setAlertMessage({
          type: 'success',
          text: `Success: Slot ${response.allocatedSpace.id} (${categoryTag} • ${response.distance}m from entrance) successfully booked for ${vehicleRequest.registrationNumber}!`
        });

        await refreshLotData();
      }
    } catch (error) {
      console.error('Booking error:', error);
      setAlertMessage({
        type: 'error',
        text: error.message || 'Failed to book parking slot.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle vehicle exit
  const handleExit = async (registrationNumber) => {
    setIsLoading(true);
    setAlertMessage(null);

    try {
      const response = await exitVehicle(registrationNumber);

      if (response.success) {
        logActivity(
          'exit',
          `Vehicle ${registrationNumber} departed. Slot ${response.releasedSpace.id} is now available.`
        );

        setAlertMessage({
          type: 'success',
          text: `Released: Vehicle ${registrationNumber} exited. Slot ${response.releasedSpace.id} is now available.`
        });

        if (latestAllocatedSpace?.id === response.releasedSpace.id) {
          setLatestAllocatedSpace(null);
        }

        await refreshLotData();
      }
    } catch (error) {
      console.error('Vehicle exit error:', error);
      setAlertMessage({
        type: 'error',
        text: error.message || 'Failed to release parking slot.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Reset to initial baseline
  const handleResetDemo = async () => {
    setIsLoading(true);
    try {
      await resetParkingState();
      setLatestAllocatedSpace(null);
      logActivity('reset', 'Parking lot reset to initial 3x6 demonstration baseline.');
      setAlertMessage({
        type: 'info',
        text: 'Parking lot has been successfully reset to initial demo state.'
      });
      await refreshLotData();
    } catch (error) {
      setAlertMessage({
        type: 'error',
        text: `Reset failed: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="brand-section">
          <div className="brand-icon-wrapper">
            <Car size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1 className="brand-title">SmartPark</h1>
              <span className="brand-badge">3 × 6 Grid</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              Smart Parking System • Optimal Entrance & Exit Routing
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="header-actions">
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleResetDemo}
            disabled={isLoading}
            title="Reset in-memory spaces to demonstration baseline"
          >
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Main Dashboard View */}
      <Dashboard
        spaces={spaces}
        stats={stats}
        activeVehicles={activeVehicles}
        latestAllocatedSpace={latestAllocatedSpace}
        recentActivities={recentActivities}
        onAssign={handleAssign}
        onExit={handleExit}
        isLoading={isLoading}
        alertMessage={alertMessage}
        onDismissAlert={() => setAlertMessage(null)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          SmartPark • 18-Slot Parking Management System (3 Accessible • 3 VIP • 3 EV • 9 Regular)
        </p>
        <p style={{ marginTop: '0.25rem', color: '#64748b' }}>
          Pure In-Memory State • Nearest Distance & Direct Exit Routing
        </p>
      </footer>
    </div>
  );
}
