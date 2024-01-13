import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')

/**
 * ActivityLink interface for ActivityLinks
 *
 */
export interface ActivityLink {
  linkTypes: ReversibleMap<string, number>
  activityTypes: ReversibleMap<string, number>
  cw: any
}

/**
 * ActivityLinks implements the activity link functions via using the ActivityLink interface
 *
 */
export class ActivityLinks implements ActivityLink {
  /**
   * Activity types to map string to number for internal use. Activity types available are: "null", "case", "inspection", "request", "workorder", "wipcase"
   */
  activityTypes: ReversibleMap<string, number>
  /**
   * Link types to map string to number for internal use. Link types available are: "null", "parent", "related"
   */
  linkTypes: ReversibleMap<string, number>
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.activityTypes = new ReversibleMap<string, number>()
    this.activityTypes.set("null", 0)
    this.activityTypes.set("case", 1)
    this.activityTypes.set("inspection", 2)
    this.activityTypes.set("request", 3)
    this.activityTypes.set("workorder", 4)
    this.activityTypes.set("wipcase", 5)

    this.linkTypes = new ReversibleMap<string, number>()
    this.linkTypes.set("null", 0)
    this.linkTypes.set("parent", 1)
    this.linkTypes.set("related", 2)
  }

  /**
   * Create a new activity link between two items.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
   * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options: "null", "parent", "related"
   * @return {Object} Returns Promise object that represents a
   */
  add(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type: string = 'related') {
    return new Promise((resolve, reject) => {
      if(!this.activityTypes.has(source_type)) {
        reject(new CWError(1, 'Source type not found.', {'provided': source_type, 'options':this.activityTypes}))
      }
      if(!this.activityTypes.has(destination_type)) {
        reject(new CWError(2, 'Destination type not found.', {'provided': destination_type, 'options':this.activityTypes}))
      }
      if(!this.linkTypes.has(link_type)) {
        reject(new CWError(3, 'Link type not found.', {'provided': link_type, 'options':this.linkTypes}))
      }
      let data = {
        SourceType: this.activityTypes.get(source_type),
        SourceSid: source_sid,
        DestType: this.activityTypes.get(destination_type),
        DestSid: destination_sid,
        LinkType: this.linkTypes.get(link_type)
      }
      let path = 'General/ActivityLink/Add'
      this.cw.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the links for a particular node type by ID.
   *
   * @param {string} type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {Array<number>} sids - Array of numeric (S)IDs you wish to get of the specified type
   * @return {Object} Returns Promise object that represents a collection
   */
  get(type: string, sids: Array<number>) {
    return new Promise((resolve, reject) => {
      if(!this.activityTypes.has(type)) {
        reject(new CWError(4, 'Activity type not found.', {'provided': type, 'options':this.activityTypes}))
      }
      let data = {
        ActivityType: this.activityTypes.get(type),
        ActivitySids: sids
      }
      let _this = this
      let path = 'General/ActivityLink/ByActivitySids'
      this.cw.runRequest(path, data).then((response: any) => {
        let return_data = new Array()
        _.forEach(response.Value, (link, key) => {
          link.DestType = _this.activityTypes.get(link.DestType)
          link.SourceType = _this.activityTypes.get(link.SourceType)
          link.LinkType = _this.linkTypes.get(link.LinkType)
          return_data.push(link)
        })
        resolve(return_data)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Clone a current activity link.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to clone a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to clone a link between SID as destination and a particular source
   * @return {Object} Returns Promise object that represents a
   */
  clone(source_type: string, source_sid: number, destination_type: string, destination_sid: number) {
    return new Promise((resolve, reject) => {
      if(!this.activityTypes.has(source_type)) {
        reject(new CWError(5, 'Source type not found.', {'provided': source_type, 'options':this.activityTypes}))
      }
      if(!this.activityTypes.has(destination_type)) {
        reject(new CWError(6, 'Destination type not found.', {'provided': destination_type, 'options':this.activityTypes}))
      }
      let data = {
        SourceActivityType: this.activityTypes.get(source_type),
        SourceActivitySid: source_sid,
        DestinationActivityType: this.activityTypes.get(destination_type),
        DestinationActivitySid: destination_sid
      }
      let path = 'General/ActivityLink/CloneByActivitySid'
      this.cw.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete an activity link by ID
   *
   * @param {number} activity_link_id - The ID of the activity link one wishes to delete
   * @return {Object} Returns Promise object that represents a
   */
  delete(activity_link_id: number) {
    return new Promise((resolve, reject) => {
      let data = {
        ActivityLinkId: activity_link_id
      }
      let path = 'General/ActivityLink/Delete'
      this.cw.runRequest(path, data).then((response: any) => {
        // console.log('response_raw', response)
        resolve(response)
      }).catch(e => {
        // console.log('AL::Delete::e', e)
        reject(e)
      })
    })
  }

  /**
   * Remove a link by specifying everything.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
   * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options: "null", "parent", "related"
   * @return {Object} Returns Promise object that represents a
   */
  remove(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type: string = 'related') {
    return new Promise((resolve, reject) => {
      if(!this.activityTypes.has(source_type)) {
        reject(new CWError(8, 'Source type not found.', {'provided': source_type, 'options':this.activityTypes}))
      }
      if(!this.activityTypes.has(destination_type)) {
        reject(new CWError(9, 'Destination type not found.', {'provided': destination_type, 'options':this.activityTypes}))
      }
      if(!this.linkTypes.has(link_type)) {
        reject(new CWError(10, 'Link type not found.', {'provided': link_type, 'options':this.linkTypes}))
      }
      let data = {
        SourceType: this.activityTypes.get(source_type),
        SourceSid: source_sid,
        DestType: this.activityTypes.get(destination_type),
        DestSid: destination_sid,
        LinkType: this.linkTypes.get(link_type)
      }
      let path = 'General/ActivityLink/Remove'
      this.cw.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
