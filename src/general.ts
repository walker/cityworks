import { CWError } from './error'
const _ = require('lodash')

/**
 * A plugin that contains "general" methods for a Cityworks install
 */
export class General {
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
   * Get notifications for currently authenticated user
   *
   * @return {Object} Returns Promise object that represents a collection of available notifications
   */
  notifications() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('General/ActivityNotification/User', {}).then((response: any) => {
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Find out if the current user is watching a particular activity (case, task, null [as a string])
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents a boolean indicating the currently authenticated user is watching the provided activity
   */
  amIWatching(activityType, activityId: number) {
    return new Promise((resolve, reject) => {
      let aType = {'null': 0, 'case': 1, 'task': 2}
      if(typeof(aType[activityType])=='undefined') {
        // reject with error
        reject(new CWError(1, "Activity type provided does not exist.", {provided: activityType, potential_activities: aType}))
      } else {
        let data = {"ActivityType": aType[activityType], "ActivityId": activityId}
        this.cw.runRequest('General/ActivityNotification/UserWatching', data).then(r => {
          // console.log(r, 'response')
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      }
    })
  }

  /**
   * Get CwMetatData by Type and CwSid
   *
   * @param {Array<number>} Ids
   * @param {string} TableName - INSPECTION, REQUEST, WORKORDER require View permission on the activities
   * @return {Object} Returns Promise object that represents a
   */
  getActivityMetadataByIds(ids: Array<number>, table: string) {
    return new Promise((resolve, reject) => {
      let tables = ["INSPECTION", "REQUEST", "WORKORDER"]
      if(_.indexOf(tables, table)==-1) {
        reject(new CWError(2, 'TableName provided does not exist or is mispelled.', {'provided': table, 'available':tables}))
      }
      let data = {
        "Ids": ids,
        "TableName": table
      }
      this.cw.runRequest('General/CwMetaData/ByTableNameSids', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get recent history for authenticated user
   *
   * @return {Object} Returns Promise object that represents a collection of RecentActivity objects
   */
  getHistory() {
    return new Promise((resolve, reject) => {
      let data = {}
      this.cw.runRequest('Ams/Search/RecentActivity', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cost summary for WorkOrder entities
   *
   * @param {Array<number>} ObjectIds
   * @return {Object} Returns Promise object that represents a
   */
  getWOEntityCostSummary(object_ids: Array<number>) {
    return new Promise((resolve, reject) => {
      let data = {
        "ObjectIds": object_ids
      }
      this.cw.runRequest('General/CostSummary/WorkOrderEntity', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get cost summary for WorkOrder entities selected through a search definition
   *
   * @param {number} SearchId - Search Definition Id
   * @return {Object} Returns Promise object that represents a
   */
  searchWOEntityCostSummary(search_id: number) {
    return new Promise((resolve, reject) => {
      let data = {
        "SearchId": search_id
      }
      this.cw.runRequest('General/CostSummary/WorkOrderEntitySearch', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Holidays
   *
   * @param {Date} startDate - Date to search for Holidays, including this date.
   * @param {Date} [endDate] - If not specified, Holidays _on_ startDate are returned. If specified, Holidays on startDate up to, but not including endDate are returned.
   * @return {Object} Returns Promise object that represents a list of the holiday(s) found
   */
  getHolidays(startDate: Date, endDate?: Date) {
    return new Promise((resolve, reject) => {
      let data = {}
      var api_path = 'General/Holidays/All'
      if(typeof(endDate)=='undefined') {
        _.set(data, "Date", startDate)
        var api_path = 'General/Holidays/ByDate'
      } else {
        _.set(data, "StartDate", startDate)
        _.set(data, "EndDate", endDate)
      }
      this.cw.runRequest(api_path, data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Holidays
   *
   * @param {Date} holiday - The holiday's date
   * @param {string} description - The holiday's name/description
   * @return {Object} Returns Promise object that represents a
   */
  addHolidays(holiday: Date, description: string) {
    return new Promise((resolve, reject) => {
      let data = {
        "Holiday": holiday,
        "Description": description
      }
      this.cw.runRequest('General/Holidays/Add', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Holidays
   *
   * @param {Array<Date>} holidays - List of datetimes which should have holidays deleted
   * @return {Object} Returns Promise object that represents a
   */
  deleteHolidays(holidays: Array<Date>) {
    return new Promise((resolve, reject) => {
      let data = {
        "Holidays": holidays
      }
      this.cw.runRequest('General/Holidays/Delete', data).then(r => {
        console.log(r)
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
