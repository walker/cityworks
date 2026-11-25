import { CWError } from './error'
import { Request } from './request'
import _ from 'lodash'

/**
 * Customer call (caller) fields accepted when adding or updating a caller. All fields are optional here;
 * the wrapper supplies RequestId (add) and IncidentNum (update) for you.
 */
export interface CustomerCallData {
  AcctNum?: string
  Answers?: Array<any>
  AptNum?: string
  CallerType?: string
  Ccx?: number
  Ccy?: number
  Ccz?: number
  CellPhone?: string
  Comments?: string
  CustAddress?: string
  CustAddType?: string
  CustCallback?: boolean
  CustCity?: string
  CustContact?: boolean
  CustDistrict?: string
  CustState?: string
  CustZip?: string
  DateAnswers?: Array<any>
  DateTimeCall?: Date | string
  DateTimeCallback?: Date | string
  DateTimeContact?: Date | string
  Email?: string
  EmployeeSid?: number
  Fax?: string
  FirstName?: string
  HomePhone?: string
  /**
   * When present (and the call is not forced to be new), the existing customer call is updated instead of a new one being added.
   */
  IncidentNum?: number
  IsFollowUpCall?: boolean
  IsResident?: boolean
  LastName?: string
  MiddleInitial?: string
  OtherPhone?: string
  ProbDetails?: string
  RequestId?: number
  Text1?: string
  Text2?: string
  Text3?: string
  Text4?: string
  Text5?: string
  Title?: string
  WorkPhone?: string
  [key: string]: any
}

/**
 * Options for passing customer calls through request create/update
 */
export interface CustomerCallOptions {
  /**
   * When true, every provided customer call is added as a brand new call on the request, even if it contains an IncidentNum
   * (e.g. data copied from a previous call). Use this when the same caller phones in again about the same request. Defaults to false.
   */
  newCall?: boolean
}

/**
 * Customer call (caller) methods. This is a subclass of {@link Request}: it inherits every request method
 * (`getById`, `create`, `update`, ...) and is available as `request.customerCall`.
 *
 * Customer calls always belong to an existing service request, so the request id is the first argument of the methods
 * that create calls. Customer calls can also be created/updated as part of `request.create()` and `request.update()`.
 */
export class CustomerCall extends Request {
  /**
   * @hidden
   */
  constructor(cw) {
    super(cw)
    // so inherited request create/update pass-through to callers also works when called on this object
    this.customerCall = this
  }

