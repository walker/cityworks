import { CWError } from './error'
const _ = require('lodash')


interface DynamicVariableMap {
  [key: string]: any
}

interface DynamicResponseDefinition {
  [key: string]: any
}


export class Query {
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
   * Build a query using query language syntax or by specifying a saved query ID
   *
   * @category Query
   * @param {number} query - Query to run (specify syntax or queryID)
   * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/General/Query
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  build(query: number|string, options: {Page?: number, PageSize?: number, SortDescending?: boolean, SortField?: string, Variables?: DynamicVariableMap} = {}, domainId?: number) {
    return new Promise((resolve, reject) => {
      var data = {
      }
      if(isNaN(+query)) {
        _.set(data, "QueryValue", query)
      } else if(!isNaN(+query)) {
        _.set(data, "QueryId", query)
      } else {
        // throw error
      }
      data = _.merge(data, options)
      if(typeof(domainId)!=='undefined') {
        _.set(data, "DomainId", domainId)
      }
      this.cw.runRequest('General/Query/Builder', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get available query types
   *
   * @category Query
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  getTypes() {
    return new Promise((resolve, reject) => {
      this.cw.runRequest('General/Query/QueryTypes', {}).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get info about query types
   *
   * @category Query
   * @param {boolean} includeDefaultSchemasInclude - Include schemas (Work Order, Service Request, etc), default is true.
   * @param {boolean} includeGisSchemas - Include gis schemas, ddefault is true.
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain
   * @return {Object} Returns Promise object that represents a list of Objects
   */
    getTypesInfo(includeDefaultSchemasInclude: boolean = true, includeGisSchemas: boolean = true, domainId?: number) {
      return new Promise((resolve, reject) => {
        var data = {
          "IncludeDefaultSchemasInclude": includeDefaultSchemasInclude,
          "IncludeGisSchemas": includeGisSchemas
        }
        if(typeof(domainId)!=='undefined') {
          _.set(data, "DomainId", domainId)
        }
        this.cw.runRequest('General/Query/QueryTypeInformation', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }

  /**
   * Validate a query string
   *
   * @category Query
   * @param {string} query - The query to validate
   * @param {DynamicVariableMap} variables - Required if the query includes variables
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain
   * @return {Object} Returns Promise object that represents a list of Objects
   */
    validateQuery(query: string, variables: DynamicVariableMap, domainId?: number) {
      return new Promise((resolve, reject) => {
        var data = {
          "Query": query,
          "Variables": variables
        }
        if(typeof(domainId)!=='undefined') {
          _.set(data, "DomainId", domainId)
        }
        this.cw.runRequest('General/Query/ValidateQuery', data).then(r => {
          resolve(r.Value)
        }).catch(e => {
          reject(e)
        })
      })
    }
    
  /**
   * Validate a query response definition
   *
   * @category Query
   * @param {string} queryType - The query to validate
   * @param {DynamicResponseDefinition} responseDefinition - Required if the query includes variables
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  validateResponseDefinition(queryType: string, responseDefinition: DynamicResponseDefinition, domainId?: number) {
    // TODO: Confirm that the queryType is present in the getTypes() request
    return new Promise((resolve, reject) => {
      var data = {
        "QueryType": queryType,
        "ResponseDefinition": responseDefinition
      }
      if(typeof(domainId)!=='undefined') {
        _.set(data, "DomainId", domainId)
      }
      this.cw.runRequest('General/Query/ValidateResponseDefinition', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get schema for specified query type
   *
   * @category Query
   * @param {string} queryType - Specify Query Type
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain. Used to determine query field configuration for the schema fields.
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  getSchema(queryType: string, domainId?: number) {
    return new Promise((resolve, reject) => {
      var data = {
        "QueryType": queryType
      }
      if(typeof(domainId)!=='undefined') {
        _.set(data, "DomainId", domainId)
      }
      this.cw.runRequest('General/Query/QuerySchema', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Run a query using query language syntax
   *
   * @category Query
   * @param {number} query - Query syntax string or saved query ID to run. If you want to append addt'l query items to a saved query, add QueryValue in the options
   * @param {Object} options - Other options. See: /{subdirectory}/apidocs/#/service-info/General/Query
   * @return {Object} Returns Promise object that represents a list of Objects
   */
  run(query: string, options: {QueryValue?: string, Page?: number, PageSize?: number, ResponseFields?: any, SortDescending?: boolean, SortField?: string, Variables?: DynamicVariableMap} = {}) {
    return new Promise((resolve, reject) => {
      var data = {}
      var api_path: string = 'General/Query/Query';
      if(isNaN(+query)) {
        _.set(data, "QueryValue", query)
        if(typeof(options.QueryValue)!=='undefined') {
          _.unset(options, 'QueryValue')
        }
      } else if(!isNaN(+query)) {
        _.set(data, "QueryId", query)
        var api_path = 'General/Query/RunById'
      } else {
        // throw error
      }
      data = _.merge(data, options)
      this.cw.runRequest(api_path, data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }

  /**
   * Get a list of the saved queries the current user can access.
   *
   * @category Query
   * @param {Array<string>} queryTypes - Get the saved queries for a particular type, default is all types
   * @param {boolean} createdOnly - Get only queries created by the current user, default is get all queries current user can access
   * @param {boolean} includeQuery - Restrict GIS searches to specified entity types
   * @param {boolean} [visibleToMobile] - Filter visibility to mobile. Default ignore visibility to mobile.
   * @param {number} [domainId] - The domain ID of the domain to search, defaut is authenticated user's current domain
   * @return {Object} Returns Promise object that represents a collection of SavedQueries
   */
  getSaved(queryTypes: Array<string> = [], createdOnly: boolean = false, includeQuery: boolean = true, visibleToMobile?: boolean, domainId?: number) {
    return new Promise((resolve, reject) => {
      // TODO: Check QueryTypeInformation and compare
      var data = {
        "CreatedOnly": createdOnly,
        "IncludeQuery": includeQuery
      }
      if(queryTypes.length==1) {
        _.set(data, "QueryType", queryTypes.pop())
      } else if(queryTypes.length>1) {
        _.set(data, "QueryTypes", queryTypes)
      }
      if(typeof(domainId)!=='undefined') {
        _.set(data, "DomainId", domainId)
      }
      this.cw.runRequest('General/Query/SavedQueries', data).then(r => {
        resolve(r.Value)
      }).catch(e => {
        reject(e)
      })
    })
  }
}
