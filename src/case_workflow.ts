import { CWError } from './error'
const _ = require('lodash')

export class CaseWorkflow {
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
   * Adds a task to the case specified by the CaObectId.
   *
   * @category Tasks
   * @param {number} caObjectId - The Case Object to attach the task to
   * @param {number} taskId - The task ID to add to the case workflow
   * @param {number} startPoint - The start point in the workflow for the task
   * @param {number} endPoint - The end point in the workflow for the task
   * @param {Object} [options] - Options for the Task. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTask
   * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
   */
   addTask(caObjectId: number, taskId: number, startPoint: number, endPoint: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        TaskId: taskId,
        StartPoint: startPoint,
        EndPoint: endPoint
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseTask/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Task Result
   *
   * @category Task Results
   * @param {number} caObjectId - The Case Object to attach the task to
   * @param {number} caTaskId - The Case task ID to add the result to
   * @param {number} resultCode - The result Code
   * @param {number} resultID - The result ID
   * @param {number} resultSetID - The result set ID
   * @param {Object} [options] - Options for the Task. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTaskResults
   * @return {Object} Returns Promise that represents an object describing CaTaskResultsItem.
   */
   addTaskResult(caObjectId: number, caTaskId: number, resultCode: number, resultID: number, resultSetID: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        CaTaskId: caTaskId,
        ResultCode: resultCode,
        ResultID: resultID,
        ResultSetID: resultSetID
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseTaskResults/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get tasks by CaObjectId
   *
   * @category Tasks
   * @param {number} caObjectId - The Case Object to get the attached tasks
   * @param {boolean} checkRelatedItems - Wherther to check related items. Defaults to false.
   * @return {Object} Returns Promise that represents a collection of the CaTaskItemBases.
   */
   getTasksByCaseId(caObjectId: number, checkRelatedItems: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        CheckRelatedItems: checkRelatedItems
      }
      this.cw.runRequest('Pll/CaseTask/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get tasks by TaskIds
   *
   * @category Tasks
   * @param {Array<number>} caTaskIds - The IDs of the tasks to retrieve
   * @param {boolean} checkRelatedItems - Wherther to check related items. Defaults to false.
   * @return {Object} Returns Promise that represents a collection of the CaTaskItemBases.
   */
   getTasksById(caTaskIds: Array<number>, checkRelatedItems: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskIds: caTaskIds,
        CheckRelatedItems: checkRelatedItems
      }
      this.cw.runRequest('Pll/CaseTask/ByIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get CaTaskResultsItem by CaTaskIds
   *
   * @category Task Results
   * @param {Array<number>} caTaskIds - The IDs of the tasks for which to retrieve results
   * @return {Object} Returns Promise that represents a collection of CaTaskResultsItems.
   */
   getResultsByTaskId(caTaskIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskIds: caTaskIds
      }
      this.cw.runRequest('Pll/CaseTaskResults/ByCaTaskIds', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Updates a task
   *
   * @category Tasks
   * @param {number} caTaskId - The Case Object to attach the task to
   * @param {Object} [options] - Options for Task. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTask
   * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
   */
   updateTask(caTaskId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskId: caTaskId
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseTask/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Updates a task
   *
   * @category Tasks
   * @param {number} caTaskId - The Case Object to attach the task to
   * @param {string} resultCode - The result code to set for the specified Task
   * @param {Object} [options] - Options for Task. Specify either or both TaskCompletedBy & TaskCompleteDate. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTask
   * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
   */
   setTaskResult(caTaskId: number, resultCode: string, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskId: caTaskId
      }
      if(_.intersectionBy(options, ['TaskCompleteDate', 'TaskCompletedBy']).length==0) {
        reject(new CWError(2, 'At least one of the attributes (TaskCompletedBy, TaskCompleteDate) must be defined.'))
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseTask/SetResult', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Deletes a task by TaskID
   *
   * @category Tasks
   * @param {number} caTaskId - The caTaskId for the task which should be deleted
   * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
   */
   deleteTask(caTaskId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskId: caTaskId
      }
      this.cw.runRequest('Pll/CaseTask/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Deletes a task by TaskID
   *
   * @category Tasks
   * @param {number} caTaskId - The caTaskId for the task which should be deleted
   * @return {Object} Returns Promise that represents the number of the CaObjectID
   */
   deleteTasksOnCase(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseTask/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Tasks. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Tasks
   * @param {Object} filters - The parameters to search by. (ResponsibleUserId, TaskAvailable, TaskComplete, TaskType)
   * @return {Object} Returns Promise that represents a collection of resulting CaTaskIDs
   */
   searchForTasks(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['ResponsibleUserId', 'TaskAvailable', 'TaskComplete', 'TaskType']).length==0) {
        reject(new CWError(1, 'At least one of the attributes (ResponsibleUserId, TaskAvailable, TaskComplete, TaskType) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseTask/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for CaseTaskResults Objects. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Task Results
   * @param {Object} filters - The parameters to search by. See: /{subdirectory}/apidocs/#/service-info/Pll/CaseTaskResults
   * @return {Object} Returns Promise that represents a collection of resulting CaTaskResultsItem
   */
   searchForTaskResults(filters?: Object) {
    return new Promise((resolve, reject) => {
      var data = filters
      this.cw.runRequest('Pll/CaseTaskResults/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
