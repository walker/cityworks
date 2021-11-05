import { CWError } from './error'
const _ = require('lodash')

export class WorkOrder {
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
     * Create new workorders
     *
     * @category WorkOrders
     * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the newly-created work order
     */
    create(wo_data: Object) {
      return new Promise((resolve, reject) => {
        if(!_.has(wo_data, 'WOTemplateId') || !_.has(wo_data, 'EntityType')) {
          reject(new CWError(2, 'WOTemplateId & EntityType must be provided.', {'provided': wo_data}))
        } else {
          this.cw.runRequest('Ams/WorkOrder/Create', wo_data).then(r => {
            resolve(r.Value)
          }).catch(e => {
            reject(e)
          })
        }
      })
    }

    /**
     * Update a work order
     *
     * @category WorkOrders
     * @param {object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated work order
     */
    update(wo_data: Object) {
      return new Promise((resolve, reject) => {
        if(!_.has(wo_data, 'WorkOrderSid') && !_.has(wo_data, 'WorkOrderId')) {
          reject(new CWError(3, 'WorkOrderId or WorkOrderSid must be provided.', {'provided': wo_data}))
        } else {
          this.cw.runRequest('Ams/WorkOrder/Update', wo_data).then(r => {
            resolve(r.Value)
          }).catch(e => {
            reject(e)
          })
        }
      })
    }

  /**
   * Move a workorder's point
   *
   * @category WorkOrders
   * @param {number} workOrderId
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include WKT or WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated work order
   */
  move(workOrderId: number, x: number, y: number, projection: Object, z?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(projection, 'WKID') && !_.has(projection, 'WKT')) {
        // Throw error
        reject(new CWError(6, 'You must provide either the WKID or WKT for the x/y coordinates.', {'projection': projection}))
      }
      var base_data = {
        WorkOrderId: workOrderId,
        X: x,
        Y: y
      };
      var data = _.merge(base_data, projection);
      this.cw.runRequest('Ams/WorkOrder/Move', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    });
  }

  /**
   * Get a work order by SID
   *
   * @category WorkOrders
   * @param {number} workOrderSid - The SID of the work order to retrieve
   * @return {Object} Returns Promise that represents an object describing the work order
   */
  getBySid(workOrderSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSid: workOrderSid
      }
      this.cw.runRequest('Ams/WorkOrder/BySid', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a work order by ID
   *
   * @category WorkOrders
   * @param {number} workOrderId - The ID of the request to retrieve
   * @return {Object} Returns Promise that represents an object describing the work order
   */
  getById(workOrderId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderId: workOrderId
      }
      this.cw.runRequest('Ams/WorkOrder/ById', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get work orders by array of SIDs
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderSids - The request SIDs to retrieve
   * @return {Object} Returns Promise that represents a collection of Objects describing the work orders
   */
  getBySids(workOrderSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderSids: workOrderSids
      }
      this.cw.runRequest('Ams/WorkOrder/BySids', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get work orders by array of IDs
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderIds - The request IDs to retrieve
   * @return {Object} Returns Promise that represents a collection of Objects describing the work orders
   */
  getByIds(workOrderIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderIds: workOrderIds
      }
      this.cw.runRequest('Ams/WorkOrder/ByIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the audit log for a specific work order
   *
   * @category WorkOrder
   * @param {number} id - A Work Order SID or ID to get the audit log for. SID is preferred.
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false)
   * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
   */
  getAuditLog(id: number, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(s) {
        _.set(data, 'WorkOrderSid', id)
      } else {
        _.set(data, 'WorkOrderId', id)
      }
      this.cw.runRequest('Ams/WorkOrder/AuditLog', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
