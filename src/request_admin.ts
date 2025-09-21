import { CWError } from './error'
const _ = require('lodash')

export class RequestAdmin {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Get service request templates
   *
   * @category Requests Admin
   * @param {Object} searchData - search data
   * @return {Object} Returns Promise that represents a collection of all Service Request Templates
   */
  getTemplates(searchData: Object) {
    return new Promise((resolve, reject) => {
      var data = searchData
      this.cw.runRequest('Ams/ServiceRequestTemplate/Templates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

   /**
   * Get request template by ID
   *
   * @category Request Templates
   * @param {number} [templateId] - The ID of the template to retrieve
   * @return {Object} Returns Promise that represents the Request template matching the provided ID
   */
  getTemplateById(templateId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      var data = {ProblemSid: templateId}
      this.cw.runRequest('Ams/ServiceRequest/problemLeafBySid', data).then((r: any) => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
