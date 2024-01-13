import { CWError } from './error'
const _ = require('lodash')
const fs = require('fs');


export class Attachments {
  /**
   * @hidden
   */
  cw: any

  /**
   * Storage of object's active activityType
   */
  currentActivityType: string

  /**
   * @hidden
   */
  constructor(cw, current_type) {
    this.cw = cw
    this.currentActivityType = current_type;
  }

  // Attachments

  /**
   * Add inspection attachments (doesn't handle URL or Signature type properly, currently)
   *
   * @category Inspection Attachments
   * @param {number} id - The ID of the node to add the attachment to (CA_OBJECT_ID, REQUESTID, WORKORDERSID, WORKORDERID, INSPECTIONID). If WORKORDERID, you _must_ feed in as a string.
   * @param {string} the_file - The loca path of the file to upload to the Cityworks instance
   * @param {number} [task_id] - ID of WorkOrder task, if current activity is a work order and the attachment should be on the task
   * @param {string} [filename] - The filename for the attachment
   * @param {string} [attachment_type] - The filename for the attachment, values: attachment, signature, url
   * @param {string} [comments] - The filename for the attachment
   * @return {Object} Returns object that represents a boolean for action resolution
   */
  add(node_id: number|string, the_file: string, filename?: string, attachment_type: string = 'attachment', task_id?: number, comments?: string) {
    // attachment_type map
    var attachment_type_map = {'attachment': 0, 'signature': 1, 'url': 2}
    return new Promise((resolve, reject) => {
      var data = {}
      if(typeof(filename)!=='undefined') {
        _.set(data, 'Filename', filename)
      }
      if(typeof(comments)!=='undefined') {
        _.set(data, 'Comments', comments)
      }
      var endpoint = ''
      switch(this.currentActivityType) {
        case 'Case':
          endpoint = 'Pll/CaseRelDocs/Add'
          _.set(data, 'CaObjectId', node_id)
          break;
        case 'Inspection':
          endpoint = 'Ams/Attachments/AddInspectionAttachment'
          _.set(data, 'InspectionId', node_id)
          if(typeof(attachment_type)!=='undefined') {
            _.set(data, 'AttachmentType', attachment_type_map[attachment_type])
          }
          break;
        case 'Request':
          _.set(data, 'RequestId', node_id)
          endpoint = 'Ams/Attachments/AddRequestAttachment'
          break;
        case 'WorkOrder':
          if(typeof(node_id)=='string') {
            _.set(data, 'WorkOrderId', node_id)
          } else {
            _.set(data, 'WorkOrderSid', node_id)
          }
          if(typeof(task_id)!=='undefined') {
            _.set(data, 'TaskId', task_id)
          }
          if(typeof(attachment_type)!=='undefined') {
            _.set(data, 'AttachmentType', attachment_type_map[attachment_type])
          }
          endpoint = 'Ams/Attachments/AddWorkOrderAttachment'
          break;
        default:
          reject(new CWError(132, 'Unknown current activity type or activity type not set.', {'provided': this.currentActivityType}))
      }
      this.cw.runRequest(endpoint, data, the_file).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete inspection attachments
   *
   * @category Inspection Attachments
   * @param {Array<number>|number} attachmentIds - An array of attachment IDs or a single attachment ID to delete.
   * @return {Object} Returns object that represents a boolean for action resolution
   */
  delete(attachmentIds: Array<number>|number) {
    return new Promise((resolve, reject) => {
      var data = {}
      var endpoint = ''
      if(typeof(attachmentIds)=='number') {
        attachmentIds = [attachmentIds]
      }

      switch(this.currentActivityType) {
        case 'Case':
          _.set(data, 'CaRelDocId', attachmentIds[0])
          endpoint = 'Pll/CaseRelDocs/Delete'
          break;
        case 'Inspection':
          _.set(data, 'AttachmentIds', attachmentIds)
          endpoint = 'Ams/Attachments/DeleteInspectionAttachments'
          break;
        case 'Request':
          _.set(data, 'AttachmentIds', attachmentIds)
          endpoint = 'Ams/Attachments/DeleteRequestAttachments'
          break;
        case 'WorkOrder':
          _.set(data, 'AttachmentIds', attachmentIds)
          endpoint = 'Ams/Attachments/DeleteWorkOrderAttachments'
          break;
        default:
          reject(new CWError(132, 'Unknown current activity type or activity type not set.', {'provided': this.currentActivityType}))
      }
      this.cw.runRequest(endpoint, data).then(r => {
        resolve(r)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Download an attachment
   *
   * @category Attachments
   * @param {number} attachmentId - ID of an attachment to download
   * @return {Object} Returns object that represents a file stream
   */
  download(attachmentId: number) {
    return new Promise((resolve, reject) => {
      var data = {}
      var endpoint = ''

      switch(this.currentActivityType) {
        case 'Case':
          // _.set(data, 'CaRelDocId', attachmentId)
          // endpoint = 'Pll/CaseRelDocs/Delete'
          break;
        case 'Inspection':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/DownloadInspectionAttachment'
          break;
        case 'Request':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/DownloadRequestAttachment'
          break;
        case 'WorkOrder':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/DownloadWorkOrderAttachment'
          break;
        default:
          reject(new CWError(132, 'Unknown current activity type or activity type not set.', {'provided': this.currentActivityType}))
      }
      this.cw.runRequest(endpoint, data).then(r => {
        resolve(r)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get attachment by ID (not implemented)
   *
   * @category Attachments
   * @param {number} attachmentId - An attachment ID to get info for
   * @return {Object} Returns object that represents an object that describes the matched inspection attachment
   */
  getById(attachmentId: number) {
    return new Promise((resolve, reject) => {
      resolve(true)
      var data = {}
      var endpoint = ''

      switch(this.currentActivityType) {
        case 'Case':
          // _.set(data, 'CaRelDocId', attachmentId)
          // endpoint = 'Pll/CaseRelDocs/Delete'
          break;
        case 'Inspection':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/InspectionAttachmentById'
          break;
        case 'Request':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/RequestAttachmentById'
          break;
        case 'WorkOrder':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = 'Ams/Attachments/WorkOrderAttachmentById'
          break;
        default:
          reject(new CWError(132, 'Unknown current activity type or activity type not set.', {'provided': this.currentActivityType}))
      }
      this.cw.runRequest(endpoint, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get attachment by node (Inspection, WorkOrder, Request, or Case) IDs
   *
   * @category Attachments
   * @param {Array<number>|number} ids - An array of IDs or a single ID (inspectionIds, WorkOrderSids, WorkOrderIds, RequestIds, or CaseIds) to get attachments for. Only one node (Inspection, WorkOrder, Request, or Case) type at a time. Don't mix-and-match WorkOrderIds with WorkOrderSids.
   * @return {Object} Returns object that represents a collection of attachments from the matched inspections
   */
  getByNodesId(ids: Array<number>|number) {
    return new Promise((resolve, reject) => {
      var data = {}
      var endpoint = ''
      if(typeof(ids)=='number') {
        ids = [ids]
      }

      switch(this.currentActivityType) {
        case 'Case':
          _.set(data, 'CaObjectId', ids)
          endpoint = 'Pll/CaseRelDocs/ByCaObjectId'
          break;
        case 'Inspection':
          _.set(data, 'InspectionIds', ids)
          endpoint = 'Ams/Attachments/InspectionAttachments'
          break;
        case 'Request':
          _.set(data, 'RequestIds', ids)
          endpoint = 'Ams/Attachments/RequestAttachments'
          break;
        case 'WorkOrder':
          if(typeof(ids[0])=='string') {
            _.set(data, 'WorkOrderIds', ids)
          } else {
            _.set(data, 'WorkOrderSids', ids)
          }
          endpoint = 'Ams/Attachments/WorkOrderAttachments'
          break;
        default:
          reject(new CWError(132, 'Unknown current activity type or activity type not set.', {'provided': this.currentActivityType}))
      }
      this.cw.runRequest(endpoint, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
