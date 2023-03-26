import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')

export class InspectionCosts {
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
    this.currentActivityType = "Inspection"
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
  addLabor(inspectionId: number, hours: number, options?: object, estimated: boolean = false) {
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
  getLabor(inspectionIds: Array<number>, estimated: boolean = false) {
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
  deleteLabor(laborCostIds: Array<number>, estimated: boolean = false) {
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
   * Add Inspection Equipment Costs
   *
   * @category Inspection Costs
   * @param {Object} inspectionId - the inspection to add the equipment costs to
   * @param {Object} options - additional options
   * @return {Object} Returns Promise that represents an object describing
   */
    addEquipment(inspectionId: number, options: Object) {
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
   * @param {Array<number>} inspectionIds - the inspection to get the equipment costs for.
   * @param {Object} estimated - get estimated equipment costs. Defaults to false.
   * @return {Object} Returns Promise that represents an object describing
   */
   getEquipment(inspectionIds: number, estimated: boolean = false) {
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

  /**
   * Delete Inspection Equipment Costs
   *
   * @category Inspection Costs
   * @param {Array<number>} equipmentCostIds - the equipment cost IDs to delete.
   * @param {Object} estimated - delete estimated equipment costs. Defaults to false.
   * @return {Object} Returns Promise that represents an object describing
   */
  deleteEquipment(equipmentCostIds: Array<number>, estimated: boolean = false) {
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
}
