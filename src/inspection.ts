import { CWError } from './error'
const _ = require('lodash')

export class Inspection {
  cw: any;

  /**
   * Construct activity link object for Inspection functions
   *
   * @param {Object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
   * @return {Object} Returns object that is this module
   */
  constructor(cw) {
    this.cw = cw;
  }

  /**
   * Create new inspection with data
   *
   * @param {Object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns Promise that represents an object describing the newly-created inspection
   */
  create(insp_data: Object) {
    return new Promise((resolve, reject) => {
      if(!_.has(insp_data, 'EntityType') || !_.has(insp_data, 'InspTemplateId')) {
        reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
      } else {
        this.cw.runRequest('Ams/Inspection/Create', insp_data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      }
    });
  }

  /*
   * Create inspections from an array of entities
   * (TODO: what array of entities)
   *
   * @param {Object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns Promise that represents a collection of objects describing the newly-created inspections
   */
   createFromEntities(insp_data: Object) {
    return new Promise((resolve, reject) => {
     if(!_.has(insp_data, 'EntityType') || !_.has(insp_data, 'InspTemplateId')) {
       reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
     } else {
       this.cw.runRequest('Ams/Inspection/CreateFromEntities', insp_data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     }
    });
  }

  /*
   * Create an inspection from a parent inspection (TODO: what parent!?)
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the newly-created inspection
   */
   createFromParent(insp_data: Object) {
    return new Promise((resolve, reject) => {
      // see if it's just InspectionId
     if(!_.has(insp_data, 'EntityType') || !_.has(insp_data, 'InspTemplateId') || !_.has(insp_data, 'InspectionId')) {
       reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
     } else {
       this.cw.runRequest('Ams/Inspection/CreateFromParent', insp_data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     }
    });
  }

  /*
   * Create an inspection from a service request
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the newly-created inspection
   */
   createFromServiceRequest(insp_data: Object) {
    return new Promise((resolve, reject) => {
     if(!_.has(insp_data, 'EntityType') || !_.has(insp_data, 'InspTemplateId') || !_.has(insp_data, 'RequestId')) {
       reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
     } else {
       this.cw.runRequest('Ams/Inspection/CreateFromServiceRequest', insp_data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     }
    });
  }

  /*
   * Create an inspection from a work order
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the newly-created inspection
   */
   createFromWorkOrder(insp_data: Object) {
    return new Promise((resolve, reject) => {
      // Are they  both actually required?!?!
      // WorkOrderId
      // WorkOrderSid ...do with only SID first then check
     if(!_.has(insp_data, 'EntityType') || !_.has(insp_data, 'InspTemplateId') || !_.has(insp_data, 'WorkOrderSid')) {
       reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
     } else {
       this.cw.runRequest('Ams/Inspection/CreateFromWorkOrder', insp_data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     }
    });
  }

  /**
   * Update an inspection with data
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the updated inspection
   */
  update(insp_data: Object) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        if(!_.has(insp_data, 'InspectionId')) {
          reject(new CWError(1, 'InspectionId must be provided.', {'provided': insp_data}));
        } else {
          this.cw.runRequest('Ams/Inspection/Update', insp_data).then(r => {
            resolve(r.Value);
          }).catch(e => {
            reject(e);
          });
        }
      });
    });
  }

