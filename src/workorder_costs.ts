import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')

export class WorkOrderCosts {
  /**
   * @hidden
   */
  cw: any

  /**
   * Storage of object's active activityType
   */
  currentActivityType: string

  /**
   * @hidden
   */
  constructor(cw:any) {
    this.cw = cw
    this.currentActivityType = "WorkOrder"
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
   * Add WorkOrder Labor Costs
   *
   * @category WorkOrder Costs
   * @param {number} workOrderSid - Array of inspection labor costings
   * @param {number} hours - Number of hours to add
   * @param {Object} options - options for the work order
   * @return {Object} Returns Promise that represents an object describing
   */
  addLabor(workOrderSid: number, hours: number, options: Object) {
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
   getLabor(workOrderSids: Array<number>, estimated: boolean = false) {
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
    deleteLabor(laborCostIds: Array<number>, estimated: boolean = false) {
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
   * Add WorkOrder Equipment Costs
   *
   * @category WorkOrder Costs
   * @param {Object} workOrderSid - the work order to add the equipment costs to
   * @param {Object} options - additional options
   * @return {Object} Returns Promise that represents an object describing
   */
  addEquipment(workOrderSid: number, options: Object) {
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

   /**
   * Get Equipment Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {number} workOrderSid - the work order to add the equipment costs to
   * @param {boolean} estimated - true to get estimated costs. defaults to false
   * @return {Object} Returns Promise that represents an object describing
   */
  //  WorkOrderCostsByWorkOrderList<EquipmentCost>
  getEquipment(workOrderSid: number, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid,
        Estimated: estimated
      }
      // TODO: ensure each object has Hours & InspectionId
      this.cw.runRequest('Ams/EquipmentCost/WorkOrderCostsByWorkOrder', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete WorkOrder Equipment Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  deleteEquipment(equipmentCostIds: Array<number>, estimated: boolean = false) { // "WorkOrderId", "WorkOrderSid", "Estimated", "MaterialSids", "Units", "AcctNum", "Source", "TransDate", "ContractorSids", "ContractorMaterialId", "ContractorMaterialDescription", "ContractorMaterialCost", "TaskIds", "Entities", "CombineIssuesByMaterialSid"
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

  /**
   * Add WorkOrder Material Costs
   *
   * @category WorkOrder Costs
   * @param {number} workOrderSid - Work Order SID number to add the material to
   * @param {number} units - Decimal units for material 
   * @param {Object} options - Additional work order options
   * @param {boolean} combineIssuesByMaterialSid - Combine issues with the same MaterialSid into a single commit, default is true
   * @return {Object} Returns Promise that represents a collection describing the work order material costs
   */
  addMaterial(workOrderSid: number, units: number, options: Object, combineIssuesByMaterialSid: boolean = true) { // "WorkOrderId", "WorkOrderSid", "Estimated", "MaterialSids", "Units", "AcctNum", "Source", "TransDate", "ContractorSids", "ContractorMaterialId", "ContractorMaterialDescription", "ContractorMaterialCost", "TaskIds", "Entities", "CombineIssuesByMaterialSid"
    return new Promise((resolve, reject) => {
      var data = {
        Units: units,
        WorkOrderSid: workOrderSid,
        CombineIssuesByMaterialSid: combineIssuesByMaterialSid
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Ams/MaterialCost/AddWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Material Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {number} workOrderSid - the work order to add the equipment costs to
   * @param {boolean} estimated - true to get estimated costs. defaults to false and gets actuals.
   * @return {Object} Returns Promise that represents an object describing
   */
  getMaterial(workOrderSid: number, estimated: boolean = false) { // "WorkOrderId", "WorkOrderSid", "Estimated", "MaterialSids", "Units", "AcctNum", "Source", "TransDate", "ContractorSids", "ContractorMaterialId", "ContractorMaterialDescription", "ContractorMaterialCost", "TaskIds", "Entities", "CombineIssuesByMaterialSid"
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/MaterialCost/AddWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete WorkOrder Material Costs
   *
   * @category WorkOrder Costs
   * @param {Array<number>} materialCostIds - list of material cost IDs to delete
   * @param {boolean} estimated - true to delete the estimated costs. defaults to false and deletes actuals.
   * @return {Object} Returns Promise that represents an object describing
   */
  deleteMaterial(materialCostIds: number, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        MaterialCostIds: materialCostIds,
        Estimated: estimated
      }
      this.cw.runRequest('Ams/MaterialCost/DeleteWorkOrderCosts', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
