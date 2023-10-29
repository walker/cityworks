import { CWError } from './error'
const _ = require('lodash')

export class Search {
  /**
   * @hidden
   */
  cw: any

  /**
   * Search Types: Null, Request, WorkOrder, Inspection, Contract, Permit, GIS, PermitTask, PermitAddress, InspCommon, Case, WorkOrderEntity, StoreTransaction, Requisition, Material, WorkActivity, MaterialLeaf, WoTemplate, Unknown, Employee, MessageQueue, Analytics, TokenState, AssetCalculationResult, Equipment, CustomerAccount, InspTemplate, ProblemLeaf, AssetSplitRecord, PavementInsp, TvInspection, Projects
   */
  searchTypes: Object = {
    "Null": 0,
    "Request": 1,
    "WorkOrder": 2,
    "Inspection": 3,
    "Contract": 4,
    "Permit": 5,
    "GIS": 6,
    "PermitTask": 7,
    "PermitAddress": 8,
    "InspCommon": 9,
    "Case": 10,
    "WorkOrderEntity": 11,
    "StoreTransaction": 12,
    "Requisition": 13,
    "Material": 14,
    "WorkActivity": 15,
    "MaterialLeaf": 16,
    "WoTemplate": 17,
    "Unknown": 18,
    "Employee": 19,
    "MessageQueue": 20,
    "Analytics": 21,
    "TokenState": 22,
    "AssetCalculationResult": 23,
    "Equipment": 24,
    "CustomerAccount": 25,
    "InspTemplate": 26,
    "ProblemLeaf": 27,
    "AssetSplitRecord": 28,
    "PavementInsp": 29,
    "TvInspection": 30,
    "Projects": 31
  }

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  /**
   * Do a "quick" search for an ID or Case Number
   *
   * @category Quick Search
   * @param {string} text - text to search the system for
   * @return {Object} Returns Promise object that represents a collection of the currently authenticated user's notifications
   */
  quick(text: string) {
    return new Promise((resolve, reject) => {
      let data = {
        "QuickSearchText": text,
      }
      this.cw.runRequest('General/QuickSearch/QuickSearch', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Execute a saved search
   *
   * @category Search
   * @param {number} searchId - SearchId to execute
   * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/Ams/Search
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  execute(searchId: number, options?: {EmployeeSid?: number, ExcludeEmptyXY?: boolean, Extent?: Object, Frequency?: boolean, IdsOnly?: boolean, IncludeSearchOrder?: boolean, MaxResults?: number, ResultFields?: Array<string>, TotalOnly?: boolean}) {
    return new Promise((resolve, reject) => {
      var data = {
        SearchId: searchId
      }
      data = _.merge(data, options)
      this.cw.runRequest('Ams/Search/Execute', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of the saved searches by search type and specific entity types OR employeeSid/domainId. You cannot search for saved searches by both specific entity type AND employeeSid/domainId.
   *
   * @category Search
   * @param {string} searchType - Get the saved searches for a particular type
   * @param {Array<string>} [applyToEntities] - Restrict GIS searches to specified entity types
   * @param {number} [employeeSid] - The employee SID to retrieve the searches as
   * @param {number} [domainId] - The domain ID of the domain to search
   * @return {Object} Returns Promise object that represents a collection of SearchDefinitionName
   */
  getSaved(searchType: string, applyToEntities?: Array<string>, employeeSid?: number, domainId?: number) {
    return new Promise((resolve, reject) => {
      if(!_.has(this.searchTypes, searchType)) {
        reject(new CWError(2, 'SearchType provided does not exist or is mispelled.', {'provided': searchType, 'available':this.searchTypes}))
      } else if(typeof(applyToEntities)!='undefined' && applyToEntities!=null && applyToEntities.length>0 && (typeof(employeeSid)!='undefined' || typeof(domainId)!='undefined')) {
        reject(new CWError(3, 'You cannot specify both applyToEntities AND employeeSid/domainId'))
      }
      var data = {}
      var savedEndpoint = ''
      if(typeof(employeeSid)!='undefined' || typeof(domainId)!='undefined') {
        savedEndpoint = 'SavedByType'
        if(typeof(employeeSid)!='undefined' && employeeSid!=null) {
          _.set(data, 'EmployeeSid', employeeSid)
        }
        if(typeof(domainId)!='undefined' && domainId!=null) {
          _.set(data, 'DomainId', domainId)
        }
      } else {
        if(searchType=='Case') {
          savedEndpoint = 'PllSavedSaved'
        } else {
          savedEndpoint = searchType + 'Saved'
        }
        if(typeof(applyToEntities)!='undefined' && applyToEntities!=null) {
          _.set(data, 'ApplyToEntities', applyToEntities)
        }
      }
      this.cw.runRequest('Ams/Search/'+savedEndpoint, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list display fields for a Search Type
   *
   * @category Search Options
   * @param {string} searchType - Restrict GIS searches to specified entity types
   * @return {Object} Returns Promise object that represents a collection of SearchDisplayFields
   */
  displayFields(searchType: string) {
    return new Promise((resolve, reject) => {
      if(!_.has(this.searchTypes, searchType)) {
        reject(new CWError(1, 'SearchType provided does not exist or is mispelled.', {'provided': searchType, 'available':this.searchTypes}))
      }
      var data = {
        searchType: _.get(this.searchTypes, searchType)
      }
      this.cw.runRequest('Ams/Search/DisplayFields', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list search types
   *
   * @category Search Options
   * @return {Object} Returns Promise object that represents a collection of SearchTypeInfo objects
   */
  types() {
    return new Promise((resolve, reject) => {
      var data = {}
      this.cw.runRequest('Ams/Search/Types', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Enable Service URLs on Saved Searches
   *
   * @category Search Options
   * @param {Array<number>} searchIds - Search IDs to enable eURL on
   * @return {Object} Returns Promise object that represents a dictionary of SearchIds and EURL booleans
   */
  enableServices(searchIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        Enable: true,
        SearchIds: searchIds
      }
      this.cw.runRequest('Ams/Search/UpdateEurl', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Disable Service URLs on Saved Searches
   *
   * @category Search Options
   * @param {Array<number>} searchIds - Search IDs to enable eURL on
   * @return {Object} Returns Promise object that represents a dictionary of SearchIds and EURL booleans
   */
  disableServices(searchIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        Enable: false,
        SearchIds: searchIds
      }
      this.cw.runRequest('Ams/Search/UpdateEurl', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a search definition
   *
   * @category Search Definitions
   * @param {number} searchId - SearchId to get.
   * @param {number} employeeSid - Enforces employee security settings on search definition if provided.
   * @return {Object} Returns Promise object that represents a SearchDefinition object
   */
  getDefinition(searchId: number, employeeSid?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        SearchId: searchId
      }
      if(typeof(employeeSid)!='undefined') {
        _.set(data, 'EmployeeSid', employeeSid)
      }
      this.cw.runRequest('Ams/Search/Definition', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get search definitions
   *
   * @category Search Definitions
   * @param {Array<number>} searchIds - SearchIds to get.
   * @param {number} employeeSid - Enforces employee security settings on search definition if provided.
   * @return {Object} Returns Promise object that represents a collection of SearchDefinition objects
   */
  getDefinitions(searchIds: Array<number>, employeeSid?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        SearchIds: searchIds
      }
      if(typeof(employeeSid)!='undefined') {
        _.set(data, 'EmployeeSid', employeeSid)
      }
      this.cw.runRequest('Ams/Search/Definitions', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get search definition names
   *
   * @category Search Definitions
   * @param {Array<number>} searchIds - SearchIds to get.
   * @return {Object} Returns Promise object that represents a collection of SearchDefinitionNames
   */
  getDefinitionNames(searchIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        SearchIds: searchIds
      }
      this.cw.runRequest('Ams/Search/DefinitionNames', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Delete search definitions
   *
   * @category Search Definitions
   * @param {Array<number>} searchIds - SearchIds to get.
   * @return {Object} Returns Promise object that represents a list (dictionary) of search IDs and deletion success boolean
   */
  deleteDefinitions(searchIds: Array<number>) {
    return new Promise((resolve, reject) => {
      var data = {
        SearchIds: searchIds
      }
      this.cw.runRequest('Ams/Search/DeleteDefinitions', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Save a search definition
   *
   * @category Search Definitions
   * @param {string} searchFor - Name of type to search for from searchTypes
   * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/Ams/Search
   * @param {number} searchId - SearchId to update. Defaults to "0" which is "Create new saved search"
   * @return {Object} Returns Promise object that represents a SearchDefinitionName object
   */
  saveDefinition(searchFor: string, options?: Object, searchId: number = 0) {
    return new Promise((resolve, reject) => {
      if(!_.has(this.searchTypes, searchFor)) {
        reject(new CWError(1, 'SearchType provided does not exist or is mispelled.', {'provided': searchFor, 'available':this.searchTypes}))
      }
      var data = {
        SearchFor: _.get(this.searchTypes, searchFor),
        SearchId: searchId
      }
      data = _.merge(data, options)
      this.cw.runRequest('Ams/Search/SaveDefinition', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Convert a search definition to a query
   *
   * @category Search Definitions
   * @param {Array<number>} searchIds - searchIds to convert
   * @param {boolean} saveQuery - Automatically save a query which converts with no errors, default is false
   * @param {boolean} allowMultipleBooleanValues - Use all values for boolean fields even though a boolean should only have one value, default is false and will only use the first boolean value
   * @param {boolean} allowEmptyQuery - Create default filter when no filter is found, default is false
   * @return {Object} Returns Promise object that represents a SearchToQueryResult list
   */
  convertToQuery(searchIds: Array<number>, saveQuery: boolean = false, addEurl: boolean = false, allowMultipleBooleanValues: boolean = false, allowEmptyQuery: boolean = false) {
    return new Promise((resolve, reject) => {
      var data = {
        "SearchIds": searchIds,
        "SaveQuery": saveQuery,
        "AddEurl": addEurl,
        "AllowMultipleBooleanValues": allowMultipleBooleanValues,
        "AllowEmptyQuery": allowEmptyQuery
      }
      this.cw.runRequest('General/Query/SearchToQuery', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

}
