export declare class Request {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Create new requests
     *
     * @category Requests
     * @param {Object} sr_data - See /{subdirectory}/apidocs/#/data-type-infodataType=RequestBase on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the newly-created request
     */
    create(sr_data: Object): Promise<unknown>;
    /**
     * Update a request
     *
     * @category Requests
     * @param {object} sr_data - See /{subdirectory}/apidocs/#/data-type-infodataType=RequestBase on the Cityworks instance
     * @return {Object} Returns Promise that represents an object describing the updated request
     */
    update(sr_data: Object): Promise<unknown>;
    /**
     * Change a request's problem code
     *
     * @category Requests
     * @param {number} requestId - The request ID to change
     * @param {number} problemSid - The request's new ProblemSID
     * @return {Object} Returns Promise that represents an object describing the updated request
     */
    changeProblem(requestId: number, problemSid: number): Promise<unknown>;
    /**
     * Get a request by ID
     *
     * @category Requests
     * @param {number} requestId - The ID of the request to retrieve
     * @return {Object} Returns Promise that represents an object describing the request
     */
    getById(requestId: number): Promise<unknown>;
    /**
     * Get requests by array of IDs
     *
     * @category Requests
     * @param {Array<number>} requestIds - The request IDs to retrieve
     * @return {Object} Returns Promise that represents a collection of Objects describing the requests
     */
    getByIds(requestIds: Array<number>): Promise<unknown>;
    /**
     * Get the audit log for a specific request
     *
     * @category Requests
     * @param {number} requestId - A Request ID to get the audit log for
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
     */
    getAuditLog(requestId: number): Promise<unknown>;
    /**
     * Get custom fields for provided requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - The RequestIds whose custom fields should be returned
     * @return {Object} Returns Promise that represents a collection of custom fields
     */
    getCustomFields(requestIds: Array<number>): Promise<unknown>;
    /**
     * Change custom field category for provided requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - The RequestIds whose custom fields should be returned
     * @param {number} categoryId - The new custom field grouping/category which should be assigned to the provided requests
     * @return {Object} Returns Promise that represents a collection of requests
     */
    changeCustomFieldCategory(requestIds: Array<number>, categoryId: number): Promise<unknown>;
    /**
     * Add a comment to a request
     *
     * @category Requests
     * @param {number} requestId - The ID of the request to retrieve
     * @param {number} comment - The comment text to add
     * @return {Object} Returns Promise that represents an object describing the comment added
     */
    comment(requestId: number, comment: string): Promise<unknown>;
    /**
     * Cancel requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to cancel the matched requests
     * @param {string} [cancelReason] - A reason for cancelling the request(s)
     * @param {datetime} [dateCancelled] - The date/time that it should be indicated the request was cancelled
     * @return {Object} Returns object that represents a collection of requests
     */
    cancel(requestIds: Array<number>, cancelReason?: string, dateCancelled?: Date): Promise<unknown>;
    /**
     * Uncancel requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to uncancel the matched requests
     * @return {Object} Returns object that represents a collection of requests
     */
    uncancel(requestIds: Array<number>): Promise<unknown>;
    /**
     * Close requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to close the matched requests
     * @return {Object} Returns object that represents a collection of requests
     */
    close(requestIds: Array<number>): Promise<unknown>;
    /**
     * Reopen closed requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to reopen the matched requests
     * @return {Object} Returns object that represents a collection of requests
     */
    reopen(requestIds: Array<number>): Promise<unknown>;
    /**
     * Delete requests
     *
     * @category Requests
     * @param {Array<number>} requestIds - An array of the IDs to delete the matched requests
     * @return {Object} Returns object that represents a collection of request Ids which have been deleted
     */
    delete(requestIds: Array<number>): Promise<unknown>;
    /**
     * Search for requests
     *
     * @category Request Search
     * @param {Object} searchData - The search information to retrieve matched requests, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
     * @return {Object} Returns Promise that represents an Array of the matching request IDs
     */
    search(searchData: Object): Promise<unknown>;
    /**
     * Get the records on the basis of RequestId, only populates RequestId, Description, ProblemCode properties
     *
     * @category Request Object Search
     * @param {string} requestId - ???, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
     * @return {Object} Returns Promise that represents a collection of the matching (limited) request objects
     */
    searchObject(requestId: string): Promise<unknown>;
    /**
     * Create a search definition. Save the definition by setting SaveDefinition = true and supplying a SearchName.
     *
     * @category Requests
     * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequest
     * @param {number} [searchName] - What to name your search (if it should be saved)
     * @param {number} [sharedWithin] - What group or domain to share the search to.
     * @param {boolean} saveDefinition - Whether or not to save the search definition. Defaults to true when a search name is specified.
     * @param {boolean} enableEurl - Whether or not to enable EURL for the saved search. Defaults to true.
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects
     */
    createSearchDefinition(searchData: Object, searchName?: string, sharedWithin?: number, saveDefinition?: boolean, enableEurl?: boolean): Promise<unknown>;
    /**
     * Get a list of problem nodes for a domain
     *
     * @category Request Categorization
     * @param {number} domainId - The domain ID for which to retrieve problem nodes.
     * @param {boolean} viewOnly - Return only view only problem nodes. Defaults to false.
     * @param {Object} [displayMode] - Object that should contain two properties if you provide it: DisplayTextMode: string (C = Code, D = Description, CD = Code ~ Description). DisplayTextDelimeter: string, only impacts CD display text mode.
     * @param {boolean} includeCancelled - Return only cancelled problem nodes as well. Defaults to false.
     * @return {Object} Returns Promise that represents a collection of problem node objects.
     */
    getProblemNodes(domainId: number, viewOnly?: boolean, displayMode?: Object, includeCancelled?: boolean): Promise<unknown>;
    /**
     * Get a list of problem codes
     *
     * @category Request Options
     * @param {boolean} forPublicOnly - Return only publicly-available service requests. Defaults to false.
     * @param {boolean} onlyActiveTemplates - Return only active templates. Defaults to true.
     * @return {Object} Returns Promise that represents an Array of problem name objects.
     */
    getProblems(forPublicOnly?: boolean, onlyActiveTemplates?: boolean, domainIds?: Array<number>): Promise<unknown>;
    /**
     * Get a list of problem codes by keywords
     *
     * @category Request Options
     * @param {string} keywords - Keywords to search for potential problem codes
     * @return {Object} Returns Promise that represents an Array of problem name objects.
     */
    getProblemsByKeywords(keywords: string): Promise<unknown>;
    /**
     * Get a list of a problem code's priorities
     *
     * @category Request Options
     * @param {number} problemSid - Return priorities for given problemSid
     * @return {Object} Returns Promise that represents an Array of priorities
     */
    getPriorities(problemSid: number): Promise<unknown>;
    /**
     * Get custom field templates for problem code
     *
     * @category Request Options
     * @param {number} problemSid - The problemSid whose template custom fields should be returned
     * @return {Object} Returns Promise that represents a collection of custom fields
     */
    getCustomFieldTemplate(problemSid: number): Promise<unknown>;
    /**
     * Get the questions and answer options for a problem code
     *
     * @category Request Options
     * @param {number} problemSid - The problemSid whose Q&A should be returned
     * @return {Object} Returns Promise that represents a collection of questions and answer settings
     */
    getQASettings(problemSid: number): Promise<unknown>;
    /**
     * Get problem leaf (template) by Sid
     *
     * @category Request Options
     * @param {number} problemSid - Return problem leaf for given problemSid
     * @return {Object} Returns Promise that represents an Object that describes the problem leaf (template)
     */
    getProblemLeaf(problemSid: number): Promise<unknown>;
    /**
     * Get a list of default statuses
     *
     * @category Request Options
     * @param {Array<number>} domainIds - List of domains to return default statuses for
     * @return {Object} Returns Promise that represents an Array of statuses.
     */
    getStatuses(domainIds: Array<number>): Promise<unknown>;
    /**
     * Get a list of possible DispatchTo values
     *
     * @category Request Options
     * @param {Array<number>} domainId - Domain to return possible dispatchTo values for
     * @return {Object} Returns Promise that represents an Array of dispatchTo options.
     */
    getDispatchTo(domainId: Array<number>): Promise<unknown>;
    /**
     * Get a list of possible SubmitTo values
     *
     * @category Request Options
     * @param {Array<number>} domainId - Domain to return possible submitTo values for
     * @return {Object} Returns Promise that represents an Array of submitTo options.
     */
    getSubmitTo(domainId: Array<number>): Promise<unknown>;
    /**
     * Get street codes
     *
     * @category Request Options
     * @return {Object} Returns Promise that represents an Array of Street Codes.
     */
    streetCodes(): Promise<unknown>;
    /**
     * Get a list of templates
     *
     * @category Request Templates
     * @param {Array<number>} problemSids - An array list of problemSids to retrieve templates for
     * @param {Date} [minimumDateModified] - ?
     * @param {Date} [maximumDateModified] - ?
     * @return {Object} Returns Promise that represents
     */
    getTemplatesById(problemSids: Array<number>, minimumDateModified?: Date, maximumDateModified?: Date): Promise<unknown>;
    /**
     * Create a search definition. Save the definition by setting SaveDefinition = true and supplying a SearchName.
     *
     * @category Request Templates
     * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequestTemplate
     * @param {number} [searchName] - What to name your search (if it should be saved)
     * @param {number} [sharedWithin] - What group or domain to share the search to.
     * @param {boolean} saveDefinition - Whether or not to save the search definition. Defaults to true when a search name is specified.
     * @return {Object} Returns Promise that represents a collection of Cityworks Metadata Objects. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CWMetadata
     */
    createTemplateSearchDefinition(searchData: Object, searchName?: string, sharedWithin?: number, saveDefinition?: boolean): Promise<unknown>;
    /**
     * Get the questions and answers for a(many) request template(s)
     *
     * @category Request Templates
     * @param {Array<number>} problemSids - An array list of problemSids to retrieve templates for
     * @return {Object} Returns Promise that represents a collection of ProblemQAs. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemQA
     */
    getTemplateQAs(problemSids: Array<number>, minimumDateModified?: Date, maximumDateModified?: Date): Promise<unknown>;
    /**
     * Get a list of template id results for a provided search parameters
     *
     * @category Request Templates
     * @param {Object} searchData - Search data variables. See /{subdirectory}/apidocs/#/service-info/Ams/ServiceRequestTemplate
     * @return {Object} Returns Promise that represents a list of template IDs.
     */
    searchTemplates(searchData: Object): Promise<unknown>;
    /**
     * Get request templates (problem leaf[s])
     *
     * @category Request Templates
     * @param {Array<number>} [templateIds] - Array of specific template IDs to retrieve
     * @param {number} canCreate - If true, only return templates the user can create, ignored if false or null, default is false
     * @param {boolean} includeInactiveIf - If true, returns inactive templates, default is false
     * @param {Date} [minimumDateModified] - ?
     * @param {Date} [maximumDateModified] - ?
     * @return {Object} Returns Promise that represents a collection of Problem Leafs. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemLeaf
     */
    getTemplates(templateIds: Array<number>, canCreate?: boolean, includeInactiveIf?: boolean, minimumDateModified?: Date, maximumDateModified?: Date): Promise<unknown>;
    /**
     * Get work order templates that are associated to this request template type
     *
     * @category Request Templates
     * @param {Array<number>} problemSids - An array list of problemSids to retrieve Problem WO templates for
     * @param {boolean} includeInactiveIf - Include inactive work order templates, default is false
     * @return {Object} Returns Promise that represents a collection of Problem WO Templates. See /{subdirectory}/apidocs/#/data-type-info;dataType=ProblemWOTemplate
     */
    getWOTemplates(problemSids: Array<number>, includeInactive?: boolean): Promise<unknown>;
}
