export declare class CaseAdmin {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Add Business Case Template
     *
     * @category Case Templates
     * @param {Object} data - The Business Case Template options.
     * @return {Object} Returns Promise that represents an object describing the created case template. See: /{subdirectory}/apidocs/#/data-type-info;dataType=BusinessCaseItem
     */
    addBusinessCaseTemplate(data: Object): Promise<unknown>;
    /**
     * Update Business Case Template
     *
     * @category Case Templates
     * @param {number} busCaseId - The Business Case ID to update
     * @param {Object} data - The Business Case Template options.
     * @return {Object} Returns Promise that represents an object describing the updated case template. See: /{subdirectory}/apidocs/#/data-type-info;dataType=BusinessCaseItem
     */
    updateBusinessCaseTemplate(busCaseId: number, options: Object): Promise<unknown>;
    /**
     * Get Business Case Templates
     *
     * @category Case Templates
     * @return {Object} Returns Promise that represents a collection of Business Case Templates
     */
    getBusinessCaseTemplates(): Promise<unknown>;
    /**
     * Add Case Type
     *
     * @category Types
     * @param {string} caseTypeName - The case type name
     * @param {string} caseTypeDesciption - The case type description
     * @param {Object} options - The other options for the Case Type
     * @return {Object} Returns Promise that represents an object describing the added case type
     */
    addCaseType(caseTypeName: string, caseTypeDesciption: string, options: Object): Promise<unknown>;
    /**
     * Update Case Type
     *
     * @category Types
     * @param {number} caseTypeId - The case Type ID
     * @param {Object} options - The other options for the Case Type
     * @return {Object} Returns Promise that represents an object describing the updated case type
     */
    updateCaseType(caseTypeId: number, options?: Object): Promise<unknown>;
    /**
     * Get Case Types
     *
     * @category Types
     * @return {Object} Returns Promise that represents a collection of CaseTypeItems
     */
    getCaseTypes(): Promise<unknown>;
    /**
     * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Types
     * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
     * @return {Object} Returns Promise that represents an Array of CaseTypeIDs
     */
    searchCaseTypeIDs(filters: Object): Promise<unknown>;
    /**
     * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Types
     * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
     * @return {Object} Returns Promise that represents a collection of CaseTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CaseTypeItem
     */
    searchCaseTypeObjects(filters: Object): Promise<unknown>;
    /**
     * Add SubType
     *
     * @category SubTypes
     * @param {string} subTypeName - The SubTypeId
     * @param {string} subTypeDescription - The SubTypeId
     * @param {Object} options - Other SubType options.
     * @return {Object} Returns Promise that represents an object describing the added SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    addSubtype(subTypeName: string, subTypeDescription: string, options?: Object): Promise<unknown>;
    /**
     * Update SubType
     *
     * @category SubTypes
     * @param {number} subTypeId - The SubTypeId
     * @param {Object} options - The case Object ID
     * @return {Object} Returns Promise that represents an object describing the updated SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    updateSubtype(subTypeId: number, options?: Object): Promise<unknown>;
    /**
     * Get SubTypes
     *
     * @category SubTypes
     * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    getSubtypes(): Promise<unknown>;
    /**
     * Add Department
     *
     * @category Departments
     * @param {string} departmentCode - The SubTypeId
     * @param {string} dpartmentName - The SubTypeId
     * @param {Object} options - Other SubType options.
     * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
     */
    addDepartment(departmentCode: string, dpartmentName: string, options?: Object): Promise<unknown>;
    /**
     * Get Departments
     *
     * @category Departments
     * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    getDepartments(): Promise<unknown>;
    /**
     * Get all Fees
     *
     * @category Fees
     * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
     */
    getFees(): Promise<unknown>;
    /**
     * Search for Fees. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @param {Object} filters - The parameter(s) to search by (AccountCode, FeeCode, FeeDesc, FeeSetupId, FeeTypeId).
     * @return {Object} Returns Promise that represents an Array of FeeSetupIDs
     */
    searchFees(filters: {
        AccountCode?: string;
        FeeCode?: string;
        FeeDesc?: string;
        FeeSetupId?: number;
        FeeTypeId?: number;
    }): Promise<unknown>;
}
