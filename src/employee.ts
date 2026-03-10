import { CWError } from './error'
import _ from 'lodash';

export interface EmployeeBase {
  LastName: string;
  FirstName?: string;
  Email?: string;
  Password?: string;
  AdDomain?: string;
  BenefitRate?: number;
  BenefitType?: number;
  DefaultImgPath?: string;
  DomainId?: number;
  EmailReq?: string;
  EmployeeSid?: number;
  EmployeeId?: string;
  GroupIds?: Array<number>;
  HolidayRate?: number;
  HolidayType?: number;
  HourlyRate?: number;
  IsActive?: boolean;
  IsDomain?: boolean;
  LicenseCodes?: Array<string>;
  LoginName?: string;
  MapServiceId?: number;
  MiddleInitial?: string;
  MobileMapCacheId?: number;
  Organization?: string;
  OtherRate?: number;
  OtherRateType?: number;
  OverheadRate?: number;
  OverheadType?: number;
  OvertimeRate?: number;
  OvertimeType?: number;
  Pager?: string;
  ShiftDiffRate?: number;
  ShiftDiffType?: number;
  StandbyRate?: number;
  StandbyType?: number;
  Title?: string;
  UniqueName?: string;
  WorkPhone?: string;
}

/**
 * A plugin that contains "general" methods for a Cityworks install
 */
export class Employee {
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
   * Add a new employee
   *
   * @param {EmployeeBase} employee - The employee information. `LastName` is a required field.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  add(employee: EmployeeBase) {
    return new Promise((resolve, reject) => {
      var data = employee
      this.cw.runRequest('Ams/Employee/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update existing employee(s)
   *
   * @param {number | Array<number>} employeeSids - The SIDs of the employees to update.
   * @param {EmployeeBase} employee - The employee information to update. `LastName` is a required field. `EmployeeSid` and `EmployeeId` cannot be included in the employeeProperties object, as those are used to identify which employees to update and could cause unintended consequences if included in the update information.
   * @return {Object} Returns Promise object that represents an object that is the updated user
   */
  update(employeeSids: number | Array<number>, employeeProperties: EmployeeBase) {
    return new Promise((resolve, reject) => {
      if(typeof employeeSids === 'number') {
        employeeSids = [employeeSids]
      }
      var startingData = {
        EmployeeSids: employeeSids
      }
      if(typeof employeeProperties.EmployeeId !== 'undefined')
        delete employeeProperties.EmployeeId // Don't let user update all Employees
      if(typeof employeeProperties.EmployeeSid !== 'undefined')
        delete employeeProperties.EmployeeSid // Don't let user update all Employees with one EmployeeSid
      var data = _.merge(startingData, employeeProperties)
      this.cw.runRequest('Ams/Employee/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get employee custom data fields by id
   *
   * @param {number} employeeSid - employeeSid with which the custom fields are associated
   * @param {string} custFieldIds - which custom field IDs to retrieve.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  customDataFields(employeeSid: number, custFieldIds?: Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSid: employeeSid
      }
      if(typeof custFieldIds !== 'undefined')
        _.set(data, 'CustFieldIds', custFieldIds)
      this.cw.runRequest('Ams/Employee/CustomDataFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all employees
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  all(inactive: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        IncludeInactive: inactive
      }
      this.cw.runRequest('Ams/Employee/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
  
  /**
   * Get the employees in the group with the given group ID.
   *
   * @param {string} groupId - Which group to get employee list.
   * @param {number} inactive - Whether to include inactive employees.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  byGroup(groupId: number, inactive: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        GroupId: groupId,
        IncludeInactive: inactive
      }
      this.cw.runRequest('Ams/Employee/ByGroup', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Get employee by ID
   *
   * @param {string} employeeSid - The SID of the employee to retrieve.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getById(employeeSid: number) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSid: employeeSid
      }
      this.getByIds([employeeSid]).then((r) => {
        const row = r as { EmployeeBase }[];
        resolve(row[0])
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Get employees by IDs
   *
   * @param {Array<number>} employeeSids - The SIDs of the employees to retrieve.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getByIds(employeeSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSids: employeeSids
      }
      this.cw.runRequest('Ams/Employee/ByIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Delete by ID
   *
   * @param {Array<number>} employeeSids - The SIDs of the employees to delete.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  delete(employeeSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSids: employeeSids
      }
      this.cw.runRequest('Ams/Employee/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Get groups that given employees are member of by employee sids.
   *
   * @param {Array<number>} employeeSids - The SIDs of the employees to retrieve groups for.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getGroupsByEmployeeSid(employeeSids: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeSids: employeeSids
      }
      this.cw.runRequest('Ams/Employee/Groups', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Add a licenses to an employee
   *
   * @param {Array<number>} employeeIds - The IDs of the employees to whom to add licenses.
   * @param {Array<string>} licenseCodes - The license codes to add.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  addLicenses(employeeIds: Array<Number>, licenseCodes: Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeIds: employeeIds,
        LicenseCodes: licenseCodes
      }
      this.cw.runRequest('Ams/Employee/AddLicensedItems', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete licenses from an employee
   *
   * @param {Array<number>} employeeIds - The IDs of the employees from whom to delete licenses.
   * @param {Array<string>} licenseCodes - The license codes to delete.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  deleteLicenses(employeeIds: Array<Number>, licenseCodes: Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {
        EmployeeIds: employeeIds,
        LicenseCodes: licenseCodes
      }
      this.cw.runRequest('Ams/Employee/DeleteLicensedItems', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Check names for uniqueness
   *
   * @param {Array<string>} namesToCheck - an array list of the names (strings) to check for uniqueness
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  checkNames(namesToCheck: Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {
        Names: namesToCheck
      }
      this.cw.runRequest('Ams/Employee/NamesAreUnique', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  } 

  /**
   * Search for employees
   *
   * @param {Array<string>} searchParameters - an object of employee properties to search for. Support properties are: `AdDomain`, `DomainId`, `Email`, `EmployeeId`, `EmployeeSid`, `LoginName`, `UniqueName`, `FirstName`, `Lastname`, `FullName`, `IsUser`, `Organization`
   * @param {boolean} active - search by active or all employees. Default is false (active only).
   * @param {number} maxResults - the maximum number of results to return. Default is 20.
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  search(searchParameters: { AdDomain?: Array<string>, DomainId?: Array<number>, Email?: Array<string>, EmployeeId?: Array<string>, EmployeeSid?: Array<number>, LoginName?: Array<string>, UniqueName?: Array<string>, FirstName?: Array<string>, LastName?: Array<string>, FullName?: Array<string>, IsUser?: Boolean, Organization?: Array<string>}, active: boolean = true, maxResults: number = 20) {
    var startingData = {
      IsActive: active,
      MaxResults: maxResults
    }
    var data = _.merge(startingData, searchParameters)
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Employee/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}