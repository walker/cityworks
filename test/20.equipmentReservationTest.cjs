'use strict';
// Mocked tests: no Cityworks instance is contacted.
var assert = require('chai').assert;
const cw20 = require('../dist/index.js');
const { createMock } = require('./mockCityworks');

describe('[Equipment::Reservation] construct function test', () => {
  it('should have a defined reservation object', () => {
    assert.isObject(cw20.equipment.reservation, 'Equipment reservation is an object');
  });
});

describe('[Equipment::Reservation] mocked function tests', () => {
  const mock = createMock(cw20.Cityworks);
  const base = 'Ams/EquipmentReservation/';
  const start = new Date('2030-01-01T10:00:00.000Z');
  const end = new Date('2030-01-01T11:00:00.000Z');

  async function assertRejects(promise, message) {
    try {
      await promise;
    } catch (e) {
      assert.equal(e.Message, message);
      return e;
    }
    assert.fail('should have rejected');
  }

  describe('checkedOut', () => {
    it('should post an empty payload and resolve the Value', async () => {
      const rows = [{EquipmentSid: 1, EmployeeSid: 2}];
      mock.on(base + 'CheckedOut', () => rows);
      const resp = await cw20.equipment.reservation.checkedOut();
      assert.deepEqual(resp, rows);
      assert.deepEqual(mock.lastCall(base + 'CheckedOut').data, {});
      assert.lengthOf(mock.calls, 1);
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'CheckedOut', {Message: 'checked out failed'});
      await assertRejects(cw20.equipment.reservation.checkedOut(), 'checked out failed');
    });
  });

  describe('checkIn', () => {
    it('should send the equipment and employee SIDs', async () => {
      mock.on(base + 'CheckIn', (data) => ({CheckedIn: data.EquipmentSid}));
      const resp = await cw20.equipment.reservation.checkIn(1, 2);
      assert.deepEqual(resp, {CheckedIn: 1});
      assert.deepEqual(mock.lastCall(base + 'CheckIn').data, {EquipmentSid: 1, EmployeeSid: 2});
    });

    it('should merge options into the payload', async () => {
      mock.on(base + 'CheckIn', () => ({}));
      await cw20.equipment.reservation.checkIn(1, 2, {Comments: 'Test check-in', WorkOrderSid: 9});
      assert.deepEqual(mock.lastCall(base + 'CheckIn').data, {EquipmentSid: 1, EmployeeSid: 2, Comments: 'Test check-in', WorkOrderSid: 9});
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'CheckIn', {Message: 'check in failed'});
      await assertRejects(cw20.equipment.reservation.checkIn(1, 2), 'check in failed');
    });
  });

  describe('checkOut', () => {
    it('should send the SIDs and reserved-to date', async () => {
      mock.on(base + 'CheckOut', () => ({Ok: true}));
      const resp = await cw20.equipment.reservation.checkOut(1, 2, end);
      assert.deepEqual(resp, {Ok: true});
      assert.deepEqual(mock.lastCall(base + 'CheckOut').data, {EquipmentSid: 1, EmployeeSid: 2, ReservedToDate: end.toISOString()});
    });

    it('should merge options into the payload', async () => {
      mock.on(base + 'CheckOut', () => ({}));
      await cw20.equipment.reservation.checkOut(1, 2, end, {Comments: 'Test check-out', WorkOrderId: 'WO-1'});
      assert.deepEqual(mock.lastCall(base + 'CheckOut').data, {
        EquipmentSid: 1, EmployeeSid: 2, ReservedToDate: end.toISOString(), Comments: 'Test check-out', WorkOrderId: 'WO-1'
      });
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'CheckOut', {Message: 'check out failed'});
      await assertRejects(cw20.equipment.reservation.checkOut(1, 2, end), 'check out failed');
    });
  });

  describe('checkOutHistory', () => {
    it('should send both filters when given', async () => {
      const rows = [{TransactionId: 5}];
      mock.on(base + 'CheckOutHistory', () => rows);
      const resp = await cw20.equipment.reservation.checkOutHistory(1, 2);
      assert.deepEqual(resp, rows);
      assert.deepEqual(mock.lastCall(base + 'CheckOutHistory').data, {EquipmentSid: 1, EmployeeSid: 2});
    });

    it('should omit filters that are not provided', async () => {
      mock.on(base + 'CheckOutHistory', () => []);
      await cw20.equipment.reservation.checkOutHistory();
      assert.deepEqual(mock.lastCall(base + 'CheckOutHistory').data, {});
      await cw20.equipment.reservation.checkOutHistory(1);
      assert.deepEqual(mock.lastCall(base + 'CheckOutHistory').data, {EquipmentSid: 1});
      await cw20.equipment.reservation.checkOutHistory(undefined, 2);
      assert.deepEqual(mock.lastCall(base + 'CheckOutHistory').data, {EmployeeSid: 2});
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'CheckOutHistory', {Message: 'history failed'});
      await assertRejects(cw20.equipment.reservation.checkOutHistory(1, 2), 'history failed');
    });
  });

  describe('deleteReservation', () => {
    it('should send the transaction IDs', async () => {
      mock.on(base + 'DeleteReservation', () => ({Deleted: 2}));
      const resp = await cw20.equipment.reservation.deleteReservation([1, 2]);
      assert.deepEqual(resp, {Deleted: 2});
      assert.deepEqual(mock.lastCall(base + 'DeleteReservation').data, {TransactionIds: [1, 2]});
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'DeleteReservation', {Message: 'delete failed'});
      await assertRejects(cw20.equipment.reservation.deleteReservation([1]), 'delete failed');
    });
  });

  describe('reservations', () => {
    it('should send the date range when given', async () => {
      const rows = [{TransactionId: 7}];
      mock.on(base + 'Reservations', () => rows);
      const resp = await cw20.equipment.reservation.reservations(1, start, end);
      assert.deepEqual(resp, rows);
      assert.deepEqual(mock.lastCall(base + 'Reservations').data, {EquipmentSid: 1, StartDateTime: start.toISOString(), EndDateTime: end.toISOString()});
    });

    it('should omit dates that are not provided', async () => {
      mock.on(base + 'Reservations', () => []);
      await cw20.equipment.reservation.reservations(1);
      assert.deepEqual(mock.lastCall(base + 'Reservations').data, {EquipmentSid: 1});
      await cw20.equipment.reservation.reservations(1, start);
      assert.deepEqual(mock.lastCall(base + 'Reservations').data, {EquipmentSid: 1, StartDateTime: start.toISOString()});
      await cw20.equipment.reservation.reservations(1, undefined, end);
      assert.deepEqual(mock.lastCall(base + 'Reservations').data, {EquipmentSid: 1, EndDateTime: end.toISOString()});
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'Reservations', {Message: 'reservations failed'});
      await assertRejects(cw20.equipment.reservation.reservations(1, start, end), 'reservations failed');
    });
  });

  describe('reserve', () => {
    it('should send the SIDs and dates', async () => {
      mock.on(base + 'Reserve', () => ({TransactionId: 11}));
      const resp = await cw20.equipment.reservation.reserve(1, 2, start, end);
      assert.deepEqual(resp, {TransactionId: 11});
      assert.deepEqual(mock.lastCall(base + 'Reserve').data, {
        EquipmentSid: 1, EmployeeSid: 2, TransDateTime: start.toISOString(), ReservedToDate: end.toISOString()
      });
    });

    it('should merge options into the payload', async () => {
      mock.on(base + 'Reserve', () => ({}));
      await cw20.equipment.reservation.reserve(1, 2, start, end, {Comments: 'Test reserve'});
      assert.equal(mock.lastCall(base + 'Reserve').data.Comments, 'Test reserve');
      assert.equal(mock.lastCall(base + 'Reserve').data.EquipmentSid, 1);
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'Reserve', {Message: 'reserve failed'});
      await assertRejects(cw20.equipment.reservation.reserve(1, 2, start, end), 'reserve failed');
    });
  });

  describe('status', () => {
    it('should send the equipment SIDs', async () => {
      const rows = [{EquipmentSid: 1, Status: 'Available'}];
      mock.on(base + 'Status', () => rows);
      const resp = await cw20.equipment.reservation.status([1, 3]);
      assert.deepEqual(resp, rows);
      assert.deepEqual(mock.lastCall(base + 'Status').data, {EquipmentSids: [1, 3]});
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'Status', {Message: 'status failed'});
      await assertRejects(cw20.equipment.reservation.status([1]), 'status failed');
    });
  });

  describe('updateReservation', () => {
    it('should send the transaction ID merged with the updates', async () => {
      mock.on(base + 'UpdateReservation', (data) => ({Updated: data.TransactionId}));
      const resp = await cw20.equipment.reservation.updateReservation(4, {
        EmployeeSid: 2,
        TransDateTime: start,
        ReservedToDate: end,
        Comments: 'Test update'
      });
      const expected = {TransactionId: 4, EmployeeSid: 2, TransDateTime: start.toISOString(), ReservedToDate: end.toISOString(), Comments: 'Test update'};
      assert.deepEqual(resp, {Updated: 4});
      assert.deepEqual(mock.lastCall(base + 'UpdateReservation').data, expected);
    });

    it('should propagate errors', async () => {
      mock.onError(base + 'UpdateReservation', {Message: 'update failed'});
      await assertRejects(cw20.equipment.reservation.updateReservation(4, {Comments: 'x'}), 'update failed');
    });
  });
});
