export declare class RequestAdmin {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Get service request templates
     *
     * @category Requests Admin
     * @param {Object} searchData - search data
     * @return {Object} Returns Promise that represents a collection of all Service Request Templates
     */
    getTemplates(searchData: Object): Promise<unknown>;
}
