/**
 * server/tests/greedyParking.test.js
 * 
 * Comprehensive Test Suite for Smart Parking System
 * Tests 3x6 grid (Accessible, VIP, EV, Regular), Greedy Algorithm, and In-Memory State.
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const { findNearestParkingSpace } = require('../algorithms/greedyParking');
const parkingData = require('../data/parkingData');

describe('Smart Parking System - 3x6 Grid & Algorithm Tests', () => {

  beforeEach(() => {
    parkingData.resetToInitialState();
  });

  // Test 1: Nearest eligible available regular space is selected (R1 at 5m)
  it('Scenario 1: Should select the nearest eligible available regular space (R1 at 5m)', () => {
    const spaces = parkingData.getAllSpaces();
    const result = findNearestParkingSpace(spaces, {
      registrationNumber: 'TEST-01-REG',
      category: 'regular'
    });

    assert.equal(result.success, true);
    assert.equal(result.allocatedSpace.id, 'R1');
    assert.equal(result.allocatedSpace.distance, 5);
    assert.equal(result.allocatedSpace.type, 'regular');

    // Verify R2 was evaluated after R1 and skipped because 8m > 5m
    const r2Trace = result.trace.find(t => t.spaceId === 'R2');
    assert.equal(r2Trace.becameBestCandidate, false);
    assert.ok(r2Trace.reason.includes('not closer'));
  });

  // Test 2: Occupied spaces are skipped
  it('Scenario 2: Occupied spaces should be skipped during greedy scan', () => {
    const spaces = parkingData.getAllSpaces();
    const result = findNearestParkingSpace(spaces, {
      registrationNumber: 'TEST-02-OCC',
      category: 'regular'
    });

    // R3 and R6 are occupied regular spaces in baseline
    const r3Trace = result.trace.find(t => t.spaceId === 'R3');
    assert.equal(r3Trace.isEligible, false);
    assert.ok(r3Trace.reason.includes('Occupied'));

    const r6Trace = result.trace.find(t => t.spaceId === 'R6');
    assert.equal(r6Trace.isEligible, false);
    assert.ok(r6Trace.reason.includes('Occupied'));

    assert.notEqual(result.allocatedSpace.id, 'R3');
    assert.notEqual(result.allocatedSpace.id, 'R6');
  });

  // Test 3: No available spaces produces an appropriate response
  it('Scenario 3: Should return a clean failure response when no eligible spaces are available', () => {
    const allOccupiedSpaces = [
      { id: 'S1', distance: 5, status: 'occupied', type: 'regular', reserved: false },
      { id: 'S2', distance: 10, status: 'occupied', type: 'regular', reserved: false }
    ];

    const result = findNearestParkingSpace(allOccupiedSpaces, {
      registrationNumber: 'TEST-03-EMPTY',
      category: 'regular'
    });

    assert.equal(result.success, false);
    assert.equal(result.allocatedSpace, null);
    assert.ok(result.message.includes('No available'));
  });

  // Test 4: Duplicate active vehicle registrations are rejected
  it('Scenario 4: Duplicate active vehicle registrations should be rejected', () => {
    const regNo = 'DUP-CAR-88';
    parkingData.occupySpace('R1', { registrationNumber: regNo, vehicleType: 'Car' });

    assert.equal(parkingData.isVehicleParked(regNo), true);
    assert.throws(() => {
      parkingData.occupySpace('R2', { registrationNumber: regNo, vehicleType: 'Car' });
    }, /already registered/);
  });

  // Test 5: Invalid inputs are rejected
  it('Scenario 5: Invalid inputs should be rejected gracefully', () => {
    const spaces = parkingData.getAllSpaces();
    const result1 = findNearestParkingSpace(spaces, { registrationNumber: '' });
    assert.equal(result1.success, false);

    const result2 = findNearestParkingSpace(spaces, null);
    assert.equal(result2.success, false);

    const result3 = findNearestParkingSpace([], { registrationNumber: 'TEST-05' });
    assert.equal(result3.success, false);
  });

  // Test 6: Vehicle exit releases the assigned space
  it('Scenario 6: Vehicle exit should mark space available and remove active assignment', () => {
    // In baseline, KA-01-DA-1010 is parked in D2
    assert.equal(parkingData.isVehicleParked('KA-01-DA-1010'), true);
    const initialSpace = parkingData.getSpaceById('D2');
    assert.equal(initialSpace.status, 'occupied');

    const { space, releasedVehicle } = parkingData.releaseSpace('KA-01-DA-1010');
    assert.equal(space.id, 'D2');
    assert.equal(space.status, 'available');
    assert.equal(parkingData.isVehicleParked('KA-01-DA-1010'), false);
  });

  // Test 7: A released space can be assigned again
  it('Scenario 7: A released space should become eligible for reassignment', () => {
    parkingData.releaseSpace('KA-01-DA-1010');
    assert.equal(parkingData.getSpaceById('D2').status, 'available');

    const newOccupant = parkingData.occupySpace('D2', {
      registrationNumber: 'NEW-DIS-77',
      vehicleType: 'Car'
    });

    assert.equal(newOccupant.status, 'occupied');
    assert.equal(newOccupant.occupiedBy.registrationNumber, 'NEW-DIS-77');
  });

  // Test 8: 3-way Category Allocation: Accessible, VIP, EV, and Regular
  it('Scenario 8: Category rules (Accessible, VIP, EV, Regular) should be strictly enforced', () => {
    const spaces = parkingData.getAllSpaces();

    // 1. Accessible vehicle -> should select D1 (3m)
    const resAcc = findNearestParkingSpace(spaces, {
      registrationNumber: 'ACC-USER-1',
      category: 'accessible'
    });
    assert.equal(resAcc.allocatedSpace.id, 'D1');
    assert.equal(resAcc.allocatedSpace.distance, 3);
    assert.equal(resAcc.allocatedSpace.type, 'accessible');

    // 2. VIP vehicle -> should select V1 (4m)
    const resVip = findNearestParkingSpace(spaces, {
      registrationNumber: 'VIP-USER-1',
      category: 'vip'
    });
    assert.equal(resVip.allocatedSpace.id, 'V1');
    assert.equal(resVip.allocatedSpace.distance, 4);
    assert.equal(resVip.allocatedSpace.type, 'vip');

    // 3. EV vehicle -> should select EV-1 (6m)
    const resEv = findNearestParkingSpace(spaces, {
      registrationNumber: 'EV-USER-1',
      category: 'ev'
    });
    assert.equal(resEv.allocatedSpace.id, 'EV-1');
    assert.equal(resEv.allocatedSpace.distance, 6);
    assert.equal(resEv.allocatedSpace.type, 'ev');

    // 4. Regular vehicle -> should select R1 (5m), skipping D1(3m), V1(4m), EV-1(6m)
    const resReg = findNearestParkingSpace(spaces, {
      registrationNumber: 'REG-USER-1',
      category: 'regular'
    });
    assert.equal(resReg.allocatedSpace.id, 'R1');
    assert.equal(resReg.allocatedSpace.distance, 5);
    assert.equal(resReg.allocatedSpace.type, 'regular');
  });

  // Test 9: Dashboard statistics remain consistent
  it('Scenario 9: Statistics should accurately reflect 18-slot counts and transitions', () => {
    const initialStats = parkingData.getStatistics();
    assert.equal(initialStats.totalSpaces, 18);
    assert.equal(initialStats.accessibleSpaces, 3);
    assert.equal(initialStats.vipSpaces, 3);
    assert.equal(initialStats.evSpaces, 3);
    assert.equal(initialStats.regularSpaces, 9);

    const initialAvail = initialStats.availableSpaces;
    const initialOcc = initialStats.occupiedSpaces;

    // Occupy R1
    parkingData.occupySpace('R1', { registrationNumber: 'STAT-OCC-1', vehicleType: 'Car' });
    const statsAfter = parkingData.getStatistics();
    assert.equal(statsAfter.availableSpaces, initialAvail - 1);
    assert.equal(statsAfter.occupiedSpaces, initialOcc + 1);

    // Release R1
    parkingData.releaseSpace('STAT-OCC-1');
    const statsRestored = parkingData.getStatistics();
    assert.equal(statsRestored.availableSpaces, initialAvail);
    assert.equal(statsRestored.occupiedSpaces, initialOcc);
  });

  // Test 10: State manager prevents double allocation
  it('Scenario 10: State manager should prevent double allocation of the same space', () => {
    parkingData.occupySpace('R2', { registrationNumber: 'RACE-1', vehicleType: 'Car' });
    assert.throws(() => {
      parkingData.occupySpace('R2', { registrationNumber: 'RACE-2', vehicleType: 'Car' });
    }, /already occupied/);
  });

});