  /**
   * Add a caller to a service request. This always creates a new customer call.
   *
   * @category Customer Calls
   * @param {number} requestId - The service request to add the caller to
   * @param {Object} callData - See /{subdirectory}/apidocs/#/data-type-info;dataType=CustomerCallBase on the Cityworks instance. IncidentNum and Employee are ignored.
   * @return {Object} Returns Promise that represents an object describing the newly-created customer call
   */
  addToRequest(requestId: number, callData: CustomerCallData = {}) {
    return new Promise((resolve, reject) => {
      if(!_.isNumber(requestId)) {
        reject(new CWError(601, 'RequestId must be provided.', {'provided': requestId}))
        return
      }
      const data = _.assign(_.omit(callData, ['IncidentNum', 'Employee']), {RequestId: requestId})
      this.cw.runRequest('Ams/CustomerCall/AddToRequest', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update an existing customer call
   *
   * @category Customer Calls
   * @param {number} incidentNum - The IncidentNum of the customer call to update
   * @param {Object} callData - The fields to update. See /{subdirectory}/apidocs/#/data-type-info;dataType=CustomerCallBase on the Cityworks instance.
   * @return {Object} Returns Promise that represents an object describing the updated customer call
   */
  updateCall(incidentNum: number, callData: CustomerCallData = {}) {
    return new Promise((resolve, reject) => {
      if(!_.isNumber(incidentNum)) {
        reject(new CWError(602, 'IncidentNum must be provided.', {'provided': incidentNum}))
        return
      }
      const data = _.assign(_.omit(callData, ['Employee']), {IncidentNum: incidentNum})
      this.cw.runRequest('Ams/CustomerCall/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * The phone numbers (digits only, last 10) and lowercased email of a customer call, used to recognise the same caller
   *
   * @hidden
   */
  private static contactKeys(call: any): Array<string> {
    const keys: Array<string> = []
    _.forEach(['HomePhone', 'WorkPhone', 'CellPhone', 'OtherPhone'], f => {
      const digits = _.replace(_.toString(_.get(call, f, '')), /\D/g, '')
      if(digits.length > 0) keys.push('p:' + _.takeRight(digits, 10).join(''))
    })
    const email = _.toLower(_.trim(_.toString(_.get(call, 'Email', ''))))
    if(email.length > 0) keys.push('e:' + email)
    return keys
  }

  /**
   * Add and/or update customer calls on a service request. Used by `request.create()` and `request.update()`, but usable directly.
   *
   * Each call is processed in order:
   * - With `options.newCall`, it is always added as a new customer call (any IncidentNum is ignored).
   * - Otherwise, a call containing an IncidentNum updates that customer call.
   * - Otherwise, the request's existing customer calls are checked for the same caller: a matching phone number (home, work, cell or other,
   *   compared by digits) or email address updates that customer call (the most recent match if several). No match adds a new call.
   *
   * @category Customer Calls
   * @param {number} requestId - The service request the callers belong to
   * @param {Object|Array<Object>} calls - One or more customer call data objects
   * @param {Object} [options] - `{newCall: boolean}`
   * @return {Object} Returns Promise that represents an array of the created/updated customer calls (in the order provided)
   */
  applyToRequest(requestId: number, calls: CustomerCallData | Array<CustomerCallData>, options: CustomerCallOptions = {}) {
    return new Promise<Array<any>>((resolve, reject) => {
      const list = _.castArray(calls)
      if(!_.every(list, _.isPlainObject)) {
        reject(new CWError(603, 'Customer call data must be an object or an array of objects.', {'provided': calls}))
        return
      }
      const results: Array<any> = []
      // existing calls are fetched at most once, and only if a call needs matching
      const cache: {existing?: Promise<Array<any>>} = {}
      const getExisting = (): Promise<Array<any>> => {
        const found = cache.existing || (this.getByRequestId(requestId).then(r => _.castArray(r || [])) as Promise<Array<any>>)
        cache.existing = found
        return found
      }
      const findMatch = (call: CustomerCallData) => {
        const keys = CustomerCall.contactKeys(call)
        if(keys.length === 0) return Promise.resolve(undefined)
        return getExisting().then(found => {
          const matches = _.filter(found, c => _.intersection(keys, CustomerCall.contactKeys(c)).length > 0)
          return _.maxBy(matches, 'IncidentNum')
        })
      }
      const add = (call: CustomerCallData) => {
        return this.addToRequest(requestId, call).then(r => {
          if(cache.existing) {
            cache.existing = cache.existing.then(found => found.concat(_.assign({}, call, r as any)))
          }
          return r
        })
      }
      list.reduce((chain: Promise<any>, call: CustomerCallData) => {
        return chain.then(() => {
          let p: Promise<any>
          if(options.newCall) {
            p = add(call)
          } else if(_.isNumber(call.IncidentNum)) {
            p = this.updateCall(call.IncidentNum as number, _.assign({}, call, {RequestId: requestId})) as Promise<any>
          } else {
            p = findMatch(call).then(match => {
              return match
                ? this.updateCall(match.IncidentNum, _.assign({}, call, {RequestId: requestId}))
                : add(call)
            })
          }
          return p.then(r => { results.push(r) })
        })
      }, Promise.resolve()).then(() => {
        resolve(results)
      }).catch(e => {
        reject(new CWError(604, 'Customer call ' + (results.length + 1) + ' of ' + list.length + ' failed: ' + _.get(e, 'Message', String(e)), {'RequestId': requestId, 'Completed': results, 'Cause': e}))
      })
    })
  }

  /**
   * Get a customer call by its incident number
   *
   * @category Customer Calls
   * @param {number} incidentNum
   * @return {Object} Returns Promise that represents an object describing the customer call
   */
  getByIncidentNum(incidentNum: number) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/ByIncidentNum', {IncidentNum: incidentNum}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the customer calls for a service request
   *
   * @category Customer Calls
   * @param {number} requestId
   * @return {Object} Returns Promise that represents a collection of customer calls
   */
  getByRequestId(requestId: number) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/ByRequestId', {RequestId: requestId}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get the customer calls for multiple service requests
   *
   * @category Customer Calls
   * @param {Array<number>} requestIds
   * @return {Object} Returns Promise that represents a collection of customer calls
   */
  getByRequestIds(requestIds: Array<number>) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/ByRequestIds', {RequestIds: requestIds}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get caller questions for customer calls
   *
   * @category Customer Calls
   * @param {Array<number>} incidentNums
   * @return {Object} Returns Promise that represents a collection of caller questions
   */
  getQuestions(incidentNums: Array<number>) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/CallerQuestions', {IncidentNums: incidentNums}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get caller questions for service requests
   *
   * @category Customer Calls
   * @param {Array<number>} requestIds
   * @return {Object} Returns Promise that represents a dictionary of RequestId to collection of caller questions
   */
  getQuestionsByRequestIds(requestIds: Array<number>) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/CallerQuestionsByRequestIds', {RequestIds: requestIds}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete a customer call
   *
   * @category Customer Calls
   * @param {number} incidentNum
   * @return {Object} Returns Promise that represents the result of the delete operation
   */
  deleteCall(incidentNum: number) {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/CustomerCall/Delete', {IncidentNum: incidentNum}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Move a customer call's point
   *
   * @category Customer Calls
   * @param {number} incidentNum
   * @param {number} x
   * @param {number} y
   * @param {Object} projection - Should include at least WKT _or_ WKID attribute. Can also include VcsWKID attribute.
   * @param {number} [z] - Optional Z coordinate
   * @return {Object} Returns Promise that represents an object describing the updated GISPoint
   */
  moveCall(incidentNum: number, x: number, y: number, projection: {WKID?: number|string, WKT?: string, VcsWKID?: number|string}, z?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(projection, 'WKID') && !_.has(projection, 'WKT')) {
        reject(new CWError(605, 'You must provide either the WKID or WKT for the x/y coordinates.', {'projection': projection}))
        return
      }
      const data = _.merge({IncidentNum: incidentNum, X: x, Y: y}, projection)
      if(typeof(z)!='undefined') {
        _.set(data, 'Z', z)
      }
      this.cw.runRequest('Ams/CustomerCall/Move', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Move customer calls from one service request to another
   *
   * @category Customer Calls
   * @param {number} fromRequestId
   * @param {number} toRequestId
   * @param {Array<number>} incidentNums - The customer calls to move
   * @return {Object} Returns Promise that represents the result of the move operation
   */
  moveToRequest(fromRequestId: number, toRequestId: number, incidentNums: Array<number>) {
    return new Promise((resolve, reject) => {
      const data = {FromRequestId: fromRequestId, ToRequestId: toRequestId, IncidentNums: incidentNums}
      this.cw.runRequest('Ams/CustomerCall/MoveToRequest', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
