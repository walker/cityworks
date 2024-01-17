export declare class CaseData {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Add Case Data Group
     *
     * @category Data Groups
     * @param {number} caObjectId - The Case Object to attach the data group to.
     * @param {number} caseDataGroupId - CaseDataGroupId as defined in CaseDataGroup admin.
     * @param {string} groupCode - The Group Code.
     * @param {Object} [options] - Options for CaseDataGroup including GroupDesc, GroupSum, and SumFlag
     * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
     */
    addGroup(caObjectId: number, caseDataGroupId: number, groupCode: string, options?: {
        GroupDesc?: string;
        GroupSum?: number;
        SumFlag?: string;
    }): Promise<unknown>;
    /**
     * Add Default Case Data Groups
     *
     * @category Data Groups
     * @param {number} caObjectId - The Case Object to attach the data group to.
     * @param {number} busCaseId - The business case ID
     * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
     */
    addDefaultGroups(caObjectId: number, busCaseId: number): Promise<unknown>;
    /**
     * Adds a data detail entry to the case data group specified by the CaDataGroupId. The CaDataGroupId is associated to a case.
     *
     * @category Data Groups
     * @param {number} caseDataDetailId - The Data Detail template ID
     * @param {number} caDataGroupId - The Case Instance Data Group ID
     * @param {string} columnSequence - The column sequence
     * @param {string} detailCode - The detail Code
     * @param {number} detailSequence - The detail order number
     * @param {Object} [options] - Other options for CaseDataDetail. See WIPAdd here: /{subdirectory}/apidocs/#/service-info/Pll/CaseDataDetail
     * @return {Object} Returns Promise that represents an object describing CaDataDetailItemBase.
     */
    wipAddDetail(caseDataDetailId: number, caDataGroupId: number, columnSequence: string, detailCode: string, detailSequence: number, options?: Object): Promise<unknown>;
    /**
     * Get groups by CaObjectId
     *
     * @category Data Groups
     * @param {number} caseId - The Case Object to get the attached data groups.
     * @return {Object} Returns Promise that represents a collection of the CaDataGroupItemBases.
     */
    getGroupsByCaseId(caseId: number): Promise<unknown>;
    /**
     * Delete Case Data Groups by Case Object ID.
     *
     * @category Data Groups
     * @param {number} caObjectId - The Case Object to attach the data group to.
     * @return {Object} Returns Promise that represents a number that is the CaObjectId (?)
     */
    deleteGroupsByCaseId(caObjectId: number): Promise<unknown>;
    /**
     * Search for Case Data Groups. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Data Groups
     * @param {Object} filters - The parameters to search by. (CaDataGroupId, CaseDataGroupId, GroupCode, GroupDesc, GroupSum, SumFlag)
     * @return {Object} Returns Promise that represents a number that is the CaObjectId (?)
     */
    searchForGroups(filters?: Object): Promise<Array<any>>;
    /**
     * Get Case Data Groups by Case ObjectId
     *
     * @category Data Groups
     * @param {string} entityType - The entity type to check
     * @param {string} entityUid - The specific entityUID to check
     * @param {Object} options - The other options for checkGIS. Either CaObjectId or CaseDataGroupId is required.
     * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
     */
    checkGIS(entityType: string, entityUid: string, options: {
        CaObjectId?: number;
        CaseDataGroupId?: number;
        CaseDataDetailId?: number;
    }): Promise<unknown>;
    /**
     * Update data groups on a case based on asset value mappings.
     *
     * @category Data Groups
     * @param {number} caObjectId - The case to update
     * @param {string} entityType - The entity type to check
     * @param {string} entityUid - The specific entityUID to check
     * @param {number} [caDataGroupId] - The specific data group ID to limit updates to
     * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
     */
    updateGroupsFromAsset(caObjectId: number, entityType: string, entityUid: string, caDataGroupId?: number): Promise<unknown>;
    /**
     * Attach Case Data Detail
     *
     * @category Data Details
     * @param {number} caDataGroupId - The Case Data Group ID to attach the data detail to.
     * @param {number} caseDataDetailId - caseDataDetailId to attach.
     * @param {Object} [options] - Options
     * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
     */
    addDetail(caDataGroupId: number, caseDataDetailId: number, options?: Object): Promise<unknown>;
    /**
     * Update Case Data Detail
     *
     * @category Data Details
     * @param {number} caDataDetailId - The Case Data Group ID to attach the data detail to.
     * @param {Object} [options] - Options
     * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
     */
    updateDetail(caDataDetailId: number, options?: Object): Promise<unknown>;
    /**
     * Lock Case Data Detail
     *
     * @category Data Details
     * @param {number} caDataDetailId - The Case Data Detail ID to lock
     * @return {Object} Returns Promise which represents an object describing the CaDataDetailItem.
     */
    lockDetail(caDataDetailId: number): Promise<unknown>;
    /**
     * Unlock Case Data Detail
     *
     * @category Data Details
     * @param {number} caDataDetailId - The Case Data Group ID to unlock
     * @return {Object} Returns Promise which represents an object describing the CaDataDetailItem.
     */
    unlockDetail(caDataDetailId: number): Promise<unknown>;
    /**
     * Search for Case Data Details. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Data Details
     * @param {Object} filters - The parameters to search by. (CaDataGroupId, CaseDataGroupId, GroupCode, GroupDesc, GroupSum, SumFlag)
     * @return {Object} Returns Promise that represents an object describing CaDataDetailItemBase.
     */
    searchForDetails(filters?: Object): Promise<Array<any>>;
    /**
     * Adds a list of possible values to the data detail entry specified by the CaDataDetailId.
     *
     * @category Data List Values
     * @param {number} caDataDetailId - The Case Object to attach the data group to.
     * @param {string} listValue - The Group Code.
     * @return {Object} Returns Promise that represents an object describing CaDataListValuesItemBase.
     */
    addListValue(caDataDetailId: number, listValue: string): Promise<unknown>;
    /**
     * Delete by Id (Ca Data List Id)
     *
     * @category Data List Values
     * @param {number} CaDataListId - The Case Data List ID
     * @return {Object} Returns Promise that represents an object describing CaDataListValuesItemBase.
     */
    deleteListValue(caDataDetailId: number): Promise<unknown>;
    /**
     * Search for List Value IDs. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Data List Values
     * @param {Object} filters - The parameters to search by. (CaDataDetailId, CaDataListId, ListValue)
     * @return {Object} Returns Promise that represents an Array of resulting CaDataListIds
     */
    searchForListValueIds(filters?: Object): Promise<unknown>;
    /**
     * Search for List Value Objects. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Data List Values
     * @param {Object} filters - The parameters to search by. (CaDataDetailId, CaDataListId, ListValue, CaDataGroupId)
     * @return {Object} Returns Promise that represents a collection of resulting CaDataListValuesItemBase objects
     */
    searchForListValueObjects(filters?: Object): Promise<unknown>;
    /**
     * Set a data detail item's value without needing to find the type
     *
     * @category Data Details
     * @param dataDetailId - The data detail item's ID
     * @param value - the value to set the data detail item to
     * @returns Promise that represents
     */
    updateDetailItemValue(dataDetailId: number, value: any): Promise<unknown>;
    /**
     * Get the Case Data Details for a Case by Case ID
     *
     * @category Data Details
     * @param {number} caseId - The case ID to get the details for
     * @return {Object} Returns Promise that represents a collection of Case Data Detail Items
     */
    getAllDataDetails(caseId: number): Promise<Array<any>>;
    /**
     * Set Case Data Detail Items for a Case by GroupCode.ItemCode syntax reference
     *
     * @category Data Details
     * @param {number} caseId - The case ID to get the details for
     * @param {Object} items - The parameters to search by. (DataGroup/Item string, Value) (e.g. {code: 'GroupCode.ItemCode', value: 'Value goes here'})
     * @return {Object} Returns Promise that represents a collection
     */
    setCaseData(caseId: number, items: Array<{
        code: string;
        value: any;
    }>): Promise<unknown>;
    /**
     * Set Case Data Detail Item for a Case by GroupCode.ItemCode syntax reference
     *
     * @category Data Details
     * @param {number} caseId - The Case ID to set the detail for
     * @param {string} detailGroupAndItemCode - The parameters to search (e.g. 'GroupCode.ItemCode')
     * @param {any} value - The value to set the specified detail to
     * @return {Object} Returns Promise
     */
    setCaseDataItem(caseId: number, detailGroupAndItemCode: string, value: any): Promise<unknown>;
}
