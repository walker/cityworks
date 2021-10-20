import { CWError } from './error'
const _ = require('lodash')

export class Request {
  cw: any;

  /**
   * Construct activity link object for Request functions
   *
   * @param {object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
   * @return {Object} Returns object that is this module
   */
  constructor(cw) {
    this.cw = cw;
  }

}
