import { CWError } from './error'
const _ = require('lodash')

export class CaseFinancial {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw: Object) {
    this.cw = cw
  }

  /**
   * Adds a fee to the case specified by the CaObectId.
   *
   * @category Case Fees
   * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
   * @param {number} feeSetupId - The fee setup id for the fee to add to the case.
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CaseFees for more options. (Checkboxes -- Autorecalculate -- are Y/N strings)
   * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
   */
  addFee(caObjectId: number, feeSetupId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaObjectId: caObjectId,
        FeeSetupId: feeSetupId
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CaseFees/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Updates a fee specified by the CaFeeId.
   *
   * @category Case Fees
   * @param {number} caFeeId - The Fee ID for the specific instance of the fee you wish to update
   * @param {Object} [options] - See /{subdirectory}/apidocs/#/service-info/Pll/CaseFees for more options. (Checkboxes -- Autorecalculate -- are Y/N strings)
   * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
   */
  updateFee(caFeeId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaFeeId: caFeeId
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CaseFees/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Adds Default Case Fees. Adds fees to the case specified by the CaObectId and BusCaseId.
   *
   * @category Case Fees
   * @param {number} caObjectId - The Case Object ID for the case to which to add the default fees
   * @param {number} busCaseId - The business case ID whose default fees should be added to the case
   * @return {Object} Returns Promise that represents a collection of Fee Items. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
   */
  addDefaultFees(caObjectId: number, busCaseId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        BusCaseId: busCaseId
      }
      this.cw.runRequest('Pll/CaseFees/AddDefault', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Gets the fees from the case specified by the CaObectId.
   *
   * @category Case Fees
   * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
   * @return {Object} Returns Promise that represents an collection of Case Fees.
   */
  getFees(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseFees/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete the fee specified by the caFeeId.
   *
   * @category Case Fees
   * @param {number} caFeeId - The Case Fee ID which should be deleted
   * @return {Object} Returns Promise that represents a collection of Case Fees.
   */
  deleteFee(caFeeId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaFeeId: caFeeId
      }
      this.cw.runRequest('Pll/CaseFees/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Case Fees by Case ObjectId. Delete from the system all Fees linked to a specific Case as specified by the Case Id parameter (CaObjectId).
   *
   * @category Case Fees
   * @param {number} caObjectId - The Case Object ID whose fees should be deleted
   * @return {Object} Returns Promise that represents a number (?)
   */
  deleteFeesByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseFees/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  searchFees(caFeeId?: number, caObjectId?: number, feeCode?: string, feeDesc?: string) {
    return new Promise((resolve, reject) => {
      if(typeof caFeeId == 'undefined' && typeof caObjectId == 'undefined' && typeof feeCode == 'undefined' && typeof feeDesc == 'undefined') {
        reject(new CWError(1, 'At least one of the arguments (caFeeId, caObjectId, feeCode, feeDesc) must be defined.'))
      }
      var data = {};
      if(typeof caFeeId != 'undefined') {
        _.set(data, 'CaFeeId', caFeeId);
      }
      if(typeof caObjectId != 'undefined') {
        _.set(data, 'CaObjectId', caObjectId);
      }
      if(typeof feeCode != 'undefined') {
        _.set(data, 'FeeCode', feeCode);
      }
      if(typeof feeDesc != 'undefined') {
        _.set(data, 'FeeDesc', feeDesc);
      }
      this.cw.runRequest('Pll/CaseFees/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get All Fee Templates
   *
   * @category Case Fees
   * @return {Object} Returns Promise that represents an object describing the newly-added fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
   */
  getAllFeeTemplates() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/FeeSetup/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  searchFeeTemplates(feeSetupId?: number, feeTypeId?: number, feeCode?: string, feeDesc?: string, accountCode?: string) {
    return new Promise((resolve, reject) => {
      if(typeof feeSetupId == 'undefined' && typeof feeTypeId == 'undefined' && typeof feeCode == 'undefined' && typeof feeDesc == 'undefined' && typeof accountCode == 'undefined') {
        reject(new CWError(1, 'At least one of the arguments (caFeeId, caObjectId, feeCode, feeDesc) must be defined.'))
      }
      var data = {};
      if(typeof feeSetupId != 'undefined' && feeSetupId!=null) {
        _.set(data, 'FeeSetupId', feeSetupId);
      }
      if(typeof feeTypeId != 'undefined' && feeTypeId!=null) {
        _.set(data, 'FeeTypeId', feeTypeId);
      }
      if(typeof feeCode != 'undefined' && feeCode!=null) {
        _.set(data, 'FeeCode', feeCode);
      }
      if(typeof feeDesc != 'undefined' && feeDesc!=null) {
        _.set(data, 'FeeDesc', feeDesc);
      }
      if(typeof accountCode != 'undefined' && accountCode!=null) {
        _.set(data, 'AccountCode', accountCode);
      }
      this.cw.runRequest('Pll/FeeSetup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
