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
   * Add attachments (doesn't handle URL or Signature type attachments properly, currently)
   *
   * @category Attachments
   * @param {number} id - The ID of the node to add the attachment to (CA_OBJECT_ID, REQUESTID, WORKORDERSID, WORKORDERID, INSPECTIONID). If WORKORDERID, you _must_ feed in as a string.
   * @param {string} the_file - The loca path of the file to upload to the Cityworks instance
   * @param {number} [task_id] - ID of WorkOrder task, if current activity is a work order and the attachment should be on the task
   * @param {string} [filename] - The filename for the attachment
   * @param {string} [attachment_type] - The filename for the attachment, values: attachment, signature, url
   * @param {string} [comments] - The filename for the attachment
   * @param {string} [label] - The label to apply to the  (PLL only)
   * @return {Object} Returns object that represents a boolean for action resolution
   */
  add(node_id: number|string, the_file: string, filename?: string, attachment_type: string = 'attachment', task_id?: number, comments?: string, label?: string) {
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
      if(typeof(label)!=='undefined' && this.currentActivityType=='Case') {
        _.set(data, 'LabelText', label)
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
   * Update attachment
   *
   * @category Attachments
   * @param {number} id - The ID of the node to add the attachment to (CA_OBJECT_ID, REQUESTID, WORKORDERSID, WORKORDERID, INSPECTIONID). If WORKORDERID, you _must_ feed in as a string.
   * @param {string} [title] - The filename for the attachment
   * @param {string} [description] - The filename for the attachment
   * @param {string} [label] - The label to apply to the  (PLL only)
   * @return {Object} Returns object that represents a boolean for action resolution
   */
  update(attachment_id: number, title?: string, description?: string, label?: string) {
    // attachment_type map
    return new Promise((resolve, reject) => {
      var data = {}
      if(typeof(title)!=='undefined') {
        _.set(data, 'Title', title)
      }
      if(typeof(description)!=='undefined') {
        _.set(data, 'Description', description)
      }
      if(typeof(label)!=='undefined' && this.currentActivityType=='Case') {
        _.set(data, 'LabelText', label)
      }
      
      var endpoint = ''
      switch(this.currentActivityType) {
        case 'Case':
          endpoint = 'Pll/CaseRelDocs/Update'
          _.set(data, 'CaRelDocId', attachment_id)
          break;
        case 'Inspection':
          endpoint = 'Ams/Attachments/UpdateInspectionAttachment'
          _.set(data, 'AttachmentId', attachment_id)
          break;
        case 'Request':
          endpoint = 'Ams/Attachments/UpdateRequestAttachment'
          _.set(data, 'AttachmentId', attachment_id)
          break;
        case 'WorkOrder':
          endpoint = 'Ams/Attachments/UpdateWorkOrderAttachment'
          _.set(data, 'AttachmentId', attachment_id)
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
   * @hidden
   */
  static downloadUrls() {
    return {'case': 'Pll/CaseRelDocs/DownloadCaRelDocs', 'inspection': 'Ams/Attachments/DownloadInspectionAttachment', 'request': 'Ams/Attachments/DownloadRequestAttachment', 'workorder': 'Ams/Attachments/DownloadWorkOrderAttachment'}
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
          _.set(data, 'CaRelDocsId', attachmentId)
          endpoint = Attachments.downloadUrls()['case']
          break;
        case 'Inspection':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = Attachments.downloadUrls()['inspection']
          break;
        case 'Request':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = Attachments.downloadUrls()['request']
          break;
        case 'WorkOrder':
          _.set(data, 'AttachmentId', attachmentId)
          endpoint = Attachments.downloadUrls()['workorder']
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
      var data = {}
      var endpoint = ''

      switch(this.currentActivityType) {
        case 'Case':
          // _.set(data, 'CaRelDocId', attachmentId)
          // endpoint = 'Pll/CaseRelDocs/ById'
          reject(new CWError(133, 'Get CaRelDoc by RelDocId not documented or found'))
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
   * Get attachments related to Inspection, WorkOrder, or Request
   *
   * @category Attachments
   * @param {Array<number>|number} ids - An array of IDs or a single ID (inspectionIds, WorkOrderSids, WorkOrderIds, or RequestIds) for which to get attachments. Only one node (Inspection, WorkOrder, Request, or Case) type at a time. Don't mix-and-match WorkOrderIds with WorkOrderSids.
   * @return {Object} Returns Promise that represents a collection of attachments from the matched inspections, service requests, or work orders
   */
  getAttachments(ids: Array<number>|number) {
    return this.getByNodesId(ids)
  }

  /**
   * Get Related Documents from Case
   *
   * @category Attachments
   * @param {number} id - An array of CaseIDs or a single CaseID for which to get related documents.
   * @return {Object} Returns Promise that represents a collection of related documents from the matched cases
   */
  getRelatedDocs(id: number) {
    return this.getByNodesId(id)
  }
  
  /**
   * Get attachment by node (Inspection, WorkOrder, Request, or Case) IDs
   *
   * @category Attachments
   * @param {Array<number>|number} ids - An array of IDs or a single ID (inspectionIds, WorkOrderSids, WorkOrderIds, RequestIds, or CaseIds) to get attachments for. Only one node (Inspection, WorkOrder, Request, or Case) type at a time. Don't mix-and-match WorkOrderIds with WorkOrderSids.
   * @return {Object} Returns Promise that represents a collection of attachments from the matched inspections
   */
  getByNodesId(ids: Array<number>|number) {
    return new Promise((resolve, reject) => {
      var data = {}
      var endpoint = ''
      if(typeof(ids)=='number' && this.currentActivityType!='Case') {
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

  /**
   * Get Tags available with which to tag attachments
   *
   * @category Attachments
   * @return {Object} Returns Promise that represents a collection of tags that can be added to attachments
   */
  getTags() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Pll/AttachmentTags/GetAll', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  private syncTags(attachmentId: number, tags: {tagid: number, tagtext: string}[]) {
    return new Promise((resolve, reject) => {
      var data = {}
      switch(this.currentActivityType) {
        case 'Case':
          this.cw.runRequest('Pll/AttachmentActivityTags/SyncTags', data).then(r => {
            resolve(r.Value)
          }).catch(e => {
            reject(e)
          })
        }
    })
  }

  private async loopSyncTags(attachmentId: number, tags: {tagid: number, tagtext: string}[], callback: Function) {
    this.syncTags(attachmentId, tags).then(r => {
      callback(r)
    })
  }

  /**
   * Set Tags on an attachment
   *
   * @category Attachments
   * @return {Object} Returns Promise that represents a collection of tags that can be added to attachments
   */
  setTags(attachmentId: number, tags: {tagid: number, tagtext: string}[], activityType: string) {
    return new Promise((resolve, reject) => {
      this.syncTags(attachmentId, tags).then(r => {
        resolve(r)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Set Tags on an many attachments
   *
   * @category Attachments
   * @param {Array<number>|number} attachmentIds - An array of attachment IDs to add tags to.
   * @param {Array<{tagid: number, tagtext: string}>} tags - An array of tag objects to add to the attachments
   * @param {string} activityType - The type of activity to which the attachments belong
   * @return {Object} Returns Promise that represents a collection of documents which have had their tags set
   */
  setTagsOnMany(attachmentIds: number[], tags: {tagid: number, tagtext: string}[]) {
    return new Promise((resolve, reject) => {
      var returnData:Array<any> = []
      attachmentIds.forEach((attachmentId) => {
        this.loopSyncTags(attachmentId, tags, (r:any) => {
          returnData.push(r)
        })
      })
      resolve(returnData)
    })
  }

  /**
   * Get Doc labels for a case template
   *
   * @category Attachments
   * @param {number} busCaseId - The ID of the Business Case to get Document Labels for
   * @return {Object} Returns Promise that represents a collection of tags that can be added to attachments
   */
  getDocLabels(busCaseId: number) {
    return new Promise((resolve, reject) => {
    // check that parent is Case?
      var data = {"BusCaseId": busCaseId}
      switch(this.currentActivityType) {
        case 'Case':
          this.cw.runRequest('Pll/BusCaseDocLabel/GetByBusCaseId', data).then(r => {
            resolve(r.Value)
          }).catch(e => {
            reject(e)
          })
          break;
        default:
          resolve([])
      }
    })
  }  
}
