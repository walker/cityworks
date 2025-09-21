import { CWError } from './error'
const _ = require('lodash')
import { convertToObject } from 'typescript';

export class Report {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  request: any
 
  /**
   * @hidden
   */
  inspection: any

  /**
   * @hidden
   */
  workorder: any

  /**
   * @hidden
   */
  briefcase: any

  /**
   * @hidden
   */
  static downloadUrls() {
    return {'request': 'Ams/Reports/DownloadSrReport', 'workorder': 'Ams/Reports/DownloadWoReport', 'inspection': 'Ams/Reports/DownloadInspReport', 'case': 'Pll/BusinessCaseReports/Download'}
  }

  /**
   * @hidden
   */
  constructor(cw, inspection: any, workorder: any, request: any, briefcase: any) {
    this.cw = cw
    this.inspection = inspection
    this.workorder = workorder
    this.request = request
    this.briefcase = briefcase
  }

  /**
   * Get the pdf "print" report for a specific CW node item
   *
   * @category Reports
   * @param {string} type - The node type (case, workorder, inspection, request)
   * @param {number} node_id - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string} filename - The filename of the report.
   * @return {Object} Returns Promise that represents a file stream of a pdf
   */
  print(type: string, node_id: number, filename?: string) {
    return new Promise((resolve, reject) => {
      if(type!=='case' && type!=='workorder' && type!=='inspection' && type!=='request') {
        reject(new CWError(405, 'Invalid type provided. Must be case, workorder, inspection, or request.'))
        return
      }
      if(typeof(node_id)==='undefined' || node_id===null || isNaN(node_id) || node_id<=0) {
        reject(new CWError(406, 'Invalid node_id provided. Must be a number greater than 0.'))
        return
      }
      var dl_url: String = ''
      var output_name = _.capitalize(type) + '_' + node_id
      // Check which verson of CW we're connected to
      if(this.cw.v() >= 23) {
        this.resolveFileName(type, node_id, filename).then((resolvedInfo: {fn: string, desc: string, cn?: string}) => {
          var data = {
            FileName: resolvedInfo.fn
          }
          if(!_.isUndefined(resolvedInfo.cn)) {
            output_name = resolvedInfo.cn ?? output_name
          }
          output_name += (resolvedInfo.desc && resolvedInfo.desc.length>0 ? '_' + _.startCase(resolvedInfo.desc).replaceAll(' ', '_') : '') + '.pdf'
          switch (type) {
            case 'request':
              dl_url = Report.downloadUrls()['request']
              _.set(data, 'RequestId', node_id)
            break
            case 'workorder':
              dl_url = Report.downloadUrls()['workorder']
              _.set(data, 'WorkOrderId', node_id)
            break
            case 'inspection':
              dl_url = Report.downloadUrls()['inspection']
              _.set(data, 'InspectionId', node_id)
            break
            case 'case':
              dl_url = Report.downloadUrls()['case']
              _.set(data, 'PermitId', node_id)
            break
          }
          // console.log('Downloading from', dl_url, 'with data', data)
          this.cw.runRequest(dl_url, data).then(file_contents => {
            // console.log('file_contents', file_contents)
            try {
              var json = JSON.parse(file_contents)
              reject(json)
            } catch (e) {
              // It's actually a PDF! Let's proceed.
              resolve({file: file_contents, name: output_name})
            }
          }).catch(e => {
            // console.log('Error', e)
            reject(e)
          })
        }).catch((e) => {
          reject(e)
        })
      } else if(this.cw.v()<23) {
        // Maybe I'll get to this for CR later. But you should really just update to 23.x and run ActiveReports
        console.log('CR print not implemented yet')
      } else {
        // Error, we don't know what version of CW we're connected to
        console.log('No clue what version of CW we are connected to')
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
  get(type: string, node_id: number, fileName: string) {
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

  /**
   * @hidden
   * Check on the filename for each
   *
   * @category Reports
   * @param {string} type - The node type (case, workorder, inspection, request)
   * @param {number} node_id - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string | undefined} filename - The filename of the report.
   * @param {Object<[key: string]: any> | undefined} options - Additional options for the report.
   * @return {Object} Returns Promise that represents a file stream of a pdf
   */
  resolveFileName(type: string, node_id: number, filename?: string | undefined, options?: { [key: string]: any }): Promise<{fn: string, desc: string, cn?: string}> {
    return new Promise<{fn: string, desc: string, cn?: string}>((resolve, reject) => {
      if(typeof(filename)==='undefined' || filename===null || filename==='') {
        // If no filename is provided, we need to set the filename to the default for the node_id
        switch (type) {
          case 'request':
            this.request.getById(node_id).then((r) => {
              this.request.admin.getTemplateById(r.ProblemSid).then((template) => {
                if(typeof(template.SRPrintTmpt)==='undefined' || template.SRPrintTmpt===null || template.SRPrintTmpt==='') {
                  reject(new CWError(404, 'No print template defined for this service request'))
                  return
                } else {
                  resolve({fn: template.SRPrintTmpt, desc: template.Description})
                }
              }).catch((e) => {
                console.log('Template error', e)
                reject(e)
              })
            }).catch((e) => {
              console.log('Inspection error', e)
              reject(e)
            })
          break
          case 'workorder':
            this.workorder.getById(node_id).then((r) => {
              this.workorder.admin.getTemplateById(r.WOTemplateId).then((template) => {
                if(typeof(template.WOPrintTmpt)==='undefined' || template.WOPrintTmpt===null || template.WOPrintTmpt==='') {
                  reject(new CWError(404, 'No print template defined for this work order'))
                  return
                } else {
                  resolve({fn: template.WOPrintTmpt, desc: template.Description})
                }
              }).catch((e) => {
                console.log('Template error', e)
                reject(e)
              })
            }).catch((e) => {
              console.log('Work Order error', e)
              reject(e)
            })
          break
          case 'inspection':
            this.inspection.getById(node_id).then((r) => {
              this.inspection.admin.getTemplateById(r.InspTemplateId).then((template) => {
                // default to first if no print template named
                if(typeof(template.PrintTemplate)==='undefined' || template.PrintTemplate===null || template.PrintTemplate==='') {
                  reject(new CWError(404, 'No print template defined for this inspection type.'))
                  return
                } else {
                  resolve({fn: template.PrintTemplate, desc: template.Description})
                }
              }).catch((e) => {
                console.log('Template error', e)
                reject(e)
              })
            }).catch((e) => {
              reject(e)
            })
          break
          case 'case':
            this.briefcase.getById(node_id).then((r) => {
              if(!_.isUndefined(r.CaseNumber) && r.CaseNumber!==null && r.CaseNumber.length>0) {
                // include case number in output name
                var cn = r.CaseNumber;
              }
              this.briefcase.getPrintTemplates(node_id).then((r) => {
                // default to first if no print template named
                if(r===null ||typeof(r)==='undefined' || typeof(r[0].ReportName)==='undefined' || r[0].ReportName===null || r[0].ReportName==='') {
                  reject(new CWError(404, 'No print template defined for this case'));
                  return;
                } else {
                  resolve({fn: r[0].FileName.replace('.rpt', ''), desc: r[0].ReportName, cn: cn});
                }
              }).catch((e) => {
                reject(e);
              });
            }).catch((e) => {
              reject(e);
            });
          break
        }
      } else {
        // We should really move this up to above. But for now, if a filename is provided, just use it.
        resolve({fn: filename, desc: ''})
      }
    })
  }
}