import { CWError } from './error'
const _ = require('lodash')

export class Request {
  cw: any;

  /**
   * Construct activity link object for Request functions
   *
   * @param {Object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
   * @return {Object} Returns object that is this module
   */
  constructor(cw) {
    this.cw = cw;
  }

  /**
   * Create new requests
   *
   * @category Requests
   * @param {Object} sr_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=RequestBase on the Cityworks instance
   * @return {Object} Returns Promise that represents an object describing the newly-created request
   */
  create(sr_data: Object) {
    return new Promise((resolve, reject) => {
      if(!_.has(sr_data, 'ProblemSid')) {
        reject(new CWError(1, 'ProblemSid must be provided.', {'provided': sr_data}))
      } else {
        this.cw.runRequest('Ams/ServiceRequest/Create', sr_data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        });
      }
    });
  }

  /**
   * Update a request
   *
   * @category Requests
   * @param {object} sr_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=RequestBase on the Cityworks instance
   * @return {Object} Returns Promise that represents an object describing the updated request
   */
  update(sr_data: Object) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        if(!_.has(sr_data, 'RequestId')) {
          reject(new CWError(1, 'RequestId must be provided.', {'provided': sr_data}));
        } else {
          this.cw.runRequest('Ams/ServiceRequest/Update', sr_data).then(r => {
            resolve(r.Value);
          }).catch(e => {
            reject(e);
          });
        }
      });
    });
  }

  /**
   * Change a request's problem code
   *
   * @category Requests
   * @param {number} requestId - The request ID to change
   * @param {number} problemSid - The request's new ProblemSID
   * @return {Object} Returns Promise that represents an object describing the updated request
   */
  changeProblem(requestId: number, problemSid: number) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        var data = {
          RequestId: requestId,
          ProblemSid: problemSid
        }
        this.cw.runRequest('Ams/ServiceRequest/ChangeProblem', data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      });
    });
  }

  /**
   * Get a request by ID
   *
   * @category Requests
   * @param {number} requestId - The ID of the reuqest to retrieve
   * @return {Object} Returns Promise that represents an object describing the request
   */
  getById(requestId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestId: requestId
      }
      this.cw.runRequest('Ams/ServiceRequest/ById', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get requests by array of IDs
   *
   * @category Requests
   * @param {Array<number>} requestIds - The request IDs to retrieve
   * @return {Object} Returns Promise that represents a collection of Objects describing the requests
   */
  getByIds(requestIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestIds: requestIds
      }
      this.cw.runRequest('Ams/ServiceRequest/ByIds', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get the audit log for a specific request
   *
   * @category Requests
   * @param {number} requestId - A Request ID to get the audit log for
   * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
   */
  getAuditLog(requestId: number) {
    return new Promise((resolve, reject) => {
      var data = {RequestId: requestId}
      this.cw.runRequest('Ams/ServiceRequest/AuditLog', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom fields for provided requests
   *
   * @category Requests
   * @param {Array<number>} requestIds - The RequestIds whose custom fields should be returned
   * @return {Object} Returns Promise that represents a collection of custom fields
   */
  getCustomFields(requestIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestIds: requestIds,
      }
      this.cw.runRequest('Ams/ServiceRequest/CustomFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Cancel requests
   *
   * @category Requests
   * @param {Array<number>} requestIds - An array of the IDs to cancel the matched requests
   * @param {string} [cancelReason] - A reason for cancelling the request(s)
   * @param {datetime} [dateCancelled] - The date/time that it should be indicated the request was cancelled
   * @return {Object} Returns object that represents a collection of requests
   */
   cancel(requestIds: Array<number>, cancelReason?: string, dateCancelled?: Date) {
     return new Promise((resolve, reject) => {
       var m = new Date();
       var data: {RequestIds: Array<number>, CancelReason?: string, DateCancelled?: Date} = { RequestIds: requestIds };
       if(typeof(cancelReason)!=='undefined') {
         data.CancelReason = cancelReason;
       }
       if(typeof(dateCancelled)!=='undefined') {
         data.DateCancelled = dateCancelled;
       }
       this.cw.runRequest('Ams/ServiceRequest/Cancel', data).then(r => {
         resolve(r.Value);
       }).catch(e => {
         reject(e);
       });
     });
   }

   /**
    * Uncancel requests
    *
    * @category Requests
    * @param {Array<number>} requestIds - An array of the IDs to uncancel the matched requests
    * @return {Object} Returns object that represents a collection of requests
    */
    uncancel(requestIds: Array<number>) {
      return new Promise((resolve, reject) => {
        var data = {
          RequestIds: requestIds
        };
        this.cw.runRequest('Ams/ServiceRequest/Uncancel', data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      });
    }

   /**
    * Close requests
    *
    * @category Requests
    * @param {Array<number>} requestIds - An array of the IDs to close the matched requests
    * @return {Object} Returns object that represents a collection of requests
    */
    close(requestIds: Array<number>) {
      return new Promise((resolve, reject) => {
        var data = {
          RequestIds: requestIds
        };
        this.cw.runRequest('Ams/ServiceRequest/Close', data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      });
    }

    /**
     * Reopen closed requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to reopen the matched requests
     * @return {Object} Returns object that represents a collection of requests
     */
     reopen(requestIds: Array<number>) {
       return new Promise((resolve, reject) => {
         var data = {
           RequestIds: requestIds
         };
         this.cw.runRequest('Ams/ServiceRequest/Reopen', data).then(r => {
           resolve(r.Value);
         }).catch(e => {
           reject(e);
         });
       });
     }

  /**
   * Delete requests
   *
   * @category Requests
   * @param {Array<number>} requestIds - An array of the IDs to delete the matched requests
   * @return {Object} Returns object that represents a collection of request Ids which have been deleted
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
   * Get a list of problem nodes for a domain
   *
   * @category Request Categorization
   * @param {number} domainId - The domain ID for which to retrieve problem nodes.
   * @param {boolean} viewOnly - Return only view only problem nodes. Defaults to false.
   * @param {Object} [displayMode] - Object that should contain two properties if you provide it: DisplayTextMode: string (C = Code, D = Description, CD = Code ~ Description). DisplayTextDelimeter: string, only impacts CD display text mode.
   * @param {boolean} includeCancelled - Return only cancelled problem nodes as well. Defaults to false.
   * @return {Object} Returns Promise that represents a collection of problem node objects.
   */
  getProblemNodes(domainId: number, viewOnly: boolean = false, displayMode?: Object, includeCancelled: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        DomainId: domainId,
        IncludeCancelled: includeCancelled,
        ViewOnly: viewOnly
      }
      if(typeof displayMode != 'undefined' && _.has(displayMode, 'DisplayTextMode')) {
        _.set(data, 'DisplayTextMode', _.get(displayMode, 'DisplayTextMode'));
        if(_.get(displayMode, 'DisplayTextMode')=='CD' && _.has(displayMode, 'DisplayTextDelimeter')) {
          _.set(data, 'DisplayTextDelimeter', _.get(displayMode, 'DisplayTextDelimeter'));
        }
      }
      this.cw.runRequest('Ams/ServiceRequest/ProblemNodes', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of problem codes
   *
   * @category Request Options
   * @param {boolean} forPublicOnly - Return only publicly-available service requests. Defaults to false.
   * @param {boolean} onlyActiveTemplates - Return only active templates. Defaults to true.
   * @return {Object} Returns Promise that represents an Array of problem name objects.
   */
  getProblems(forPublicOnly: boolean = false, onlyActiveTemplates: boolean = true, domainIds?: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        ForPublicOnly: forPublicOnly,
        OnlyActiveTemplates: onlyActiveTemplates
      }
      if(typeof domainIds != 'undefined') {
        _.set(data, 'DomainIds', domainIds);
      }
      this.cw.runRequest('Ams/ServiceRequest/Problems', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of problem codes by keywords
   *
   * @category Request Options
   * @param {string} keywords - Keywords to search for potential problem codes
   * @return {Object} Returns Promise that represents an Array of problem name objects.
   */
  getProblemsByKeywords(keywords: string) {
    return new Promise((resolve, reject) => {
      var data = {
        Keywords: keywords
      }
      this.cw.runRequest('Ams/ServiceRequest/ProblemsByKeywords', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of a problem code's priorities
   *
   * @category Request Options
   * @param {number} problemSid - Return priorities for given problemSid
   * @return {Object} Returns Promise that represents an Array of priorities
   */
  getPriorities(problemSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ProblemSids: problemSid,
      }
      this.cw.runRequest('Ams/ServiceRequest/Priorities', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get custom field templates for problem code
   *
   * @category Request Options
   * @param {number} problemSid - The problemSid whose template custom fields should be returned
   * @return {Object} Returns Promise that represents a collection of custom fields
   */
  getCustomFieldTemplate(problemSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ProblemSids: problemSid,
      }
      this.cw.runRequest('Ams/ServiceRequest/TemplateCustomFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the questions and answer options for a problem code
   *
   * @category Request Options
   * @param {number} problemSid - The problemSid whose Q&A should be returned
   * @return {Object} Returns Promise that represents a collection of questions and answer settings
   */
  getQASettings(problemSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ProblemSids: problemSid,
      }
      this.cw.runRequest('Ams/ServiceRequest/QA', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get problem leaf (template) by Sid
   *
   * @category Request Options
   * @param {number} problemSid - Return problem leaf for given problemSid
   * @return {Object} Returns Promise that represents an Object that describes the problem leaf (template)
   */
  getProblemLeaf(problemSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ProblemSid: problemSid
      }
      this.cw.runRequest('Ams/ServiceRequest/ProblemLeafBySid', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of default statuses
   *
   * @category Request Options
   * @param {Array<number>} domainIds - List of domains to return default statuses for
   * @return {Object} Returns Promise that represents an Array of statuses.
   */
  getStatuses(domainIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        DomainIds: domainIds
      }
      this.cw.runRequest('Ams/ServiceRequest/DefaultStatus', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of possible DispatchTo values
   *
   * @category Request Options
   * @param {Array<number>} domainId - Domain to return possible dispatchTo values for
   * @return {Object} Returns Promise that represents an Array of dispatchTo options.
   */
  getDispatchTo(domainId: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        DomainId: domainId
      }
      this.cw.runRequest('Ams/ServiceRequest/DispatchTo', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of possible SubmitTo values
   *
   * @category Request Options
   * @param {Array<number>} domainId - Domain to return possible submitTo values for
   * @return {Object} Returns Promise that represents an Array of submitTo options.
   */
  getSubmitTo(domainId: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        DmainId: domainId
      }
      this.cw.runRequest('Ams/ServiceRequest/SubmitTo', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
