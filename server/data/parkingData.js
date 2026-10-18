/**
 * server/data/parkingData.js
 * 
 * In-Memory Parking Space Data Store:
 * 18 Parking Slots arranged in a 3x6 Grid:
 * - 3 Accessible / Disability Slots (D1, D2, D3)
 * - 3 VIP Executive Slots (V1, V2, V3)
 * - 3 EV Charging Slots (EV-1, EV-2, EV-3)
 * - 9 Regular Slots (R1 to R9)
 * 
 * Optimized distance routing with direct access to Entrance and Exit gates.
 */

// Baseline 18-Slot Configuration (3 rows x 6 columns)
const INITIAL_PARKING_SPACES = [
  // --- ROW 1: Priority & Fast Ingress Bays (Closest to Entrance & Main Ramp) ---
  {
    id: 'D1',
    row: 1,
    col: 1,
    distance: 3,
    status: 'available',
    type: 'accessible',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'D2',
    row: 1,
    col: 2,
    distance: 4,
    status: 'occupied',
    type: 'accessible',
    reserved: false,
    occupiedBy: {
      registrationNumber: 'KA-01-DA-1010',
      vehicleType: 'Car',
      parkedAt: '2026-10-18T09:30:00.000Z'
    }
  },
  {
    id: 'D3',
    row: 1,
    col: 3,
    distance: 5,
    status: 'available',
    type: 'accessible',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'V1',
    row: 1,
    col: 4,
    distance: 4,
    status: 'available',
    type: 'vip',
    reserved: true,
    occupiedBy: null
  },
  {
    id: 'V2',
    row: 1,
    col: 5,
    distance: 6,
    status: 'occupied',
    type: 'vip',
    reserved: true,
    occupiedBy: {
      registrationNumber: 'VIP-007-DL',
      vehicleType: 'SUV',
      parkedAt: '2026-10-18T10:00:00.000Z'
    }
  },
  {
    id: 'V3',
    row: 1,
    col: 6,
    distance: 7,
    status: 'available',
    type: 'vip',
    reserved: true,
    occupiedBy: null
  },

  // --- ROW 2: EV Fast Charging & Central Regular Bays ---
  {
    id: 'EV-1',
    row: 2,
    col: 1,
    distance: 6,
    status: 'available',
    type: 'ev',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'EV-2',
    row: 2,
    col: 2,
    distance: 8,
    status: 'occupied',
    type: 'ev',
    reserved: false,
    occupiedBy: {
      registrationNumber: 'TS-09-EV-2024',
      vehicleType: 'EV',
      parkedAt: '2026-10-18T11:15:00.000Z'
    }
  },
  {
    id: 'EV-3',
    row: 2,
    col: 3,
    distance: 9,
    status: 'available',
    type: 'ev',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R1',
    row: 2,
    col: 4,
    distance: 5,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R2',
    row: 2,
    col: 5,
    distance: 8,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R3',
    row: 2,
    col: 6,
    distance: 10,
    status: 'occupied',
    type: 'regular',
    reserved: false,
    occupiedBy: {
      registrationNumber: 'MH-02-CD-5678',
      vehicleType: 'Car',
      parkedAt: '2026-10-18T10:45:00.000Z'
    }
  },

  // --- ROW 3: Regular Parking Bays (Aisle with Direct Access to Exit Gate) ---
  {
    id: 'R4',
    row: 3,
    col: 1,
    distance: 12,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R5',
    row: 3,
    col: 2,
    distance: 14,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R6',
    row: 3,
    col: 3,
    distance: 15,
    status: 'occupied',
    type: 'regular',
    reserved: false,
    occupiedBy: {
      registrationNumber: 'DL-03-EF-9012',
      vehicleType: 'Motorcycle',
      parkedAt: '2026-10-18T09:00:00.000Z'
    }
  },
  {
    id: 'R7',
    row: 3,
    col: 4,
    distance: 18,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R8',
    row: 3,
    col: 5,
    distance: 20,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  },
  {
    id: 'R9',
    row: 3,
    col: 6,
    distance: 22,
    status: 'available',
    type: 'regular',
    reserved: false,
    occupiedBy: null
  }
];

// Active in-memory state containers
let parkingSpaces = [];
const activeVehicles = new Map(); // RegistrationNumber -> { spaceId, vehicleType, parkedAt }

// Deep clone baseline data into memory
function resetToInitialState() {
  parkingSpaces = JSON.parse(JSON.stringify(INITIAL_PARKING_SPACES));
  activeVehicles.clear();

  // Populate activeVehicles map for all initially occupied spaces
  for (const space of parkingSpaces) {
    if (space.status === 'occupied' && space.occupiedBy) {
      activeVehicles.set(space.occupiedBy.registrationNumber.toUpperCase(), {
        spaceId: space.id,
        vehicleType: space.occupiedBy.vehicleType,
        parkedAt: space.occupiedBy.parkedAt
      });
    }
  }
}

