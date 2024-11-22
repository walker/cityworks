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
   * Get the pdf report
   *
   * @category Data Groups
   * @param {string} type - The node type (case, workorder, inspection, request)
   * @param {number} node_id - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string} groupCode - The Group Code.
   * @param {Object} [options] - Options for CaseDataGroup including GroupDesc, GroupSum, and SumFlag
   * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
   */
  getReport(type: string, node_id: number, fileName: string) {
    return new Promise((resolve, reject) => {
      var dl_url: String = ''
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
          // const dl_url = `ams/Reports/DownloadInspReport`
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
    })
  }


  // async function report(cwToken, callback: any)
  // {
  //     cworks.Cityworks.setToken(cwToken)

  //     var NSONumbers: String[] = await getNSONumbers();

  //     var asdf = true;
  //         const downloadURL: String = URL_PREFIX + `{%22FileName%22:%22NSO_Activity_Wkly%22,%22PermitID%22:%22` + n + `%22}&token=${cwToken}`;
  //         await emailReport(downloadURL, "NSO Weekly Report", "Attached is the weekly report of NSO activity for employee: NSO-" + n);
  //     });
  // }

  // #!/usr/bin/env node

}