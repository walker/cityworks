import { CWError } from './error'
const _ = require('lodash')

export class Inspection {
  cw: any;

  /**
   * Construct activity link object for Inspection functions
   *
   * @param {object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
   * @return {Object} Returns object that is this module
   */
  constructor(cw) {
    this.cw = cw;
  }

  /**
   * Create new inspection with data
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the newly-created inspection
   */
  create(insp_data: object) {
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
   * Get an inspection by id
   *
   * @param {number} inspectionId - The inspection ID to retrieve
   * @return {Object} Returns object that represents an object describing the inspection
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

  /////
  // INSPECTION TEMPLATES
  /////

  /**
   * Get inspection templates
   *
   * @param {Array<string>} [entityTypes] - The Entity Type(s) to return potential inspections for
   * @param {boolean} [canCreate] - If true, only return templates the user can create, ignored if false or null, default is true
   * @param {Object} [options] - An object which can include: [IncludeInactive]: boolean, MaximumDateModified: Date, MinimumDateModified: Date, TemplateIds: Array<number>
   * @return {Object} Returns object that represents a collection of all possible employees for an Inspection's SubmitTo
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

  // DeleteInspectionAttachments
  // Delete inspection attachments
  // Request Parameters
  // List<Int32> req AttachmentIds
  // Ams/Attachments/DeleteInspectionAttachments?data={
  //   "AttachmentIds": null
  // }

  // DownloadInspectionAttachment
  // Download an inspection attachment
  // Request Parameters
  // Int32 req AttachmentId
  // Ams/Attachments/DownloadInspectionAttachment?data={
  //   "AttachmentId": null
  // }

  // InspectionAttachmentById InspAttachment
  // Get an inspection attachment by id
  // Request Parameters
  // Int32 req AttachmentId
  // Ams/Attachments/InspectionAttachmentById?data={
  //   "AttachmentId": null
  // }

  // InspectionAttachments List<InspAttachment>
  // Get inspections attachments
  // Request Parameters
  // List<Int32>reqInspectionIds
  // Ams/Attachments/InspectionAttachments?data={
  //     "InspectionIds": null
  // }
}
