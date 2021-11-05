export declare class CaseFinancial {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: Object);
    /**
     * Adds a fee to the case specified by the CaObectId.
     *
     * @category Case Fees
     * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
     * @param {number} feeSetupId - The fee setup id for the fee to add to the case.
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CaseFees for more options. (Checkboxes -- Autorecalculate -- are Y/N strings)
     * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
     */
    addFee(caObjectId: number, feeSetupId: number, options?: Object): Promise<unknown>;
    /**
     * Updates a fee specified by the CaFeeId.
     *
     * @category Case Fees
     * @param {number} caFeeId - The Fee ID for the specific instance of the fee you wish to update
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CaseFees for more options. (Checkboxes -- Autorecalculate -- are Y/N strings)
     * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
     */
    updateFee(caFeeId: number, options?: Object): Promise<unknown>;
    /**
     * Adds Default Case Fees. Adds fees to the case specified by the CaObectId and BusCaseId.
     *
     * @category Case Fees
     * @param {number} caObjectId - The Case Object ID for the case to which to add the default fees
     * @param {number} busCaseId - The business case ID whose default fees should be added to the case
     * @return {Object} Returns Promise that represents a collection of Fee Items. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
     */
    addDefaultFees(caObjectId: number, busCaseId: number): Promise<unknown>;
    /**
     * Gets the fees from the case specified by the CaObectId.
     *
     * @category Case Fees
     * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
     * @return {Object} Returns Promise that represents an collection of Case Fees.
     */
    getFees(caObjectId: number): Promise<unknown>;
    /**
     * Delete the fee specified by the caFeeId.
     *
     * @category Case Fees
     * @param {number} caFeeId - The Case Fee ID which should be deleted
     * @return {Object} Returns Promise that represents a collection of Case Fees.
     */
    deleteFee(caFeeId: number): Promise<unknown>;
    /**
     * Delete Case Fees by Case ObjectId. Delete from the system all Fees linked to a specific Case as specified by the Case Id parameter (CaObjectId).
     *
     * @category Case Fees
     * @param {number} caObjectId - The Case Object ID whose fees should be deleted
     * @return {Object} Returns Promise that represents a number (?)
     */
    deleteFeesByCaseId(caObjectId: number): Promise<unknown>;
    /**
     * Search for Case Fees. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Case Fees
     * @param {number} [caFeeId] - The Case Fee ID which should be deleted
     * @param {number} [caObjectId] - The Case Fee ID which should be deleted
     * @param {string} [feeCode] - The Case Fee ID which should be deleted
     * @param {string} [feeDesc] - The Case Fee ID which should be deleted
     * @return {Object} Returns Promise that represents an Array of case fee IDs
     */
    searchFees(caFeeId?: number, caObjectId?: number, feeCode?: string, feeDesc?: string): Promise<unknown>;
    /**
     * Get All Fee Templates
     *
     * @category Case Fees
     * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
     */
    getAllFeeTemplates(): Promise<unknown>;
    /**
     * Search for Fees. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Case Fees
     * @param {number} [feeSetupId] - The Case Fee ID to search for
     * @param {number} [feeTypeId] - The Case Fee Type ID to search for
     * @param {string} [feeCode] - The fee code to search for
     * @param {string} [feeDesc] - The fee description to search for
     * @param {string} [accountCode] - The account code to search for
     * @return {Object} Returns Promise that represents an Array of case fee IDs
     */
    searchFeeTemplates(feeSetupId?: number, feeTypeId?: number, feeCode?: string, feeDesc?: string, accountCode?: string): Promise<unknown>;
}
