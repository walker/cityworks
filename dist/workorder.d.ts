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
     * @return {Object} Returns Promise that represents an object describing the newly-created work order
     */
    create(wo_data: Object): Promise<unknown>;
    /**
     * Update a work order
     *
     * @category WorkOrders
     * @param {object} wo_data - See /{subdirectory}/apidocs/#/data-type-infodataType=WorkOrder on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated work order
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
     * @return {Object} Returns Promise that represents an object describing the updated work order
     */
    move(workOrderId: number, x: number, y: number, projection: Object, z?: number): Promise<unknown>;
    /**
     * Get a work order by SID
     *
     * @category WorkOrders
     * @param {number} workOrderSid - The SID of the work order to retrieve
     * @return {Object} Returns Promise that represents an object describing the work order
     */
    getBySid(workOrderSid: number): Promise<unknown>;
    /**
     * Get a work order by ID
     *
     * @category WorkOrders
     * @param {number} workOrderId - The ID of the request to retrieve
     * @return {Object} Returns Promise that represents an object describing the work order
     */
    getById(workOrderId: number): Promise<unknown>;
    /**
     * Get work orders by array of SIDs
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderSids - The request SIDs to retrieve
     * @return {Object} Returns Promise that represents a collection of Objects describing the work orders
     */
    getBySids(workOrderSids: Array<number>): Promise<unknown>;
    /**
     * Get work orders by array of IDs
     *
     * @category WorkOrders
     * @param {Array<number>} workOrderIds - The request IDs to retrieve
     * @return {Object} Returns Promise that represents a collection of Objects describing the work orders
     */
    getByIds(workOrderIds: Array<number>): Promise<unknown>;
    /**
     * Get the audit log for a specific work order
     *
     * @category WorkOrder
     * @param {number} id - A Work Order SID or ID to get the audit log for. SID is preferred.
     * @param {boolean} s - Whether first argument is an SID (true) or an ID (false)
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
     */
    getAuditLog(id: number, s?: boolean): Promise<unknown>;
}
