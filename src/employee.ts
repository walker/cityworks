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
   * @param {number | Array<number>} employeeSids - The IDs of the employees to update.
   * @param {EmployeeBase} employee - The employee information. `LastName` is a required field.
   * @return {Object} Returns Promise object that represents an object that is the updated user
   */
  update(employeeSids: number | Array<number>, employee: EmployeeBase) {
    return new Promise((resolve, reject) => {
      var data = employee
      if(typeof(employeeSids) == 'number') {
        _.set(data, 'EmployeeSids', [employeeSids])
      } else {
        _.set(data, 'EmployeeSids', employeeSids)
      }
      this.cw.runRequest('Ams/Employee/Update', data).then(r => {
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
   * Get al employees
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
    //   var data = {
    //     IncludeInactive: inactive
    //   }
    //   if(typeof(options)!='undefined') {
    //     data = _.merge(data, options)
    //   }
    //   this.cw.runRequest('Pll/CaseFlags/Add', data).then(r => {
    //     resolve(r.Value)
    //   }).catch(e => {
    //     reject(e)
    //   })
    // })
  /**
   * Get the employees in the group with the given group ID.
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  byGroup() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Get employee by ID
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getById() {
    return new Promise((resolve, reject) => {
      // Call byIds
    })
  } 

  /**
   * Get employees by IDs
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getByIds() {
    return new Promise((resolve, reject) => {
      // Call byIds
    })
  } 

  /**
   * Delete by ID
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  delete() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Get groups that given employees are member of by employee sid.
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getGroupsByEmployeeSid() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Check names for uniqueness
   *
   * @param {Array<string>} namesToCheck - an array list of the names (strings) to check for uniqueness
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  checkNames(names: Array<string>) {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Search for employees
   *
   * @param {string} search - The search object to filter employee records against.
   * @return {Object} Returns Promise object that represents an array of employees matching the search
   */
  search(search: any) {
    return new Promise((resolve, reject) => {
      var data = search
      this.cw.runRequest('Ams/Employee/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get employee custom data fields by id
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  customDataFields() {
    return new Promise((resolve, reject) => {
    })
  } 

  
}