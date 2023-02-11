import { CWError } from './error'
const _ = require('lodash')

export class WorkOrderAdmin {
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
   * Get entity groups
   *
   * @category WorkOrders Admin
   * @return {Object} Returns Promise that represents a collection of all entity groups
   */
  getEntityGroups() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Ams/Entity/Groups', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get entity types
   *
   * @category WorkOrders Admin
   * @return {Object} Returns Promise that represents a collection of all GIS WorkOrder entity types
   */
  getEntityTypes(entityGroups:Array<string>) {
    return new Promise((resolve, reject) => {
      var data = {EntityGroups: entityGroups}
      this.cw.runRequest('Ams/Designer/WOTemplates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get WorkOrder templates
   *
   * @category WorkOrders Admin
   * @return {Object} Returns Promise that represents a collection of all WorkOrder templates
   */
  getTemplates(entityType:string, includeComments:boolean=true, includeInstructions:boolean=true) {
    return new Promise((resolve, reject) => {
      var data = {EntityType: entityType, IncludeComments: includeComments, IncludeInstructions: includeInstructions}
      this.cw.runRequest('Ams/Designer/WOTemplates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update WorkOrder template
   *
   * @category WorkOrders Admin
   * @param {Object} wOTemplate - Obect that describes the WorkOrder Template
   * @return {Object} Returns Promise that represents a collection of all
   */
  updateTemplate(wOTemplate:Object) {
    let valid_fields = ["AcctNum", "AutoCreateTask", "Cancel", "Comments", "CopyCustomFieldVal", "CycleFrom", "CycleIncludeWeekends", "CycleIntervalNum", "CycleIntervalUnit", "CycleType", "DaysToComplete", "DefaultProject", "DefaultProjectSid", "Description", "Effort", "ExpenseType", "Instructions", "IsReactive", "MaintScore", "NumDaysBefore", "Priority",   "RequireAssetOnClose", "Shop", "Stage", "SubmitToEmployeeSid", "SupervisorEmployeeSid", "UnitsAccompDesc", "UnitsAccompDescLock", "WOCategory", "WOCustFieldCatId", "WOPrintTmpt", "WOTemplateId", "WorkMonth"]
    return new Promise((resolve, reject) => {
      var data = wOTemplate
      this.cw.runRequest('Ams/Designer/WOTemplates', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get template group rights for provided WorkOrder Templates
   *
   * @category WorkOrders Admin
   * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateGroupRights(wOTemplateIds:Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateIds: wOTemplateIds}
      this.cw.runRequest('Ams/Designer/WOTemplates', data).then(r => { // TODO: Update this URL
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get template activity services for provided WorkOrder Templates
   *
   * @category WorkOrders Admin
   * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateActivity(wOTemplateIds:Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateIds: wOTemplateIds}
      this.cw.runRequest('Ams/Designer/WOTemplateActivityService', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get fields which will be updated when provided WorkOrder Template instance closes
   *
   * @category WorkOrders Admin
   * @param {Array<number>} wOTemplateIds - Array one or more WorkOrder Template IDs
   * @return {Object} Returns Promise that represents a collection of all
   */
  getUpdateFields(wOTemplateIds:Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateIds: wOTemplateIds}
      this.cw.runRequest('Ams/Designer/WOTemplateUpdateFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get equipment
   *
   * @category WorkOrders Admin
   * @param {Array<number>} wOTemplateIds - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateEquipment(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Designer/WOTemplateEquipment', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get labor
   *
   * @category WorkOrders Admin
   * @param {Array<number>} wOTemplateIds - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateLabor(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Designer/WOTemplateLabor', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get material
   *
   * @category WorkOrders Admin
   * @param {number} wOTemplateId - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateMaterial(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Designer/WOTemplateMaterial', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get map layer fields configured for provided WorkOrder template
   *
   * @category WorkOrders Admin
   * @param {number} wOTemplateId - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all
   */
  getTemplateMapLayerFields(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WorkOrderTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Designer/WorkOrderTemplateMapLayerFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get tasks configured for provided WorkOrder template
   *
   * @category WorkOrders Admin
   * @param {number} wOTemplateId - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all tasks on WorkOrder template
   */
  getTemplateTasks(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Tasks/ByWorkOrderTemplate', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get inspections connected to provided WorkOrder template
   *
   * @category WorkOrders Admin
   * @param {number} wOTemplateId - WorkOrder Template ID
   * @return {Object} Returns Promise that represents a collection of all tasks on WorkOrder template
   */
  getRelatedInspectionTemplates(wOTemplateId:number) {
    return new Promise((resolve, reject) => {
      var data = {WOTemplateId: wOTemplateId}
      this.cw.runRequest('Ams/Designer/WOTemplateInspections', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
