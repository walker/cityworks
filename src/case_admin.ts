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
   * @category Types & SubTypes
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
   * @category Types & SubTypes
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
   * @category Types & SubTypes
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
   * @category Types & SubTypes
   * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
   * @return {Object} Returns Promise that represents an Array of CaseTypeIDs
   */
  searchCaseTypeIDs(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaseType', 'CaseTypeDesc', 'CaseTypeId']).length==0) {
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
   * @category Types & SubTypes
   * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
   * @return {Object} Returns Promise that represents a collection of CaseTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CaseTypeItem
   */
  searchCaseTypeObjects(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaseType', 'CaseTypeDesc', 'CaseTypeId']).length==0) {
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
   * @category Types & SubTypes
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
   * @category Types & SubTypes
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
   * @category Types & SubTypes
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
      if(_.intersectionBy(_.keysIn(filters), ['AccountCode', 'FeeCode', 'FeeDesc', 'FeeSetupId', 'FeeTypeId']).length==0) {
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
   * @param {Object} options - Must specify OrgId and ExpirationDescType attributes. See: /{subdirectory}/apidocs/#/service-info/Pll/ExpirationType
   * @return {Object} Returns Promise that represents an object describing the newly-added ExpirationTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=ExpirationTypeItem
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

  /**
   * Get all Deposits
   *
   * @category Deposits
   * @return {Object} Returns Promise that represents a collection of DepositItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepositItemBase
   */
  getDeposits() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/Deposit/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search Deposits. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @param {Object} filters - The parameter(s) to search by (AccountCode, DepositCode, DepositDesc, DepositId, DepositTypeId).
   * @return {Object} Returns Promise that represents an Array of FeeSetupIDs
   */
  searchDeposits(filters: {AccountCode?: string, DepositCode?: string, DepositDesc?: string, DepositId?: number, DepositTypeId?: number}) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['AccountCode', 'DepositCode', 'DepositDesc', 'DepositId', 'DepositTypeId']).length==0) {
        reject(new CWError(4, 'At least one of the attributes (AccountCode, DepositCode, DepositDesc, DepositId, DepositTypeId) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/Deposit/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Disciplines
   *
   * @category Disciplines
   * @return {Object} Returns Promise that represents a collection of DisciplineItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DisciplineItem
   */
  getDisciplines() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/Discipline/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Department
   *
   * @category Departments & Divisions
   * @param {string} departmentCode - The SubTypeId
   * @param {string} departmentName - The SubTypeId
   * @param {Object} options - Other SubType options.
   * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
   */
  addDepartment(departmentCode: string, departmentName: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        DepartmentCode: departmentCode,
        DepartmentName: departmentName
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
   * @category Departments & Divisions
   * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
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
   * Add Division
   *
   * @category Departments & Divisions
   * @return {Object} Returns Promise that represents an object describing the newly-added DivisionItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DivisionItem
   */
  addDivision(departmentId: number, divisionName: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        DepartmentId: departmentId,
        DivisionName: divisionName
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/Division/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Divisions
   *
   * @category Departments & Divisions
   * @return {Object} Returns Promise that represents a collection of DivisionItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DivisionItem
   */
  getDivisions() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/Division/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Inspection Time Block
   *
   * @category Inspections
   * @param {string} labelText - Label for the time block
   * @param {string} startTime - Start time in 24 hour format (HH:mm)
   * @param {string} endTime - End time in 24 hour format (HH:mm)
   * @param {Object} inspTimeBlocksDetails - See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspTimeBlocksDetailItem
   * @return {Object} Returns Promise that represents an object describing the newly-added InspectionTimeBlocksItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionTimeBlocksItem
   */
  addInspectionTimeBlock(labelText: string, startTime: string, endTime: string, inspTimeBlocksDetails?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        LabelText: labelText,
        StartTime: startTime,
        EndTime: endTime
      }
      if(typeof(inspTimeBlocksDetails)!='undefined') {
        _.set(data, 'InspTimeBlocksDetails', inspTimeBlocksDetails)
      }
      this.cw.runRequest('Pll/InspectionTimeBlock/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Inspection Time Blocks
   *
   * @category Inspections
   * @return {Object} Returns Promise that represents a collection of InspectionTimeBlocksItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionTimeBlocksItem
   */
  getInspectionTimeBlocks() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/InspectionTimeBlock/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all NotificationCases
   *
   * @category Notifications
   * @return {Object} Returns Promise that represents a collection of NotificationCaseItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NotificationCaseItem
   */
  getNotificationCases() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/NotificationCase/GetNotificationCaseList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Notification Types
   *
   * @category Notifications
   * @return {Object} Returns Promise that represents a collection of NotificationCaseItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NotificationTypeItem
   */
  getNotificationTypes() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/NotificationType/GetNotificationTypeList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Numbering Group
   *
   * @category NumberingGroups
   * @param {number} options - attributes or update
   * @return {Object} Returns Promise that represents an object describing the newly-added NumberingGroupItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
   */
  addNumberingGroup(options: Object) {
    return new Promise((resolve, reject) => {
      var data = options
      this.cw.runRequest('Pll/NumberingGroup/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update Numbering Group
   *
   * @category NumberingGroups
   * @param {number} numberingGroupId - ID of NumberGroup to update
   * @param {number} options - updates attributes
   * @return {Object} Returns Promise that represents an object describing the newly-added HolidaysItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
   */
  updateNumberingGroup(numberingGroupId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        NumberingGroupId: numberingGroupId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/NumberingGroup/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all Numbering Groups
   *
   * @category NumberingGroups
   * @return {Object} Returns Promise that represents a collection of NumberingGroupItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
   */
  getNumberingGroups() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/NumberingGroup/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Person
   *
   * @category People
   * @param {string} name - Name of person
   * @param {Object} options - attributes for new person
   * @return {Object} Returns Promise that represents an object describing the newly-added NumberingGroupItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
   */
  addPerson(name: string, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        Name: name
      }
      var data = _.merge(options, data_init)
      this.cw.runRequest('Pll/People/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all People
   *
   * @category People
   * @return {Object} Returns Promise that represents a collection of PeopleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleItem
   */
  getPeople() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/People/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add People Role
   *
   * @category People
   * @param {string} name - Name of person
   * @param {Object} options - attributes for new person. See: /{subdirectory}/apidocs/#/service-info/Pll/PeopleRole
   * @return {Object} Returns Promise that represents an object describing the newly-added PeopleRoleItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
   */
  addPeopleRole(roleCode: string, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        RoleCode: roleCode
      }
      var data = _.merge(options, data_init)
      this.cw.runRequest('Pll/People/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all PeopleRoles
   *
   * @category People
   * @return {Object} Returns Promise that represents a collection of PeopleRoleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
   */
  getPeopleRoles() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/PeopleRole/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add TaskResultDetail
   *
   * @category TaskResults
   * @param {Object} options - attributes for new TaskResultDetail. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultDetail
   * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultDetailItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultDetailItem
   */
  addTaskResultDetail(options: Object) {
    return new Promise((resolve, reject) => {
      var data = options
      this.cw.runRequest('Pll/TaskResultDetail/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update TaskResultDetail
   *
   * @category TaskResults
   * @param {string} resultDetailId - Result Detail ID
   * @param {Object} options - attributes for new person. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultDetail
   * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultDetailItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultDetailItem
   */
  updateTaskResultDetail(resultDetailId: number, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        ResultDetailId: resultDetailId
      }
      var data = _.merge(options, data_init)
      this.cw.runRequest('Pll/TaskResultDetail/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all TaskResultDetails
   *
   * @category TaskResults
   * @return {Object} Returns Promise that represents a collection of PeopleRoleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
   */
  getTaskResultDetails() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/TaskResultDetail/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add TaskResultFeeInsert
   *
   * @category TaskResults
   * @param {Object} options - attributes for new TaskResultFeeInsert. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultFeeInsert
   * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultFeeInsertItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultFeeInsertItem
   */
  addTaskResultFeeInsert(options: Object) {
    return new Promise((resolve, reject) => {
      var data = options
      this.cw.runRequest('Pll/TaskResultFeeInsert/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete TaskResultFeeInsert
   *
   * @category TaskResults
   * @param {number} taskResultFeeInsertId - ID for TaskResultFeeInsert to be deleted.
   * @return {Object} Returns Promise that represents the ID Number of the deleted TaskResultFeeInsertItem.
   */
   deleteTaskResultFeeInsert(taskResultFeeInsertId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        TaskResultFeeInsertId: taskResultFeeInsertId
      }
      this.cw.runRequest('Pll/TaskResultFeeInsert/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete TaskResultFeeInsert(s) by Task ID
   *
   * @category TaskResults
   * @param {number} taskId - ID for Task parent of TaskResultFeeInsert(s) to be deleted.
   * @return {Object} Returns Promise that represents the ID Number of the Task parent of the deleted TaskResultFeeInsertItem(s).
   */
   deleteTaskResultFeeInsertByTaskId(taskId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        TaskId: taskId
      }
      this.cw.runRequest('Pll/TaskResultFeeInsert/DeleteByTaskId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update TaskResultFeeInsert
   *
   * @category TaskResults
   * @param {number} taskResultFeeInsertId - ID for TaskResultFeeInsert to be updated.
   * @param {number} taskId - Updated TaskID
   * @param {number} taskResultId - Updated TaskResultId
   * @param {number} [feeSetupId] - Fee setup ID update for TaskResultFeeInsert
   * @return {Object} Returns Promise that represents the ID Number of the updated TaskResultFeeInsertItem.
   */
   updateTaskResultFeeInsert(taskResultFeeInsertId: number, taskId: number, taskResultId: number, feeSetupId?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        TaskResultFeeInsertId: taskResultFeeInsertId,
        TaskId: taskId,
        TaskResultId: taskResultId
      }
      if(typeof(feeSetupId)!='undefined') {
        _.set(data, 'FeeSetupId', feeSetupId)
      }
      this.cw.runRequest('Pll/TaskResultFeeInsert/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Get all TaskResultFeeInsert
   *
   * @category TaskResults
   * @return {Object} Returns Promise that represents a collection of TaskResultFeeInsertItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultFeeInsertItem
   */
  getTaskResultFeeInsert() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/TaskResultFeeInsert/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
