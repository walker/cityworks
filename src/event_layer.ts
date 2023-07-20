import { CWError } from './error'
const _ = require('lodash')

/**
 * A plugin that contains "event layer" methods for a Cityworks install
 */
export class EventLayer {
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
   * Update (enable/disable) an event layer
   *
   * @param {string} eventLayerId - which event layer to update
   * @param {boolean} enabled - true to enable, false to disable
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   update(eventLayerId: number, enabled: boolean) {
     return new Promise((resolve, reject) => {
       let data = {"EventLayerId": eventLayerId, "Enabled": enabled}
       this.cw.runRequest('Ams/EventLayer/Update', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Enable an event layer
   *
   * @param {string} eventLayerId - which event layer to update
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   enable(eventLayerId: number) {
     return this.update(eventLayerId, true);
   }

   /**
    * Disable an event layer
    *
    * @param {string} eventLayerId - which event layer to update
    * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
    */
    disable(eventLayerId: number) {
      return this.update(eventLayerId, false);
    }

  /**
   * ??
   *
   * @param {Array<number>} createBySids -
   * @param {Array<string>} queryTypes -
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   createByID(createBySids: Array<number>, queryTypes: Array<number>) {
     return new Promise((resolve, reject) => {
       let data = {"CreateBySids": createBySids, "QueryTypes": queryTypes}
       this.cw.runRequest('Ams/EurlQuery/IdNames', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Save user preferences
   *
   * @param {string} element - "VisibleQeIds"
   * @param {string} category - "qe-map"
   * @param {Object} defaultValue - {all: [3]}
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   updatePreferences(element: number, category: boolean, defaultValue: Object) {
     return new Promise((resolve, reject) => {
       let data = {"Element": element, "Category": category, "DefaultValue": defaultValue}
       this.cw.runRequest('Ams/Preferences/UserSave', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get all event layers
   *
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   all() {
     return new Promise((resolve, reject) => {
       let data = {}
       this.cw.runRequest('Ams/EventLayer/All', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get all EUrl Query Types
   *
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   queryTypes() {
     return new Promise((resolve, reject) => {
       let data = {}
       this.cw.runRequest('General/EurlQuery/QueryTypes', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get Preferences for User
   *
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   preferences() {
     return new Promise((resolve, reject) => {
       let data = {}
       this.cw.runRequest('Ams/Preferences/User', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get Styles for event layers
   *
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   styles() {
     return new Promise((resolve, reject) => {
       let data = {}
       this.cw.runRequest('Ams/EventLayer/Styles', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Get all event layers
   *
   * @param {boolean} includeDisabled - Defaults to false
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   getAllEventLayers(includeDisabled: boolean = false) {
     return new Promise((resolve, reject) => {
       let data = {"IncludeDisabled": includeDisabled}
       this.cw.runRequest('Ams/EventLayer/All', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * Filter event layers by provided search definitions
   *
   * @param {Array<number>} searchIds - Defaults to false
   * @param {Array<number>} eventLayerIds - Defaults to false
   * @return {Object} Returns Promise object which represents a xxxxx indicating xxxxxxx
   */
   filterEventLayersBySearches(searchIds: Array<number>, eventLayerIds: Array<number>) {
     return new Promise((resolve, reject) => {
       let data = {"SearchIds": searchIds, "EventLayerIds": eventLayerIds}
       this.cw.runRequest('Ams/EventLayer/Filters', data).then(r => {
         // console.log(r, 'response')
         resolve(r.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

  /**
   * eventLayer GIS endpoint, this may need to be a promise as well...
   *
   * @return {string} Returns string that is absolute URL for event layer GIS endpoint
   */
   getGISEndpoint(eventLayerId) {
     return this.cw.base_url + '/' + this.cw.settings.path + '/eventlayer/1/' + eventLayerId + '/rest/services/cw/FeatureServer/{#}?f=json'; // 1 for SR, 2 for WorkOrders, 3 for Inspections, 5 for PLL Cases
   }

}
