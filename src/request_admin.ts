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
   * @return {Object} Returns Promise that represents a collection of all Service Request Templates
   */
  getTemplates() {
    return new Promise((resolve, reject) => {
      var data = searchData
      this.cw.runRequest('Ams/ServiceRequestTemplate/Templates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
