interface CWErrorInt {
  name: string
  code: number
  message: string
  info?: string
}

/**
 * CWError implements a custom error class for this codebase with additional information
 *
 * `{name: string, code:number, info: object}`
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
  constructor(code:number, message:string, info?:object) {
    this.name = "Cityworks Exception"
    this.code = code
    this.message = message
    if(typeof(info) !== 'undefined') {
      this.info = JSON.stringify(info)
    }
  }
}
