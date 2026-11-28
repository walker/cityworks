import { CWError } from './error'
import type { CityworksClient } from './client'
import ReversibleMap from 'reversible-map'
import _ from 'lodash'


/**
 * A plugin that contains "comments" methods
 */
export class Comments {
  /**
   * @hidden
   */
  cw: CityworksClient

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
  constructor(cw: CityworksClient, activityType: string) {
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
   * The IsPublic value to send: what was asked for, else for case (PLL) comments private unless the account is a public user. Other activities
   * are left to Cityworks.
   */
  private visibility(isPublic?: boolean): boolean | undefined {
    if(typeof(isPublic)!='undefined') {
      return isPublic
    }
    if(this.currentActivityType=='CaObject') {
      return this.cw.isPublicUser()
    }
    return undefined
  }

  /**
   * Add a comment - for adding a comment to an object when the object is already known. Always call comment.add from request, workorder or briefcase (case); inspections do not support comments yet.
   * 
   * @param {number} sid - The SID of the activity to which the comment should be attached
   * @param {string} comment - The text for the comment
   * @param {boolean} [isPublic] - Whether the comment is visible to the public. Case (PLL) comments are always sent with this value and default to private; they default to public only when the connected account is a public (non-employee) user (`publicUser` setting). Make it a deliberate choice.
   * @return {Object} Returns a Promise which represents a CommentRecord object
   */
  add(sid: number, comment: string, isPublic?: boolean) {
    return new Promise((resolve, reject) => {
      var data = {
        ActivityType: this.activityTypes.get(this.currentActivityType),
        ActivitySid: sid,
        Comments: comment
      }
      const visibility = this.visibility(isPublic)
      if(typeof(visibility)!='undefined') {
        _.set(data, 'IsPublic', visibility)
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
   * Case (PLL) comments must be updated with their visibility (Cityworks fails the update otherwise), and updating must never change it by accident.
   * So for a case comment either say what it should be (`isPublic`), or give the case it belongs to (`activitySid`) and the comment's current
   * visibility is looked up and kept. With neither the update is rejected (code 3), unless the connected account is a public user (`publicUser` setting), whose comments are public.
   *
   * @param {number} id - The ID of the comment which should be updated
   * @param {string} comment - The new text for the updated comment
   * @param {boolean|Object} [visibility] - `true`/`false` to make the comment public/private, or `{isPublic?: boolean, activitySid?: number}`. Leave it out to keep the comment as it is: other activities leave it to Cityworks, case comments need `activitySid`.
   * @return {Object} Returns a Promise which represents a CommentRecord object
   */
  update(id: number, comment: string, visibility?: boolean | {isPublic?: boolean, activitySid?: number}) {
    return new Promise((resolve, reject) => {
      const options: {isPublic?: boolean, activitySid?: number} = typeof(visibility)=='boolean' ? {isPublic: visibility} : (visibility || {})
      var data = {
        ActivityType: this.activityTypes.get(this.currentActivityType),
        CommentId: id,
        Comments: comment
      }
      const send = () => {
        this.cw.runRequest('Ams/Comment/Update', data).then((response: any) => {
          resolve(response.Value)
        }).catch(e => {
          reject(e)
        })
      }
      if(typeof(options.isPublic)!='undefined') {
        _.set(data, 'IsPublic', options.isPublic)
        send()
      } else if(this.currentActivityType!='CaObject') {
        send()
      } else if(typeof(options.activitySid)!='undefined') {
        // keep whatever visibility the comment has now
        this.get([options.activitySid]).then((existing: any) => {
          const current = _.find(existing, (c: any) => c.CommentId == id)
          if(typeof(current)=='undefined') {
            reject(new CWError(4, 'Comment ' + id + ' was not found on ' + this.currentActivityType + ' ' + options.activitySid + '.', {'CommentId': id, 'ActivitySid': options.activitySid}))
            return
          }
          _.set(data, 'IsPublic', current.IsPublic === true)
          send()
        }).catch(e => {
          reject(e)
        })
      } else if(this.cw.isPublicUser()) {
        _.set(data, 'IsPublic', true)
        send()
      } else {
        reject(new CWError(3, 'Case comments must be updated with isPublic or the case they belong to (activitySid), so their visibility is never changed by accident.', {'CommentId': id}))
      }
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
        // Cityworks answers with a dictionary keyed by id and fails when an id is repeated
        const uniqueSids = _.uniq(sids)
        var data = {
          ActivitySids: uniqueSids,
          ActivityType: this.activityTypes.get(this.currentActivityType),
        }
        this.cw.runRequest('Ams/Comment/ByActivitySids', data).then((response: any) => {
          if(uniqueSids.length==1) {
            resolve(response.Value[uniqueSids[0]])
          } else {
            resolve(response.Value)
          }
        }).catch(e => {
          reject(e)
        })
      } else {
        reject(new CWError(2, 'At least one activity S/ID must be provided.', {'provided': sids}))
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
  getPredefined(problemSid: number = 0, category?: string) {
    return new Promise((resolve, reject) => {
      var data = {}
      _.set(data, 'ProblemSid', problemSid)
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
