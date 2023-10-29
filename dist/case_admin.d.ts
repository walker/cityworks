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
     * @category Types & SubTypes
     * @param {string} caseTypeName - The case type name
     * @param {string} caseTypeDesciption - The case type description
     * @param {Object} options - The other options for the Case Type
     * @return {Object} Returns Promise that represents an object describing the added case type
     */
    addCaseType(caseTypeName: string, caseTypeDesciption: string, options: Object): Promise<unknown>;
    /**
     * Update Case Type
     *
     * @category Types & SubTypes
     * @param {number} caseTypeId - The case Type ID
     * @param {Object} options - The other options for the Case Type
     * @return {Object} Returns Promise that represents an object describing the updated case type
     */
    updateCaseType(caseTypeId: number, options?: Object): Promise<unknown>;
    /**
     * Get Case Types
     *
     * @category Types & SubTypes
     * @return {Object} Returns Promise that represents a collection of CaseTypeItems
     */
    getCaseTypes(): Promise<unknown>;
    /**
     * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Types & SubTypes
     * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
     * @return {Object} Returns Promise that represents an Array of CaseTypeIDs
     */
    searchCaseTypeIDs(filters: Object): Promise<unknown>;
    /**
     * Search for CaseTypes. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Types & SubTypes
     * @param {Object} filters - The parameter(s) to search by (CaseType, CaseTypeDesc, CaseTypeId)
     * @return {Object} Returns Promise that represents a collection of CaseTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=CaseTypeItem
     */
    searchCaseTypeObjects(filters: Object): Promise<unknown>;
    /**
     * Add SubType
     *
     * @category Types & SubTypes
     * @param {string} subTypeName - The SubTypeId
     * @param {string} subTypeDescription - The SubTypeId
     * @param {Object} options - Other SubType options.
     * @return {Object} Returns Promise that represents an object describing the added SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    addSubtype(subTypeName: string, subTypeDescription: string, options?: Object): Promise<unknown>;
    /**
     * Update SubType
     *
     * @category Types & SubTypes
     * @param {number} subTypeId - The SubTypeId
     * @param {Object} options - The case Object ID
     * @return {Object} Returns Promise that represents an object describing the updated SubTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    updateSubtype(subTypeId: number, options?: Object): Promise<unknown>;
    /**
     * Get SubTypes
     *
     * @category Types & SubTypes
     * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=SubTypeItem
     */
    getSubtypes(): Promise<unknown>;
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
    /**
     * Get all Expirations
     *
     * @category Expirations
     * @return {Object} Returns Promise that represents a collection of ExpirationTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=ExpirationTypeItem
     */
    getExpirations(): Promise<unknown>;
    /**
     * Add an Expiration type
     *
     * @category Expirations
     * @param {Object} options - Must specify OrgId and ExpirationDescType attributes. See: /{subdirectory}/apidocs/#/service-info/Pll/ExpirationType
     * @return {Object} Returns Promise that represents an object describing the newly-added ExpirationTypeItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=ExpirationTypeItem
     */
    addExpiration(options?: Object): Promise<unknown>;
    /**
     * Get all Deposits
     *
     * @category Deposits
     * @return {Object} Returns Promise that represents a collection of DepositItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepositItemBase
     */
    getDeposits(): Promise<unknown>;
    /**
     * Search Deposits. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @param {Object} filters - The parameter(s) to search by (AccountCode, DepositCode, DepositDesc, DepositId, DepositTypeId).
     * @return {Object} Returns Promise that represents an Array of FeeSetupIDs
     */
    searchDeposits(filters: {
        AccountCode?: string;
        DepositCode?: string;
        DepositDesc?: string;
        DepositId?: number;
        DepositTypeId?: number;
    }): Promise<unknown>;
    /**
     * Get all Disciplines
     *
     * @category Disciplines
     * @return {Object} Returns Promise that represents a collection of DisciplineItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DisciplineItem
     */
    getDisciplines(): Promise<unknown>;
    /**
     * Add Department
     *
     * @category Departments & Divisions
     * @param {string} departmentCode - The SubTypeId
     * @param {string} departmentName - The SubTypeId
     * @param {Object} options - Other SubType options.
     * @return {Object} Returns Promise that represents an object describing the added DepartmentItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
     */
    addDepartment(departmentCode: string, departmentName: string, options?: Object): Promise<unknown>;
    /**
     * Get Departments
     *
     * @category Departments & Divisions
     * @return {Object} Returns Promise that represents a collection of SubTypeItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DepartmentItem
     */
    getDepartments(): Promise<unknown>;
    /**
     * Add Division
     *
     * @category Departments & Divisions
     * @return {Object} Returns Promise that represents an object describing the newly-added DivisionItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DivisionItem
     */
    addDivision(departmentId: number, divisionName: string, options?: Object): Promise<unknown>;
    /**
     * Get all Divisions
     *
     * @category Departments & Divisions
     * @return {Object} Returns Promise that represents a collection of DivisionItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=DivisionItem
     */
    getDivisions(): Promise<unknown>;
    /**
     * Add Inspection Time Block
     *
     * @category Inspections
     * @param {string} labelText - Label for the time block
     * @param {string} startTime - Start time in 24 hour format (HH:mm)
     * @param {string} endTime - End time in 24 hour format (HH:mm)
     * @param {Object} inspTimeBlocksDetails - See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspTimeBlocksDetailItem
     * @return {Object} Returns Promise that represents an object describing the newly-added InspectionTimeBlocksItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionTimeBlocksItem
     */
    addInspectionTimeBlock(labelText: string, startTime: string, endTime: string, inspTimeBlocksDetails?: Object): Promise<unknown>;
    /**
     * Get all Inspection Time Blocks
     *
     * @category Inspections
     * @return {Object} Returns Promise that represents a collection of InspectionTimeBlocksItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionTimeBlocksItem
     */
    getInspectionTimeBlocks(): Promise<unknown>;
    /**
     * Get all NotificationCases
     *
     * @category Notifications
     * @return {Object} Returns Promise that represents a collection of NotificationCaseItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NotificationCaseItem
     */
    getNotificationCases(): Promise<unknown>;
    /**
     * Get all Notification Types
     *
     * @category Notifications
     * @return {Object} Returns Promise that represents a collection of NotificationCaseItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NotificationTypeItem
     */
    getNotificationTypes(): Promise<unknown>;
    /**
     * Add Numbering Group
     *
     * @category NumberingGroups
     * @param {number} options - attributes or update
     * @return {Object} Returns Promise that represents an object describing the newly-added NumberingGroupItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
     */
    addNumberingGroup(options: Object): Promise<unknown>;
    /**
     * Update Numbering Group
     *
     * @category NumberingGroups
     * @param {number} numberingGroupId - ID of NumberGroup to update
     * @param {number} options - updates attributes
     * @return {Object} Returns Promise that represents an object describing the newly-added HolidaysItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
     */
    updateNumberingGroup(numberingGroupId: number, options?: Object): Promise<unknown>;
    /**
     * Get all Numbering Groups
     *
     * @category NumberingGroups
     * @return {Object} Returns Promise that represents a collection of NumberingGroupItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
     */
    getNumberingGroups(): Promise<unknown>;
    /**
     * Add Person
     *
     * @category People
     * @param {string} name - Name of person
     * @param {Object} options - attributes for new person
     * @return {Object} Returns Promise that represents an object describing the newly-added NumberingGroupItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=NumberingGroupItem
     */
    addPerson(name: string, options: Object): Promise<unknown>;
    /**
     * Get all People
     *
     * @category People
     * @return {Object} Returns Promise that represents a collection of PeopleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleItem
     */
    getPeople(): Promise<unknown>;
    /**
     * Add People Role
     *
     * @category People
     * @param {string} name - Name of person
     * @param {Object} options - attributes for new person. See: /{subdirectory}/apidocs/#/service-info/Pll/PeopleRole
     * @return {Object} Returns Promise that represents an object describing the newly-added PeopleRoleItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
     */
    addPeopleRole(roleCode: string, options: Object): Promise<unknown>;
    /**
     * Get all PeopleRoles
     *
     * @category People
     * @return {Object} Returns Promise that represents a collection of PeopleRoleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
     */
    getPeopleRoles(): Promise<unknown>;
    /**
     * Add TaskResultDetail
     *
     * @category TaskResults
     * @param {Object} options - attributes for new TaskResultDetail. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultDetail
     * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultDetailItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultDetailItem
     */
    addTaskResultDetail(options: Object): Promise<unknown>;
    /**
     * Update TaskResultDetail
     *
     * @category TaskResults
     * @param {string} resultDetailId - Result Detail ID
     * @param {Object} options - attributes for new person. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultDetail
     * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultDetailItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultDetailItem
     */
    updateTaskResultDetail(resultDetailId: number, options: Object): Promise<unknown>;
    /**
     * Get all TaskResultDetails
     *
     * @category TaskResults
     * @return {Object} Returns Promise that represents a collection of PeopleRoleItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=PeopleRoleItem
     */
    getTaskResultDetails(): Promise<unknown>;
    /**
     * Add TaskResultFeeInsert
     *
     * @category TaskResults
     * @param {Object} options - attributes for new TaskResultFeeInsert. See: /{subdirectory}/apidocs/#/service-info/Pll/TaskResultFeeInsert
     * @return {Object} Returns Promise that represents an object describing the newly-added TaskResultFeeInsertItem. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultFeeInsertItem
     */
    addTaskResultFeeInsert(options: Object): Promise<unknown>;
    /**
     * Delete TaskResultFeeInsert
     *
     * @category TaskResults
     * @param {number} taskResultFeeInsertId - ID for TaskResultFeeInsert to be deleted.
     * @return {Object} Returns Promise that represents the ID Number of the deleted TaskResultFeeInsertItem.
     */
    deleteTaskResultFeeInsert(taskResultFeeInsertId: number): Promise<unknown>;
    /**
     * Delete TaskResultFeeInsert(s) by Task ID
     *
     * @category TaskResults
     * @param {number} taskId - ID for Task parent of TaskResultFeeInsert(s) to be deleted.
     * @return {Object} Returns Promise that represents the ID Number of the Task parent of the deleted TaskResultFeeInsertItem(s).
     */
    deleteTaskResultFeeInsertByTaskId(taskId: number): Promise<unknown>;
    /**
     * Update TaskResultFeeInsert
     *
     * @category TaskResults
     * @param {number} taskResultFeeInsertId - ID for TaskResultFeeInsert to be updated.
     * @param {number} taskId - Updated TaskID
     * @param {number} taskResultId - Updated TaskResultId
     * @param {number} [feeSetupId] - Fee setup ID update for TaskResultFeeInsert
     * @return {Object} Returns Promise that represents the ID Number of the updated TaskResultFeeInsertItem.
     */
    updateTaskResultFeeInsert(taskResultFeeInsertId: number, taskId: number, taskResultId: number, feeSetupId?: number): Promise<unknown>;
    /**
     * Get all TaskResultFeeInsert
     *
     * @category TaskResults
     * @return {Object} Returns Promise that represents a collection of TaskResultFeeInsertItems. See: /{subdirectory}/apidocs/#/data-type-info;dataType=TaskResultFeeInsertItem
     */
    getTaskResultFeeInsert(): Promise<unknown>;
}
