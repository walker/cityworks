import { CWError } from './error'
const _ = require('lodash')
const querystring = require('querystring')
const fs = require('fs')
import * as https from 'https'

import { CaseData } from './case_data'
import { CaseFinancial } from './case_financial'
import { CaseWorkflow} from './case_workflow'
import { CaseAdmin } from './case_admin'
import { Comments } from './comments'
import { CaseAssets } from './case_assets'

export interface Briefcase {
  TempTableName: string
  AnonymousFlag: string
  RegisteredFlag: string
  CreatedByLoginId: string
  TableName: string
  ModifiedByLoginId: number
  AcceptedByLoginId: number
  EnteredByLoginid: number
  WorkOrderId: string
  WorkOrderDesc: string
  WorkOrderStatus: string
  ServiceRequestId: number
  ServiceRequestDesc: string
  ServiceRequestStatus: string
  CloneCaseRelation: any|null
  PendingFlag: any|null
  CaseGroup: any|null
  ParentCaObjectId: number|null
  AmountDue: number|null
  GetViewColumns: Array<string>
  CaObjectId: number
  OrgId: number
  CaseTypeId: number
  CaseType: string
  CaseTypeDesc: string
  BusCaseDesc: string|null
  SubTypeId: number|null
  SubType: string|null
  SubTypeDesc: string|null
  CreatedBy: number
  DateAccepted: Date|null
  DateCreated: Date
  DateEntered: Date
  DateExpiration: Date|null
  DateIssued: Date|null
  DateModified: Date|null
  EnteredBy: number
  ExpiredFlag: string|null
  IssuedBy: number|null
  IssuedFlag: string|null
  ModifiedBy: number|null
  SubTypeDefaultText: string|null
  CaseNumber: string
  CaseStatusId: number
  CaseStatus: string
  ProjectSid: number|null
  ProjectId: string|null
  ProjectCode: string|null
  ProjectDesc: string|null
  PriorityLevel: string|null
  StatusCode: string
  CaseName: string
  AcceptedBy: number
  BLicenseFlag: string|null
  BusinessName: string|null
  BusCaseId: number|null
  BusinessOrgType: string|null
  BusinessCategory: string|null
  StateTaxId: string|null
  FedTaxId: string|null
  Location: string|null
  PACaseFlag: string|null
  ActiveFlag: string|null
  CX: number|null
  CY: number|null
  CZ: number|null
  AssignedTo: number|null
  AssignedToLoginId: string|null
  AssignedToFirstName: string|null
  AssignedToLastName: string|null
  Facility_Id: string|number|null
  Level_Id: string|number|null
}

export class Briefcase {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  current_case: number = 0

