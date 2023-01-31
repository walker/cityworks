export declare class Case {
    /**
     * @hidden
     */
    cw: any;
    /**
     * Data Detail methods
     */
    data?: Object;
    /**
     * Asset (Address) methods
     */
    assets?: Object;
    /**
     * Workflow & task methods
     */
    workflow?: Object;
    /**
     * Payment, Receipt, & Fee methods
     */
    financial?: Object;
    /**
     * Commenting methods
     */
    comment?: Object;
    /**
     * PLL Administration methods
     */
    admin?: Object;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Create new case
     *
     * @category Cases
     * @param {number} caseTypeId - The case Type ID
     * @param {number} subTypeId - The case subType ID
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
     * @return {Object} Returns Promise that represents an object describing the newly-created case
     */
    create(caseTypeId: number, subTypeId: number, options?: Object): Promise<unknown>;
    /**
     * Create a child case
     *
     * @category Cases
     * @param {number} busCaseId - The case Type ID
     * @param {number} parentCaObjectId - The case subType ID
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
     * @return {Object} Returns Promise that represents an object describing the newly-created case
     */
    createChild(busCaseId: number, parentCaObjectId: number, options?: Object): Promise<unknown>;
    /**
     * Create a case from a Service Request
     *
     * @category Cases
     * @param {number} caseTypeId - The case Type ID
     * @param {number} subTypeId - The case subType ID
     * @param {number} requestId - The service request ID
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
     * @return {Object} Returns Promise that represents an object describing the newly-created case
     */
    createFromRequest(caseTypeId: number, subTypeId: number, requestId: number, options?: Object): Promise<unknown>;
    /**
     * Update a case
     *
     * @category Cases
     * @param {number} caObjectId - The case Object ID to update
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/data-type-info;dataType=CaObjectItemBase
     * @return {Object} Returns Promise that represents an object describing the updated case
     */
    update(caObjectId: number, options?: Object): Promise<unknown>;
    /**
     * Get cases by IDs
     *
     * @category Cases
     * @param {Array<number>} caObjectIds - The case Object ID to update
     * @return {Object} Returns Promise that represents a collection of objects describing the cases
     */
    getByIds(caObjectIds: Array<number>): Promise<unknown>;
    /**
     * Search for Cases. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Cases
     * @param {Object} filters - The parameter(s) to search by
     * @return {Object} Returns Promise that represents an Array of case Object IDs
     */
    search(filters: Object): Promise<unknown>;
    /**
     * Move a Case point
     *
     * @category Cases
     * @param {string} caObjectId
     * @param {number} x
     * @param {number} y
     * @param {Object} projection - Should include at least WKT _or_ WKID attribute. Can also include VcsWKID attribute.
     * @param {number} [z] - Optional Z coordinate
     * @return {Object} Returns Promise that represents an object describing the updated GISPoint
     */
    move(caObjectId: number, x: number, y: number, projection: {
        WKID?: string;
        WKT?: string;
        VcsWKID?: string;
    }, z?: number): Promise<unknown>;
    /**
     * Delete case
     *
     * @category Cases
     * @param {number} caObjectId - The case Object ID
     * @return {Object} Returns Promise that represents an object describing the deleted case
     */
    delete(caObjectId: number): Promise<unknown>;
}
