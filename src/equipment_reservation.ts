import _ from 'lodash';

export interface EquipmentReservationOptions {
  WorkOrderId?: string;
  WorkOrderSid?: number;
  Comments?: string;
}

export class EquipmentReservation {
  cw: any

  constructor(cw) {
    this.cw = cw
  }

  checkedOut() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/EquipmentReservation/CheckedOut', {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  checkIn(equipmentSid: number, employeeSid: number, options?: EquipmentReservationOptions) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSid: equipmentSid,
        EmployeeSid: employeeSid
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentReservation/CheckIn', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  checkOut(equipmentSid: number, employeeSid: number, reservedToDate: Date, options?: EquipmentReservationOptions) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSid: equipmentSid,
        EmployeeSid: employeeSid,
        ReservedToDate: reservedToDate
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentReservation/CheckOut', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  checkOutHistory(equipmentSid?: number, employeeSid?: number) {
    return new Promise((resolve, reject) => {
      var data = {} as { EquipmentSid?: number, EmployeeSid?: number }
      if(typeof equipmentSid !== 'undefined') {
        data.EquipmentSid = equipmentSid
      }
      if(typeof employeeSid !== 'undefined') {
        data.EmployeeSid = employeeSid
      }
      this.cw.runRequest('Ams/EquipmentReservation/CheckOutHistory', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  deleteReservation(transactionIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        TransactionIds: transactionIds
      }
      this.cw.runRequest('Ams/EquipmentReservation/DeleteReservation', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  reservations(equipmentSid: number, startDateTime?: Date, endDateTime?: Date) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSid: equipmentSid
      } as { EquipmentSid: number, StartDateTime?: Date, EndDateTime?: Date }
      if(typeof startDateTime !== 'undefined') {
        data.StartDateTime = startDateTime
      }
      if(typeof endDateTime !== 'undefined') {
        data.EndDateTime = endDateTime
      }
      this.cw.runRequest('Ams/EquipmentReservation/Reservations', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  reserve(equipmentSid: number, employeeSid: number, transDateTime: Date, reservedToDate: Date, options?: EquipmentReservationOptions) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSid: equipmentSid,
        EmployeeSid: employeeSid,
        TransDateTime: transDateTime,
        ReservedToDate: reservedToDate
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentReservation/Reserve', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  status(equipmentSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentSids: equipmentSids
      }
      this.cw.runRequest('Ams/EquipmentReservation/Status', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  updateReservation(transactionId: number, updates: {
    EmployeeSid?: number,
    TransDateTime?: Date,
    ReservedToDate?: Date,
    WorkOrderId?: string,
    WorkOrderSid?: number,
    Comments?: string
  }) {
    return new Promise((resolve, reject) => {
      var data = {
        TransactionId: transactionId
      }
      data = _.merge(data, updates)
      this.cw.runRequest('Ams/EquipmentReservation/UpdateReservation', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
