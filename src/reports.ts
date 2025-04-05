import { CWError } from './error'
const _ = require('lodash')
import { convertToObject } from 'typescript';

export class Reports {
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
   * Get the pdf "print" report for a specific CW node item
   *
   * @category Reports
   * @param {string} type - The node type (case, workorder, inspection, request)
   * @param {number} node_id - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string} fileName - The filename of the report.
   * @return {Object} Returns Promise that represents a file stream of a pdf
   */
  getReport(type: string, node_id: number, fileName: string) {
    return new Promise((resolve, reject) => {
      var dl_url: String = ''
      // Check which verson of CW we're connected to
      if(this.cw.v() >= 23) {
        var data = {
          FileName: fileName
        }
        switch (type) {
          case 'request':
            dl_url = `Ams/Reports/DownloadSrReport`
            _.set(data, 'RequestId', node_id)
          break
          case 'workorder':
            dl_url = `Ams/Reports/DownloadWoReport`
            _.set(data, 'WorkOrderId', node_id)
          break
          case 'inspection':
            dl_url = `Ams/Reports/DownloadInspReport`
            _.set(data, 'InspectionId', node_id)
          break
          case 'case':
            dl_url = `Pll/BusinessCaseReports/Download`
            _.set(data, 'PermitId', node_id)
          break
        }
        this.cw.runRequest(dl_url, data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      } else if(this.cw.v()<23) {
        // Maybe I'll get to this for CR later. But you should really just update to 23.x and run ActiveReports
      } else {
        // Error, we don't know what version of CW we're connected to

      }
    })
  }

  /**
   * Get the custom pdf report from a CW 15.x instance
   *
   * @category Reports
   * @param {number} report_id - CaseDataGroupId as defined in CaseDataGroup admin.
   * @return {Object} Returns Promise that represents a file stream of a pdf
   */
    getCustomReport(type: string, node_id: number, fileName: string) {
      return new Promise((resolve, reject) => {
        var dl_url: String = ''
        // Check which verson of CW we're connected to
        if(this.cw.v() >= 23) {
          // Custom reporting endpoints don't exist for AR in 23 right now...
        } else if(this.cw.v() < 23) {
          // This is the only one that runs right now
          
        } else {
          // Error, we don't know what version of CW we're connected to
        }
      })
    }
}