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
   * Add Case Fee Payment. Adds a payment to the case fee specified by caObjectId.
   *
   * @category Case Payments
   * @param {number} caObjectId - The Case Object ID for the case to which to add the fee
   * @param {Object} options - See /{subdirectory}/apidocs/#/service-info/Pll/CasePayment for more options, including required fields.
   * @return {Object} Returns Promise that represents an object describing the newly-added payment. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPaymentItemBase
   */
  addPayment(caObjectId: number, options: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaObjectId: caObjectId
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CasePayment/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Case Deposit Payment. Adds a payment to the case deposit specified by CaDepositId.
   *
   * @category Case Payments
   * @param {number} caDepositId - The Case Deposit ID for the case deposit to which to add the fee
   * @param {Object} options - See /{subdirectory}/apidocs/#/service-info/Pll/CasePayment for more options, including required fields.
   * @return {Object} Returns Promise that represents an object describing the newly-added payment. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPaymentItemBase
   */
  addDepositPayment(caDepositId: number, options: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaDepositId: caDepositId
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CasePayment/AddDeposit', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  addDeposit(caObjectId: number, depositId: number, amount?: number, comment?: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        DepositId: depositId
      }
      if(typeof(amount)!='undefined') {
        _.set(data, 'Amount', amount)
      }
      if(typeof(comment)!='undefined') {
        _.set(data, 'CommentText', comment)
      }
      this.cw.runRequest('CaseDeposit/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  addInstrument(caObjectId: number, instTypeId: number, amount: number, dateExpire: Date, options?: Object) {
    return new Promise((resolve, reject) => {
      var init_data = {
        CaObjectId: caObjectId,
        InstTypeId: instTypeId,
        Amount: amount,
        DateExpire: dateExpire
      }
      var data = _.merge(init_data, options);
      this.cw.runRequest('Pll/CaseInstrument/Add', data).then(r => {
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
   * Adds Default Case Deposits. Adds deposits to the case specified by the CaObectId and BusCaseId.
   *
   * @category Case Deposits
   * @param {number} caObjectId - The Case Object ID for the case to which to add the default deposits
   * @param {number} busCaseId - The business case ID whose default deposits should be added to the case
   * @return {Object} Returns Promise that represents a collection of Deposit Items. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaDepositItemBase
   */
  addDefaultDeposits(caObjectId: number, busCaseId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        BusCaseId: busCaseId
      }
      this.cw.runRequest('Pll/CaseDeposit/AddDefault', data).then(r => {
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
   * @param {number} caObjectId - The Case Object ID for the case to which to get the fees
   * @return {Object} Returns Promise that represents a collection of Case Fees.
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
   * Get Case Deposit by Case ObjectId.
   *
   * @category Case Deposits
   * @param {number} caObjectId - The Case Object ID for the case to which to get the deposits
   * @return {Object} Returns Promise that represents a collection of Case Deposits.
   */
  getDeposits(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseDeposit/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Case Payments by Case ObjectId
   *
   * @category Case Payments
   * @param {number} caObjectId - The Case Object ID for the case to which to get the payments
   * @return {Object} Returns Promise that represents a collection of Case Payments.
   */
  getPayments(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CasePayment/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Gets the instruments from the case specified by the CaObectId.
   *
   * @category Case Instruments
   * @param {number} caObjectId - The Case Object ID for the case to which to get the fees
   * @return {Object} Returns Promise that represents a collection of Case Instruments.
   */
  getInstruments(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseInstrument/ByCaObjectId', data).then(r => {
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
   * @return {Object} Returns Promise that represents a Case Fee object.
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
   * Delete a Case Payment by Id. Delete a specific case payment by CaPaymentId.
   *
   * @category Case Payments
   * @param {number} caPaymentId - The Case Payment ID which should be deleted
   * @return {Object} Returns Promise that represents a Case Payment object.
   */
  deletePayment(caFeeId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaFeeId: caFeeId
      }
      this.cw.runRequest('Pll/CasePayment/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Case Payments by Case ObjectId. Delete from the system all payments associated to a specific case as specified by the case id (CaObjectId)
   *
   * @category Case Payments
   * @param {number} caObjectId - The Case Object ID whose payments should be deleted
   * @return {Object} Returns Promise that represents a number (?)
   */
  deletePaymentsByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CasePayment/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete the fee specified by the caFeeId.
   *
   * @category Case Deposits
   * @param {number} caDepositId - The Case Deposit ID which should be deleted
   * @return {Object} Returns Promise that represents a collection of Case Deposits.
   */
  deleteDeposit(caDepositId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDepositId: caDepositId
      }
      this.cw.runRequest('Pll/CaseDeposit/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Case Fees by Case ObjectId. Delete from the system all Fees linked to a specific Case as specified by the Case Id parameter (CaObjectId).
   *
   * @category Case Deposits
   * @param {number} caObjectId - The Case Object ID whose fees should be deleted
   * @return {Object} Returns Promise that represents a number (?)
   */
  deleteDepositsByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseDeposit/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete the instrument specified by the caInstrumentId.
   *
   * @category Case Instruments
   * @param {number} caInstrumentId - The Case Instrument ID which should be deleted
   * @return {Object} Returns Promise that represents a Case Instrument.
   */
  deleteInstrument(caInstrumentId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaInstrumentId: caInstrumentId
      }
      this.cw.runRequest('Pll/CaseInstrument/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Case Instruments by Case ObjectId. Delete from the system all Instruments linked to a specific Case as specified by the Case Id parameter (CaObjectId).
   *
   * @category Case Instruments
   * @param {number} caObjectId - The Case Object ID whose instruments should be deleted
   * @return {Object} Returns Promise that represents a number (?)
   */
  deleteInstrumentsByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseInstrument/DeleteByCaObjectId', data).then(r => {
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
   * @param {number} [caFeeId] - The Case Fee ID which should be searched for
   * @param {number} [caObjectId] - The Case Object ID which should be searched for connected fees
   * @param {string} [feeCode] - The Case Fee Code which should be searched for
   * @param {string} [feeDesc] - The Case Fee Description which should be searched for
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
   * Search for Case Payments. Include one or more of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Payments
   * @param {number} filters - The filters to search for matched Case Payments
   * @return {Object} Returns Promise that represents an Array of case payment IDs
   */
  searchPayments(filters: Object) {
    return new Promise((resolve, reject) => {
      var data = {};
      _.marge(data, filters)
      this.cw.runRequest('Pll/CasePayment/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  searchDeposits(caDepositId?: number, caObjectId?: number, depositCode?: string, depositDesc?: string) {
    return new Promise((resolve, reject) => {
      if(typeof caDepositId == 'undefined' && typeof caObjectId == 'undefined' && typeof depositCode == 'undefined' && typeof depositDesc == 'undefined') {
        reject(new CWError(1, 'At least one of the arguments (caDepositId, caObjectId, depositCode, depositDesc) must be defined.'))
      }
      var data = {};
      if(typeof caDepositId != 'undefined') {
        _.set(data, 'CaDepositId', caDepositId);
      }
      if(typeof caObjectId != 'undefined') {
        _.set(data, 'CaObjectId', caObjectId);
      }
      if(typeof depositCode != 'undefined') {
        _.set(data, 'DepositCode', depositCode);
      }
      if(typeof depositDesc != 'undefined') {
        _.set(data, 'DepositDesc', depositDesc);
      }
      this.cw.runRequest('Pll/CaseDeposit/Search', data).then(r => {
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

  /**
   * Search for Case Instruments. Include one or more of the listed search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Instruments
   * @param {Object} filters - The filters to apply to the search of Case Instruments (AddressLine1, Amount, CaInstrumentId, CityName, CommentText, Company, ContactEmail, ContactName, ContactPhone, CountryCode, InstTypeId, SerialNumber, StateCode, ZipCode)
   * @return {Object} Returns Promise that represents an Array of case instrument IDs
   */
  searchCaseInstruments(filters?: Object) {
    return new Promise((resolve, reject) => {
      var data = filters
      this.cw.runRequest('Pll/CaseInstrument/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the Defined Instruments
   *
   * @category Instruments
   * @param {Object} options - the options to filter the instruments returned by
   * @return {Object} Returns Promise that represents an Array of CaInstrumentItem
   */
  getInstrumentList(options: Object) {
    return new Promise((resolve, reject) => {
      var data = options
      this.cw.runRequest('Pll/CaseInstrument/GetList', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

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
  addCaseInstrumentRelease(caInstrumentId: number, releasedBy: number, dateReleased: Date, amountReleased?: number, percentReleased?: number, comment?: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaInstrumentId: caInstrumentId,
        DateReleased: dateReleased,
        ReleasedBy: releasedBy
      }
      if((typeof(percentReleased)!='undefined' || percentReleased!=null) && (typeof(amountReleased)!='undefined' || amountReleased!=null)) {
        reject(new CWError(2, 'Either amountReleased or percentReleased must be specified.'))
      } else if(typeof(percentReleased)!='undefined' && percentReleased!=null) {
        _.set(data, 'PercentReleased', percentReleased)
      } else if(typeof(amountReleased)!='undefined' && amountReleased!=null) {
        _.set(data, 'AmountReleased', amountReleased)
      }
      if(typeof(comment)!='undefined') {
        _.set(data, 'CommentText', comment)
      }
      this.cw.runRequest('Pll/CaseInstReleases/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Deletes a release specified by the caInstReleasesId.
   *
   * @category Case Instrument Releases
   * @param {number} caInstReleasesId - The Case Instrument Release ID to delete
   * @return {Object} Returns Promise that represents an object describing the deleted instrument release. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaInstReleasesItemBase
   */
  deleteCaseInstrumentRelease(caInstReleasesId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaInstReleasesId: caInstReleasesId
      }
      this.cw.runRequest('Pll/CaseInstReleases/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Instrument Releases. Include one or more of the search fields. A logical 'and' operation is applied for muliple search fields.
   *
   * @category Case Instrument Releases
   * @param {Object} filters - Specify at least one of the following: AmountReleased, CaInstReleasesId, CaInstrumentId, CommentText, PercentReleased, ReleasedBy
   * @return {Object} Returns Promise that represents an Array of Case Instruments resulting from the search
   */
  searchCaseInstrumentReleases(filters: Object) {
    return new Promise((resolve, reject) => {
      var data = filters
      this.cw.runRequest('Pll/CaseInstReleases/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
