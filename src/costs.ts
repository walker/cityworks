import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')

export class Costs {
  /**
   * @hidden
   */
  cw: any

  /**
   * Storage of all potential activity types which comments can be attached to: Unknown, Request, WorkOrder, CaTask, CaObject, CaCorrection, Project, Contract
   */
  activityTypes: ReversibleMap<string, number>

  /**
   * Storage of object's active activityType
   */
  currentActivityType: string

  /**
   * @hidden
   */
  constructor(cw:any, activityType:string) {
    this.cw = cw
    this.activityTypes = new ReversibleMap<string, number>()
    this.activityTypes.set("Request", 1)
    this.activityTypes.set("WorkOrder", 2)
    this.activityTypes.set("Inspection", 3)

    if(!this.activityTypes.has(activityType)) {
      throw new CWError(1, 'Cost activity type not found.', {'provided': activityType, 'options':this.activityTypes})
    }
    this.currentActivityType = activityType
  }

  /**
   * Get Cost Codes
   *
   * @category Labor Costs
   * @param {Array<number>} employeeSids - A list of Employee IDs for which to get the job codes.
   * @param {boolean} commonOnly - Set to true to get the Cost Codes that are common to ALL employees in the list, otherwise get all job codes that apply to at least one employee in the list.
   * @return {Object} Returns Promise that represents an object describing
   */
  getCodes(employeeSids: Object, commonOnly: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSids: employeeSids,
        CommonCodesOnly: commonOnly
      }
      this.cw.runRequest('Ams/LaborCost/CostCodes', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Job Codes
   *
   * @category Labor Costs
   * @return {Object} Returns Promise that represents an object describing
   */
   getJobCodes() {
    return new Promise((resolve, reject) => {
    this.cw.runRequest('Ams/LaborCost/JobCodes').then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Inspection Labor Costs
   *
   * @category Inspection Costs
   * @param {number} inspectionId - Inspection ID to add labor costs to
   * @param {number} hours - The hours to add to the inspection
   * @param {Object} options - Additional settings for hours setting
   * @param {boolean} estimated - Boolean, get estimated or real costs, defaults to false (get real by default)
   * @return {Object} Returns Promise that represents an object describing
   */
  addInspectionLabor(inspectionId: number, hours: number, options?: object, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated,
        InspectionIds: inspectionId,
        Hours: hours
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/LaborCost/AddInspectionCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

   /**
   * Get Labor Costs for a specific list of Inspections
   *
   * @category Inspection Costs
   * @param {Array<int>} inspectionIds - An array of inspection IDs to get associated costs for.
   * @param {boolean} estimated - Boolean, get estimated or real costs, defaults to false (get real by default)
   * @return {Object} Returns Promise that represents an object describing
   */
  getInspectionLabor(inspectionIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated,
        InspectionIds: inspectionIds
      }
      this.cw.runRequest('Ams/LaborCost/InspectionCostsByInspection', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Inspection Labor Costs
   *
   * @category Inspection Costs
   * @param {Array<int>} laborCostIds - An array of inspection labor cost IDs to delete
   * @param {boolean} estimated - Boolean, delete estimated or real costs, defaults to false (delete real by default)
   * @return {Object} Returns Promise that represents an object describing
   */
  deleteInspectionLabor(laborCostIds: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated,
        reqLaborCostIds: laborCostIds
      }
      this.cw.runRequest('Ams/LaborCost/DeleteInspectionCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Request Labor Costs
   *
   * @category Request Costs
   * @param {Object} requestCosts - Array of inspection labor costings
   * @return {Object} Returns Promise that represents an object describing
   */
  addRequestLabor(requestCosts: Array<Object>) {
    return new Promise((resolve, reject) => {
      var data = requestCosts
      // TODO: ensure each object has Hours & InspectionId
      this.cw.runRequest('Ams/LaborCost/AddRequestCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

   /**
   * Get Labor Costs for Request(s)
   *
   * @category Request Costs
   * @param {Array<number>} requestCosts - Array of request Ids to get costs for
   * @return {Object} Returns Promise that represents an object describing
   */
  getRequestLabor(requestIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestIds: requestIds
      }
      this.cw.runRequest('Ams/LaborCost/RequestCostsByRequest', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Request Labor Costs
   *
   * @category Request Costs
   * @param {Array<number>} laborCostIds - Array of request labor cost Ids to delete
   * @return {Object} Returns Promise that represents an object describing
   */
  deleteRequestLabor(laborCostIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        LaborCostIds: laborCostIds
      }
      this.cw.runRequest('Ams/LaborCost/DeleteRequestCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add WorkOrder Labor Costs
   *
   * @category WorkOrder Costs
   * @param {number} workOrderSid - Array of inspection labor costings
   * @param {number} hours - Number of hours to add
   * @param {Object} options - options for the work order
   * @return {Object} Returns Promise that represents an object describing
   */
  addWorkOrderLabor(workOrderSid: number, hours: number, options: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid,
        Hours: hours
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      // TODO: ensure each object has Hours & InspectionId
      this.cw.runRequest('Ams/LaborCost/AddWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

   /**
   * Get Labor Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {Array<number>} workOrderSids - Array of request Ids to get costs for
   * @param {boolean} estimated - Whether to get estimates or actuals (defaults to false -- get actuals)
   * @return {Object} Returns Promise that represents an object describing
   */
   getWorkOrderLabor(workOrderSids: Array<number>, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated,
        WorkOrderSids: workOrderSids
      }
      this.cw.runRequest('Ams/LaborCost/WorkOrderCostsByWorkOrder', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete WorkOrder Labor Costs
   *
   * @category WorkOrder Costs
   * @param {Array<number>} laborCostIds - List of labor cost IDs to delete
   * @param {boolean} estimated - Whether to delete estimates or actuals (defaults to false -- delete actuals)
   * @return {Object} Returns Promise that represents an object describing
   */
    deleteWorkOrderLabor(laborCostIds: Array<number>, estimated: boolean = false) {
      return new Promise((resolve, reject) => {
        var data = {
          LaborCostIds: laborCostIds,
          Estimated: estimated
        }
        this.cw.runRequest('Ams/LaborCost/DeleteWorkOrderCosts', data).then((response: any) => {
          resolve(response.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

    /**
   * Add Inspection Equipment Costs
   *
   * @category Inspection Costs
   * @param {Object} inspectionId - the inspection to add the equipment costs to
   * @param {Object} options - additional options
   * @return {Object} Returns Promise that represents an object describing
   */
    addInspectionEquopment(inspectionId: number, options: Object) {
      return new Promise((resolve, reject) => {
        var data = {
          InspectionId: inspectionId
        }
        if(typeof(options)!='undefined') {
          data = _.merge(data, options)
        }
        // TODO: ensure each object has Hours & InspectionId
        this.cw.runRequest('Ams/EquipmentCost/AddInspectionCosts', data).then((response: any) => {
          resolve(response.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }
  
   /**
   * Get Equipment Costs for Inspection(s)
   *
   * @category Inspection Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // InspectionCostsByInspectionList<InspectionEquipmentCost>

  /**
   * Delete Inspection Equipment Costs
   *
   * @category Inspection Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  //  DeleteInspectionCostsDictionary<Int32, Boolean>

  /**
   * Add WorkOrder Equipment Costs
   *
   * @category WorkOrder Costs
   * @param {Object} workOrderSid - the work order to add the equipment costs to
   * @param {Object} options - additional options
   * @return {Object} Returns Promise that represents an object describing
   */
  addWorkOrderquopment(workOrderSid: number, options: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      // TODO: ensure each object has Hours & InspectionId
      this.cw.runRequest('Ams/EquipmentCost/AddWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
// AddWorkOrderCostsList<EquipmentCost>

   /**
   * Get Equipment Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  //  WorkOrderCostsByWorkOrderList<EquipmentCost>

  /**
   * Delete WorkOrder Equipment Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // DeleteWorkOrderCostsDictionary<Int32, Boolean>

  /**
   * Add WorkOrder Material Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // AddWorkOrderCostsList<MaterialCost>

   /**
   * Get Material Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  //  WorkOrderCostsByWorkOrderList<MaterialCost>

  /**
   * Delete WorkOrder Material Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // DeleteWorkOrderCostsDictionary<Int32, Boolean>

}
