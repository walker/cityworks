import { CWError } from './error'
const _ = require('lodash')

export class Request {
  /**
   * @hidden
   */
  cw: any

  /**
   * Request Administration methods
   */
  admin?: any

  /**
   * Request Costing methods
   */
  costs: any

  /**
   * Request Comments methods
   */
  comment: any

  /**
   * Attachments methods
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
   * Create new requests
   *
   * @category Requests
   * @param {Object} sr_data - See /{subdirectory}/apidocs/#/data-type-infodataType=RequestBase on the Cityworks instance
   * @return {Object} Returns Promise that represents an object describing the newly-created request
   */
  create(sr_data: Object) {
    return new Promise((resolve, reject) => {
      if(!_.has(sr_data, 'ProblemSid')) {
        reject(new CWError(2, 'ProblemSid must be provided.', {'provided': sr_data}))
      } else {
        this.cw.runRequest('Ams/ServiceRequest/Create', sr_data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Update a request
   *
   * @category Requests
   * @param {object} sr_data - See /{subdirectory}/apidocs/#/data-type-infodataType=RequestBase on the Cityworks instance
   * @return {Object} Returns Promise that represents an object describing the updated request
   */
  update(sr_data: Object) {
    return new Promise((resolve, reject) => {
      if(!_.has(sr_data, 'RequestId')) {
        reject(new CWError(3, 'RequestId must be provided.', {'provided': sr_data}))
      } else {
        this.cw.runRequest('Ams/ServiceRequest/Update', sr_data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Move a request's point
   *
   * @category Requests
   * @param {number} requestId
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include at least WKT _or_ WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated GISPoint
   */
  move(requestId: number, x: number, y: number, projection: {WKID?: string, WKT?: string, VcsWKID?: string}, z?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(projection, 'WKID') && !_.has(projection, 'WKT')) {
        // Throw error
        reject(new CWError(6, 'You must provide either the WKID or WKT for the x/y coordinates.', {'projection': projection}))
      }
      var base_data = {
        RequestId: requestId,
        X: x,
        Y: y
      };
      if(typeof(z)!='undefined') {
        _.set(base_data, 'Z', z)
      }
      var data = _.merge(base_data, projection);
      this.cw.runRequest('Ams/ServiceRequest/Move', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update request's map layer fields
   *
   * @category Requests
   * @param {number} requestId
   * @return {Object} Returns Promise that represents an object describing the updated map layer fields
   */
  updateMLF = (requestId: number) => {
    return new Promise((resolve, reject) => {
      var data = {
        ServiceRequestId: requestId
      }
      this.cw.runRequest('Ams/TemplateMapLayer/ServiceRequestInstanceMapLayersByRequestId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
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
      var data = {
        RequestId: requestId,
        ProblemSid: problemSid
      }
      this.cw.runRequest('Ams/ServiceRequest/ChangeProblem', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a request by ID
   *
   * @category Requests
   * @param {number} requestId - The ID of the request to retrieve
   * @return {Object} Returns Promise that represents an object describing the request
   */
  getById(requestId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestId: requestId
      }
      this.cw.runRequest('Ams/ServiceRequest/ById', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
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
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
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
   * Change custom field category for provided requests
   *
   * @category Requests
   * @param {Array<number>} requestIds - The RequestIds whose custom fields should be returned
   * @param {number} categoryId - The new custom field grouping/category which should be assigned to the provided requests
   * @return {Object} Returns Promise that represents a collection of requests
   */
  changeCustomFieldCategory(requestIds: Array<number>, categoryId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        RequestIds: requestIds,
        CategoryId: categoryId
      }
      this.cw.runRequest('Ams/ServiceRequest/ChangeCustomFieldCategory', data).then(r => {
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
       var m = new Date()
       var data: {RequestIds: Array<number>, CancelReason?: string, DateCancelled?: Date} = { RequestIds: requestIds }
       if(typeof(cancelReason)!=='undefined')
         _.set(data, 'CancelReason', cancelReason);
       if(typeof(dateCancelled)!=='undefined')
         _.set(data, 'DateCancelled', dateCancelled);
       this.cw.runRequest('Ams/ServiceRequest/Cancel', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
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
        }
        this.cw.runRequest('Ams/ServiceRequest/Uncancel', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
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
        }
        this.cw.runRequest('Ams/ServiceRequest/Close', data).then(r => {
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
         }
         this.cw.runRequest('Ams/ServiceRequest/ReOpen', data).then(r => {
           resolve(r.Value)
         }).catch(e => {
           reject(e)
         })
       })
     }

  /**
   * Delete requests
   *
   * @category Requests
   * @param {Array<number>} requestIds - An array of the IDs to delete the matched requests
   * @return {Object} Returns object that represents a collection of request Ids which have been deleted
   */
   delete(requestIds: Array<number>) {
     return new Promise((resolve, reject) => {
       var data = {
         RequestIds: requestIds
       }
       this.cw.runRequest('Ams/ServiceRequest/Delete', data).then(r => {
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
    * Search for requests
    *
    * @category Request Search
    * @param {Object} searchData - The search information to retrieve matched requests, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
    * @return {Object} Returns Promise that represents an Array of the matching request IDs
    */
   search(searchData: Object) {
     return new Promise((resolve, reject) => {
       var data = searchData
       this.cw.runRequest('Ams/ServiceRequest/Search', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
    * Get the records on the basis of RequestId, only populates RequestId, Description, ProblemCode properties
    *
    * @category Request Object Search
    * @param {string} requestId - ???, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
    * @return {Object} Returns Promise that represents a collection of the matching (limited) request objects
    */
   searchObject(requestId: string) {
     return new Promise((resolve, reject) => {
       var data = {
         RequestId: requestId
       }
       this.cw.runRequest('Ams/ServiceRequest/SearchObject', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
    * Create a search definition. Save the definition by setting SaveDefinition = true and supplying a SearchName.
    *
    * @category Requests
    * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
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
       this.cw.runRequest('Ams/ServiceRequest/CreateSearchDefinition', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
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
      if(typeof displayMode != 'undefined' && displayMode !== null && _.has(displayMode, 'DisplayTextMode')) {
        _.set(data, 'DisplayTextMode', _.get(displayMode, 'DisplayTextMode'))
        if(_.get(displayMode, 'DisplayTextMode')=='CD' && _.has(displayMode, 'DisplayTextDelimeter')) {
          _.set(data, 'DisplayTextDelimeter', _.get(displayMode, 'DisplayTextDelimeter'))
        }
      }
      this.cw.runRequest('Ams/ServiceRequest/ProblemNodes', data).then(r => {
        // console.log(_.filter(r, function(o) { return !o.Cancel; }), 'filter');
        // console.log(_.some(r.Value, ['Cancel', true]), 'some');
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
        _.set(data, 'DomainIds', domainIds)
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
   * Get a list of possible Employee values
   *
   * @category Request Options
   * @param {string} listType - Which list (endpoint) to get. Includes only DispatchTo & SubmitTo.
   * @param {number} domainId - Domain to return possible dispatchTo values for
   * @return {Object} Returns Promise that represents an Array of Employee options.
   */
  getEmployeeLists(listType: string, domainId: number) {
    return new Promise((resolve, reject) => {
      // TODO: make a default domain option on the CW object for cases like this.
      var data = {
        DomainId: domainId
      }
      if(!_.includes(['DispatchTo', 'SubmitTo'], listType)) {
        reject(new CWError(2, 'listType must be either SubmitTo or DispatchTo.', {'provided': listType}))
      } else {
        this.cw.runRequest(`Ams/ServiceRequest/${listType}`, data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Get a list of possible DispatchTo values
   *
   * @category Request Options
   * @param {number} domainId - Domain to return possible dispatchTo values for
   * @return {Object} Returns Promise that represents an Array of dispatchTo options.
   */
  getDispatchTos(domainId: number) {
    // Fix name for choice of non-pluralized endpoint. Unlike WOs & Inspections...
    return this.getEmployeeLists('DispatchTo', domainId);
  }

  /**
   * Get a list of possible SubmitTo values
   *
   * @category Request Options
   * @param {number} domainId - Domain to return possible submitTo values for
   * @return {Object} Returns Promise that represents an Array of submitTo options.
   */
  getSubmitTos(domainId: number) {
    // Fix name for choice of non-pluralized endpoint. Unlike WOs & Inspections...
    return this.getEmployeeLists('SubmitTo', domainId);
  }

  /**
   * Get street codes
   *
   * @category Request Options
   * @return {Object} Returns Promise that represents an Array of Street Codes.
   */
  streetCodes() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/ServiceRequest/AllStreetCode', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of templates
   *
   * @category Request Templates
   * @param {Array<number>} problemSids - An array list of problemSids to retrieve templates for
   * @param {Date} [minimumDateModified] - ?
   * @param {Date} [maximumDateModified] - ?
   * @return {Object} Returns Promise that represents
   */
   getTemplatesById(problemSids: Array<number>, minimumDateModified?: Date, maximumDateModified?: Date) {
     return new Promise((resolve, reject) => {
       var data = {
         ProblemSids: null
       }
       if(typeof minimumDateModified != 'undefined') {
         _.set(data, 'MinimumDateModified', minimumDateModified)
       }
       if(typeof maximumDateModified != 'undefined') {
         _.set(data, 'MaximumDateModified', maximumDateModified)
       }

       this.cw.runRequest('Ams/ServiceRequestTemplate/ByIds', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
    * Create a search definition. Save the definition by setting SaveDefinition = true and supplying a SearchName.
    *
    * @category Request Templates
    * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequestTemplate
    * @param {number} [searchName] - What to name your search (if it should be saved)
    * @param {number} [sharedWithin] - What group or domain to share the search to.
    * @param {boolean} saveDefinition - Whether or not to save the search definition. Defaults to true when a search name is specified.
    * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CWMetadata
    */
   createTemplateSearchDefinition(searchData: Object, searchName?: string, sharedWithin?: number, saveDefinition: boolean = true) {
     return new Promise((resolve, reject) => {
       var data = searchData
       if(_.isString(searchName)) {
         _.set(data, 'SearchName', searchName)
         _.set(data, 'SaveDefinition', saveDefinition)
         // not sure how to handle sharedWithin...
         // _.set(data, 'SharedWithin', sharedWithin)
       }
       this.cw.runRequest('Ams/ServiceRequestTemplate/CreateSearchDefinition', data).then(r => {
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
    * Get the questions and answers for a(many) request template(s)
    *
    * @category Request Templates
    * @param {Array<number>} problemSids - An array list of problemSids to retrieve templates for
    * @return {Object} Returns Promise that represents a collection of ProblemQAs. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemQA
    */
    getTemplateQAs(problemSids: Array<number>, minimumDateModified?: Date, maximumDateModified?: Date) {
      return new Promise((resolve, reject) => {
        var data = {
          ProblemSids: null
        }
        this.cw.runRequest('Ams/ServiceRequestTemplate/QA', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

    /**
     * Get a list of template id results for a provided search parameters
     *
     * @category Request Templates
     * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequestTemplate
     * @return {Object} Returns Promise that represents a list of template IDs.
     */
    searchTemplates(searchData: Object) {
      return new Promise((resolve, reject) => {
        var data = searchData
        this.cw.runRequest('Ams/ServiceRequestTemplate/Search', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

    /**
     * Get request templates (problem leaf[s])
     *
     * @category Request Templates
     * @param {Array<number>} [templateIds] - Array of specific template IDs to retrieve
     * @param {number} canCreate - If true, only return templates the user can create, ignored if false or null, default is false
     * @param {boolean} includeInactiveIf - If true, returns inactive templates, default is false
     * @param {Date} [minimumDateModified] - ?
     * @param {Date} [maximumDateModified] - ?
     * @return {Object} Returns Promise that represents a collection of Problem Leafs. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemLeaf
     */
    getTemplates(templateIds: Array<number>, canCreate: boolean = false, includeInactiveIf: boolean = false, minimumDateModified?: Date, maximumDateModified?: Date) {
      return new Promise((resolve, reject) => {
        var data = {
          CanCreate: canCreate,
          IncludeInactiveIf: includeInactiveIf
        }
        if(typeof templateIds != 'undefined') {
          _.set(data, 'TemplateIds', templateIds)
        }
        if(typeof minimumDateModified != 'undefined') {
          _.set(data, 'MinimumDateModified', minimumDateModified)
        }
        if(typeof maximumDateModified != 'undefined') {
          _.set(data, 'MaximumDateModified', maximumDateModified)
        }
        this.cw.runRequest('Ams/ServiceRequestTemplate/Templates', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

    /**
     * Get WorkOrder templates that are associated to this request template type
     *
     * @category Request Templates
     * @param {Array<number>} problemSids - An array list of problemSids to retrieve Problem WO templates for
     * @param {boolean} includeInactiveIf - Include inactive WorkOrder templates, default is false
     * @return {Object} Returns Promise that represents a collection of Problem WO Templates. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemWOTemplate
     */
    getWOTemplates(problemSids: Array<number>, includeInactive: boolean = false) {
      return new Promise((resolve, reject) => {
        var data = {
          ProblemSids: problemSids,
          IncludeInactive: includeInactive
        }
        this.cw.runRequest('Ams/ServiceRequestTemplate/WorkOrderTemplates', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

  /**
   * Get Map Layer Fields
   *
   * @category Requests
   * @param {number} requestId - The request ID to get the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the request map layer fields
   */
  getMLFs(requestId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ServiceRequestId: requestId
      }
      var path = 'Ams/TemplateMapLayer/ServiceRequestInstanceMapLayersByRequestId';
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
   * @category Requests
   * @param {number} requestId - The service request ID to get the map layer fields for.
   * @param {number} x
   * @param {number} y
   * @param {number} domainId - Domain ID
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents a ...
   */
    updateMLFs(requestId: number, x?: number, y?: number, domainId?: number, z?: number) { // |number
      return new Promise((resolve, reject) => {
        var data = {}
        var path = 'Ams/TemplateMapLayer/UpdateServiceRequestInstanceMapLayers';
        _.set(data, 'ServiceRequestId', requestId)
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
   * @category Requests
   * @param {number} requestId - The request ID to delete the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the deleted map layer fields
   */
  deleteMLFs(requestId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        ServiceRequestId: requestId
      }
      var path = 'Ams/TemplateMapLayer/DeleteServiceRequestInstancesByRequestId';
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
