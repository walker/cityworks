export declare class WorkOrder {
    /**
     * @hidden
     */
    cw: any;
    /**
     * WorkOrder Administration methods
     */
    admin?: Object;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Create new workorders, including linkin to Requests & Inspections (optionally)
     *
     * @category WorkOrders
     * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @param {Array<number>} [inspectionIds] - The inspection IDs which the workorder should be linked to.
     * @param {Array<number>} [requestIds] - The inspection IDs which the workorder should be linked to.
     * @return {Object} Returns Promise that represents an object describing the newly-created workorder
     */
    create(wo_data: Object, inspectionIds?: Array<number>, requestIds?: Array<number>): Promise<unknown>;
    /**
     * Create new workorder linked to parent workorder
     *
     * @category WorkOrders
     * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
     * @return {Object} Returns Promise that represents an object describing the newly-created workorder
     */
    createFromParent(wo_data: Object, workOrderSId: string | number, s?: boolean): Promise<unknown>;
    /**
     * Update a WorkOrder
     *
     * @category WorkOrders
     * @param {object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated workorder
     */
    update(wo_data: Object): Promise<unknown>;
    /**
     * Combine WorkOrders
     *
     * @category WorkOrders
     * @param {Array<string>} fromWorkOrderIds - The workorder IDs which should be combined.
     * @param {string} toWorkOrderId - The work order ID for the single work order that should contain the info/entities from the other work orders
     * @param {boolean} cancelCombinedWorkOrders - If the work orders combined into the single should then be canceled, default is true.
     * @return {Object} Returns object that represents a collection of WorkOrders
     */
    combine(fromWorkOrderIds: Array<string>, toWorkOrderId: string, cancelCombinedWorkOrders?: boolean): Promise<unknown>;
    /**
     * Move a workorder's point
     *
     * @category WorkOrders
     * @param {string} workOrderId
     * @param {number} x
     * @param {number} y
     * @param {Object} projection - Should include WKT or WKID attribute. Can also include VcsWKID attribute.
     * @param {number} [z] - Optional Z coordinate
     * @return {Object} Returns Promise that represents an object describing the updated workorder
     */
    move(workOrderId: string, x: number, y: number, projection: Object, z?: number): Promise<unknown>;
    /**
     * Get a workorder by S/ID
     *
     * @category WorkOrders
     * @param {string|number} workOrderSId - The S/ID of the workorder to retrieve. # for SID, string for ID.
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents an object describing the workorder
     */
    getById(workOrderSId: string | number, s?: boolean): Promise<unknown>;
    /**
     * Get workorders by an array of S/IDs
     *
     * @category WorkOrders
     * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. If providing WorkOrderID, should be all strings, else provide all numbers for WorkOrderSID
     * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
     */
    getByIds(workOrderSIds: Array<string | number>): Promise<unknown>;
    /**
     * Get instructions by an array of workorders S/IDs
     *
     * @category WorkOrders
     * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. If providing WorkOrderID, should be all strings, else provide all numbers for WorkOrderSID
     * @return {Object} Returns Promise that represents an array of String, String describing the workorder instructions
     */
    getInstructions(workOrderSIds: Array<string | number>): Promise<unknown>;
    /**
     * Get the audit log for a specific workorder
     *
     * @category WorkOrder
     * @param {number} workOrderSId - A WorkOrder S/ID to get the audit log for. SID is default.
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
     */
    getAuditLog(workOrderSId: number): Promise<unknown>;
    /**
     * Get custom field values for the workorder S/IDs
     *
     * @category WorkOrders
     * @param {Array<string|number>} workOrderSIds - The workorder S/IDs to retrieve. #s for SID, strings for ID.
     * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
     */
    getCustomFieldValues(workOrderSIds: Array<string | number>): Promise<unknown>;
    /**
     * Add a comment to a workorder
     *
     * @category WorkOrders
     * @param {number} workOrderSId - The S/ID of the workorder to retrieve. SID is default.
     * @param {string} comment - The comment text to add.
     * @return {Object} Returns Promise that represents an object describing the comment added
     */
    comment(workOrderSId: string | number, comment: string): Promise<unknown>;
    /**
     * Get entities on an existing WorkOrder
     *
     * @category WorkOrders
     * @param {Array<string|number>} workOrderSIds - The workorder S/IDs which the entities should be added to. # for SID, string for ID.
     * @param {boolean} getGisData - Query gis to populate Entity.Attributes with current gis data. Defaults to true.
     * @return {Object} Returns object that represents a list of entities removed.
     */
    getEntities(workOrderSIds: Array<string | number>, getGisData?: boolean): Promise<unknown>;
    /**
     * Add entities to an existing WorkOrder
     *
     * @category WorkOrders
     * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
     * @param {Object} entityInfo - Entity info object including: (req) EntityType: {string}, (req) EntityUids: {Array<string>}, Facility_Id: {string}, Level_Id: {string}
     * @param {boolean} updateXY - Update work order xy after adding entit(y|ies), default is true.
     * @return {Object} Returns object that represents a list of entities removed.
     */
    addEntities(workOrderSId: string | number, entityInfo: Object, updateXY?: boolean): Promise<unknown>;
    /**
     * Update a WorkOrder entity
     *
     * @category WorkOrders
     * @param {string|number} workOrderSId - The workorder S/ID which the entities should be added to. # for SID, string for ID.
     * @param {Object} entityInfo - Entity info object including: (req) EntityType: {string}, (req) EntityUid: {string}, Facility_Id: {string}, Level_Id: {string}
     * @param {boolean} workComplete - Update WorkOrder completeness, default is true.
     * @return {Object} Returns object that represents a list of entities removed.
     */
    updateEntity(workOrderSId: string | number, entityInfo: Object, workComplete?: boolean): Promise<unknown>;
    /**
     * Remove entities from a work order. Provide WorkOrderId and either ObjectIds or EntityType and EntityUids
     *
     * @category WorkOrders
     * @param {number} workOrderSId - The workorder S/ID which the entities should be removed from. # for SID, string for ID.
     * @param {Object} entityInfo - Remove entities by WorkOrderEntity.ObjectId (not gis objectId).
     * @param {boolean} updateXY - Update work order xy after removing entities, default is true.
     * @return {Object} Returns object that represents a list of entities removed.
     */
    removeEntities(workOrderSId: string | number, entityInfo: Object, updateXY?: boolean): Promise<unknown>;
    /**
     * Cancel workorders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to cancel the matched workorders
     * @param {string} [cancelReason] - A reason for cancelling the workorder(s)
     * @param {datetime} [dateCancelled] - The date/time that it should be indicated the workorder was cancelled
     * @return {Object} Returns object that represents a collection of workorders
     */
    cancel(workOrderIds: Array<number>, cancelReason?: string, dateCancelled?: Date): Promise<unknown>;
    /**
     * Uncancel workorders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to uncancel the matched workorders
     * @return {Object} Returns object that represents a collection of workorders
     */
    uncancel(workOrderIds: Array<number>): Promise<unknown>;
    /**
     * Close WorkOrders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to close the matched WorkOrders
     * @return {Object} Returns object that represents a collection of WorkOrders
     */
    close(workOrderIds: Array<number>): Promise<unknown>;
    /**
     * Reopen closed WorkOrders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to reopen the matched WorkOrders
     * @return {Object} Returns object that represents a collection of WorkOrders
     */
    reopen(workOrderIds: Array<number>): Promise<unknown>;
    /**
     * Delete WorkOrders
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - An array of the IDs to delete the matched WorkOrders
     * @return {Object} Returns object that represents a collection of WorkOrder Ids which have been deleted
     */
    delete(workOrderIds: Array<number>): Promise<unknown>;
    /**
     * Get WorkOrderS/IDs connected to provided entities
     *
     * @category WorkOrder Search
     * @param {string} entityType - The entity type to find connected work orders
     * @param {Array<string>} entityUIDs - The list of entities to search for connected WorkOrders
     * @param {boolean} s - Get WorkOrderSids. Defaults to true. When false, returned list is WorkOrderIds
     * @param {Object} [search] - Any additional search properties of the work order (open/closed, etc)
     * @return {Object} Returns Promise that represents an array of WorkOrderS/IDs
     */
    getWOsByEntities(entityType: string, entityUids: Array<string>, search?: Array<string | number>, s?: boolean): Promise<unknown>;
    /**
     * Get WorkOrderSid and description for provided WorkOrderId
     *
     * @category WorkOrder Search
     * @param {string} workOrderId - The WorkOrderId for which to get the WorkOrderSid and description
     * @return {Object} Returns Promise that represents an object with WorkOrderS/IDs & Description
     */
    getSearchList(workOrderId: string): Promise<unknown>;
    /**
     * Get WorkOrder Employee lists
     *
     * @category WorkOrder Options
     * @param {string} listType - Which list (endpoint) to get. Includes Supervisors & SubmitTos.
     * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
     * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
     * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
     */
    getEmployeeLists(listType: string, includeInactiveEmployees?: boolean, domainIds?: Array<number>): Promise<unknown>;
    /**
     * Get SubmitTo list
     *
     * @category WorkOrder Options
     * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
     * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
     * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
     */
    getSubmitTos(includeInactiveEmployees?: boolean, domainIds?: Array<number>): Promise<unknown>;
    /**
     * Get Supervisors list
     *
     * @category WorkOrder Options
     * @param {boolean} includeInactiveEmployees - Whether to include inactive employees in the returned list. Defaults to false.
     * @param {Array<number>} [domainIds] - Filter to certain domains within the Cityworks instance.
     * @return {Object} Returns Promise that represents a collection of employees. See: /{subdirectory}/apidocs/#/data-type-info;dataType=EmployeeNameId
     */
    getSupervisors(includeInactiveEmployees?: boolean, domainIds?: Array<number>): Promise<unknown>;
    /**
     * Get Status Options
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents a collection of codes. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CodeDesc
     */
    getStatuses(): Promise<unknown>;
    /**
     * Get Categories
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of configured workorder category code descriptions
     */
    getCategories(): Promise<unknown>;
    /**
     * Get Priorities
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of configured workorder priorities
     */
    getPriorities(): Promise<unknown>;
    /**
     * Get Cycle From
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of string/string Cycle From options for workorders
     */
    getCycleFrom(): Promise<unknown>;
    /**
     * Get Cycle Intervals
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of string/string Cycle Interval options for workorders
     */
    getCycleIntervals(): Promise<unknown>;
    /**
     * Get Cycle Types
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of string/string Cycle Type options for workorders
     */
    getCycleTypes(): Promise<unknown>;
    /**
     * Get WorkOrder Stages
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of string/string Stage options for WorkOrders
     */
    getStages(): Promise<unknown>;
    /**
     * Get Expense Types
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of string/string Expense Type options for workorders
     */
    getExpenseTypes(): Promise<unknown>;
}
