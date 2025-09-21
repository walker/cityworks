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
  Name: string
  Code: number
  Message: string
  Error_messages?: Array<CWErrorMsgs>
  Info?: string
}

/**
 * CWError implements a custom error class for this codebase with additional information
 *
 */
export class CWError implements CWErrorInt {
  /**
   * Just statically set to "Cityworks Exception" for now
   */
  Name: string
  /**
   * Number for the thrown error (Efforts were made to make these unique when thrown throughout the codebase)
   */
  Code: number
  /**
   * The error message
   */
  Message: string
  /**
   * The error message
   */
  Error_messages: Array<CWErrorMsgs>
  /**
   * Object stuffed with any other information one wishes to include in the thrown error
   */
  Info?: string

  /**
   * CWError implements a custom error class for this codebase with additional information
   *
   * @param {number} code - Number for the thrown error (Efforts were made to make these unique when thrown throughout the codebase)
   * @param {string} message - The error message
   * @param {Object} info - Object stuffed with any other information one wishes to include in the thrown error
   * @return {Object} Returns instance of CWError object
   */
  constructor(code:number, message:string, info?:any) {
    this.Name = "Cityworks Exception"
    this.Code = code
    this.Message = message
    this.Error_messages = []
    // console.log('CWERROR', code, message, info)
    if(typeof(info) !== 'undefined') {
      if(_.has(info, 'ErrorMessages')) {
        _.forEach(info.ErrorMessages, (v) => {
          _.set(v, 'Service', v.Service.replace(/([a-z])([A-Z])/g, '$1 $2'))
          _.set(v, 'Name', v.Name.replace(/([a-z])([A-Z])/g, '$1 $2'))
          this.Error_messages.push(v)
        })
      }
      if(_.has(info, 'Message'))
        this.Message = _.get(info, 'Message')
      this.Info = JSON.stringify(info)
    }
  }
}