// Initialize on module load
resetToInitialState();

/**
 * Returns a copy of all current parking spaces
 */
function getAllSpaces() {
  return JSON.parse(JSON.stringify(parkingSpaces));
}

/**
 * Finds a space by ID
 */
function getSpaceById(spaceId) {
  return parkingSpaces.find(s => s.id === spaceId);
}

/**
 * Checks if a vehicle registration is currently parked
 */
function isVehicleParked(regNumber) {
  if (!regNumber) return false;
  return activeVehicles.has(regNumber.trim().toUpperCase());
}

/**
 * Gets details of currently parked vehicle
 */
function getActiveVehicleDetails(regNumber) {
  if (!regNumber) return null;
  return activeVehicles.get(regNumber.trim().toUpperCase()) || null;
}

/**
 * Returns a list of all currently active vehicle registrations
 */
function getAllActiveVehicles() {
  const result = [];
  for (const [regNo, data] of activeVehicles.entries()) {
    result.push({
      registrationNumber: regNo,
      ...data
    });
  }
  return result;
}

/**
 * Calculates current parking lot statistics
 */
function getStatistics() {
  const total = parkingSpaces.length;
  let available = 0;
  let occupied = 0;
  let accessibleCount = 0;
  let vipCount = 0;
  let evCount = 0;
  let regularCount = 0;

  for (const space of parkingSpaces) {
    if (space.status === 'occupied') {
      occupied++;
    } else {
      available++;
    }

    if (space.type === 'accessible') {
      accessibleCount++;
    } else if (space.type === 'vip') {
      vipCount++;
    } else if (space.type === 'ev') {
      evCount++;
    } else {
      regularCount++;
    }
  }

  const occupancyPercentage = total > 0 ? Number(((occupied / total) * 100).toFixed(1)) : 0;

  return {
    totalSpaces: total,
    availableSpaces: available,
    occupiedSpaces: occupied,
    accessibleSpaces: accessibleCount,
    vipSpaces: vipCount,
    evSpaces: evCount,
    regularSpaces: regularCount,
    occupancyPercentage
  };
}

/**
 * Mutates state to occupy a space with atomic safety
 */
function occupySpace(spaceId, vehicleData) {
  const space = parkingSpaces.find(s => s.id === spaceId);
  if (!space) {
    throw new Error(`Parking space ${spaceId} not found.`);
  }

  if (space.status === 'occupied') {
    throw new Error(`Parking space ${spaceId} is already occupied.`);
  }

  const regNo = vehicleData.registrationNumber.trim().toUpperCase();
  if (activeVehicles.has(regNo)) {
    throw new Error(`Vehicle ${regNo} is already registered in space ${activeVehicles.get(regNo).spaceId}.`);
  }

  const parkedAt = new Date().toISOString();
  space.status = 'occupied';
  space.occupiedBy = {
    registrationNumber: regNo,
    vehicleType: vehicleData.vehicleType || 'Car',
    parkedAt
  };

  activeVehicles.set(regNo, {
    spaceId: space.id,
    vehicleType: space.occupiedBy.vehicleType,
    parkedAt
  });

  return JSON.parse(JSON.stringify(space));
}

/**
 * Mutates state to release an occupied space
 */
function releaseSpace(registrationNumber) {
  if (!registrationNumber) {
    throw new Error('Registration number is required.');
  }

  const regNo = registrationNumber.trim().toUpperCase();
  if (!activeVehicles.has(regNo)) {
    throw new Error(`Vehicle ${regNo} is not currently parked in this lot.`);
  }

  const assignment = activeVehicles.get(regNo);
  const space = parkingSpaces.find(s => s.id === assignment.spaceId);

  if (!space) {
    activeVehicles.delete(regNo);
    throw new Error(`Inconsistency detected: Space ${assignment.spaceId} not found.`);
  }

  const previousOccupant = { ...space.occupiedBy };

  space.status = 'available';
  space.occupiedBy = null;
  activeVehicles.delete(regNo);

  return {
    space: JSON.parse(JSON.stringify(space)),
    releasedVehicle: previousOccupant
  };
}

module.exports = {
  getAllSpaces,
  getSpaceById,
  isVehicleParked,
  getActiveVehicleDetails,
  getAllActiveVehicles,
  getStatistics,
  occupySpace,
  releaseSpace,
  resetToInitialState
};
