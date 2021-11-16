import { CWError } from './error'
const _ = require('lodash')

export class CaseWorkflow {
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
   * Add Case Data Group
   *
   * @category Data Groups
   * @param {number} caObjectId - The Case Object to attach the data group to.
   * @param {number} caseDataGroupId - CaseDataGroupId as defined in CaseDataGroup admin.
   * @param {string} groupCode - The Group Code.
   * @param {Object} [options] - Options for CaseDataGroup including GroupDesc, GroupSum, and SumFlag
   * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
   */
   addGroup(caObjectId: number, caseDataGroupId: number, groupCode: string, options?: {GroupDesc?: string, GroupSum?: number, SumFlag?: string}) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        CaseDataGroupId: caseDataGroupId,
        GroupCode: groupCode
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseDataGroup/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Default Case Data Groups
   *
   * @category Data Groups
   * @param {number} caObjectId - The Case Object to attach the data group to.
   * @param {number} busCaseId - The business case ID
   * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
   */
   addDefaultGroups(caObjectId: number, busCaseId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        BusCaseId: busCaseId
      }
      this.cw.runRequest('Pll/CaseDataGroup/AddDefault', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Adds a data detail entry to the case data group specified by the CaDataGroupId. The CaDataGroupId is associated to a case.
   *
   * @category Data Groups
   * @param {number} caseDataDetailId - The Data Detail template ID
   * @param {number} caDataGroupId - The Case Instance Data Group ID
   * @param {string} columnSequence - The column sequence
   * @param {string} detailCode - The detail Code
   * @param {number} detailSequence - The detail order number
   * @param {Object} [options] - Other options for CaseDataDetail. See WIPAdd here: /{subdirectory}/apidocs/#/service-info/Pll/CaseDataDetail
   * @return {Object} Returns Promise that represents an object describing CaDataDetailItemBase.
   */
   wipAddDetail(caseDataDetailId: number, caDataGroupId: number, columnSequence: string, detailCode: string, detailSequence: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data_init = {
        CaseDataDetailId: caseDataDetailId,
        CaDataGroupId: caDataGroupId,
        ColumnSequence: columnSequence,
        DetailCode: detailCode,
        DetailSequence: detailSequence
      }
      var data = _.merge(data_init, options)
      this.cw.runRequest('Pll/CaseDataGroup/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Add Default Case Data Groups
   *
   * @category Data Groups
   * @param {number} caObjectId - The Case Object to get the attached data groups.
   * @return {Object} Returns Promise that represents a collection of the CaDataGroupItemBases.
   */
   getGroupsByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseDataGroup/ByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete Case Data Groups by Case Object ID.
   *
   * @category Data Groups
   * @param {number} caObjectId - The Case Object to attach the data group to.
   * @return {Object} Returns Promise that represents a number that is the CaObjectId (?)
   */
   deleteGroupsByCaseId(caObjectId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId
      }
      this.cw.runRequest('Pll/CaseDataGroup/DeleteByCaObjectId', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for Case Data Groups. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Data Groups
   * @param {Object} filters - The parameters to search by. (CaDataGroupId, CaseDataGroupId, GroupCode, GroupDesc, GroupSum, SumFlag)
   * @return {Object} Returns Promise that represents a number that is the CaObjectId (?)
   */
   searchForGroups(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['CaDataGroupId', 'CaseDataGroupId', 'GroupCode', 'GroupDesc', 'GroupSum', 'SumFlag']).length==0) {
        reject(new CWError(2, 'At least one of the attributes (CaDataGroupId, CaseDataGroupId, GroupCode, GroupDesc, GroupSum, SumFlag) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseDataGroup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get Case Data Groups by Case ObjectId
   *
   * @category Data Groups
   * @param {string} entityType - The entity type to check
   * @param {string} entityUid - The specific entityUID to check
   * @param {Object} options - The other options for checkGIS. Either CaObjectId or CaseDataGroupId is required.
   * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
   */
   checkGIS(entityType: string, entityUid: string, options: {CaObjectId?:number, CaseDataGroupId?: number, CaseDataDetailId?: number}) {
    return new Promise((resolve, reject) => {
      var data = {
        EntityType: entityType,
        EntityUid: entityUid
      }
      if(_.has(options, 'CaObjectId')) {
        _.set(data, 'CaObjectId', _.get(options, 'CaObjectId'))
      } else if(_.has(options, 'CaseDataGroupId')) {
        _.set(data, 'CaseDataGroupId', _.get(options, 'CaseDataGroupId'))
      } else {
        reject(new CWError(1, 'Either CaObjectId or CaseDataGroupId is required.', {'provided': options}))
      }
      if(_.has(options, 'CaseDataDetailId')) {
        _.set(data, 'CaseDataDetailId', _.get(options, 'CaseDataDetailId'))
      }
      this.cw.runRequest('Pll/CaseDataGroup/CheckGISChanges', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update data groups on a case based on asset value mappings.
   *
   * @category Data Groups
   * @param {number} caObjectId - The case to update
   * @param {string} entityType - The entity type to check
   * @param {string} entityUid - The specific entityUID to check
   * @param {number} [caDataGroupId] - The specific data group ID to limit updates to
   * @return {Object} Returns Promise that represents a collection of the default CaDataGroupItemBases.
   */
   updateGroupsFromAsset(caObjectId: number, entityType: string, entityUid: string, caDataGroupId?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaObjectId: caObjectId,
        EntityType: entityType,
        EntityUid: entityUid
      }
      if(typeof(caDataGroupId)!='undefined') {
        _.set(data, 'CaDataGroupId', caDataGroupId)
      }
      this.cw.runRequest('Pll/CaseDataGroup/UpdateFromAsset', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Attach Case Data Detail
   *
   * @category Data Details
   * @param {number} caDataGroupId - The Case Data Group ID to attach the data detail to.
   * @param {number} caseDataDetailId - caseDataDetailId to attach.
   * @param {Object} [options] - Options
   * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
   */
   addDetail(caDataGroupId: number, caseDataDetailId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataGroupId: caDataGroupId,
        CaseDataDetailId: caseDataDetailId
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseDataDetail/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Update Case Data Detail
   *
   * @category Data Details
   * @param {number} caDataDetailId - The Case Data Group ID to attach the data detail to.
   * @param {Object} [options] - Options
   * @return {Object} Returns Promise that represents an object describing CaDataGroupItemBase.
   */
   updateDetail(caDataDetailId: number, options?: Object) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataDetailId: caDataDetailId
      }
      if(typeof(options)!='undefined') {
        data = _.merge(data, options)
      }
      this.cw.runRequest('Pll/CaseDataDetail/Update', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Lock Case Data Detail
   *
   * @category Data Details
   * @param {number} caDataDetailId - The Case Data Group ID to lock
   * @return {Object} Returns Promise which represents an object describing the CaDataDetailItem.
   */
   lockDetail(caDataDetailId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataDetailId: caDataDetailId,
        Lock: true
      }
      this.cw.runRequest('Pll/CaseDataDetail/UpdateLock', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Unlock Case Data Detail
   *
   * @category Data Details
   * @param {number} caDataDetailId - The Case Data Group ID to unlock
   * @return {Object} Returns Promise which represents an object describing the CaDataDetailItem.
   */
   unlockDetail(caDataDetailId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataDetailId: caDataDetailId,
        Lock: false
      }
      this.cw.runRequest('Pll/CaseDataDetail/UpdateLock', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Adds a list of possible values to the data detail entry specified by the CaDataDetailId.
   *
   * @category Data List Values
   * @param {number} caDataDetailId - The Case Object to attach the data group to.
   * @param {string} listValue - The Group Code.
   * @return {Object} Returns Promise that represents an object describing CaDataListValuesItemBase.
   */
   addListValue(caDataDetailId: number, listValue: string) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataDetailId: caDataDetailId,
        ListValue: listValue
      }
      this.cw.runRequest('Pll/CaseDataListValues/Add', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete by Id (Ca Data List Id)
   *
   * @category Data List Values
   * @param {number} CaDataListId - The Case Data List ID
   * @return {Object} Returns Promise that represents an object describing CaDataListValuesItemBase.
   */
   deleteListValue(caDataDetailId: number) {
    return new Promise((resolve, reject) => {
      var data = {
        CaDataDetailId: caDataDetailId
      }
      this.cw.runRequest('Pll/CaseDataListValues/Delete', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for List Value IDs. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Data List Values
   * @param {Object} filters - The parameters to search by. (CaDataDetailId, CaDataListId, ListValue)
   * @return {Object} Returns Promise that represents an Array of resulting CaDataListIds
   */
   searchForListValueIds(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['CaDataDetailId', 'CaDataListId', 'ListValue']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (CaDataDetailId, CaDataListId, ListValue) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseDataGroup/Search', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Search for List Value Objects. Include one or more of the search fields. A logical 'and' operation is applied to muliple search fields
   *
   * @category Data List Values
   * @param {Object} filters - The parameters to search by. (CaDataDetailId, CaDataListId, ListValue)
   * @return {Object} Returns Promise that represents a collection of resulting CaDataListValuesItemBase objects
   */
   searchForListValueObjects(filters?: Object) {
    return new Promise((resolve, reject) => {
      if(_.intersectionBy(filters, ['CaDataDetailId', 'CaDataListId', 'ListValue']).length==0) {
        reject(new CWError(3, 'At least one of the attributes (CaDataDetailId, CaDataListId, ListValue) must be defined.'))
      }
      var data = filters
      this.cw.runRequest('Pll/CaseDataGroup/SearchObject', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
