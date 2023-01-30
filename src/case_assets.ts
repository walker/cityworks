import { CWError } from './error'
const _ = require('lodash')

export class CaseAssets {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Attach asset to case
   *
   * @category Case Assets
   * @param {number} caObjectId - The Case Object to attach the data group to.
   * @param {number} caseDataGroupId - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string} groupCode - The Group Code.
   * @param {Object} [options] - Options for CaseDataGroup including GroupDesc, GroupSum, and SumFlag
   * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
   */
   attach(caObjectId: number, updateXY: boolean = true, options?: {Address?: string, AddressId?: number, AssetId?: string, AssetObjectId?: number, AssetType?: string, CityName?: string, CrossStreet?: string, DateExpired?: string, ExpiredFlag?: string, Facility_Id?: string, FeatureAssetId?: string, FeatureClass?: string, FeatureObjectId?: number, LegacyId?: string, Level_Id?: string, LndObjectId?: number, Location?: string, MasterFlag?: string, ObjectId?: string, StateCode?: string, StreetDirection?: string, StreetFraction?: string, StreetName?: string, StreetNumber?: number, StreetPostDir?: string, StreetType?: string, Suite?: string, TileNo?: string, UpdateCaseData?: boolean, XCoord?: number, YCoord?: number, ZCoord?: number, ZipCode?: string}) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        UpdateXY: updateXY
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseAddress/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Dettach specific asset from case
   *
   * @category Case Assets
   * @param {number} caObjectId - The Case Object to attach the data group to.
   * @param {boolean} updateXY - The business case ID
   * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
   */
  detach(caAddressId: number, updateXY: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {
        CaAddressId: caAddressId,
        UpdateXY: updateXY
      }
      this.cw.runRequest('Pll/CaseAddress/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Detach all assets from case
   *
   * @category Case Assets
   * @param {number} caObjectId - The Case Object to detach the assets from.
   * @param {boolean} updateXY - The business case ID
   * @return {Object} Returns Promise that represents a collection of detached CaAddressIds.
   */
  detachAll(caObjectId: number, updateXY: boolean = true) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        UpdateXY: updateXY
      }
      this.cw.runRequest('Pll/CaseAddress/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get assets attached to a specific case
   *
   * @category Case Assets
   * @param {number} caObjectId - The Case Object from which to get attached assets
   * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
   */
  getForCase(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseAddress/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }


  /**
   * Search for Case Assets. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Case Assets
   * @param {Object} filters - The parameters to search by. (CaDataDetailId, CaDataListId, ListValue)
   * @return {Object} Returns Promise that represents an Array of resulting CaDataListIds
   */
   search(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['AssetType', 'CaAddressId', 'CaObjectId', 'CityName', 'ExpiredFlag', 'StateCode', 'StateName', 'StreetName', 'StreetNumber', 'Suite', 'ZipCode']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (AssetType, CaAddressId, CaObjectId, CityName, ExpiredFlag, StateCode, StateName, StreetName, StreetNumber, Suite, ZipCode) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseAddress/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
