const _ = require('lodash')

export interface CWErrorMsgs {
  MessageType: number
  Code: number
  Service: string
  Name: string
  DebugDetails: string
  DisplayText: string
  InnerMessage: string|null
}

/**
 * CWErrorInt interface definition for implementation by CWError
 *
 * `{name: string, code: number, message: string, info?: string}`
 *
 */
export interface CWErrorInt {
  name: string
  code: number
  message: string
  error_messages?: Array<CWErrorMsgs>
  info?: string
}

/**
 * CWError implements a custom error class for this codebase with additional information
 *
 */
export class CWError implements CWErrorInt {
  /**
   * Just statically set to "Cityworks Exception" for now
   */
  name: string
  /**
   * Number for the thrown error (Efforts were made to make these unique when thrown throughout the codebase)
   */
  code: number
  /**
   * The error message
   */
  message: string
  /**
   * The error message
   */
  error_messages: Array<CWErrorMsgs>
  /**
   * Object stuffed with any other information one wishes to include in the thrown error
   */
  info?: string

  /**
   * CWError implements a custom error class for this codebase with additional information
   *
   * @param {number} code - Number for the thrown error (Efforts were made to make these unique when thrown throughout the codebase)
   * @param {string} message - The error message
   * @param {Object} info - Object stuffed with any other information one wishes to include in the thrown error
   * @return {Object} Returns instance of CWError object
   */
  constructor(code:number, message:string, info?:any) {
    this.name = "Cityworks Exception"
    this.code = code
    this.message = message
    this.error_messages = []
    // console.log('CWERROR', code, message, info)
    if(typeof(info) !== 'undefined') {
      if(_.has(info, 'ErrorMessages')) {
        _.forEach(info.ErrorMessages, (v) => {
          _.set(v, 'Service', v.Service.replace(/([a-z])([A-Z])/g, '$1 $2'))
          _.set(v, 'Name', v.Name.replace(/([a-z])([A-Z])/g, '$1 $2'))
          this.error_messages.push(v)
        })
      }
      if(_.has(info, 'Message'))
        this.message = _.get(info, 'Message')
      this.info = JSON.stringify(info)
    }
  }
}
