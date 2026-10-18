/**
 * client/src/services/parkingApi.js
 * 
 * REST API client module connecting React frontend to Express backend.
 * Uses standard Fetch API with centralized error handling.
 */

// Fallback to localhost:5000 if running directly outside Vite proxy
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/parking';

/**
 * Helper to handle fetch responses and parse JSON error messages
 */
async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.message || `HTTP ${response.status}: ${response.statusText}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * Fetch all parking spaces
 */
export async function getParkingSpaces() {
  const response = await fetch(`${BASE_URL}`, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Fetch parking lot statistics (Total, Available, Occupied, Occupancy %)
 */
export async function getParkingStats() {
  const response = await fetch(`${BASE_URL}/stats`, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Fetch currently parked vehicles
 */
export async function getActiveVehicles() {
  const response = await fetch(`${BASE_URL}/vehicles`, {
    headers: { 'Accept': 'application/json' }
  });
  return handleResponse(response);
}

/**
 * Allocate the nearest eligible parking space using Greedy Algorithm
 * @param {Object} payload - { registrationNumber, vehicleType, requiresAccessible, hasReservationPermit }
 */
export async function assignParkingSpace(payload) {
  const response = await fetch(`${BASE_URL}/assign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return handleResponse(response);
}

/**
 * Release an active parking space when vehicle exits
 * @param {string} registrationNumber - Registration plate of exiting vehicle
 */
export async function exitVehicle(registrationNumber) {
  const response = await fetch(`${BASE_URL}/exit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({ registrationNumber })
  });
  return handleResponse(response);
}

/**
 * Reset server-side in-memory state to initial demonstration baseline
 */
export async function resetParkingState() {
  const response = await fetch(`${BASE_URL}/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });
  return handleResponse(response);
}
