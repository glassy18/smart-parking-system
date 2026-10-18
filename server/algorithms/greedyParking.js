/**
 * server/algorithms/greedyParking.js
 * 
 * Greedy Algorithm for Nearest Parking Space Allocation.
 * Evaluates spaces based on distance from entrance and eligibility categories:
 * 1. Regular
 * 2. EV (Electric Vehicle Charging)
 * 3. VIP / Executive
 * 4. Accessible / Disability
 */

/**
 * Finds the nearest eligible available parking space using a single Greedy scan.
 * 
 * @param {Array<Object>} spaces - Array of 18 parking spaces
 * @param {Object} vehicleRequest - Vehicle booking request
 * @param {string} vehicleRequest.registrationNumber - License plate
 * @param {string} vehicleRequest.vehicleType - Type (Car, SUV, Motorcycle, EV)
 * @param {string} [vehicleRequest.category='regular'] - 'regular' | 'ev' | 'vip' | 'accessible'
 * 
 * @returns {Object} Result object with allocated space, distance, and trace
 */
function findNearestParkingSpace(spaces, vehicleRequest) {
  // 1. Input Validation
  if (!spaces || !Array.isArray(spaces) || spaces.length === 0) {
    return {
      success: false,
      message: 'No parking spaces available in the system.',
      allocatedSpace: null,
      distance: null,
      trace: []
    };
  }

  if (!vehicleRequest || !vehicleRequest.registrationNumber || typeof vehicleRequest.registrationNumber !== 'string') {
    return {
      success: false,
      message: 'A valid vehicle registration number is required.',
      allocatedSpace: null,
      distance: null,
      trace: []
    };
  }

  const regNo = vehicleRequest.registrationNumber.trim().toUpperCase();

  // Normalize requested category
  let requestedCategory = 'regular';
  if (vehicleRequest.category) {
    requestedCategory = vehicleRequest.category.toLowerCase();
  } else if (vehicleRequest.requiresAccessible) {
    requestedCategory = 'accessible';
  } else if (vehicleRequest.isVip || vehicleRequest.hasReservationPermit) {
    requestedCategory = 'vip';
  } else if (vehicleRequest.isEv || vehicleRequest.vehicleType === 'EV') {
    requestedCategory = 'ev';
  }

  let minDistance = Infinity;
  let bestSpace = null;
  const trace = [];
  let stepIndex = 0;

  const startTime = process.hrtime.bigint ? Number(process.hrtime.bigint()) : Date.now() * 1e6;

  // 2. Greedy Linear Scan over all 18 spaces
  for (let i = 0; i < spaces.length; i++) {
    const space = spaces[i];
    stepIndex++;

    let isEligible = true;
    let reason = '';
    let becameBestCandidate = false;

    // Constraint 1: Check occupancy
    if (space.status === 'occupied') {
      isEligible = false;
      const occupant = space.occupiedBy ? space.occupiedBy.registrationNumber : 'another vehicle';
      reason = `Occupied (by ${occupant}) — skipped.`;
    }
    // Constraint 2: Category Matching
    else if (requestedCategory === 'accessible' && space.type !== 'accessible') {
      isEligible = false;
      reason = `Non-accessible bay — vehicle requested Disability / Accessible bay (skipped).`;
    }
    else if (requestedCategory === 'vip' && space.type !== 'vip') {
      isEligible = false;
      reason = `Non-VIP bay — vehicle requested VIP / Executive bay (skipped).`;
    }
    else if (requestedCategory === 'ev' && space.type !== 'ev') {
      isEligible = false;
      reason = `Non-EV bay — vehicle requested EV Charging bay (skipped).`;
    }
    else if (requestedCategory === 'regular' && space.type !== 'regular') {
      isEligible = false;
      reason = `Specialized bay (${space.type.toUpperCase()}) — reserved for ${space.type} vehicles only (skipped).`;
    }

    // 3. Greedy Distance Check
    if (isEligible) {
      if (space.distance < minDistance) {
        const prevCandidateDesc = bestSpace ? `${bestSpace.id} (${minDistance}m)` : 'none';
        minDistance = space.distance;
        bestSpace = space;
        becameBestCandidate = true;

        reason = prevCandidateDesc === 'none'
          ? `Available at ${space.distance}m [${space.type.toUpperCase()}] — initial eligible candidate (Current Best: ${space.id}).`
          : `Available at ${space.distance}m [${space.type.toUpperCase()}] — closer than previous best ${prevCandidateDesc}. Becomes new best candidate!`;
      } else {
        reason = `Available at ${space.distance}m [${space.type.toUpperCase()}] — not closer than current best candidate ${bestSpace.id} (${minDistance}m). Skipped.`;
      }
    }

    trace.push({
      step: stepIndex,
      spaceId: space.id,
      distance: space.distance,
      status: space.status,
      type: space.type,
      reserved: space.reserved,
      isEligible,
      reason,
      currentMinDistance: minDistance === Infinity ? null : minDistance,
      currentBestSpaceId: bestSpace ? bestSpace.id : null,
      becameBestCandidate
    });
  }

  const endTime = process.hrtime.bigint ? Number(process.hrtime.bigint()) : Date.now() * 1e6;
  const executionTimeMs = Number(((endTime - startTime) / 1e6).toFixed(4));

  if (!bestSpace) {
    return {
      success: false,
      message: `No available ${requestedCategory.toUpperCase()} parking spaces found.`,
      allocatedSpace: null,
      distance: null,
      trace,
      stats: {
        totalEvaluated: spaces.length,
        eligibleFound: 0,
        executionTimeMs
      }
    };
  }

  return {
    success: true,
    message: `Successfully allocated nearest ${bestSpace.type.toUpperCase()} space ${bestSpace.id} at ${bestSpace.distance} metres.`,
    allocatedSpace: {
      id: bestSpace.id,
      distance: bestSpace.distance,
      type: bestSpace.type,
      reserved: bestSpace.reserved
    },
    distance: bestSpace.distance,
    trace,
    stats: {
      totalEvaluated: spaces.length,
      eligibleFound: trace.filter(t => t.isEligible).length,
      executionTimeMs
    }
  };
}

module.exports = {
  findNearestParkingSpace
};
