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
  addInspectionLabor(inspectionId: number, hours: number, options: object, estimated: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        Estimated: estimated,
        InspectionIds: inspectionId,
        Hours: hours
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
      // ensure each object has Hours & InspectionId
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
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  //  RequestCostsByRequestList<RequestLaborCost>

  /**
   * Delete Request Labor Costs
   *
   * @category InspeRequestction Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // DeleteRequestCostsDictionary<Int32, Boolean>

  /**
   * Add WorkOrder Labor Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // AddWorkOrderCostsList<WorkOrderLaborCost>

   /**
   * Get Labor Costs for WorkOrder(s)
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  //  WorkOrderCostsByWorkOrderList<WorkOrderLaborCost>

  /**
   * Delete WorkOrder Labor Costs
   *
   * @category WorkOrder Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // DeleteWorkOrderCostsDictionary<Int32, Boolean>

  /**
   * Add Inspection Equipment Costs
   *
   * @category Inspection Costs
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
  // AddInspectionCostsList<InspectionEquipmentCost>

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
   * @param {Object} 
   * @return {Object} Returns Promise that represents an object describing
   */
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
