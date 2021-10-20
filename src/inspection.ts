import { CWError } from './error'
const _ = require('lodash')

export class Inspection {
  cw: any;

  /**
   * Construct activity link object for Inspection functions
   *
   * @param {object} cw - Feed in the cityworks object instance so that this instance has access to the runRequest from the recursively-linked Cityworks instance
   * @return {Object} Returns object that is this module
   */
  constructor(cw) {
    this.cw = cw;
  }

  /**
   * Create new inspection with data
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the newly-created inspection
   */
  create(insp_data: Object) {
    return new Promise((resolve, reject) => {
      if(typeof(insp_data.EntityType)=='undefined' || typeof(insp_data.InspTemplateId)=='undefined') {
        reject(new CWError(1, 'EntityType and InspTemplateId properties must be provided.', {'provided': insp_data}));
      } else {
        this.cw.runRequest('Ams/Inspection/Create', insp_data).then(r => {
          resolve(r.Value);
        }).catch(e => {
          reject(e);
        });
      }
    });
  }

  /**
   * Update an inspection with data
   *
   * @param {object} insp_data - See /{subdirectory}/apidocs/#/data-type-info;dataType=InspectionBase on your Cityworks instance
   * @return {Object} Returns object that represents an object describing the updated inspection
   */
  update(insp_data: Object) {
    return new Promise((resolve, reject) => {
      return new Promise((resolve, reject) => {
        if(typeof(insp_data.InspectionId)=='undefined') {
          reject(new CWError(1, 'InspectionId must be provided.', {'provided': insp_data}));
        } else {
          this.cw.runRequest('Ams/Inspection/Update', insp_data).then(r => {
            resolve(r.Value);
          }).catch(e => {
            reject(e);
          });
        }
      });
    });
  }

  /**
   * Get an inspection by id
   *
   * @param {number} inspectionId - The inspection ID to retrieve
   * @return {Object} Returns object that represents an object describing the inspection
   */
  getById(inspectionId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionId: inspectionId
      }
      this.cw.runRequest('Ams/Inspection/ById', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get inspections by a list of ids
   *
   * @param {Array<number>} inspectionIds - An array of the IDs to retrieve the matched inspections
   * @return {Object} Returns object that represents an object describing the inspection
   */
  getByIds(inspectionIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        InspectionIds: inspectionIds
      }
      this.cw.runRequest('Ams/Inspection/ByIds', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Search for inspections
   *
   * @param {Object} searchData - An array of the IDs to retrieve the matched inspections, see instance docs: /{subdirectory}/apidocs/#/service-info/Ams/Inspection
   * @return {Object} Returns object that represents an array of the matching inspection IDs
   */
  search(searchData: Object) {
    return new Promise((resolve, reject) => {
      var data = searchData;
      this.cw.runRequest('Ams/Inspection/Search', data).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  /**
   * Get list of statuses
   *
   * @return {Object} Returns object that represents an array of all possible statuses for an Inspection
   */
  statuses() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('Ams/Inspection/Statuses', {}).then(r => {
        resolve(r.Value);
      }).catch(e => {
        reject(e);
      });
    });
  }

  // Attachments

  // AddInspectionAttachment InspAttachment
  // Add an inspection attachment
  // Request Parameters
  // Int32 AttachmentType V15_4
  // String Comments
  // String Filename
  // Int32 req InspectionId
  // Ams/Attachments/AddInspectionAttachment?data={
  //   "Comments": null,
  //   "Filename": null,
  //   "InspectionId": null,
  //   "AttachmentType": null
  // }

  // DeleteInspectionAttachments
  // Delete inspection attachments
  // Request Parameters
  // List<Int32> req AttachmentIds
  // Ams/Attachments/DeleteInspectionAttachments?data={
  //   "AttachmentIds": null
  // }

  // DownloadInspectionAttachment
  // Download an inspection attachment
  // Request Parameters
  // Int32 req AttachmentId
  // Ams/Attachments/DownloadInspectionAttachment?data={
  //   "AttachmentId": null
  // }

  // InspectionAttachmentById InspAttachment
  // Get an inspection attachment by id
  // Request Parameters
  // Int32 req AttachmentId
  // Ams/Attachments/InspectionAttachmentById?data={
  //   "AttachmentId": null
  // }

  // InspectionAttachments List<InspAttachment>
  // Get inspections attachments
  // Request Parameters
  // List<Int32>reqInspectionIds
  // Ams/Attachments/InspectionAttachments?data={
  //     "InspectionIds": null
  // }
}
