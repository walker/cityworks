import { CWError } from './error'
import ReversibleMap from 'reversible-map'
const _ = require('lodash')


/**
 * A plugin that contains "comments" methods
 */
export class Comments {
  /**
   * @hidden
   */
  cw: any

  /**
   * Storage of all potential activity types which comments can be attached to: Unknown, Request, WorkOrder, CaTask, CaObject, CaCorrection, Project, Contract
   */
  activityTypes: ReversibleMap<string, number>

  /**
   * Storage of object's active activityType
   */
  currentActivityType: string

  /**
   * @hidden
   */
  constructor(cw: any, activityType: string) {
    this.cw = cw
    this.activityTypes = new ReversibleMap<string, number>()
    this.activityTypes.set("Unknown", 0)
    this.activityTypes.set("Request", 1)
    this.activityTypes.set("WorkOrder", 2)
    this.activityTypes.set("CaTask", 3)
    this.activityTypes.set("CaObject", 4)
    this.activityTypes.set("CaCorrection", 5)
    this.activityTypes.set("Project", 6)
    this.activityTypes.set("Contract", 7)

    if(!this.activityTypes.has(activityType)) {
      throw new CWError(1, 'Comment activity type not found.', {'provided': activityType, 'options':this.activityTypes})
    }
    this.currentActivityType = activityType
  }

  /**
   * Add a comment - for adding a comment to an object when the object is already known. Always call comment.add from request, case, workorder, or inspection.
   * 
   * @param {number} sid - The SID of the activity to which the comment should be attached
   * @param {string} comment - The text for the comment
   * @return {Object} Returns a Promise which represents a CommentRecord object
   */
  add(sid: number, comment: string) {
    return new Promise((resolve, reject) => {
      var data = {
        ActivityType: this.activityTypes.get(this.currentActivityType),
        ActivitySid: sid,
        Comments: comment
      }
      this.cw.runRequest('Ams/Comment/Add', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update a comment
   *
   * @param {number} id - The ID of the comment which should be updated
   * @param {string} comment - The new text for the updated comment
   * @return {Object} Returns a Promise which represents a CommentRecord object
   */
  update(id: number, comment: string) {
    return new Promise((resolve, reject) => {
      var data = {
        ActivityType: this.activityTypes.get(this.currentActivityType),
        CommentId: id,
        Comments: comment
      }
      this.cw.runRequest('Ams/Comment/Update', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get comments for activity items
   *
   * @param {Array<number>} sids - The options SIDs to get comments for.
   * @return {Object} Returns Promise object that represents a collection of available comments
   */
  get(sids: Array<number>) {
    return new Promise((resolve, reject) => {
      if(typeof(sids)!='undefined' && sids !=null) {
        var data = {
          ActivitySids: sids,
          ActivityType: this.activityTypes.get(this.currentActivityType),
        }
        this.cw.runRequest('Ams/Comment/ByActivitySids', data).then((response: any) => {
          if(sids.length==1) {
            resolve(response.Value[sids[0]])
          } else {
            resolve(response.Value)
          }
        })
      }
    })
  }

  /**
   * Get pre-defined comments for activityTypes
   *
   * @param {number} problemSid - The ProblemSid if currentActivityType is (Service) Request
   * @param {string} [category] - Only applies to WorkOrder and ServiceRequest category comments.
   * @return {Object} Returns Promise object that represents a collection of available comment templates.
   */
  getPredefined(problemSid?: number, category?: string) {
    return new Promise((resolve, reject) => {
      var data = {}
      if(this.currentActivityType=='Request') {
        _.set(data, 'ProblemSid', problemSid)
      }
      if(typeof(category)!='undefined' && (this.currentActivityType=='Request' || this.currentActivityType=='WorkOrder')) {
        _.set(data, 'Category', category)
      }
      _.set(data, 'ActivityType', this.activityTypes.get(this.currentActivityType))
      this.cw.runRequest('Ams/Comment/PredefinedComments', data).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  // /**
  //  * Get pre-set comments for activityTypes
  //  *
  //  * @param {Array<string>} [activityTypes] - Provide a list of activity types. Defaults to current activity type.
  //  * @param {Array<string>} [categories] - Only applies to WorkOrder and ServiceRequest category comments.
  //  * @return {Object} Returns Promise object that represents a collection of available comment templates.
  //  */
  // getForActivityList(activityTypes?: Array<string>, categories?: Array<string>) {
  //   return new Promise((resolve, reject) => {
  //     var data = {}
  //     if(typeof(activityTypes)!='undefined') {
  //       // TODO: iterate through it and output numeric types
  //       _.set(data, 'ActivityTypes', activityTypes)
  //     } else {
  //       _.set(data, 'ActivityTypes', [this.activityTypes.get(this.currentActivityType)])
  //     }
  //     if(typeof(categories)!='undefined') {
  //       _.set(data, 'Categories', categories)
  //     }
  //     console.log(data, 'data')
  //     this.cw.runRequest('Ams/Comment/ByActivityTypes', data).then((response: any) => {
  //       resolve(response.Value)
  //     }).catch(e => {
  //      reject(e)
  //    })
  //   })
  // }

}
