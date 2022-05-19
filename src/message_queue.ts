import { CWError } from './error'
const _ = require('lodash')

export class MessageQueue {
  /**
   * @hidden
   */
  cw: any
  /**
   * Statuses -
   * Pending: 0,
   * Processing: 1,
   * Complete: 2,
   * Failed: 3
   */
  status: Object = {
    Pending: 0,
    Processing: 1,
    Complete: 2,
    Failed: 3
  }
  /**
   * Hook Types -
   * Unknown: 0,
   * ActivityUpdate: 1,
   * Email: 2,
   * WebHook: 3
   */
  hook_types: Object = {
    Unknown: 0,
    ActivityUpdate: 1,
    Email: 2,
    WebHook: 3
  }

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Process Webhook MessageQueue records by MessageQueueId
   *
   * @param {Array<number>} [ids] - List of MessageQueueId values
   * @param {boolean} [delete_successful] - automatically delete messages that complete with successful execution, default is false
   * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
   */
  processMessages(ids: Array<number>, delete_successful: boolean = false) {
    return new Promise((resolve, reject) => {
      let data = { Ids: ids, Delete: delete_successful}
      let path = 'General/WebHookEvent/ProcessMessages'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Messages specified in list of MessageQueueIds
   *
   * @param {Array<number>} ids - List of MessageQueueId values
   * @param {string} status -
   * @param {number} [maxcount] - Maximum number returned. Defaults to 15
   * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
   */
  get(ids: Array<number>, status: string, maxcount: number = 15) {
    return new Promise((resolve, reject) => {
      if(typeof(this.status[status])=='undefined') {
        reject(new CWError(1, 'Status provided does not exist or is mispelled.', {'provided': status, 'available':this.status}))
      }
      let data = {
        "Ids": ids,
        "MaxCount": typeof(maxcount)!='undefined' ? maxcount : 15,
        "Status": this.status[status]
      }
      let path = 'General/MessageQueue/ByIds'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Messages specified in list of MessageQueueIds
   *
   * @param {Array<number>} ids - List of MessageQueueId values
   * @param {string} status - automatically delete messages that complete with successful execution, default is false
   * @param {number} [hours_to_keep] - utomatically delete messages that complete with successful execution, default is false
   * @return {Array<>} Returns Promise object that represents a collection of QueueMessages which have been processed
   */
  delete(ids: Array<number>, status: string, hours_to_keep?: number) {
    return new Promise((resolve, reject) => {
      if(typeof(this.status[status])=='undefined') {
        reject(new CWError(2, 'Status provided does not exist or is mispelled.', {'provided': status, 'available':this.status}))
      }
      let data = {
        "Ids": ids,
        "Status": this.status[status],
        "HoursToKeep": hours_to_keep
      }
      let path = 'General/MessageQueue/Delete'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      }).catch(e => {
        reject(e)
      })
    })
  }

  // PreferencesList<GlobalPreference>
  // Base response type: CoreResponseBase
  // Get a list of message queue preferences
  // This method has no parameters
  preferences() {
    return new Promise((resolve, reject) => {
      let data = {}
      let path = 'General/MessageQueue/Preferences'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      }).catch(e => {
        reject(e)
      })
    })
  }

  search(parameters, max_results?: number) {
    let data: any
    return new Promise((resolve, reject) => {
      if(typeof(parameters.status)!=='undefined' && typeof(this.status[parameters.status])=='undefined') {
        reject(new CWError(3, 'Status provided does not exist or is mispelled.', {'provided': parameters.status, 'available':this.status}))
      } else if(typeof(parameters.status)!=='undefined' && typeof(this.status[parameters.status])!=='undefined') {
        data.Status = this.status[parameters.status]
      }
      if(typeof(max_results)!=='undefined') {
        data.MaxResults = max_results
      }
      let allowed_params = ['Id', 'HookId', 'HookType', 'Result', 'DateCreatedBegin', 'DateCreatedEnd', 'DateUpdatedBegin', 'DateUpdatedEnd']
      let disallowed_params = ['Status', 'MaxResults']
      _.forEach(parameters, (v, k) => {
        if(_.indexOf(allowed_params,k)!=-1 && _.indexOf(disallowed_params, k)==-1) {
          data[k] = v
        } else if(_.indexOf(disallowed_params, k)==-1) {
          reject(new CWError(4, 'Provided parameter does not exist or is mispelled.', {'provided': k, 'value': v, 'available':_.concat(allowed_params, disallowed_params)}))
        }
      })
      let path = 'General/MessageQueue/Search'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
        if(typeof(response.Value)=='undefined') {
          response.Value = []
        }
        resolve(response.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update queue message
   *
   * @param {Object} parameters - Provide allowed parameters:
   *
   *      {
   *        HookId: number,
   *        Id: number,
   *        Packet: string,
   *        Result: string,
   *        Status: string, // Available options: Pending, Processing, Complete, Failed
   *        HookType: string // Available options: Unknown, ActivityUpdate, Email, WebHook
   *      }
   *
   * @return {Object} Returns Promise object that represents an Object with the desired GIS service definitions
   */
  update(parameters: any) {
    let data: any
    return new Promise((resolve, reject) => {
      if(typeof(parameters.status)!=='undefined' && typeof(this.status[parameters.status])=='undefined') {
        reject(new CWError(3, 'Status provided does not exist or is mispelled.', {'provided': parameters.status, 'available':this.status}))
      } else if(typeof(parameters.status)!=='undefined' && typeof(this.status[parameters.status])!=='undefined') {
        data.Status = this.status[parameters.status]
      }
      if(typeof(parameters.hook_types)!=='undefined' && typeof(this.hook_types[parameters.hook_types])=='undefined') {
        reject(new CWError(3, 'Status provided does not exist or is mispelled.', {'provided': parameters.hook_types, 'available':this.hook_types}))
      } else if(typeof(parameters.hook_types)!=='undefined' && typeof(this.hook_types[parameters.hook_types])!=='undefined') {
        data.HookType = this.hook_types[parameters.hook_types]
      }
      let allowed_params = ['Id', 'HookId', 'Packet', 'Result']
      let disallowed_params = ['Status', 'HookType']
      _.forEach(parameters, (v, k) => {
        if(_.indexOf(allowed_params,k)!=-1 && _.indexOf(disallowed_params, k)==-1) {
          data[k] = v
        } else if(_.indexOf(disallowed_params, k)==-1) {
          reject(new CWError(5, 'Provided parameter does not exist or is mispelled.', {'provided': k, 'value': v, 'available':_.concat(allowed_params, disallowed_params)}))
        }
      })

      let path = 'General/MessageQueue/Update'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
        if(typeof(response.Value)=='undefined') {
          response.Value = []
        }
        resolve(response.Value)
      })
    })
  }

  updateMessageStatus(ids: number[], status: string, hours_to_keep?: number) {
    return new Promise((resolve, reject) => {
      if(typeof(this.status[status])=='undefined') {
        reject(new CWError(2, 'Status provided does not exist or is mispelled.', {'provided': status, 'available':this.status}))
      }
      let data = {
        "Ids": ids,
        "Status": this.status[status],
        "HoursToKeep": hours_to_keep
      }
      let path = 'General/MessageQueue/UpdateMessageStatus'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      })
    })
  }

  getWebooks(hook_ids) {
    return new Promise((resolve, reject) => {
      let data = {
        "HookIds": hook_ids
      }
      let path = 'General/MessageQueue/WebHooks'
      this.cw.runRequest(path, data).then((response: any) => {
        // TODO
      })
    })
  }
}
