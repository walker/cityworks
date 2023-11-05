export declare class Search {
    /**
     * @hidden
     */
    cw: any;
    /**
     * Search Types: Null, Request, WorkOrder, Inspection, Contract, Permit, GIS, PermitTask, PermitAddress, InspCommon, Case, WorkOrderEntity, StoreTransaction, Requisition, Material, WorkActivity, MaterialLeaf, WoTemplate, Unknown, Employee, MessageQueue, Analytics, TokenState, AssetCalculationResult, Equipment, CustomerAccount, InspTemplate, ProblemLeaf, AssetSplitRecord, PavementInsp, TvInspection, Projects
     */
    searchTypes: Object;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Do a "quick" search for an ID or Case Number
     *
     * @category Quick Search
     * @param {string} text - text to search the system for
     * @return {Object} Returns Promise object that represents a collection of the currently authenticated user's notifications
     */
    quick(text: string): Promise<unknown>;
    /**
     * Execute a saved search
     *
     * @category Search
     * @param {number} searchId - SearchId to execute
     * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/Ams/Search
     * @return {Object} Returns Promise object that represents a list of Objects
     */
    execute(searchId: number, options?: {
        EmployeeSid?: number;
        ExcludeEmptyXY?: boolean;
        Extent?: Object;
        Frequency?: boolean;
        IdsOnly?: boolean;
        IncludeSearchOrder?: boolean;
        MaxResults?: number;
        ResultFields?: Array<string>;
        TotalOnly?: boolean;
    }): Promise<unknown>;
    /**
     * Get a list of the saved searches by search type and specific entity types OR employeeSid/domainId. You cannot search for saved searches by both specific entity type AND employeeSid/domainId.
     *
     * @category Search
     * @param {string} searchType - Get the saved searches for a particular type
     * @param {Array<string>} [applyToEntities] - Restrict GIS searches to specified entity types
     * @param {number} [employeeSid] - The employee SID to retrieve the searches as
     * @param {number} [domainId] - The domain ID of the domain to search
     * @return {Object} Returns Promise object that represents a collection of SearchDefinitionName
     */
    getSaved(searchType: string, applyToEntities?: Array<string>, employeeSid?: number, domainId?: number): Promise<unknown>;
    /**
     * Get a list display fields for a Search Type
     *
     * @category Search Options
     * @param {string} searchType - Restrict GIS searches to specified entity types
     * @return {Object} Returns Promise object that represents a collection of SearchDisplayFields
     */
    displayFields(searchType: string): Promise<unknown>;
    /**
     * Get a list search types
     *
     * @category Search Options
     * @return {Object} Returns Promise object that represents a collection of SearchTypeInfo objects
     */
    types(): Promise<unknown>;
    /**
     * Enable Service URLs on Saved Searches
     *
     * @category Search Options
     * @param {Array<number>} searchIds - Search IDs to enable eURL on
     * @return {Object} Returns Promise object that represents a dictionary of SearchIds and EURL booleans
     */
    enableServices(searchIds: Array<number>): Promise<unknown>;
    /**
     * Disable Service URLs on Saved Searches
     *
     * @category Search Options
     * @param {Array<number>} searchIds - Search IDs to enable eURL on
     * @return {Object} Returns Promise object that represents a dictionary of SearchIds and EURL booleans
     */
    disableServices(searchIds: Array<number>): Promise<unknown>;
    /**
     * Get a search definition
     *
     * @category Search Definitions
     * @param {number} searchId - SearchId to get.
     * @param {number} employeeSid - Enforces employee security settings on search definition if provided.
     * @return {Object} Returns Promise object that represents a SearchDefinition object
     */
    getDefinition(searchId: number, employeeSid?: number): Promise<unknown>;
    /**
     * Get search definitions
     *
     * @category Search Definitions
     * @param {Array<number>} searchIds - SearchIds to get.
     * @param {number} employeeSid - Enforces employee security settings on search definition if provided.
     * @return {Object} Returns Promise object that represents a collection of SearchDefinition objects
     */
    getDefinitions(searchIds: Array<number>, employeeSid?: number): Promise<unknown>;
    /**
     * Get search definition names
     *
     * @category Search Definitions
     * @param {Array<number>} searchIds - SearchIds to get.
     * @return {Object} Returns Promise object that represents a collection of SearchDefinitionNames
     */
    getDefinitionNames(searchIds: Array<number>): Promise<unknown>;
    /**
     * Delete search definitions
     *
     * @category Search Definitions
     * @param {Array<number>} searchIds - SearchIds to get.
     * @return {Object} Returns Promise object that represents a list (dictionary) of search IDs and deletion success boolean
     */
    deleteDefinitions(searchIds: Array<number>): Promise<unknown>;
    /**
     * Save a search definition
     *
     * @category Search Definitions
     * @param {string} searchFor - Name of type to search for from searchTypes
     * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/Ams/Search
     * @param {number} searchId - SearchId to update. Defaults to "0" which is "Create new saved search"
     * @return {Object} Returns Promise object that represents a SearchDefinitionName object
     */
    saveDefinition(searchFor: string, options?: Object, searchId?: number): Promise<unknown>;
    /**
     * Convert a search definition to a query
     *
     * @category Search Definitions
     * @param {Array<number>} searchIds - searchIds to convert
     * @param {boolean} saveQuery - Automatically save a query which converts with no errors, default is false
     * @param {boolean} allowMultipleBooleanValues - Use all values for boolean fields even though a boolean should only have one value, default is false and will only use the first boolean value
     * @param {boolean} allowEmptyQuery - Create default filter when no filter is found, default is false
     * @return {Object} Returns Promise object that represents a SearchToQueryResult list
     */
    convertToQuery(searchIds: Array<number>, saveQuery?: boolean, addEurl?: boolean, allowMultipleBooleanValues?: boolean, allowEmptyQuery?: boolean): Promise<unknown>;
}
