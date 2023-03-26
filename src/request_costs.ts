import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')

export class RequestCosts {
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
    this.currentActivityType = "Request"
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
   * Add Request Labor Costs
   *
   * @category Request Costs
   * @param {Object} requestCosts - Array of inspection labor costings
   * @return {Object} Returns Promise that represents an object describing
   */
  addLabor(requestCosts: Array<Object>) {
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
   * @param {Array<number>} requestIds - Array of request Ids to get costs for
   * @return {Object} Returns Promise that represents an object describing
   */
  getLabor(requestIds: Array<number>) {
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
  deleteLabor(laborCostIds: Array<number>) {
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

}
