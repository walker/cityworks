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
   * Add Case Payment Refund. Refunds a payment on the case payment specified by caPaymentId.
   *
   * @category Case Payment Refunds
   * @param {number} caPaymentId - The Case Payment ID for the case payment which to refund
   * @param {number} refundAmount - The amount to refund
   * @param {string} comment - A comment to append to the refund
   * @return {Object} Returns Promise that represents an object describing the newly-added payment refund. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPaymentRefundItemBase
   */
  addRefund(caPaymentId: number, refundAmount: number, comment: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaPaymentId: caPaymentId,
        RefundAmount: refundAmount,
        Comments: comment
      }
      this.cw.runRequest('Pll/CasePaymentRefund/Add', data).then(r => {
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
   * @return {Object} Returns Promise that represents an object describing the updated fee. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaFeesItemBase
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
   * Void a refund.
   *
   * @category Case Refund Payment
   * @param {number} caPaymentRefundId - The Refund ID for the specific refund to void
   * @param {String} voided - A string. No clue.
   * @return {Object} Returns Promise that represents an object describing the voided refund. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPaymentRefundItemBase
   */
  voidRefund(caPaymentRefundId: number, voided: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaPaymentRefundId: caPaymentRefundId,
        Voided: voided
      }
      this.cw.runRequest('Pll/CasePaymentRefund/Update', data).then(r => {
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
   * Delete Case Payment Refund. Removes a refund on a payment.
   *
   * @category Case Payment Refunds
   * @param {number} caPaymentRefundId - The Case Payment ID for the case payment which to refund
   * @return {Object} Returns Promise that represents an object describing the deleted payment refund. See /{subdirectory}/apidocs/#/data-type-info;dataType=CaPaymentRefundItemBase
   */
  deleteRefund(caPaymentRefundId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaPaymentRefundId: caPaymentRefundId
      }
      this.cw.runRequest('Pll/CasePaymentRefund/Delete', data).then(r => {
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
   * Search for Case Fees. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Fees
   * @param {Object} filters - The parameter(s) to search by
   * @return {Object} Returns Promise that represents an Array of case fee IDs
   */
  searchFees(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaFeeId', 'CaObjectId', 'FeeCode', 'FeeDesc']).length==0) {
        reject(new CWError(4, 'At least one of the attributes (CaFeeId, CaObjectId, FeeCode, FeeDesc) must be defined.'))
      }
      var data = filters
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
   * @param {Object} filters - The filters to search for matched Case Payments
   * @return {Object} Returns Promise that represents an Array of case payment IDs
   */
  searchPayments(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaPaymentId', 'CommentText', 'FeeAmount', 'FeeCode', 'FeeDesc', 'PaymentAccount', 'PaymentAmount', 'TenderType']).length==0) {
        reject(new CWError(5, 'At least one of the attributes (CaPaymentId, CommentText, FeeAmount, FeeCode, FeeDesc, PaymentAccount, PaymentAmount, TenderType) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CasePayment/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Payment Refunds. Include one or more of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Payment Refunds
   * @param {Object} filters - The filters to search for matched Case Payments.
   * @return {Object} Returns Promise that represents an Array of case payment refund IDs
   */
  searchRefunds(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaPaymentId', 'CaPaymentRefundId', 'Comments', 'RefundAmount']).length==0) {
        reject(new CWError(6, 'At least one of the attributes (CaPaymentId, CaPaymentRefundId, Comments, RefundAmount) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CasePayment/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Deposits. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Deposits
   * @param {Object} filters - The parameters to search by.
   * @return {Object} Returns Promise that represents an Array of case fee IDs
   */
  searchDeposits(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['CaDepositId', 'CaObjectId', 'DepositCode', 'DepositDesc']).length==0) {
        reject(new CWError(1, 'At least one of the arguments (CaDepositId, CaObjectId, DepositCode, DepositDesc) must be defined.'))
      }
      var data = filters
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
   * Search for Fees. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Fees
   * @param {Object} filters - The parameters to search by
   * @return {Object} Returns Promise that represents an Array of case fee IDs
   */
  searchFeeTemplates(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['FeeSetupId', 'FeeTypeId', 'FeeCode', 'FeeDesc', 'AccountCode']).length==0) {
        reject(new CWError(7, 'At least one of the arguments (FeeSetupId, FeeTypeId, FeeCode, FeeDesc, AccountCode) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/FeeSetup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Instruments. Include at least one of the search fields. A logical 'and' operation is applied for multiple search fields.
   *
   * @category Case Instruments
   * @param {Object} filters - The parameters to search by (AddressLine1, Amount, CaInstrumentId, CityName, CommentText, Company, ContactEmail, ContactName, ContactPhone, CountryCode, InstTypeId, SerialNumber, StateCode, ZipCode)
   * @return {Object} Returns Promise that represents an Array of case instrument IDs
   */
  searchCaseInstruments(filters: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['AddressLine1', 'Amount', 'CaInstrumentId', 'CityName', 'CommentText', 'Company', 'ContactEmail', 'ContactName', 'ContactPhone', 'CountryCode', 'InstTypeId', 'SerialNumber', 'StateCode', 'ZipCode']).length==0) {
        reject(new CWError(9, 'At least one of the arguments (AddressLine1, Amount, CaInstrumentId, CityName, CommentText, Company, ContactEmail, ContactName, ContactPhone, CountryCode, InstTypeId, SerialNumber, StateCode, ZipCode) must be defined.'))
      }
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
      if(_.intersectionBy(_.keysIn(filters), ['AmountReleased', 'CaInstReleasesId', 'CaInstrumentId', 'CommentText', 'PercentReleased', 'ReleasedBy']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (AmountReleased, CaInstReleasesId, CaInstrumentId, CommentText, PercentReleased, ReleasedBy) must be defined.'))
      }
      this.cw.runRequest('Pll/CaseInstReleases/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get All Fees
   *
   * @category Fees
   * @return {Object} Returns Promise that represents a collection of FeeSetups. See /{subdirectory}/apidocs/#/data-type-info;dataType=FeeSetupItemBase
   */
  fees() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Pll/FeeSetup/All', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Fees. Include one or more of the search fields. A logical 'and' operation is applied for muliple search fields.
   *
   * @category Fees
   * @param {Object} filters - Specify at least one.
   * @return {Object} Returns Promise that represents a collection of FeeSetups. See /{subdirectory}/apidocs/#/data-type-info;dataType=FeeSetupItemBase
   */
  searchAvailableFees(filters: {AccountCode?: string, FeeCode?: string, FeeDesc?: string, FeeSetupId?: number, FeeTypeId?: number}) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(_.keysIn(filters), ['AccountCode', 'FeeCode', 'FeeDesc', 'FeeSetupId', 'FeeTypeId']).length==0) {
        reject(new CWError(8, 'At least one of the attributes (AccountCode, FeeCode, FeeDesc, FeeSetupId, FeeTypeId) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/FeeSetup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get all tender types configured
   *
   * @category Tender Types
   * @return {Object} Returns Promise that represents a collection of tender type objects. See /{subdirectory}/apidocs/#/data-type-info;dataType=TenderTypeItem
   */
  getTenderTypes() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/TenderType/All', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Adds a tender type configuration
   *
   * @category Tender Types
   * @param {Object} options - See /{subdirectory}/apidocs/#/service-info/Pll/TenderType
   * @return {Object} Returns Promise that represents an object describing the newly-added tender type. See /{subdirectory}/apidocs/#/data-type-info;dataType=TenderTypeItem
   */
  addTenderType(options: Object) {
    return new Promise((resolve, reject) => {
      var data = options
      this.cw.runRequest('Pll/TenderType/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update a tender type configuration
   *
   * @category Tender Types
   * @param {number} tenderTypeId - ID of the tender type to update
   * @param {Object} options - See /{subdirectory}/apidocs/#/service-info/Pll/TenderType
   * @return {Object} Returns Promise that represents an object describing the newly-added tender type. See /{subdirectory}/apidocs/#/data-type-info;dataType=TenderTypeItem
   */
  updateTenderType(tenderTypeId: number, options: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        TenderTypeId: tenderTypeId
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/TenderType/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
