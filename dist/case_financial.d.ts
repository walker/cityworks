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
     * Adds a deposit to the case specified by the CaObectId.
     *
     * @category Case Deposits
     * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
     * @param {number} depositId - The deposit setup id for the deposit to add to the case.
     * @param {number} [amount] - The amount of the deposit (optional)
     * @param {string} [comment] - Comment text to add to the deposit (optional)
     * @return {Object} Returns Promise that represents an object describing the newly-added deposit. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaDepositItemBase
     */
    addDeposit(caObjectId: number, depositId: number, amount?: number, comment?: string): Promise<unknown>;
    /**
     * Adds an instrument to the case specified by the CaObectId.
     *
     * @category Case Instruments
     * @param {number} caObjectId - The Case Object ID for the case to which to add the instrument
     * @param {number} instTypeId - The instrument type id for the instrument being added to the case.
     * @param {number} amount - The amount of the instrument
     * @param {Date} dateExpire - The datetime for the instrument to expire.
     * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CaseInstrument for more options.
     * @return {Object} Returns Promise that represents an object describing the newly-added instrument. See /{subdirectory}/apidocs/#/service-info/Pll/CaseInstrument
     */
    addInstrument(caObjectId: number, instTypeId: number, amount: number, dateExpire: Date, options?: Object): Promise<unknown>;
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
     * Adds Default Case Deposits. Adds deposits to the case specified by the CaObectId and BusCaseId.
     *
     * @category Case Deposits
     * @param {number} caObjectId - The Case Object ID for the case to which to add the default deposits
     * @param {number} busCaseId - The business case ID whose default deposits should be added to the case
     * @return {Object} Returns Promise that represents a collection of Deposit Items. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaDepositItemBase
     */
    addDefaultDeposits(caObjectId: number, busCaseId: number): Promise<unknown>;
    /**
     * Gets the fees from the case specified by the CaObectId.
     *
     * @category Case Fees
     * @param {number} caObjectId - The Case Object ID for the case to which to get the fees
     * @return {Object} Returns Promise that represents a collection of Case Fees.
     */
    getFees(caObjectId: number): Promise<unknown>;
    /**
     * Get Case Deposit by Case ObjectId.
     *
     * @category Case Deposits
     * @param {number} caObjectId - The Case Object ID for the case to which to get the deposits
     * @return {Object} Returns Promise that represents a collection of Case Deposits.
     */
    getDeposits(caObjectId: number): Promise<unknown>;
    /**
     * Gets the instruments from the case specified by the CaObectId.
     *
     * @category Case Instruments
     * @param {number} caObjectId - The Case Object ID for the case to which to get the fees
     * @return {Object} Returns Promise that represents a collection of Case Instruments.
     */
    getInstruments(caObjectId: number): Promise<unknown>;
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
     * Delete the fee specified by the caFeeId.
     *
     * @category Case Deposits
     * @param {number} caDepositId - The Case Deposit ID which should be deleted
     * @return {Object} Returns Promise that represents a collection of Case Deposits.
     */
    deleteDeposit(caDepositId: number): Promise<unknown>;
    /**
     * Delete Case Fees by Case ObjectId. Delete from the system all Fees linked to a specific Case as specified by the Case Id parameter (CaObjectId).
     *
     * @category Case Deposits
     * @param {number} caObjectId - The Case Object ID whose fees should be deleted
     * @return {Object} Returns Promise that represents a number (?)
     */
    deleteDepositsByCaseId(caObjectId: number): Promise<unknown>;
    /**
     * Delete the instrument specified by the caInstrumentId.
     *
     * @category Case Instruments
     * @param {number} caInstrumentId - The Case Instrument ID which should be deleted
     * @return {Object} Returns Promise that represents a Case Instrument.
     */
    deleteInstrument(caInstrumentId: number): Promise<unknown>;
    /**
     * Delete Case Instruments by Case ObjectId. Delete from the system all Instruments linked to a specific Case as specified by the Case Id parameter (CaObjectId).
     *
     * @category Case Instruments
     * @param {number} caObjectId - The Case Object ID whose instruments should be deleted
     * @return {Object} Returns Promise that represents a number (?)
     */
    deleteInstrumentsByCaseId(caObjectId: number): Promise<unknown>;
    /**
     * Search for Case Fees. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Case Fees
     * @param {number} [caFeeId] - The Case Fee ID which should be searched for
     * @param {number} [caObjectId] - The Case Object ID which should be searched for connected fees
     * @param {string} [feeCode] - The Case Fee Code which should be searched for
     * @param {string} [feeDesc] - The Case Fee Description which should be searched for
     * @return {Object} Returns Promise that represents an Array of case fee IDs
     */
    searchFees(caFeeId?: number, caObjectId?: number, feeCode?: string, feeDesc?: string): Promise<unknown>;
    /**
     * Search for Case Deposits. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Case Deposits
     * @param {number} [caDepositId] - The Case Deposit ID which should be searched for
     * @param {number} [caObjectId] - The Case Object ID which should be searched for connected deposits
     * @param {string} [depositCode] - The Case Deposit Code which should be searched for
     * @param {string} [depositDesc] - The Case Deposit Description which should be searched for
     * @return {Object} Returns Promise that represents an Array of case fee IDs
     */
    searchDeposits(caDepositId?: number, caObjectId?: number, depositCode?: string, depositDesc?: string): Promise<unknown>;
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
    /**
     * Search for Case Instruments. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
     *
     * @category Case Instruments
     * @param {Object} filters - The filters to apply to the search of Case Instruments (AddressLine1, Amount, CaInstrumentId, CityName, CommentText, Company, ContactEmail, ContactName, ContactPhone, CountryCode, InstTypeId, SerialNumber, StateCode, ZipCode)
     * @return {Object} Returns Promise that represents an Array of case instrument IDs
     */
    searchCaseInstruments(filters?: Object): Promise<unknown>;
    /**
     * Get the Defined Instruments
     *
     * @category Instruments
     * @param {Object} options - the options to filter the instruments returned by
     * @return {Object} Returns Promise that represents an Array of CaInstrumentItem
     */
    getInstrumentList(options: Object): Promise<unknown>;
    /**
     * Adds a release to a case instrument specified by the caInstrumentId. Must provide either amountReleased OR percentReleased
     *
     * @category Case Instrument Releases
     * @param {number} caInstrumentId - The Case Instrument ID to which to add the instrument release
     * @param {number} releasedBy - UserID to attach to the release.
     * @param {Date} dateReleased - The date of the release
     * @param {number} [amountReleased] - The amount to be released
     * @param {number} [percentReleased] - OR the percent to be released
     * @param {string} [comment] - Comment to attach to the release
     * @return {Object} Returns Promise that represents an object describing the newly-added instrument release. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaInstReleasesItemBase
     */
    addCaseInstrumentRelease(caInstrumentId: number, releasedBy: number, dateReleased: Date, amountReleased?: number, percentReleased?: number, comment?: string): Promise<unknown>;
    /**
     * Deletes a release specified by the caInstReleasesId.
     *
     * @category Case Instrument Releases
     * @param {number} caInstReleasesId - The Case Instrument Release ID to delete
     * @return {Object} Returns Promise that represents an object describing the deleted instrument release. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaInstReleasesItemBase
     */
    deleteCaseInstrumentRelease(caInstReleasesId: number): Promise<unknown>;
    /**
     * Search for Case Instrument Releases. Include one or more of the search fields. A logical 'and' operation is applied for muliple search fields.
     *
     * @category Case Instrument Releases
     * @param {Object} filters - Specify at least one of the following: AmountReleased, CaInstReleasesId, CaInstrumentId, CommentText, PercentReleased, ReleasedBy
     * @return {Object} Returns Promise that represents an Array of Case Instruments resulting from the search
     */
    searchCaseInstrumentReleases(filters: Object): Promise<unknown>;
}
