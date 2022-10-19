export declare class CaseWorkflow {
    /**
     * @hidden
     */
    cw: any;
    /**
     * Task sub-methods
     */
    task: Object;
    /**
     * @hidden
     */
    constructor(cw: any);
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
    addTask(caObjectId: number, taskId: number, startPoint: number, endPoint: number, options?: Object): Promise<unknown>;
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
    addTaskResult(caObjectId: number, caTaskId: number, resultCode: number, resultID: number, resultSetID: number, options?: Object): Promise<unknown>;
    /**
     * Add Task Comment
     *
     * @category Comments
     * @param {number} caTaskId - The Case task ID of the task to add the comment to
     * @param {string} comment - The comment text
     * @return {Object} Returns Promise that represents an object describing CaTaskCommentsItemBase.
     */
    addTaskComment(caTaskId: number, comment: string): Promise<unknown>;
    /**
     * Get tasks by CaObjectId
     *
     * @category Tasks
     * @param {number} caObjectId - The Case Object to get the attached tasks
     * @param {boolean} checkRelatedItems - Wherther to check related items. Defaults to false.
     * @return {Object} Returns Promise that represents a collection of the CaTaskItemBases.
     */
    getTasksByCaseId(caObjectId: number, checkRelatedItems?: boolean): Promise<unknown>;
    /**
     * Get tasks by TaskIds
     *
     * @category Tasks
     * @param {Array<number>} caTaskIds - The IDs of the tasks to retrieve
     * @param {boolean} checkRelatedItems - Wherther to check related items. Defaults to false.
     * @return {Object} Returns Promise that represents a collection of the CaTaskItemBases.
     */
    getTasksById(caTaskIds: Array<number>, checkRelatedItems?: boolean): Promise<unknown>;
    /**
     * Get CaTaskResultsItem by CaTaskIds
     *
     * @category Task Results
     * @param {Array<number>} caTaskIds - The IDs of the tasks for which to retrieve results
     * @return {Object} Returns Promise that represents a collection of CaTaskResultsItems.
     */
    getResultsByTaskId(caTaskIds: Array<number>): Promise<unknown>;
    /**
     * Search for CaseTaskComments by CaTaskId
     *
     * @category Comments
     * @param {number} caTaskId - The task ID for which to retrieve attached comments
     * @return {Object} Returns Promise that represents a collection of CommentRecords.
     */
    getCommentsForTask(caTaskId: number): Promise<unknown>;
    /**
     * Search for CaseTaskComments by CaTaskId
     *
     * @category Comments
     * @param {Array<number>} caTaskIds - The task IDs for which to retrieve attached comments
     * @return {Object} Returns Promise that represents a collection of CaTaskCommentsItemBase.
     */
    getCommentsForTasks(caTaskIds: Array<number>): Promise<unknown>;
    /**
     * Updates a task
     *
     * @category Tasks
     * @param {number} caTaskId - The Case Object to attach the task to
     * @param {Object} [options] - Options for Task. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTask
     * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
     */
    updateTask(caTaskId: number, options?: Object): Promise<unknown>;
    /**
     * Update Task Comment
     *
     * @category Comments
     * @param {number} caTaskCommentId - The Case task ID of the task to add the comment to
     * @param {string} comment - The comment text
     * @param {number} commentId - Probably unnecessary?
     * @return {Object} Returns Promise that represents an object describing CaTaskCommentsItemBase.
     */
    updateTaskComment(caTaskCommentId: number, comment: string, commentId?: number): Promise<unknown>;
    /**
     * Updates a task
     *
     * @category Tasks
     * @param {number} caTaskId - The Case Object to attach the task to
     * @param {string} resultCode - The result code to set for the specified Task
     * @param {Object} [options] - Options for Task. Specify either or both TaskCompletedBy & TaskCompleteDate. See /{subdirectory}/apidocs/#/service-info/Pll/CaseTask
     * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
     */
    setTaskResult(caTaskId: number, resultCode: string, options?: Object): Promise<unknown>;
    /**
     * Deletes a task by TaskID
     *
     * @category Tasks
     * @param {number} caTaskId - The caTaskId for the task which should be deleted
     * @return {Object} Returns Promise that represents an object describing CaTaskItemBase.
     */
    deleteTask(caTaskId: number): Promise<unknown>;
    /**
     * Deletes a task by TaskID
     *
     * @category Tasks
     * @param {number} caTaskId - The caTaskId for the task which should be deleted
     * @return {Object} Returns Promise that represents the number of the CaObjectID
     */
    deleteTasksOnCase(caObjectId: number): Promise<unknown>;
    /**
     * Deletes tasks by TaskID
     *
     * @category Comments
     * @param {Array<number>} caTaskCommentIds - The comments to delete
     * @return {Object} Returns Promise that represents a dictionary of comment IDs.
     */
    deleteTaskComments(caTaskCommentIds: Array<number>): Promise<unknown>;
    /**
     * Search for Case Tasks. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Tasks
     * @param {Object} filters - The parameters to search by. (ResponsibleUserId, TaskAvailable, TaskComplete, TaskType)
     * @return {Object} Returns Promise that represents a collection of resulting CaTaskIDs
     */
    searchForTasks(filters?: Object): Promise<unknown>;
    /**
     * Search for CaseTaskResults Objects. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Task Results
     * @param {Object} filters - The parameters to search by. See: /{subdirectory}/apidocs/#/service-info/Pll/CaseTaskResults
     * @return {Object} Returns Promise that represents a collection of resulting CaTaskResultsItem
     */
    searchForTaskResults(filters?: Object): Promise<unknown>;
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
    addTaskAttachment(caTaskId: number, caObjectId: number, docName: number, file: any, locationType?: string): Promise<unknown>;
    /**
       * Gets each Document Attached to the specified Task
       *
       * @category Task Attachments
       * @param {number} caTaskId - The Task ID to attach the document to
       * @return {Object} Returns Promise that represents a collection of objects describing each Attachment on the provided task
       */
    getTaskAttachments(caTaskId: number): Promise<unknown>;
    /**
     * Deletes a task attachment by caRelDocId (Related Case Document ID). Same as RelDocs delete for case.
     *
     * @category Task Attachments
     * @param {number} caRelDocId - The caRelDocId for the related document which should be deleted
     * @return {Object} Returns Promise that represents the an object describing the deleted document.
     */
    deleteTaskAttachment(caRelDocId: number): Promise<unknown>;
}