  /**
   * Data Detail methods
   */
  data?: any
  /**
   * Asset (Address) methods
   */
  asset?: any
  /**
   * Asset (Address) methods
   */
  attachments?: any
  /**
   * Workflow & task methods
   */
  workflow?: any
  /**
   * Payment, Receipt, & Fee methods
   */
  financial?: any
  /**
   * Commenting methods
   */
  comment?: any
  /**
   * PLL Administration methods
   */
  admin?: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Create new case
   *
   * @category Cases
   * @param {number} caseTypeId - The case Type ID
   * @param {number} subTypeId - The case subType ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  create(caseTypeId: number, subTypeId: number, options?: Object): Promise<Briefcase> {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseTypeId: caseTypeId,
        SubTypeId: subTypeId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Case/Create', data).then(r => {
        this.current_case = r.Value.CaObjectId
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Create a child case
   *
   * @category Cases
   * @param {number} busCaseId - The case Type ID
   * @param {number} parentCaObjectId - The case subType ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  createChild(busCaseId: number, parentCaObjectId: number, options?: Object): Promise<Briefcase> {
    return new Promise((resolve, reject) => {
      var data_init = {
        BusCaseId: busCaseId,
        ParentCaObjectId: parentCaObjectId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Case/CreateChild', data).then(r => {
        this.current_case = r.Value.CaObjectId
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Create a case from a Service Request
   *
   * @category Cases
   * @param {number} caseTypeId - The case Type ID
   * @param {number} subTypeId - The case subType ID
   * @param {number} requestId - The service request ID
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the newly-created case
   */
  createFromRequest(caseTypeId: number, subTypeId: number, requestId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseTypeId: caseTypeId,
        SubTypeId: subTypeId,
        ServiceRequestId: requestId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseObject/CreateCaseFromServiceRequest', data).then(r => {
        this.current_case = r.Value.CaObjectId
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update a case
   *
   * @category Cases
   * @param {number} caObjectId - The case Object ID to update
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
   * @return {Object} Returns Promise that represents an object describing the updated case
   */
  update(caObjectId: number, options?: Object): Promise<Briefcase> {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaObjectId: caObjectId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseObject/Update', data).then(r => {
        this.current_case = r.Value.CaObjectId
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cases by IDs
   *
   * @category Cases
   * @param {Array<number>} caObjectIds - The case Object ID to get
   * @return {Object} Returns Promise that represents a collection of objects describing the cases
   */
  getByIds(caObjectIds: Array<number>): Promise<Array<Briefcase>> {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectIds: caObjectIds
      }
      this.cw.runRequest('Pll/CaseObject/ByIds', data).then(r => {
        if(r.Value.length == 1) {
          this.current_case = r.Value[0]
        }
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Cases. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Cases
   * @param {Object} filters - The parameter(s) to search by
   * @return {Object} Returns Promise that represents an Array of case Object IDs
   */
  search(filters: Object): Promise<Array<number>> {
    return new Promise((resolve, reject) => {
      var data = filters
      this.cw.runRequest('Pll/CaseObject/Search', data).then(r => {
        if(r.Value.length == 1) {
          this.current_case = r.Value[0].CaObjectId
        }
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Move a Case point
   *
   * @category Cases
   * @param {string} caObjectId
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include at least WKT _or_ WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated GISPoint
   */
  move(caObjectId: number, x: number, y: number, projection: {WKID?: string, WKT?: string, VcsWKID?: string}, z?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(projection, 'WKID') && !_.has(projection, 'WKT')) {
        // Throw error
        reject(new CWError(1, 'You must provide either the WKID or WKT for the x/y coordinates.', {'projection': projection}))
      }
      var data_init = {
        CaObjectId: caObjectId,
        X: x,
        Y: y
      };
      if(typeof(z)!='undefined') {
        _.set(data_init, 'Z', z)
      }
      var data = _.merge(data_init, projection);
      this.cw.runRequest('Pll/CaseObject/Move', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete case
   *
   * @category Cases
   * @param {number} caObjectId - The case Object ID
   * @return {Object} Returns Promise that represents an object describing the deleted case
   */
  delete(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseObject/DeleteCase', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Map Layer Fields
   *
   * @category Cases
   * @param {number} caObjectId - The case object ID to get the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the case object map layer fields
   */
  getMLFs(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      var path = 'Ams/TemplateMapLayer/CaseInstanceMapLayersByCaObjectId';
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
   * @category Cases
   * @param {number} caObjectId - The case object ID to get the map layer fields for.
   * @param {number} x
   * @param {number} y
   * @param {number} domainId - The domain ID for the case in question
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents a collection of Objects describing the case object map layer fields
   */
    updateMLFs(caObjectId: number, x?: number, y?: number, domainId?: number, z?: number) {
      return new Promise((resolve, reject) => {
        var data = {
          CaObjectId: caObjectId
        }
        var path = 'Ams/TemplateMapLayer/UpdateCaseInstanceMapLayers';
        
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
   * @category Cases
   * @param {number} caObjectId - The case object ID to delete the map layer fields for.
   * @return {Object} Returns Promise that represents a collection of Objects describing the case object map layer fields deleted
   */
  deleteMLFs(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      var path = 'Ams/TemplateMapLayer/DeleteCaseInstanceMapLayersByCaObjectId';
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Reports available for Case
   *
   * @category Cases
   * @param {number} caObjectId - The case object ID to get the report (print template) list for
   * @return {Object} Returns Promise that represents a collection of Objects describing the reports (print templates) available for this case
   */
  getPrintTemplates(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      var path = 'Pll/BusinessCaseReports/ByCaObjectId';
      this.cw.runRequest(path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Print Case
   *
   * @category Cases
   * @param {number} caObjectId - The case object ID to delete the map layer fields for.
   * @param {string} fileName - the filename of the report from the getPrintTemplates method, but w/out the extension
   * @return {Object} Returns Promise that represents a collection of Objects describing the case object map layer fields deleted
   */
  print(caObjectId: number, fileName: string, callback: any) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        FileName: fileName
      }
      var path = 'Pll/BusinessCaseReports/Download'
      var options = this.cw.getRequestOptions(path, 'GET')
      console.log(options)

      var file_extension = `pdf`
      console.log(__dirname + fileName + '.' + file_extension)
      const file = fs.createWriteStream(__dirname.replace('/dist', '/downloads') + '/' + fileName + '.' + file_extension)

      var request_url = 'https://'+options.hostname + options.path + '?data=' + JSON.stringify(data) + '&Token=' + this.cw.getToken()
      // TODO: test the Filename to make sure it's in the File list from getPrintTemplates (or let the API just error?)
      https.get(request_url, {timeout: 10000000}, (res) => {
        res.on('data', (d) => {
          file.write(d);
        });
  
        res.on('end', () => {
          file.close(callback('Success'))
        })
      }).on('error', (e) => {
        file.close(callback('Failure'));
        console.error(e);
      });
    })
  }

  // importCase(caseTypeId: number, subTypeId: number, caseName: string, location: string, x: number, y:number, appData: object, comment: string, expiration: string, assetIds: object) {
  //   return new Promise(resolve => {
  //     const _this = this;
  //     let case_data = {CaseName:caseName, Location:location, DateExpiration: expiration, X:x,Y:y}
  //     this.create(caseTypeId, subTypeId, case_data).then((response: any) => {
  //       if(response) {
  //         if(typeof(response.CaObjectId)!='undefined') {
  //           var CaObjectId = response.CaObjectId
  //           if(typeof(comment) != 'undefined') {
  //             _this.comments.add(CaObjectId, comment)
  //           }
  //           if(assetIds) {
  //             _this.assets!.attach(CaObjectId, true, assetIds)
  //           }
  //           if(appData) {
  //             _this.data!.getGroupsByCaseId(response.CaObjectId).then(response_one => {
  //               // loop through all groups
  //               let data_details_items = []
  //               _this.data!.caseDataGroupIterator(appData, response_one, data_details_items).then(di => {
  //                 _this.data!.caseDataDetailIterator(appData, di).then(resp => {
  //                   resolve(response)
  //                 })
  //               })
  //             })
  //           } else {
  //             resolve(response)
  //           }
  //         } else {
  //           console.log('Error creating case: '+ JSON.stringify(case_data))
  //           process.exit(0)
  //         }
  //       } else {
  //         resolve(false)
  //       }
  //     })
  //   })
  // }

}
