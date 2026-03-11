import _ from 'lodash';

export interface EquipmentCostOptions {
  AcctNum?: string;
  ContractorEquipmentCost?: number;
  ContractorEquipmentDescription?: string;
  ContractorEquipmentId?: string;
  ContractorSids?: Array<number>;
  EquipmentSids?: Array<number>;
  Estimated?: boolean;
  FinishDate?: Date;
  Hours?: number;
  OperatorId?: number;
  StartDate?: Date;
  Units?: number;
}

export class EquipmentCost {
  cw: any

  constructor(cw) {
    this.cw = cw
  }

  addInspectionCosts(inspectionId: number, options?: EquipmentCostOptions) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionId: inspectionId
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentCost/AddInspectionCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  addRequestCosts(requestId: number, options?: EquipmentCostOptions) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestId: requestId
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentCost/AddRequestCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  addWorkOrderCosts(workOrderSid: number, options?: EquipmentCostOptions & { WorkOrderId?: string, TaskIds?: Array<number>, Entities?: Array<any> }) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid
      }
      if(typeof options !== 'undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/EquipmentCost/AddWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  deleteInspectionCosts(equipmentCostIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentCostIds: equipmentCostIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/EquipmentCost/DeleteInspectionCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  deleteRequestCosts(equipmentCostIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentCostIds: equipmentCostIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/EquipmentCost/DeleteRequestCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  deleteWorkOrderCosts(equipmentCostIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        EquipmentCostIds: equipmentCostIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/EquipmentCost/DeleteWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  inspectionCostsByInspection(inspectionIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionIds: inspectionIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/EquipmentCost/InspectionCostsByInspection', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  requestCostsByRequest(requestIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestIds: requestIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/EquipmentCost/RequestCostsByRequest', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  workOrderCostsByWorkOrder(workOrderIds?: Array<string>, workOrderSids?: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated
      } as { Estimated: boolean, WorkOrderIds?: Array<string>, WorkOrderSids?: Array<number> }

      if(typeof workOrderIds !== 'undefined') {
        data.WorkOrderIds = workOrderIds
      }
      if(typeof workOrderSids !== 'undefined') {
        data.WorkOrderSids = workOrderSids
      }

      this.cw.runRequest('Ams/EquipmentCost/WorkOrderCostsByWorkOrder', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
