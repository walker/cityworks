export declare class WorkOrder {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Create new workorders
     *
     * @category WorkOrders
     * @param {Object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the newly-created workorder
     */
    create(wo_data: Object): Promise<unknown>;
    /**
     * Update a workorder
     *
     * @category WorkOrders
     * @param {object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated workorder
     */
    update(wo_data: Object): Promise<unknown>;
    /**
     * Move a workorder's point
     *
     * @category WorkOrders
     * @param {number} workOrderId
     * @param {number} x
     * @param {number} y
     * @param {Object} projection - Should include WKT or WKID attribute. Can also include VcsWKID attribute.
     * @param {number} [z] - Optional Z coordinate
     * @return {Object} Returns Promise that represents an object describing the updated workorder
     */
    move(workOrderId: number, x: number, y: number, projection: Object, z?: number): Promise<unknown>;
    /**
     * Get a workorder by S/ID
     *
     * @category WorkOrders
     * @param {number} workOrderSId - The S/ID of the workorder to retrieve
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents an object describing the workorder
     */
    getById(workOrderSId: number, s?: boolean): Promise<unknown>;
    /**
     * Get workorders by an array of S/IDs
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderSIds - The workorder S/IDs to retrieve
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
     */
    getByIds(workOrderSIds: Array<number>, s?: boolean): Promise<unknown>;
    /**
     * Get the audit log for a specific workorder
     *
     * @category WorkOrder
     * @param {number} id - A WorkOrder S/ID to get the audit log for. SID is default.
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
     */
    getAuditLog(id: number, s?: boolean): Promise<unknown>;
    /**
     * Get custom field values for the workorder S/IDs
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderSIds - The workorder S/IDs to retrieve
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents a collection of Objects describing the workorders
     */
    getCustomFieldValues(workOrderSIds: Array<number>, s?: boolean): Promise<unknown>;
    /**
     * Add a comment to a workorder
     *
     * @category WorkOrders
     * @param {number} workOrderSId - The S/ID of the workorder to retrieve. SID is default.
     * @param {string} comment - The comment text to add.
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false). Defaults to true.
     * @return {Object} Returns Promise that represents an object describing the comment added
     */
    comment(workOrderSId: Array<number>, comment: string, s?: boolean): Promise<unknown>;
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
     * Get categories
     *
     * @category WorkOrder Options
     * @return {Object} Returns Promise that represents an array of workorder category code descriptions
     */
    getCategories(): Promise<unknown>;
}
