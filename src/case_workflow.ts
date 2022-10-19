import { CWError } from './error'
const _ = require('lodash')
import { Comments } from './comments'

export class CaseWorkflow {
  /**
   * @hidden
   */
  cw: any

  /**
   * Task sub-methods
   */
  task: Object

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.task = {
      comment: new Comments(cw, 'CaTask')
    }
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
   * Add Task Comment
   *
   * @category Comments
   * @param {number} caTaskId - The Case task ID of the task to add the comment to
   * @param {string} comment - The comment text
   * @return {Object} Returns Promise that represents an object describing CaTaskCommentsItemBase.
   */
   addTaskComment(caTaskId: number, comment: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskId: caTaskId,
        CommentText: comment
      }
      this.cw.runRequest('Pll/CaseTaskComments/Add', data).then(r => {
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
   * Search for CaseTaskComments by CaTaskId
   *
   * @category Comments
   * @param {number} caTaskId - The task ID for which to retrieve attached comments
   * @return {Object} Returns Promise that represents a collection of CommentRecords.
   */
   getCommentsForTask(caTaskId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        caTaskId: caTaskId
      }
      this.cw.runRequest('Pll/CaseTaskComments/ByCaTaskId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for CaseTaskComments by CaTaskId
   *
   * @category Comments
   * @param {Array<number>} caTaskIds - The task IDs for which to retrieve attached comments
   * @return {Object} Returns Promise that represents a collection of CaTaskCommentsItemBase.
   */
   getCommentsForTasks(caTaskIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        caTaskIds: caTaskIds
      }
      this.cw.runRequest('Pll/CaseTaskComments/ByCaTaskIds', data).then(r => {
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
   * Update Task Comment
   *
   * @category Comments
   * @param {number} caTaskCommentId - The Case task ID of the task to add the comment to
   * @param {string} comment - The comment text
   * @param {number} commentId - Probably unnecessary?
   * @return {Object} Returns Promise that represents an object describing CaTaskCommentsItemBase.
   */
   updateTaskComment(caTaskCommentId: number, comment: string, commentId?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskCommentId: caTaskCommentId,
        CommentText: comment
      }
      if(typeof(commentId)!='undefined') {
        _.set(data, 'CommentId', commentId)
      }
      this.cw.runRequest('Pll/CaseTaskComments/Update', data).then(r => {
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
      if(_.intersectionBy(_.keysIn(options), ['TaskCompleteDate', 'TaskCompletedBy']).length==0) {
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
   * Deletes tasks by TaskID
   *
   * @category Comments
   * @param {Array<number>} caTaskCommentIds - The comments to delete
   * @return {Object} Returns Promise that represents a dictionary of comment IDs.
   */
   deleteTaskComments(caTaskCommentIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskCommentIds: caTaskCommentIds
      }
      this.cw.runRequest('Pll/CaseTaskComments/Delete', data).then(r => {
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
      if(_.intersectionBy(_.keysIn(filters), ['ResponsibleUserId', 'TaskAvailable', 'TaskComplete', 'TaskType']).length==0) {
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

  /**
     * Adds a task to the case specified by the CaObectId.
     *
     * @category Task Attachments
     * @param {number} caTaskId - The Task ID to attach the document to
     * @param {number} caObjectId - The Case Object ID
     * @param {string} docName - The file name as it should display in the system
     * @param {string} locationType - The location of the file...leave blank
     * @param {any} file - The binary string for the file
     * @return {Object} Returns Promise that represents an object describing added Attachment
     */
  addTaskAttachment(caTaskId: number, caObjectId: number, docName: number, file: any, locationType?: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        CaTaskId: caTaskId,
        DocName: docName
      }
      if(typeof(locationType)!='undefined') {
        _.set(data, 'LocationType', locationType)
      }
      this.cw.runRequest('Pll/CaseRelDocs/AddTaskRelDoc', data, file).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
     * Gets each Document Attached to the specified Task
     *
     * @category Task Attachments
     * @param {number} caTaskId - The Task ID to attach the document to
     * @return {Object} Returns Promise that represents a collection of objects describing each Attachment on the provided task
     */
  getTaskAttachments(caTaskId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaTaskId: caTaskId
      }
      this.cw.runRequest('Pll/CaseRelDocs/ByCaTaskId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Deletes a task attachment by caRelDocId (Related Case Document ID). Same as RelDocs delete for case.
   *
   * @category Task Attachments
   * @param {number} caRelDocId - The caRelDocId for the related document which should be deleted
   * @return {Object} Returns Promise that represents the an object describing the deleted document.
   */
  deleteTaskAttachment(caRelDocId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaRelDocId: caRelDocId
      }
      this.cw.runRequest('PLL/CaseRelDocs/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}



