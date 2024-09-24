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
   * 
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

  //Pll/PeopleRole/All // gets all people roles available
  //Pll/CasePeople/ByCaObjectId
  //Pll/CasePeople/Delete
  //Pll/CasePeople/DeleteByCaObjectId
  //Pll/CasePeople/Search
  //Pll/CasePeople/SearchObject

}
