export declare class CaseAssets {
    /**
     * @hidden
     */
    cw: any;
    /**
     * @hidden
     */
    constructor(cw: any);
    /**
     * Attach asset to case
     *
     * @category Case Assets
     * @param {number} caObjectId - The Case Object to attach the data group to.
     * @param {boolean} updateXY - Whether or not to update the Case's X/Y values when attaching the asset. Defaults to true.
     * @param {Object} [options] - Options for CaseDataGroup including Address, AddressId, AssetId, AssetObjectId, AssetType, CityName, CrossStreet, DateExpired, ExpiredFlag, Facility_Id, FeatureAssetId, FeatureClass, FeatureObjectId, LegacyId, Level_Id, LndObjectId, Location, MasterFlag, ObjectId, StateCode, StreetDirection, StreetFraction, StreetName, StreetNumber, StreetPostDir, StreetType, Suite, TileNo, UpdateCaseData, XCoord, YCoord, ZCoord, and ZipCode
     * @return {Object} Returns Promise that represents an object describing CaAddress.
     * // {"AddressId":OBJECTID,"AssetId":"GUID","AssetType":"ASSET_NAME","CaObjectId":CA_OBJECTID,"FeatureAssetId":"GUID","FeatureClass":"ASSET_NAME","FeatureObjectId":OBJECTID,"Location":"Address string","ObjectId":"OBJECTID","XCoord":,"YCoord":,"UpdateCaseData":false}
     */
    attach(caObjectId: number, updateXY?: boolean, options?: {
        Address?: string;
        AddressId?: number;
        AssetId?: string;
        AssetObjectId?: number;
        AssetType?: string;
        CityName?: string;
        CrossStreet?: string;
        DateExpired?: string;
        ExpiredFlag?: string;
        Facility_Id?: string;
        FeatureAssetId?: string;
        FeatureClass?: string;
        FeatureObjectId?: number;
        LegacyId?: string;
        Level_Id?: string;
        LndObjectId?: number;
        Location?: string;
        MasterFlag?: string;
        ObjectId?: string;
        StateCode?: string;
        StreetDirection?: string;
        StreetFraction?: string;
        StreetName?: string;
        StreetNumber?: number;
        StreetPostDir?: string;
        StreetType?: string;
        Suite?: string;
        TileNo?: string;
        UpdateCaseData?: boolean;
        XCoord?: number;
        YCoord?: number;
        ZCoord?: number;
        ZipCode?: string;
    }): Promise<unknown>;
    /**
     * Detach specific asset from case
     *
     * @category Case Assets
     * @param {number} caObjectId - The Case Object to attach the data group to.
     * @param {boolean} updateXY - Whether or not to update the Case's X/Y values when detaching the assets. Defaults to true.
     * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
     */
    detach(caAddressId: number, updateXY?: boolean): Promise<unknown>;
    /**
     * Detach all assets from case
     *
     * @category Case Assets
     * @param {number} caObjectId - The Case Object to detach the assets from.
     * @param {boolean} updateXY - Whether or not to update the Case's X/Y values when detaching the asset(s). Defaults to false.
     * @return {Object} Returns Promise that represents a collection of detached CaAddressIds.
     */
    detachAll(caObjectId: number, updateXY?: boolean): Promise<unknown>;
    /**
     * Get assets attached to a specific case
     *
     * @category Case Assets
     * @param {number} caObjectId - The Case Object from which to get attached assets
     * @return {Object} Returns Promise that represents a collection of the default CaAddresses.
     */
    getForCase(caObjectId: number): Promise<unknown>;
    /**
     * Search for Case Assets. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
     *
     * @category Case Assets
     * @param {Object} filters - The parameters to search by. (AssetType, CaAddressId, CaObjectId, CityName, ExpiredFlag, StateCode, StateName, StreetName, StreetNumber, Suite, ZipCode)
     * @return {Object} Returns Promise that represents an Array of resulting CaAddresses
     */
    search(filters?: Object): Promise<unknown>;
}
