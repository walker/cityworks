import { CWError } from './error'
const _ = require('lodash')

export class Gis {
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
   * Get gis service configuration for user, group, domain, or service id
   *
   * @param {string} [whichType] - domain, group, mapservice, or user
   * @param {number} [whichId] - domain, group, mapservice, or user Id
   * @param {number} [getGisData] - If true, check for feature server JSON data, default is true
   * @param {Array<string>} [context] Filter returned list by specific context, i.e. Office, Field, Mobile, Public, etc. Default is all.
   * @return {Object} Returns Promise object that represents an Object with the desired GIS service definitions
   */
  getConfig(whichType, whichId, getGisData: boolean = true, context: Array<string> = []) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/Domain'
      whichType = whichType.toLowerCase()
      let data: {DomainId?: any, GroupId?: any, MapServiceId?: any, UserId?: any, GetGisData: boolean, Security: Array<string>}
      switch(whichType) {
        case 'domain':
          data = {DomainId:whichId, GetGisData: getGisData, Security: context}
          break
        case 'group':
          data = {GroupId:whichId, GetGisData: getGisData, Security: context}
          break
        case 'mapservice':
          data = {MapServiceId:whichId, GetGisData: getGisData, Security: context}
          break
        case 'user':
          data = {UserId:whichId, GetGisData: getGisData, Security: context}
          break
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
    * Get domain gis services
    *
    * @param {number} domainId - The mobile map cache Id to download
    * @return {Object} Returns Promise object that represents an Object with the domain's default GIS services
    */
  domain(domainId, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/Domain'
      let data = {
        DomainId: domainId
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
     * Download mobile map cache
     *
     * @param {number} cacheId - The mobile map cache Id to download
     * @return {Object} Returns Promise object that represents a streaming download (?)
     */
  downloadMobile(cacheId, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/DownloadMobileMapCache'
      let data = {
        MobileMapCacheId: cacheId
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get initial extent for user
   *
   * @return {Object} Returns Promise object that represents ... (?)
   */
  initialExtent() {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/InitialExtent'
      let data = {};
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get service request gis services
   *
   * @param {number} requestId - The WorkOrder to check against.
   * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
   * @return {Object} Returns Promise object that represents an Object with the specified request's entit(y|ies)
   */
  request(requestId, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/ServiceRequestConfiguration'
      let data = {
        RequestId: requestId,
        GetGisData: getGisData
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
     * Get inspection gis services
     *
     * @param {number} inspectionId - The WorkOrder to check against.
     * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
     * @return {Object} Returns Promise object that represents an Object with the specified inspection's entity
     */
  inspection(inspectionId, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/InspectionConfiguration'
      let data = {
        InspectionId: inspectionId,
        GetGisData: getGisData
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
     * Get workorder gis services
     *
     * @param {number} workOrderSid - The WorkOrder to check against.
     * @param {boolean} getGisData - If true, check for feature server JSON data, default is true.
     * @return {Object} Returns Promise object that represents an Object with the specified WorkOrder's entit(y|ies)
     */
  workOrder(workOrderSid, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/WorkOrderConfiguration'
      let data = {
        WorkOrderSid: workOrderSid,
        GetGisData: getGisData
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
     * Get service request gis services
     *
     * @param {Array<string>} [context] Filter returned list by specific context, i.e. Office, Field, Mobile, Public, etc. Default is all.
     * @param {boolean} [allDomains] services assigned to any domain the user belongs to, default is true
     * @param {boolean} [allGroups] services assigned to any groups the user belongs to regardless of domain, default is true
     * @param {boolean} [getGisData] If true, check for feature server JSON data, default is true
     * @return {Object} Returns Promise object that represents an Object with the user's GIS services
     */
  user(context: Array<string> = [], allDomains: boolean = true, allGroups: boolean = true, getGisData: boolean = true) {
    return new Promise((resolve, reject) => {
      let path = 'Gis/MapService/User'
      let data = {
        AllDomains: allDomains,
        AllGroups: allGroups,
        GetGisData: getGisData,
        Security: context
      }
      this.cw.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Geocode server info by ServerId
   *
   * @param {number} ServiceId
   * @return {Object} Returns Promise object that represents an object describing the provided Geocoder service configuration
   */
   // Gis/GeoCode/GeocodeServer

   /**
      * Get currently selected entities from the Cityworks install's session for your user
      * @return {Object} Returns Promise object that represents an Object with the currently-selected entities
      */
   selectedEntities() {
     return new Promise((resolve, reject) => {
       let path = 'General/AppData/SelectedEntities'
       this.cw.runRequest(path, {}).then((response: any) => {
         resolve(response.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }

   /**
      * Get attributes available for provided entity
      *
      * @param {string} entityType - The entity type to describe
      * @return {Object} Returns Promise object that represents a collection of attribute description objects
      */
   getEntityAttributes(entityType:string) {
     return new Promise((resolve, reject) => {
       let data = {EntityType: entityType}
       let path = 'AMS/Entity/Attributes'
       this.cw.runRequest(path, data).then((response: any) => {
         resolve(response.Value)
       }).catch(e => {
         reject(e)
       })
     })
   }
}
