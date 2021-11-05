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
     * @return {Object} Returns Promise that represents an object describing the newly-created workorder
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
     * Update a workorder
     *
     * @category WorkOrders
     * @param {object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated workorder
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
   * @return {Object} Returns Promise that represents an object describing the updated workorder
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
   * Get a workorder by S/ID
   *
   * @category WorkOrders
   * @param {number} workOrderSId - The S/ID of the workorder to retrieve
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
   * @return {Object} Returns Promise that represents an object describing the workorder
   */
  getById(workOrderSId: number, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(s) {
        _.set(data, 'WorkOrderSids', workOrderSId)
        var path = 'Ams/WorkOrder/BySid';
      } else {
        _.set(data, 'WorkOrderIds', workOrderSId)
        var path = 'Ams/WorkOrder/ById';
      }
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get workorders by an array of S/IDs
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderSIds - The workorder S/IDs to retrieve
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  getByIds(workOrderSIds: Array<number>, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(s) {
        _.set(data, 'WorkOrderSids', workOrderSIds)
        var path = 'Ams/WorkOrder/BySids';
      } else {
        _.set(data, 'WorkOrderIds', workOrderSIds)
        var path = 'Ams/WorkOrder/ByIds';
      }
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the audit log for a specific workorder
   *
   * @category WorkOrder
   * @param {number} id - A WorkOrder S/ID to get the audit log for. SID is default.
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
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

  /**
   * Get custom field values for the workorder S/IDs
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderSIds - The workorder S/IDs to retrieve
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  getCustomFieldValues(workOrderSIds: Array<number>, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(s) {
        _.set(data, 'WorkOrderSids', workOrderSIds)
        var path = 'Ams/WorkOrder/CustomFieldsByWorkOrderSids';
      } else {
        _.set(data, 'WorkOrderIds', workOrderSIds)
        var path = 'Ams/WorkOrder/CustomFields';
      }
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Add a comment to a workorder
   *
   * @category WorkOrders
   * @param {number} workOrderSId - The S/ID of the workorder to retrieve. SID is default.
   * @param {string} comment - The comment text to add.
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
   * @return {Object} Returns Promise that represents an object describing the comment added
   */
  comment(workOrderSId: Array<number>, comment: string, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {
        Comments: comment
      }
      if(s)
        _.set(data, 'WorkOrderSid', workOrderSId)
      else
        _.set(data, 'WorkOrderId', workOrderSId)
      this.cw.runRequest('Ams/WorkOrder/AddComments', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Cancel workorders
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderIds - An array of the IDs to cancel the matched workorders
   * @param {string} [cancelReason] - A reason for cancelling the workorder(s)
   * @param {datetime} [dateCancelled] - The date/time that it should be indicated the workorder was cancelled
   * @return {Object} Returns object that represents a collection of workorders
   */
  cancel(workOrderIds: Array<number>, cancelReason?: string, dateCancelled?: Date) {
    return new Promise((resolve, reject) => {
      var m = new Date()
      var data: {WorkOrderIds: Array<number>, CancelReason?: string, DateCancelled?: Date} = { WorkOrderIds: workOrderIds }
      if(typeof(cancelReason)!=='undefined')
        _.set(data, 'CancelReason', cancelReason);
      if(typeof(dateCancelled)!=='undefined')
        _.set(data, 'DateCancelled', dateCancelled);
      this.cw.runRequest('Ams/WorkOrder/Cancel', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Uncancel workorders
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderIds - An array of the IDs to uncancel the matched workorders
   * @return {Object} Returns object that represents a collection of workorders
   */
   uncancel(workOrderIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         WorkOrderIds: workOrderIds
       }
       this.cw.runRequest('Ams/WorkOrder/Uncancel', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
    * Close WorkOrders
    *
    * @category WorkOrders
    * @param {Array<number>} workOrderIds - An array of the IDs to close the matched WorkOrders
    * @return {Object} Returns object that represents a collection of WorkOrders
    */
    close(workOrderIds: Array<number>) {
      return new Promise((resolve, reject) => {
        var data = {
          WorkOrderIds: workOrderIds
        }
        this.cw.runRequest('Ams/WorkOrder/Close', data).then(r => {
          if(r.Status>0) {
            reject(new CWError(5, r.Message, {'response': r}))
          } else {
            resolve(r.Value)
          }
        }).catch(e => {
          reject(e)
        })
      })
    }

    /**
     * Reopen closed WorkOrders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to reopen the matched WorkOrders
     * @return {Object} Returns object that represents a collection of WorkOrders
     */
     reopen(workOrderIds: Array<number>) {
       return new Promise((resolve, reject) => {
         var data = {
           WorkOrderIds: workOrderIds
         }
         this.cw.runRequest('Ams/WorkOrder/ReOpen', data).then(r => {
           resolve(r.Value)
         }).catch(e => {
           reject(e)
         })
       })
     }

  /**
   * Delete WorkOrders
   *
   * @category WorkOrders
   * @param {Array<number>} workOrderIds - An array of the IDs to delete the matched WorkOrders
   * @return {Object} Returns object that represents a collection of WorkOrder Ids which have been deleted
   */
   delete(workOrderIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         WorkOrderIds: workOrderIds
       }
       this.cw.runRequest('Ams/WorkOrder/Delete', data).then(r => {
         if(r.Status>0) {
           reject(new CWError(4, r.Message, {'response': r}))
         } else {
           resolve(r.Value)
         }
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get categories
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of workorder category code descriptions
   */
  getCategories() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/Categories', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
