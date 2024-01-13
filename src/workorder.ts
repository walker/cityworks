import { CWError } from './error'
const _ = require('lodash')


export class WorkOrder {
  /**
   * @hidden
   */
  cw: any

  /**
   * WorkOrder Administration methods
   */
  admin: any

  /**
   * WorkOrder Costing methods
   */
  costs: any

  /**
   * WorkOrder Comments methods
   */
  comment: any

  /**
   * WorkOrder Comments methods
   */
  attachments: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.admin
    this.comment
    this.attachments
  }

  /**
   * Create new workorders, including linkin to Requests & Inspections (optionally)
   *
   * @category WorkOrders
   * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
   * @param {Array<number>} [inspectionIds] - The inspection IDs which the workorder should be linked to.
   * @param {Array<number>} [requestIds] - The inspection IDs which the workorder should be linked to.
   * @return {Object} Returns Promise that represents an object describing the newly-created workorder
   */
  create(wo_data: Object, inspectionIds?: Array<number>, requestIds?: Array<number>) {
    return new Promise((resolve, reject) => {
      if(!_.has(wo_data, 'WOTemplateId') || !_.has(wo_data, 'EntityType')) {
        reject(new CWError(2, 'WOTemplateId & EntityType must be provided.', {'provided': wo_data}))
      } else {
        var data = wo_data;
        if(typeof inspectionIds != 'undefined' && inspectionIds != null && !_.has(data, 'InspectionIds')) {
          _.set(data, 'InspectionIds', inspectionIds);
        }
        if(typeof requestIds != 'undefined' && requestIds != null && !_.has(data, 'RequestIds')) {
          _.set(data, 'RequestIds', requestIds);
        }
        this.cw.runRequest('Ams/WorkOrder/Create', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Create new workorder linked to parent workorder
   *
   * @category WorkOrders
   * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
   * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
   * @return {Object} Returns Promise that represents an object describing the newly-created workorder
   */
  createFromParent(wo_data: Object, workOrderSId: string|number, s: boolean = true) {
    return new Promise((resolve, reject) => {
      if(!_.has(wo_data, 'WOTemplateId') || !_.has(wo_data, 'EntityType')) {
        reject(new CWError(2, 'WOTemplateId & EntityType must be provided.', {'provided': wo_data}))
      } else {
        var data = wo_data;
        if(_.isString(workOrderSId)) {
          _.set(data, 'WorkOrderId', workOrderSId)
        } else {
          _.set(data, 'WorkOrderSid', workOrderSId)
        }
        this.cw.runRequest('Ams/WorkOrder/Create', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Update a WorkOrder
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
   * Combine WorkOrders
   *
   * @category WorkOrders
   * @param {Array<string>} fromWorkOrderIds - The workorder IDs which should be combined.
   * @param {string} toWorkOrderId - The WorkOrder ID for the single WorkOrder that should contain the info/entities from the other WorkOrders
   * @param {boolean} cancelCombinedWorkOrders - If the WorkOrders combined into the single should then be canceled, default is true.
   * @return {Object} Returns object that represents a collection of WorkOrders
   */
   combine(fromWorkOrderIds: Array<string>, toWorkOrderId: string, cancelCombinedWorkOrders: boolean = true) {
     return new Promise((resolve, reject) => {
       var data = {
         CancelCombinedWorkOrders: cancelCombinedWorkOrders,
         ToWorkOrderId: toWorkOrderId,
         FromWorkOrderIds: fromWorkOrderIds
       }
       this.cw.runRequest('Ams/WorkOrder/Combine', data).then(r => {
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
   * Move a workorder's point
   *
   * @category WorkOrders
   * @param {string} workOrderId
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include WKT or WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated workorder
   */
  move(workOrderId: string, x: number, y: number, projection: Object, z?: number) {
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
      if(typeof(z)!='undefined') {
        _.set(base_data, 'z', z)
      }
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
   * @param {string|number} workOrderSId - The S/ID of the workorder to retrieve. # for SID, string for ID.
   * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
   * @return {Object} Returns Promise that represents an object describing the workorder
   */
  getById(workOrderSId: string|number, s: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(_.isString(workOrderSId)) {
        _.set(data, 'WorkOrderId', workOrderSId)
        var path = 'Ams/WorkOrder/ById';
      } else {
        _.set(data, 'WorkOrderSid', workOrderSId)
        var path = 'Ams/WorkOrder/BySid';
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
   * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. If providing WorkOrderID, should be all strings, else provide all numbers for WorkOrderSID
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  getByIds(workOrderSIds: Array<string|number>) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(workOrderSIds.length==0) {
        // throw error
        reject(new CWError(101, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
      } else {
        var path = 'Ams/WorkOrder/ByIds';
        if(_.isString(workOrderSIds[0])) {
          _.set(data, 'WorkOrderIds', workOrderSIds)
          path = 'Ams/WorkOrder/ByIds';
        } else if(_.isNumber(workOrderSIds[0])) {
          _.set(data, 'WorkOrderSids', workOrderSIds)
          path = 'Ams/WorkOrder/BySids';
        } else {
          // throw error - was not number or string
          reject(new CWError(9, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
        }
        this.cw.runRequest(path, data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Get instructions by an array of workorders S/IDs
   *
   * @category WorkOrders
   * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. If providing WorkOrderID, should be all strings, else provide all numbers for WorkOrderSID
   * @return {Object} Returns Promise that represents an array of String, String describing the workorder instructions
   */
  getInstructions(workOrderSIds: Array<string|number>) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(workOrderSIds.length==0) {
        // throw error
        reject(new CWError(102, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
      } else {
        var path = 'Ams/WorkOrder/ByIds';
        if(_.isString(workOrderSIds[0])) {
          _.set(data, 'WorkOrderIds', workOrderSIds)
          path = 'Ams/WorkOrder/InstructionsByWorkOrderIds';
        } else if(_.isNumber(workOrderSIds[0])) {
          _.set(data, 'WorkOrderSids', workOrderSIds)
          path = 'Ams/WorkOrder/InstructionsByWorkOrderSids';
        } else {
          // throw error - was not number or string
          reject(new CWError(9, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
        }
        this.cw.runRequest(path, data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Get the audit log for a specific workorder
   *
   * @category WorkOrders
   * @param {number} workOrderSId - A WorkOrder S/ID to get the audit log for. SID is default.
   * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
   */
  getAuditLog(workOrderSId: number) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(_.isString(workOrderSId)) {
        _.set(data, 'WorkOrderId', workOrderSId)
      } else if(_.isNumber(workOrderSId)) {
        _.set(data, 'WorkOrderSid', workOrderSId)
      } else {
        // throw error - was not number or string
        reject(new CWError(9, 'Workorder S/IDs was not provided.', {'workorderSId': workOrderSId}))
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
   * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. #s for SID, strings for ID.
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  getCustomFieldValues(workOrderSIds: Array<string|number>) {
    return new Promise((resolve, reject) => {
      var data = {}
      var path = 'Ams/WorkOrder/CustomFields';
      if(_.isString(workOrderSIds[0])) {
        _.set(data, 'WorkOrderIds', workOrderSIds)
        var path = 'Ams/WorkOrder/CustomFields';
      } else if(_.isNumber(workOrderSIds[0])) {
        _.set(data, 'WorkOrderSids', workOrderSIds)
        var path = 'Ams/WorkOrder/CustomFieldsByWorkOrderSids';
      } else {
        // throw error - was not number or string
        reject(new CWError(9, 'No workorder S/IDs were provided.', {'workorderSIds': workOrderSIds}))
      }
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get entities on an existing WorkOrder
   *
   * @category WorkOrders
   * @param {Array<string|number>} workOrderSIds - The workorder S/IDs which the entities should be added to. # for SID, string for ID.
   * @param {boolean} getGisData - Query gis to populate Entity.Attributes with current gis data. Defaults to true.
   * @return {Object} Returns object that represents a list of entities removed.
   */
  getEntities(workOrderSIds: Array<string|number>, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {
        GetGisData: getGisData
      }
      if(workOrderSIds.length==0) {
        // throw error
        reject(new CWError(11, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
      } else {
        if(_.isString(workOrderSIds[0])) {
          _.set(data, 'WorkOrderIds', workOrderSIds)
        } else if(_.isNumber(workOrderSIds[0])) {
          _.set(data, 'WorkOrderSids', workOrderSIds)
        } else {
          reject(new CWError(12, 'No workorder S/IDs were provided.', {'workorderSId': workOrderSIds}))
        }
      }
      this.cw.runRequest('Ams/WorkOrder/Entities', data).then(r => {
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
   * Add entities to an existing WorkOrder
   *
   * @category WorkOrders
   * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
   * @param {Object} entityInfo - Entity info object including: (req) EntityType: {string}, (req) EntityUids: {Array<string>}, Facility_Id: {string}, Level_Id: {string}
   * @param {boolean} updateXY - Update WorkOrder xy after adding entit(y|ies), default is true.
   * @return {Object} Returns object that represents a list of entities removed.
   */
   addEntities(workOrderSId: string|number, entityInfo: Object, updateXY: boolean = true) {
     return new Promise((resolve, reject) => {
       var data = {
         UpdateXY: updateXY
       }
       if(_.isString(workOrderSId)) {
         _.set(data, 'WorkOrderId', workOrderSId)
       } else {
         _.set(data, 'WorkOrderSid', workOrderSId)
       }
       if(_.has(entityInfo, 'Facility_Id'))
         _.set(data, 'Facility_Id', _.get(entityInfo, 'Facility_Id'))
       if(_.has(entityInfo, 'Level_Id'))
         _.set(data, 'Level_Id', _.get(entityInfo, 'Level_Id'))
       if(_.has(entityInfo, 'EntityUids') && _.has(entityInfo, 'EntityType')) {
         _.set(data, 'EntityUids', _.get(entityInfo, 'EntityUids'))
         _.set(data, 'EntityType', _.get(entityInfo, 'EntityType'))
       } else {
         reject(new CWError(7, 'No entity info was provided.', {'workorderSId': workOrderSId,'entityInfo': entityInfo}))
       }

       this.cw.runRequest('Ams/WorkOrder/AddEntities', data).then(r => {
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
    * Update a WorkOrder entity
    *
    * @category WorkOrders
    * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
    * @param {Object} entityInfo - Entity info object including: (req) EntityType: {string}, (req) EntityUid: {string}, Facility_Id: {string}, Level_Id: {string}
    * @param {boolean} workComplete - Update WorkOrder completeness, default is true.
    * @return {Object} Returns object that represents a list of entities removed.
    */
    updateEntity(workOrderSId: string|number, entityInfo: Object, workComplete: boolean = false) {
      return new Promise((resolve, reject) => {
        var data = {
          WorkComplete: workComplete
        }
        if(_.isString(workOrderSId)) {
          _.set(data, 'WorkOrderId', workOrderSId)
        } else {
          _.set(data, 'WorkOrderSid', workOrderSId)
        }
        if(_.has(entityInfo, 'Facility_Id'))
          _.set(data, 'Facility_Id', _.get(entityInfo, 'Facility_Id'))
        if(_.has(entityInfo, 'Level_Id'))
          _.set(data, 'Level_Id', _.get(entityInfo, 'Level_Id'))
        if(_.has(entityInfo, 'EntityUids') && _.has(entityInfo, 'EntityType')) {
          _.set(data, 'EntityUid', _.get(entityInfo, 'EntityUid'))
          _.set(data, 'EntityType', _.get(entityInfo, 'EntityType'))
        } else {
          reject(new CWError(7, 'No entity info was provided.', {'workorderSId': workOrderSId,'entityInfo': entityInfo}))
        }

        this.cw.runRequest('Ams/WorkOrder/UpdateEntity', data).then(r => {
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
   * Remove entities from a WorkOrder. Provide WorkOrderId and either ObjectIds or EntityType and EntityUids
   *
   * @category WorkOrders
   * @param {number} workOrderSId - The workorder S/ID which the entities should be removed from. # for SID, string for ID.
   * @param {Object} entityInfo - Remove entities by WorkOrderEntity.ObjectId (not gis objectId).
   * @param {boolean} updateXY - Update WorkOrder xy after removing entities, default is true.
   * @return {Object} Returns object that represents a list of entities removed.
   */
   removeEntities(workOrderSId: string|number, entityInfo: Object, updateXY: boolean = true) {
     return new Promise((resolve, reject) => {
       var data = {
         UpdateXY: updateXY
       }
       if(_.isString(workOrderSId)) {
         _.set(data, 'WorkOrderId', workOrderSId)
       } else {
         _.set(data, 'WorkOrderSid', workOrderSId)
       }
       if(_.has(entityInfo, 'ObjectIds')) {
         _.set(data, 'ObjectIds', _.get(entityInfo, 'ObjectIds'))
       } else if(_.has(entityInfo, 'EntityUids') && _.has(entityInfo, 'EntityType')) {
         _.set(data, 'EntityUids', _.get(entityInfo, 'EntityUids'))
         _.set(data, 'EntityType', _.get(entityInfo, 'EntityType'))
       } else {
         reject(new CWError(8, 'No entity info was provided.', {'workorderSId': workOrderSId,'entityInfo': entityInfo}))
       }

       this.cw.runRequest('Ams/WorkOrder/RemoveEntities', data).then(r => {
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
    * Get WorkOrderS/IDs connected to provided entities
    *
    * @category WorkOrder Search
    * @param {string} entityType - The entity type to find connected WorkOrders
    * @param {Array<string>} entityUIDs - The list of entities to search for connected WorkOrders
    * @param {boolean} s - Get WorkOrderSids. Defaults to true. When false, returned list is WorkOrderIds
    * @param {Object} [search] - Any additional search properties of the WorkOrder (open/closed, etc)
    * @return {Object} Returns Promise that represents an array of WorkOrderS/IDs
    */
   getWOsByEntities(entityType: string, entityUids: Array<string>, search?: Array<string|number>, s: boolean = true) {
     return new Promise((resolve, reject) => {
       var data = {}
       if(typeof(search)!='undefined') {
         _.merge(data, search)
       }
       if(!_.has(data, 'EntityType')) {
         _.set(data, 'EntityType', entityType)
       }
       if(!_.has(data, 'EntityUids')) {
         _.set(data, 'EntityUids', entityUids)
       }
       var path = 'Ams/WorkOrder/SearchForSids'
       if(!s) {
         path = 'Ams/WorkOrder/Search'
       }
       this.cw.runRequest(path, data).then(r => {
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
    * Get WorkOrderSid and description for provided WorkOrderId
    *
    * @category WorkOrder Search
    * @param {string} workOrderId - The WorkOrderId for which to get the WorkOrderSid and description
    * @return {Object} Returns Promise that represents an object with WorkOrderS/IDs & Description
    */
   getSearchList(workOrderId: string) {
     return new Promise((resolve, reject) => {
       var data = {}
       _.set(data, 'WorkOrderId', workOrderId)
       this.cw.runRequest('Ams/WorkOrder/SearchObject', data).then(r => {
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
    * Get WorkOrder Employee lists
    *
    * @category WorkOrder Options
    * @param {string} listType - Which list (endpoint) to get. Includes Supervisors & SubmitTos.
    * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
    * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
    * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
    */
   getEmployeeLists(listType: string, includeInactiveEmployees: boolean = false, domainIds?: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         IncludeInactiveEmployees: includeInactiveEmployees
       }
       if(typeof(domainIds)!='undefined' && domainIds!=null) {
         _.set(data, 'DomainIds', domainIds)
       }
       if(!_.includes(['Supervisors', 'SubmitTos'], listType)) {
         reject(new CWError(2, 'listType must be either SubmitTos or Supervisors.', {'provided': listType}))
       } else {
         this.cw.runRequest(`Ams/WorkOrder/${listType}`, data).then(r => {
           resolve(r.Value)
         }).catch(e => {
           reject(e)
         })
       }
     })
   }

   /**
    * Get SubmitTo list
    *
    * @category WorkOrder Options
    * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
    * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
    * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
    */
   getSubmitTos(includeInactiveEmployees: boolean = false, domainIds?: Array<number>) {
     return this.getEmployeeLists('SubmitTos', includeInactiveEmployees, domainIds);
   }

   /**
    * Get Supervisors list
    *
    * @category WorkOrder Options
    * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
    * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
    * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
    */
   getSupervisors(includeInactiveEmployees: boolean = false, domainIds?: Array<number>) {
     return this.getEmployeeLists('Supervisors', includeInactiveEmployees, domainIds);
   }

   /**
    * Get Status Options
    *
    * @category WorkOrder Options
    * @return {Object} Returns Promise that represents a collection of codes. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CodeDesc
    */
   getStatuses() {
     return new Promise((resolve, reject) => {
       this.cw.runRequest('Ams/WorkOrder/Statuses', {}).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get Categories
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of configured workorder category code descriptions
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

  /**
   * Get Priorities
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of configured workorder priorities
   */
  getPriorities() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/Priorities', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Cycle From
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of string/string Cycle From options for workorders
   */
  getCycleFrom() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/CycleFrom', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Cycle Intervals
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of string/string Cycle Interval options for workorders
   */
  getCycleIntervals() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/CycleIntervals', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Cycle Types
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of string/string Cycle Type options for workorders
   */
  getCycleTypes() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/CycleTypes', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get WorkOrder Stages
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of string/string Stage options for WorkOrders
   */
  getStages() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/Stages', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Expense Types
   *
   * @category WorkOrder Options
   * @return {Object} Returns Promise that represents an array of string/string Expense Type options for workorders
   */
  getExpenseTypes() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/WorkOrder/ExpenseTypes', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Map Layer Fields
   *
   * @category WorkOrders
   * @param {string} workOrderSId - The workorder S/ID to get the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  getMLFs(workOrderSId: string) { // |number
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderId: workOrderSId
      }
      var path = 'Ams/TemplateMapLayer/WorkOrderInstanceMapLayersByWorkOrderId';
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update Map Layer Fields
   *
   * @category WorkOrders
   * @param {string} workOrderSId - The workorder S/ID to get the map layer fields for.
   * @param {number} x
   * @param {number} y
   * @param {number} domainId - Should include WKT or WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents a ...
   */
    updateMLFs(workOrderSId: string, x?: number, y?: number, domainId?: number, z?: number) { // |number
      return new Promise((resolve, reject) => {
        var data = {}
        var path = 'Ams/TemplateMapLayer/UpdateWorkOrderInstanceMapLayers';
        if(_.isString(workOrderSId)) {
          _.set(data, 'WorkOrderId', workOrderSId)
        } else if(_.isNumber(workOrderSId)) {
          _.set(data, 'WorkOrderSid', workOrderSId)
        } else {
          // throw error - was not number or string
          reject(new CWError(9, 'No workorder S/ID was provided.', {'workorderSId': workOrderSId}))
        }
        if(_.isNumber(x)) {
          _.set(data, 'X', x)
        }
        if(_.isNumber(y)) {
          _.set(data, 'Y', y)
        }
        if(_.isNumber(z)) {
          _.set(data, 'Z', z)
        }
        if(_.isNumber(domainId)) {
          _.set(data, 'DomainId', domainId)
        }
        this.cw.runRequest(path, data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

  /**
   * Delete Map Layer Fields
   *
   * @category WorkOrders
   * @param {string} workOrderSId - The workorder S/ID to delete the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
   */
  deleteMLFs(workOrderSId: string) { // |number
    return new Promise((resolve, reject) => {
      var data = {
        WorkOrderId: workOrderSId
      }
      var path = 'Ams/TemplateMapLayer/DeleteWorkOrderInstancesByWorkOrderId';
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
