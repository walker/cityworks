import { CWError } from './error'
const _ = require('lodash')

export class CaseAdmin {
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
   * Add Business Case Template
   *
   * @category Case Templates
   * @param {Object} data - The Business Case Template options.
   * @return {Object} Returns Promise that represents an object describing the created case template. See: /{subdirectory}/apidocs/#/data-type-info;dataType=BusinessCaseItem
   */
  addBusinessCaseTemplate(data: Object) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Pll/BusinessCase/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update Business Case Template
   *
   * @category Case Templates
   * @param {number} busCaseId - The Business Case ID to update
   * @param {Object} data - The Business Case Template options.
   * @return {Object} Returns Promise that represents an object describing the updated case template. See: /{subdirectory}/apidocs/#/data-type-info;dataType=BusinessCaseItem
   */
  updateBusinessCaseTemplate(busCaseId: number, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        BusCaseId: busCaseId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/BusinessCase/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Business Case Templates
   *
   * @category Case Templates
   * @return {Object} Returns Promise that represents a collection of Business Case Templates
   */
  getBusinessCaseTemplates() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/BusinessCase/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Case Type
   *
   * @category Types
   * @param {string} caseTypeName - The case type name
   * @param {string} caseTypeDesciption - The case type description
   * @param {Object} options - The other options for the Case Type
   * @return {Object} Returns Promise that represents an object describing the added case type
   */
  addCaseType(caseTypeName: string, caseTypeDesciption: string, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseType: caseTypeName,
        CaseTypeDesciption: caseTypeDesciption
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseType/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update Case Type
   *
   * @category Types
   * @param {number} caseTypeId - The case Type ID
   * @param {Object} options - The other options for the Case Type
   * @return {Object} Returns Promise that represents an object describing the updated case type
   */
  updateCaseType(caseTypeId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseTypeId: caseTypeId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseType/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Case Types
   *
   * @category Types
   * @return {Object} Returns Promise that represents a collection of CaseTypeItems
   */
  getCaseTypes() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/CaseType/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Types
   * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
   * @return {Object} Returns Promise that represents an Array of CaseTypeIDs
   */
  searchCaseTypeIDs(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['CaseType', 'CaseTypeDesc', 'CaseTypeId']).length==0) {
        reject(new CWError(2, 'At least one of the attributes (CaFeeId, CaObjectId, FeeCode, FeeDesc) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseType/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Types
   * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
   * @return {Object} Returns Promise that represents a collection of CaseTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CaseTypeItem
   */
  searchCaseTypeObjects(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['CaseType', 'CaseTypeDesc', 'CaseTypeId']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (CaseType, CaseTypeDesc, CaseTypeId) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseType/SearchObject', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add SubType
   *
   * @category SubTypes
   * @param {string} subTypeName - The SubTypeId
   * @param {string} subTypeDescription - The SubTypeId
   * @param {Object} options - Other SubType options.
   * @return {Object} Returns Promise that represents an object describing the added SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
   */
  addSubtype(subTypeName: string, subTypeDescription: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        SubType: subTypeName,
        SubTypeDesc: subTypeDescription
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/SubType/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update SubType
   *
   * @category SubTypes
   * @param {number} subTypeId - The SubTypeId
   * @param {Object} options - The case Object ID
   * @return {Object} Returns Promise that represents an object describing the updated SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
   */
  updateSubtype(subTypeId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        SubTypeId: subTypeId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/SubType/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get SubTypes
   *
   * @category SubTypes
   * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
   */
  getSubtypes() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/SubType/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Department
   *
   * @category Departments
   * @param {string} departmentCode - The SubTypeId
   * @param {string} dpartmentName - The SubTypeId
   * @param {Object} options - Other SubType options.
   * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
   */
  addDepartment(departmentCode: string, dpartmentName: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        DepartmentCode: departmentCode,
        DepartmentName: dpartmentName
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Department/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Departments
   *
   * @category Departments
   * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
   */
  getDepartments() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/Department/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Fees
   *
   * @category Fees
   * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
   */
  getFees() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/FeeSetup/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Fees. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @param {Object} filters - The parameter(s) to search by (AccountCode, FeeCode, FeeDesc, FeeSetupId, FeeTypeId).
   * @return {Object} Returns Promise that represents an Array of FeeSetupIDs
   */
  searchFees(filters: {AccountCode?: string, FeeCode?: string, FeeDesc?: string, FeeSetupId?: number, FeeTypeId?: number}) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['AccountCode', 'FeeCode', 'FeeDesc', 'FeeSetupId', 'FeeTypeId']).length==0) {
        reject(new CWError(4, 'At least one of the attributes (AccountCode, FeeCode, FeeDesc, FeeSetupId, FeeTypeId) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/FeeSetup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Expirations
   *
   * @category Expirations
   * @return {Object} Returns Promise that represents a collection of ExpirationTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=ExpirationTypeItem
   */
  getExpirations() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/ExpirationType/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add an Expiration type
   *
   * @category Expirations
   * @return {Object} Returns Promise that represents an object describing the newly-added ExpirationTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=ExpirationTypeItem
   */
  addExpiration(options?: Object) {
    return new Promise((resolve, reject) => {
      if(!_.has(options, 'OrgId') || !_.has(options, 'ExpirationTypeDesc')) {
        reject(new CWError(5, 'OrgId and ExpirationTypeDesc must both be defined.'))
      }
      var data = options
      this.cw.runRequest('Pll/ExpirationType/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
