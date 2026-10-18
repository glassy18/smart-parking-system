/**
 * server/routes/parkingRoutes.js
 * 
 * REST API Routes for Smart Parking System
 */

const express = require('express');
const router = express.Router();
const parkingData = require('../data/parkingData');
const { findNearestParkingSpace } = require('../algorithms/greedyParking');

// Mutex lock for atomic in-memory transactions during concurrent requests
let isAllocating = false;

/**
 * GET /api/parking
 * Returns all parking spaces and active assignments
 */
router.get('/', (req, res) => {
  try {
    const spaces = parkingData.getAllSpaces();
    res.status(200).json({
      success: true,
      count: spaces.length,
      data: spaces
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve parking spaces.',
      error: error.message
    });
  }
});

/**
 * GET /api/parking/stats
 * Returns live parking statistics
 */
router.get('/stats', (req, res) => {
  try {
    const stats = parkingData.getStatistics();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to compute statistics.',
      error: error.message
    });
  }
});

/**
 * GET /api/parking/vehicles
 * Returns list of currently parked vehicles (useful for quick-exit in UI)
 */
router.get('/vehicles', (req, res) => {
  try {
    const vehicles = parkingData.getAllActiveVehicles();
    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active vehicles.',
      error: error.message
    });
  }
});

/**
 * POST /api/parking/assign
 * Executes Greedy Algorithm to allocate nearest eligible parking space.
 */
router.post('/assign', async (req, res) => {
  // Concurrency lock to prevent race conditions in closely timed requests
  while (isAllocating) {
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  isAllocating = true;

  try {
    const { registrationNumber, vehicleType, category, requiresAccessible, hasReservationPermit, isVip, hasVipPermit, isEv } = req.body;

    // 1. Input Validation
    if (!registrationNumber || typeof registrationNumber !== 'string' || registrationNumber.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Registration number is required and must be non-empty.'
      });
    }

    const cleanRegNo = registrationNumber.trim().toUpperCase();

    // Basic format validation (alphanumeric with optional hyphens/spaces, 2 to 20 characters)
    const plateRegex = /^[A-Z0-9- ]{2,20}$/;
    if (!plateRegex.test(cleanRegNo)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid registration format. Use 2-20 alphanumeric characters (e.g., KA-01-AB-1234).'
      });
    }

    // 2. Prevent duplicate active registrations
    if (parkingData.isVehicleParked(cleanRegNo)) {
      const activeDetails = parkingData.getActiveVehicleDetails(cleanRegNo);
      return res.status(409).json({
        success: false,
        message: `Vehicle ${cleanRegNo} is already parked in space ${activeDetails.spaceId}. A vehicle cannot hold multiple active spots.`
      });
    }

    // 3. Retrieve current state of all parking spaces
    const currentSpaces = parkingData.getAllSpaces();

    // 4. Run Greedy Algorithm
    const algorithmResult = findNearestParkingSpace(currentSpaces, {
      registrationNumber: cleanRegNo,
      vehicleType: vehicleType || 'Car',
      category,
      isEv: Boolean(isEv || category === 'ev' || vehicleType === 'EV'),
      requiresAccessible: Boolean(requiresAccessible || category === 'accessible'),
      hasReservationPermit: Boolean(hasReservationPermit || isVip || hasVipPermit || category === 'vip'),
      isVip: Boolean(hasReservationPermit || isVip || hasVipPermit || category === 'vip')
    });

    // 5. Check algorithm outcome
    if (!algorithmResult.success) {
      return res.status(422).json({
        success: false,
        message: algorithmResult.message,
        trace: algorithmResult.trace,
        stats: algorithmResult.stats
      });
    }

    // 6. Mutate in-memory state atomically
    const occupiedSpace = parkingData.occupySpace(algorithmResult.allocatedSpace.id, {
      registrationNumber: cleanRegNo,
      vehicleType: vehicleType || 'Car'
    });

    const updatedStats = parkingData.getStatistics();

    return res.status(201).json({
      success: true,
      message: `Space ${occupiedSpace.id} successfully allocated to vehicle ${cleanRegNo}.`,
      allocatedSpace: occupiedSpace,
      distance: occupiedSpace.distance,
      trace: algorithmResult.trace,
      stats: algorithmResult.stats,
      lotStats: updatedStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal server error during space allocation.'
    });
  } finally {
    isAllocating = false;
  }
});

/**
 * POST /api/parking/exit
 * Releases a vehicle's assigned parking space.
 */
router.post('/exit', (req, res) => {
  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber || typeof registrationNumber !== 'string' || registrationNumber.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle registration number is required to release a space.'
      });
    }

    const cleanRegNo = registrationNumber.trim().toUpperCase();

    if (!parkingData.isVehicleParked(cleanRegNo)) {
      return res.status(404).json({
        success: false,
        message: `Vehicle ${cleanRegNo} was not found among currently parked vehicles.`
      });
    }

    const { space, releasedVehicle } = parkingData.releaseSpace(cleanRegNo);
    const updatedStats = parkingData.getStatistics();

    return res.status(200).json({
      success: true,
      message: `Vehicle ${cleanRegNo} has exited. Parking space ${space.id} is now available.`,
      releasedSpace: space,
      vehicleDetails: releasedVehicle,
      lotStats: updatedStats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Error occurred while releasing the parking space.'
    });
  }
});

/**
 * POST /api/parking/reset
 * Resets in-memory data to the baseline demonstration state.
 */
router.post('/reset', (req, res) => {
  try {
    parkingData.resetToInitialState();
    const spaces = parkingData.getAllSpaces();
    const stats = parkingData.getStatistics();

    return res.status(200).json({
      success: true,
      message: 'In-memory parking state successfully reset to initial demonstration baseline.',
      data: spaces,
      lotStats: stats
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to reset parking state.',
      error: error.message
    });
  }
});

module.exports = router;
