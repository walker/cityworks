import { CWError } from './error'
const _ = require('lodash')

export class CasePeople {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw: Object) {
    this.cw = cw
  }

  /**
   * Add a people record to a case
   *
   * @category Case People
   * @param {number} caObjectId - The Case Object ID for the case to which to add the person
   * @param {number} name - The name of the person to add to the case.
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CasePeople for more options.
   * @return {Object} Returns Promise that represents an object describing the newly-added person. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPeopleItemBase
   */
  add(caObjectId: number, name: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaObjectId: caObjectId,
        Name: name
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CaseFees/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all the people roles available
   *
   * @category Case People
   * @return {Object} Returns Promise that represents an collection of configured People Roles
   */
  getRoles() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Pll/PeopleRole/All', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get people records attached to a specific case
   *
   * @category Case People
   * @param {number} caObjectId - The Case Object ID for the case to which to add the person
   * @return {Object} Returns Promise that represents an object describing the newly-added person. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPeopleItemBase
   */
  get(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
      }
      this.cw.runRequest('Pll/CasePeople/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete specific people records
   *
   * @category Case People
   * @param {number} caPeopleId - The Case Object ID for the case to which to add the person
   * @return {Object} Returns Promise that represents the result of the delete operation.
   */
  delete(caPeopleId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaPeopleId: caPeopleId,
      }
      this.cw.runRequest('Pll/CasePeople/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete all people records attached to a specific case
   *
   * @category Case People
   * @param {number} caObjectId - The Case Object ID for the case to which to add the person
   * @return {Object} Returns Promise that represents the result of the delete operation.
   */
  deleteAll(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
      }
      this.cw.runRequest('Pll/CasePeople/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for people records
   *
   * @category Case People
   * @param {number} searchOptions - Where you specify search options that assume a logical 'and' operation
   * @param {boolean} idsOnly - If you only wants the IDs of the people records that match the search criteria, set this to true. Otherwise, set it to false.
   * @return {Object} Returns Promise that represents an array of people record IDs that match the search criteria.
   */
  search(searchOptions: {
    AddressLine1: string
    AddressLine2: string
    CaObjectId: number
    CaPeopleId: number
    CityName: string
    CountryCode: string
    CountryName: string
    Email: string
    Name: string
    PhoneHome: string
    PhoneMobile: string
    PhoneWork: string
    RoleCode: string
    RoleDesc: string
    RoleId: number
    StateCode: string
    StateName: string
    ZipCode: string
  }, idsOnly: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = searchOptions
      var runUrl: string = 'Pll/CasePeople/SearchObject'
      if(idsOnly) {
        runUrl = 'Pll/CasePeople/Search'
      }
      this.cw.runRequest(runUrl, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