  /**
   * Get an inspection by ID
   *
   * @param {number} inspectionId - The inspection ID to retrieve
   * @return {Object} Returns Promise that represents an object describing the inspection
   */
  getById(inspectionId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionId: inspectionId
      }
      this.cw.runRequest('Ams/Inspection/ById', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get inspections by array of IDs
   *
   * @param {number} inspectionId - The inspection ID to retrieve
   * @return {Object} Returns Promise that represents a collection of Objects describing the inspections
   */
  getByIds(inspectionIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionIds: inspectionIds
      }
      this.cw.runRequest('Ams/Inspection/ByIds', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Cancel inspections
   *
   * @param {Array<number>} inspectionIds - An array of the IDs to cancel the matched inspections
   * @param {string} [cancelReason] - A reason for cancelling the inspection(s)
   * @param {datetime} [dateCancelled] - The date/time that it should be indicated the inspection was cancelled
   * @return {Object} Returns object that represents a collection of inspections
   */
   cancel(inspectionIds: Array<number>, cancelReason?: string, dateCancelled?: Date) {
     return new Promise((resolve, reject) => {
       var m = new Date();
       var data: {InspectionIds: Array<number>, CancelReason?: string, DateCancelled?: Date} = { InspectionIds: inspectionIds };
       if(typeof(cancelReason)!=='undefined') {
         data.CancelReason = cancelReason;
       }
       if(typeof(dateCancelled)!=='undefined') {
         data.DateCancelled = dateCancelled;
       }
       this.cw.runRequest('Ams/Inspection/Cancel', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

   /**
    * Close inspections
    *
    * @param {Array<number>} inspectionIds - An array of the IDs to close the matched inspections
    * @return {Object} Returns object that represents a collection of inspections
    */
    close(inspectionIds: Array<number>) {
      return new Promise((resolve, reject) => {
        var data = {
          InspectionIds: inspectionIds
        };
        this.cw.runRequest('Ams/Inspection/Close', data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      });
    }

  /**
   * Delete inspections
   *
   * @param {Array<number>} inspectionIds - An array of the IDs to delete the matched inspections
   * @return {Object} Returns object that represents a collection of inspection Ids which have been deleted
   */
   delete(inspectionIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         InspectionIds: inspectionIds
       };
       this.cw.runRequest('Ams/Inspection/Delete', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

 /**
  * Reopen inspections
  *
  * @param {Array<number>} inspectionIds - An array of the IDs to reopen the matched inspections
  * @return {Object} Returns object that represents a collection of inspection Ids which have been deleted
  */
  reopen(inspectionIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionIds: inspectionIds
      };
      this.cw.runRequest('Ams/Inspection/Reopen', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Search for inspections
   *
   * @param {Object} searchData - An array of the IDs to retrieve the matched inspections, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/Inspection
   * @return {Object} Returns object that represents an array of the matching inspection IDs
   */
  search(searchData: Object) {
    return new Promise((resolve, reject) => {
      var data = searchData;
      this.cw.runRequest('Ams/Inspection/Search', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get list of statuses
   *
   * @return {Object} Returns object that represents an array of all possible statuses for an Inspection
   */
  statuses() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/Statuses', {}).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get inspection submit to list
   *
   * @param {boolean} [includeInactiveEmployees] - whether to include inactive employees in the return. Defaults to false.
   * @param {boolean} [domainIds] - which domains to include in the return, default to All domains
   * @return {Object} Returns object that represents a collection of all possible employees for an Inspection's SubmitTo
   */
  submitTos(includeInactiveEmployees: boolean = false, domainIds?: Array<number>) {
    return new Promise((resolve, reject) => {
      var data: {IncludeInactiveEmployees?: boolean, DomainIds?: Array<number>} = {};
      if(includeInactiveEmployees) {
        data.IncludeInactiveEmployees = true;
      }
      if(typeof(domainIds)!=='undefined') {
        data.DomainIds = domainIds;
      }
      this.cw.runRequest('Ams/Inspection/SubmitTos', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }


  /**
   * Add an entity to an existing inspection
   * This method requires an Entity/Asset to be specified. You can either specify the Entity Type and its UID or a WorkOrderEntityBase Object.
   * @param {Object} entity - Either of two attribute combinations are valid: entityType & entityUid OR Entity as a fully-inflated WorkOrderEntity (WorkOrderEntityBase) object.
   * @param {number} inspectionId - An Inspection ID to attach the entity/asset to.
   * @param {boolean} updateXY - Provide a boolean to whether the inspection's X/Y coordinates should be updated. Default is true.
   * @param {Object} facility - Add Facility_Id for the Facility Identifier and Level_id for the Facility Level Identifier. Defaults to empty so that no facility is specified.
   * @return {Object} Returns object that represents an object which describes an Inspection Entity
   */
  connectAsset(entity: {EntityType?: string, EntityUid?: string, Entity?: Object}, inspectionId: number, updateXY: boolean = true, facility: {Facility_Id?: string, Level_Id?: string} = {}) {
   return new Promise((resolve, reject) => {
     var data: {InspectionId: number, EntityType?: string, EntityUid?: string, Entity?: Object, Facility_Id?: string, Level_Id?: string} = {
       InspectionId: inspectionId
     };
     if(_.has(entity, 'EntityType') && _.has(entity, 'EntityUid')) {
       data.EntityType = entity.EntityType;
       data.EntityUid = entity.EntityUid;
     } else if(_.has(entity, 'Entity')) {
       data.Entity = entity.Entity;
     } else {
       // Throw error, no entity/asset provided
     }
     if(_.has(facility, 'Facility_Id')) {
       data.Facility_Id = facility.Facility_Id;
     }
     if(_.has(facility, 'Level_Id')) {
       data.Level_Id = facility.Level_Id;
     }
     this.cw.runRequest('Ams/Inspection/AddEntity', data).then(r => {
       resolve(r.Value);
     }).catch(e => {
       // 4 NotAuthorizedToUpdateInspection
       // 9 InvalidActivityMapLogicXY
       // 21 ErrorUnknownEntityType
       // 30 InvalidField
       // 60 WarningItemNotFound
       // 68 MoveInvalidCityworksWkid
       reject(e);
     });
   });
  }

  /**
   * Get the answers for inspections
   *
   * @param {Array<number>} inspections - An Array of one or more Inspection IDs
   * @return {Object} Returns Promise that represents a collection of Inspection Answers
   */
  getAnswers(inspections: Array<number>) {
    return new Promise((resolve, reject) => {
      var data: {InspectionId?: number, InspectionIds?: Array<number>} = {}
      if(inspections.length==0) {
        data.InspectionId = inspections[0]
      } else {
        data.InspectionIds = inspections
      }
      this.cw.runRequest('Ams/Inspection/Answers', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the audit log for a specific Inspection
   *
   * @param {number} inspectionId - An Inspection ID to get the audit log for
   * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
   */
  getAuditLog(inspectionId: number) {
    return new Promise((resolve, reject) => {
      var data = {InspectionId: inspectionId}
      this.cw.runRequest('Ams/Inspection/AuditLog', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Create a search definition. Save the definition by setting SaveDefinition = true and supplying a SearchName.
   *
   * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/Inspection
   * @param {number} [searchName] - What to name your search (if it should be saved)
   * @param {number} [sharedWithin] - What group or domain to share the search to.
   * @param {boolean} saveDefinition - Whether or not to save the search definition. Defaults to true when a search name is specified.
   * @param {boolean} enableEurl - Whether or not to enable EURL for the saved search. Defaults to true.
   * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
   */
  createSearchDefinition(searchData: Object, searchName?: string, sharedWithin?: number, saveDefinition: boolean = true, enableEurl: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = searchData
      if(_.isString(searchName)) {
        _.set(data, 'SearchName', searchName)
        _.set(data, 'SaveDefinition', saveDefinition)
        _.set(data, 'EnableEurl', enableEurl)
        // not sure how to handle sharedWithin...
        // _.set(data, 'SharedWithin', sharedWithin)
      }
      this.cw.runRequest('Ams/Inspection/CreateSearchDefinition', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cycle from
   *
   * @return {Object} Returns Promise that represents ... I have no idea what this endpoint does
   */
  getCycleFrom() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/CycleFrom', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cycle intervals
   *
   * @return {Object} Returns Promise that represents a Dictionary of the cycle intervals available
   */
  getCycleIntervals() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/CycleIntervals', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cycle types
   *
   * @return {Object} Returns Promise that represents a Dictionary of the cycle types available
   */
  getCycleTypes() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/CycleTypes', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get districts
   *
   * @return {Object} Returns Promise that represents an Array of the districts
   */
  getDistricts() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/Districts', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Get cycle types
   *
   * @return {Object} Returns Promise that represents a Dictionary of the cycle types available
   */
  cycleIntervals() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/CycleTypes', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Move inspection by InspectionId. Must provide well known id (WKID) or well known text (WKT)
   *
   * @param {number} inspectionId - The ID of the inspection that should be moved
   * @param {number} x - The X coordinate for the move
   * @param {number} y - The Y coordinate for the move
   * @param {Object} projection_info - An object which must include either WKID: Int32 or WKT: String. Can also include VcsWKID.
   * @param {number} [z] - the optional z coordinate for the move
   * @return {Object} Returns Promise that represents a Dictionary of the cycle types available
   */
  move(inspectionId: number, x: number, y: number, projection_info?: Object, z?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionId: inspectionId,
        x: x,
        y: y
      }
      if(typeof z != 'undefined') {
        _.set(data, 'z', z)
      }
      if(typeof projection_info != 'undefined') {
        if(_.has(projection_info, 'WKID')) {
          _.set(data, 'WKID', _.get(projection_info, 'WKID'))
        } else if(_.has(projection_info, 'WKT')) {
          _.set(data, 'WKT', _.get(projection_info, 'WKT'))
        }

        if(_.has(projection_info, 'VcsWKID')) {
          _.set(data, 'VcsWKID', _.get(projection_info, 'VcsWKID'))
        }
      }
      this.cw.runRequest('Ams/Inspection/Move', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /////
  // INSPECTION TEMPLATES
  /////

  /**
   * Get inspection templates
   *
   * @param {Array<string>} [entityTypes] - The Entity Type(s) to return potential inspections for
   * @param {boolean} [canCreate] - If true, only return templates the user can create, ignored if false or null, default is true
   * @param {Object} [options] - An object which can include: [IncludeInactive]: boolean, MaximumDateModified: Date, MinimumDateModified: Date, TemplateIds: Array<number>
   * @return {Object} Returns Promise that represents a collection of all possible employees for an Inspection's SubmitTo
   */
  getTemplates(entityTypes?: Array<string>, canCreate?: boolean, options?: {IncludeInactive?: boolean, MaximumDateModified?: Date, MinimumDateModified?: Date, TemplateIds?: Array<number>}) {
    return new Promise((resolve, reject) => {
      var data: {EntityTypes?: Array<string>, CanCreate?: boolean, IncludeInactive?: boolean, MaximumDateModified?: Date, MinimumDateModified?: Date, TemplateIds?: Array<number>} = {};
      if(typeof(entityTypes)!=='undefined') {
        data.EntityTypes = entityTypes;
      }
      data.CanCreate = typeof(canCreate)!=='undefined' ? canCreate : true;
      if(typeof(options)==='object') {
        _.forIn(options, (v, k) => {
          data[k] = v;
        });
      }
      this.cw.runRequest('Ams/InspectionTemplate/Templates', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get a list of templates by IDs
   *
   * @param {Array<number>} inspectionIds - An array of the IDs to retrieve the matched inspections
   * @param {Object} [options] - An object which can include: [IncludeInactive]: boolean, MaximumDateModified: Date, MinimumDateModified: Date, TemplateIds: Array<number>
   * @return {Object} Returns object that represents an object describing the inspection
   */
  getTemplatesByIds(inspTemplateIds: Array<number>, options?: {MaximumDateModified?: Date, MinimumDateModified?: Date}) {
    return new Promise((resolve, reject) => {
      var data = {
        InspTemplateIds: inspTemplateIds
      }
      if(typeof(options)==='object') {
        _.forIn(options, (v, k) => {
          data[k] = v;
        });
      }
      this.cw.runRequest('Ams/InspectionTemplate/ByIds', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get entity types for inspection template(s)
   *
   * @param {Array<number>} inspTemplateIds - An array of the IDs to reopen the matched inspections
   * @return {Object} Returns object that represents an array of Entity Types
   */
   getTemplateEntityTypes(inspTemplateIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         InspTemplateIds: inspTemplateIds
       };
       this.cw.runRequest('Ams/InspectionTemplate/EntityTypes', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

  /**
  * Get the questions and answers for inspection template(s)
  *
  * @param {Array<number>} inspTemplateIds - An array of the IDs to reopen the matched inspections
  * @return {Object} Returns object that represents an array which contains a list of InspQuestionPanel for the template
  */
  getQA(inspTemplateIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        InspTemplateIds: inspTemplateIds
      };
      this.cw.runRequest('Ams/InspectionTemplate/QA', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get inspection template question conditions
   *
   * @param {Array<number>} inspTemplateIds - An array of template IDs to get the matched inspection template Question conditions for
   * @return {Object} Returns object that represents an array which contains a dictionary of InspQuestion IDs to configs
   */
   getQConditions(inspTemplateIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         InspTemplateIds: inspTemplateIds
       };
       this.cw.runRequest('Ams/InspectionTemplate/QuestionConditions', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }


  // Attachments

  // AddInspectionAttachment InspAttachment
  // Add an inspection attachment
  // Request Parameters
  // Int32 AttachmentType V15_4
  // String Comments
  // String Filename
  // Int32 req InspectionId
  // Ams/Attachments/AddInspectionAttachment?data={
  //   "Comments": null,
  //   "Filename": null,
  //   "InspectionId": null,
  //   "AttachmentType": null
  // }

  /**
   * Delete inspection attachments
   *
   * @param {Array<number>} attachmentIds - An array of inspection attachment IDs to delete
   * @return {Object} Returns object that represents a boolean for action resolution
   */
   deleteAttachments(attachmentIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         AttachmentIds: attachmentIds
       };
       this.cw.runRequest('Ams/Attachments/DeleteInspectionAttachments', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

  /**
   * Download an inspection attachment
   *
   * @param {number} attachmentId - ID of an inspection attachment to download
   * @return {Object} Returns object that represents a file stream
   */
   downloadAttachment(attachmentId: number) {
     return new Promise((resolve, reject) => {
       var data = {
         AttachmentId: attachmentId
       };
       this.cw.runRequest('Ams/Attachments/DownloadInspectionAttachment', data).then(r => {
         // TODO, pass file through // resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

  /**
   * Get inspection attachment by ID
   *
   * @param {number} attachmentId - An attachment ID to get info for
   * @return {Object} Returns object that represents an object that describes the matched inspection attachment
   */
   getAttachmentById(attachmentId: number) {
     return new Promise((resolve, reject) => {
       var data = {
         AttachmentId: attachmentId
       };
       this.cw.runRequest('Ams/Attachments/InspectionAttachmentById', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

  /**
   * Get inspection attachment by ID
   *
   * @param {Array<number>} inspectionIds - An array of inspection IDs to get attachments for
   * @return {Object} Returns object that represents a collection of attachments from the matched inspections
   */
   getAttachments(inspectionIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         InspectionIds: inspectionIds
       };
       this.cw.runRequest('Ams/Attachments/InspectionAttachments', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }
}
