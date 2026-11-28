import { CWError } from './error'
import { General } from './general'
import { Attachments } from './attachments'
import { ActivityLinks } from './activity_link'
import { Gis } from './gis'
import { MessageQueue } from './message_queue'
import { Search } from './search'
import { Query } from './query'
import { Report } from './report'
import { Request } from './request'
import { CustomerCall } from './customer_call'
import { Inspection } from './inspection'
import { WorkOrder } from './workorder'
import { Briefcase } from './briefcase'
import { CaseData } from './case_data'
import { CaseFinancial } from './case_financial'
import { CaseWorkflow} from './case_workflow'
import { CasePeople } from './case_people'
import { CaseAssets } from './case_assets'
import { CaseFlags } from './case_flags'
import { CaseAdmin } from './case_admin'
import { Comments } from './comments'
import { WorkOrderAdmin } from './workorder_admin'
import { InspectionAdmin } from './inspection_admin'
import { RequestAdmin } from './request_admin'
import { WorkOrderCosts } from './workorder_costs'
import { InspectionCosts } from './inspection_costs'
import { RequestCosts } from './request_costs'
import { Employee } from './employee'
import { Equipment } from './equipment'
import { Contractor } from './contractor'
import { RecentActivity } from './recent_activity'
import { GeneralAdmin } from './general_admin'
import { AuditLogs } from './audit_logs'

import * as https from 'https'
import * as querystring from 'querystring'
import _ from 'lodash'
import FormData from 'form-data'
import * as fs from 'fs'
import * as path from 'path'
import axios from 'axios'

interface postData {
  data?: string
  token?: string
  file?: any
  [key: string]: any
}

interface Citywork {
}

/**
 * Core class Cityworks with most of the authentication and install capabilities functions
 */
class Cityworks implements Citywork {
  /**
   * The domain of the cityworks install. Defaults to Cityworks Online
   */
  private base_url: string
  /**
   * Stores the currently in use authentication token
   */
  private Token?: string
  /**
   * Stores the login username
   */
  private login?: string
  /**
   * Holds the login password
   */
  private password?: string
  /**
   * Holds the GIS Token for GIS-based Authentication (Portal)
   */
  private gisToken?: string
  /**
   * Holds the GIS Token URL for GIS-based Authentication (Portal)
   */
  private gisTokenUrl?: string
  /**
   * Stores settings including path (defaults to "cityworks"), secure (defaults to true), expires (defaults to null - does not expire), default_domain
   */
  private settings: {
    path: string,
    secure: boolean,
    expires: any,
    default_domain?: any,
    version: number,
    publicUser: boolean
  }
  error?: any

  private extensions: Object
  private features: Object
  private potential_loads: Array<string>
  private loaded: Array<string> | null = null

  /**
     * Contructor for a new cityworks instance's object, allows one to optionally configure the domain and other settings right from the get-go
     * @param {string} [base_url] - The base url of your Cityworks instance
     * @param {object} [settings] - The settings for your Cityworks site. Full list: {path: (defaults to "cityworks"), publicUser: true if the account is a non-employee public access user (case comments then default to public), defaults to false, secure: defaults to true, expires: defaults to NULL, does not expire, default_domain: defaults to NULL, uses default user domain, version: defaults to 23, for 15.x set to 15}
     * @param {array} [load] - allows user to choose which modules to load and make available. Omit to load everything. See `configure` for the full list of module names.
     */
  constructor(base_url?: string, settings?: Object, load?: Array<string>) {
    this.base_url = 'cityworksonline'
    this.extensions = {"UnknownExtension": 0, "CwAnalytics": 1, "WebHooks": 2, "PLLPublicApp": 3, "ActivityUpdate": 4, "SingleSignOn": 5}
    this.features = {"UnknownFeature": 0, "ViewInspections": 1, "EditInspections": 2, "ViewServiceRequest": 3, "EditServiceRequest": 4, "ViewWorkOrder": 5, "EditWorkOrder": 6, "EquipmentCheckOut": 7, "OfficeField": 8, "Respond": 9, "Eurl": 10, "PaverInterface": 11, "Contracts": 12, "Storeroom": 13, "PLL": 14, "Cw4XL": 15, "TableEditor": 16, "CCTVInterface": 17, "MobileAndroid": 18, "MobileiOS": 19, "PerformanceBudgeting": 20, "Insights": 21, "RespondCase": 22, "RespondInspection": 23, "RespondServiceRequest": 24, "RespondTaskManager": 25, "RespondWorkOrder": 26, "Workload": 27, "OpX": 28, "TrimbleUnityMobile": 29, "TrimbleVegetationManager": 30}
    this.settings = {
      path: 'cityworks',
      secure: true,
      expires: null,
      default_domain: null,
      version: 23,
      publicUser: false
    }
    this.potential_loads = ['general', 'activity_link', 'message_queue', 'gis', 'search', 'query', 'request', 'inspection', 'workorder', 'case', 'report', 'employee', 'equipment', 'contractor', 'recent_activity', 'general_admin']
    if(typeof(base_url)!='undefined') {
      this.configure(base_url, settings, load)
    }
  }

  /**
     * Configure a new cityworks instance's domain and other settings
     *
     * @param {string} [base_url] - The first color, in hexadecimal format.
     * @param {object} [settings] - The second color, in hexadecimal format.
     * @param {array} [load] - allows user to choose which modules to make available; using any other module throws an error. Defaults to loading all of them. Names: 'general', 'activity_link', 'message_queue', 'gis', 'search', 'query', 'request', 'inspection', 'workorder', 'case' (alias 'briefcase'), 'report', 'employee', 'equipment', 'contractor', 'recent_activity', 'general_admin'. The 'report' module builds on 'request', 'inspection', 'workorder' and 'case' internally, but does not make them available to you unless you also list them.
     * @return {boolean} Returns true if successful, otherwise, throws error
     */
  configure(base_url?: string, settings?: Object, load?: Array<string>) {
    this.loaded = this.normalizeLoad(load)
    if(typeof base_url !== 'undefined') { this.base_url = base_url } else { this.base_url = 'cityworksonline' }
    this.settings = {
      path: 'cityworks',
      secure: true,
      expires: null,
      default_domain: null,
      version: 23,
      publicUser: false
    }

    if(typeof(settings)!='undefined') {
      _.forEach(settings, (v,k) => {
        if(typeof(this.settings[k])!='undefined') {this.settings[k] = v}
      })
    }
  }

  /**
   * Whether a module (e.g. 'request', 'case') is available. All modules are available unless a `load` list was given to configure.
   *
   * @param {string} name - The module name
   * @return {boolean}
   */
  isLoaded(name: string): boolean {
    const canonical = Cityworks.loadAliases[name] || name
    return this.loaded === null || this.loaded.indexOf(canonical) > -1
  }

  /**
   * @hidden
   */
  private static loadAliases: {[key: string]: string} = {briefcase: 'case', case_financial: 'case'}

  private normalizeLoad(load?: Array<string>): Array<string> | null {
    if(typeof(load) === 'undefined' || load === null) {
      return null
    }
    const names = _.uniq(_.map(load, n => Cityworks.loadAliases[n] || n))
    const unknown = _.difference(names, this.potential_loads)
    if(unknown.length > 0) {
      throw CWError.validation(15, 'Unknown module(s) in load: ' + unknown.join(', '), {'provided': load, 'available': this.potential_loads})
    }
    return names
  }

  /**
     * Send a request to the Cityworks API
     *
     * If one ever needs to access or call an unimplemented API endpoint of a Cityworks install, one can call this method directly with the path and data payload:
     *
     * `cityworks.runRequest(service_path, post_data)`
     *
     * @param {string} service_path - The path to the particular endpoint
     * @param {any} post_data - The data object to be sent to the Cityworks API
     * @param {string} post_file - The path of the file to send to the Cityworks API
     * @return {Object} Returns Promise object that represents the json object returned from the Cityworks API
     */
  runRequest(service_path: string, post_data?: any, post_file?: string) {
    return new Promise((resolve, reject) => {
      let pd = {} as postData
      var file_name = ''
      var file_type = ''

      if(typeof(post_data) !== 'undefined') {
        pd.data = JSON.stringify(post_data)
      }

      if(this.settings.version<23 && typeof(this.Token) !== 'undefined' && this.Token != '' && service_path!='General/Authentication/CityworksOnlineAuthenticate' && service_path!='General/Authentication/Authenticate') {
        pd.token = this.Token
      }

      let obj: {
        Status: number,
        Message: string
      }

      let options = {
        hostname: this.base_url,
        port: 443,
        path: '/' + this.settings.path + '/services/' + service_path,
        method: 'GET',
        headers: {},
        timeout: 10000000
      }
      if(this.settings.secure==false) {
        options.port = 80
      }
      if(this.settings.version>=23 && typeof(this.Token) !== 'undefined' && this.Token != '' && service_path!='General/Authentication/CityworksOnlineAuthenticate' && service_path!='General/Authentication/Authenticate') {
        _.set(options, 'headers.Authorization', 'cityworks ' + this.Token)
        if(!_.isEmpty(pd)) {
          _.set(options, 'method', 'POST')
        }
      }

      if(typeof(post_file)!=='undefined') {
        // file_name = path.basename(post_file)
        // file_type = mimetypes.lookup(path.extname(post_file))
        var cw_url = 'https://'
        if(options.port==80) {
          cw_url = 'http://'
        }
        cw_url += options.hostname+options.path
        if(this.settings.version<23 && typeof(this.Token) !== 'undefined' && this.Token != '' && service_path!='General/Authentication/CityworksOnlineAuthenticate' && service_path!='General/Authentication/Authenticate') {
          cw_url += '?token='+this.Token
        }
        const formData = new FormData()
        formData.append('data', JSON.stringify(post_data))
        formData.append('file', fs.createReadStream(post_file))
        axios.post(cw_url, formData, {
          headers: formData.getHeaders()
        }).then((r) => {
          resolve(r.data)
        }).catch((e) => {
          reject(new CWError(17, 'Error sending the file to the Cityworks API.', e, {
            category: axios.isAxiosError(e) ? (e.response ? 'http' : e.request ? 'network' : 'unknown') : 'unknown',
            cause: e, servicePath: service_path,
            statusCode: axios.isAxiosError(e) && e.response ? e.response.status : undefined
          }))
        })
      } else {
        // if(service_path=='Pll/CaseFlags/DeleteByCaObjectId') {
        //   console.log(options)
        //   console.log(pd)
        //   process.exit(0)
        // }
        // TODO: check if still necessary

        if(service_path=='Pll/CaseRelDocs/ByCaObjectId' && !_.isEmpty(pd)){
          _.set(options, 'path', options.path + '?' + querystring.stringify(pd))
        } else {
          _.set(options, 'headers.Content-Type', 'application/x-www-form-urlencoded')
          if(!_.isEmpty(pd)){
            _.set(options, 'headers.Content-Length', Buffer.byteLength(querystring.stringify(pd)))
          }
        }
        let request = https.request(options, (response) => {
          let str=''
          response.on('error',function(e){
              console.log(e, 'Caught on error')
              reject(new CWError(13, "Unknown error.", e, {category: 'network', cause: e, servicePath: service_path}))
          })

          response.on('data',function(chunk){
              str+=chunk
          })

          response.on('end',function(){
            if(!_.isUndefined(_.findKey(Attachments.downloadUrls(), function(o) { return o === service_path })) || !_.isUndefined(_.findKey(Report.downloadUrls(), function(o) { return o === service_path })) || !_.isUndefined(_.findKey(CaseFinancial.downloadUrls(), function(o) { return o === service_path }))) {
              // This is an attachment or report download call
              if(_.findKey(Report.downloadUrls(), function(o) { return o === service_path })==='case' && response.statusCode==500) {
                reject(new CWError(13, 'Could not find report template for specified case or other server error occurred.', undefined, {category: 'http', servicePath: service_path, statusCode: response.statusCode}))
              } else if(_.findKey(Report.downloadUrls(), function(o) { return o === service_path })==='receipt' && response.statusCode==500) {
                reject(new CWError(14, 'Could not find receipt file or another server error occurred.', undefined, {category: 'http', servicePath: service_path, statusCode: response.statusCode}))
              } else {
                resolve(str);
              }
            } else {
              const responseErrorOptions = {
                category: response.statusCode && response.statusCode >= 400 ? 'http' as const : 'response' as const,
                servicePath: service_path,
                statusCode: response.statusCode
              }
              var test_str = JSON.stringify(str) + "[test string]"
              if(test_str.match(/\<h2\>Object\ moved\ to/)!=null) {
                reject(new CWError(5, "Error parsing JSON. Cityworks returned HTML.", {response: str, statusCode: response.statusCode}, responseErrorOptions))
                return
              }
              let obj
              try {
                obj = JSON.parse(str)
              } catch (e) {
                reject(new CWError(e instanceof SyntaxError ? 6 : 7, "Error parsing JSON.", {error: String(e), response: str, statusCode: response.statusCode}, {...responseErrorOptions, cause: e}))
                return
              }
              if(typeof(obj)=='undefined') {
                reject(new CWError(10, 'No response received from Cityworks API.', undefined, responseErrorOptions))
              } else if(obj === null) {
                reject(new CWError(7, "Error parsing JSON.", {error: 'Cityworks returned null', response: str, statusCode: response.statusCode}, responseErrorOptions))
              } else {
                const apiErrorOptions = {category: 'api' as const, servicePath: service_path, statusCode: response.statusCode}
                switch(obj.Status) {
                  case 1:
                    reject(new CWError(1, 'Error', obj, apiErrorOptions))
                    break;
                  case 2:
                    reject(new CWError(2, 'Unauthorized', obj, apiErrorOptions))
                    break;
                  case 3:
                    reject(new CWError(3, 'InvalidCredentials', obj, apiErrorOptions))
                    break;
                  case 0:
                  default:
                    if(typeof(obj.Value)=='undefined' && obj.Status==0) {
                      resolve(true);
                    } else {
                      resolve(obj);
                    }
                    break;
                }
              }
            }
          })
        })
        request.on('error', (e) => {
          reject(new CWError(13, 'Unknown error.', e, {category: 'network', cause: e, servicePath: service_path}))
        })
        request.on('timeout', () => {
          request.destroy(new Error('Request to the Cityworks API timed out.'))
        })
        request.write(querystring.stringify(pd))
        request.end()
      }
    })
  }

  /**
     * Authenticate with the Cityworks API and store an access token for use. Stores the token on cityworks.Token.
     * @param {string} login - User's login name
     * @param {password} password - User's password
     * @return {Object} Returns Promise object that represents a boolean which tells you the login succeeded (true) or failed (false).
     */
  authenticate(login: string, password: string) {
    return new Promise((resolve, reject) => {
      let data = {LoginName:login, Password:password}
      let path = 'General/Authentication/Authenticate'
      if(this.base_url == 'cityworksonline') {
        path = 'General/Authentication/CityworksOnlineAuthenticate'
      }
      this.runRequest(path, data).then((response: any) => {
        if(response.Status>0) {
          // failed
          reject(new CWError(100, response.Message, undefined, {category: 'api', servicePath: path}))
        } else if(typeof(response.Value)!='undefined' && typeof(response.Value.Token)!='undefined') {
          this.login = login
          this.password = password
          this.Token = response.Value.Token
          resolve(true)
        } else {
          // failed
          reject(new CWError(11, 'Unknown Error'))
        }
      }).catch(error => {
        reject(error);
      })
    })
  }

  /**
     * Current version
     * @return {number} Returns a number that is the currently configured version of the Cityworks platform. Defaults to "23".
     */
  v() {
    return this.settings.version
  }

  /**
   * Whether the account being used is a non-employee (public access) user. Set with the `publicUser` setting in configure; defaults to false.
   * Comments on cases are private by default, and public by default only when this is true.
   *
   * @return {boolean}
   */
  isPublicUser(): boolean {
    return this.settings.publicUser === true
  }

  /**
   * The absolute URL of the configured Cityworks install, e.g. https://cw.domain.tld/cityworks
   *
   * @return {string}
   */
  getBaseUrl(): string {
    return (this.settings.secure == false ? 'http://' : 'https://') + this.base_url + '/' + this.settings.path
  }

  /**
     * Authenticate a username with a GIS Token
     * @param {login} - Gis user name, should match a Cityworks employee login name
     * @param {string} gisToken - Gis Oauth2 access token
     * @param {string} gisTokenUrl - Base url to GIS server (not the '/generateToken' endpoint)
     * @param {number} [expires] - Authenticate to Cityworks for a specified number of milliseconds, defaults to 2 weeks
     */
  authenticateWithGISToken(login: string, gisToken: string, gisTokenUrl: string, expires?: number) {
    this.login = login
    this.gisToken = gisToken
    this.gisTokenUrl = gisTokenUrl
    if(typeof(expires)=='undefined') {
      expires = 1209600000
    }

    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/AuthenticateGisToken'
      let data = { LoginName:this.login, GisToken: this.gisToken, GisTokenUrl: this.gisTokenUrl, Expires: expires}

      this.runRequest(path, data).then((response: any) => {
        if((typeof(response.Status)!='undefined' && response.Status>0)) {
          // failed
          reject(new CWError(100, response.Message, undefined, {category: 'api', servicePath: path}))
        } else if(typeof(response.Value)!='undefined' && typeof(response.Value.Token)!='undefined') {
          this.Token = response.Value.Token
          resolve(true)
        } else {
          // failed
          resolve(false)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
     * Validate provided token
     * @param {string} token - User's login name
     * @param {boolean} [set] - Set a valid token as the cityworks instance's active token
     * @return {Object} Returns Promise object that represents a boolean which apprises one of the token's validity and that is was set (true) or throws an error if was not valid (and not set).
     */
  validateToken(token:string, set?:boolean) {
    return new Promise((resolve, reject) => {
      let data = { Token: token }
      let path = 'General/Authentication/Validate'
      this.runRequest(path, data).then((response: any) => {
        if(response.Status>0) {
          // failed
          resolve(false)
        } else {
          if(set) {
            this.Token = token
          }
          resolve(response.Value)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  /**
     * Set a token you've retrieved from your storage system as the active token for the cityworks instance. Note that this doesn't check the token for validity.
     * @param {token} token - The token string to set as the active token.
     * @return {boolean} Returns a boolean which apprises one that the token was set (true) or not set (false).
     */
  setToken(token) {
    if(token!='' && token!=null) {
      this.Token = token
      return true
    } else {
      return false
    }
  }

  /**
     * Get currently set, valid token
     * @param {token} token - The token string to set as the active token.
     * @return {string} Returns a string which is the currently-set token or the boolean false value if no (valid) token set
     */
  getToken() {
    if(this.Token=='' || this.Token==null) {
      return false
    } else {
      return this.Token
    }
  }

  /**
     * Revoke all current user's tokens or only tokens created before a particular date and time.
     * @param {number} [revokeBefore] - Datetime as an Epoch integer (number), if you wish to revoke only tokens created before a particular datetime
     * @return {Object} Returns Promise object that represents a boolean which apprises one of the revocation outcome's success (true) or failure (false)
     */
  revokeToken(revokeBefore?:number) {
    return new Promise((resolve, reject) => {
      let data = { RevokeDate: revokeBefore }
      let path = 'General/Token/RevokeUser'
      this.runRequest(path, data).then((response: any) => {
        if((typeof(response.Status)!='undefined' && response.Status>0)) {
          // failed
          resolve(false)
        } else {
          resolve(true)
        }
      }).catch(error => {
        reject(error)
      })
    })
  }

  // App data

  /**
     * Get the localization settings for current Cityworks install
     * @return {Object} Returns Promise object that represents an Object which contains all the localization settings for the current Cityworks install
     */
  getLocalizationSettings() {
    return new Promise((resolve, reject) => {
      let path = 'General/Localization/LocalizationSettings'
      this.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get the system timezone options for current Cityworks install
     * @return {Object} Returns Promise object that represents an Object which contains all the timezone settings for the currentCityworks install
     */
  getTimezoneOptions() {
    return new Promise((resolve, reject) => {
      let path = 'General/Localization/TimeZones'
      this.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get the current install's location information
     * @return {Object} Returns Promise object that represents an Object which contains the location information
     */
  getCurrentLocation() {
    return new Promise((resolve, reject) => {
      let path = 'General/AppData/CurrentLocation'
      this.runRequest(path, {}).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  // Licensing Checks
  /**
     * Check if a particular license is available to the currently-authenticated user
     * @param {string} area - Area of access
     * @param {string} service - Service to access
     * @return {boolean} Returns Promise object that represents a boolean which informs access is granted (true) or denied (false)
     */
  licensedApiCheck(area: string, service: string) {
    return new Promise((resolve, reject) => {
      let data = {
        "Area": area,
        "Service": service
      }
      let path = 'General/AppData/SelectedEntities'
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Check if a current Cityworks install is licensed to use a particular extension
     *
     * Possible extensions currently include: "UnknownExtension", "CwAnalytics", "WebHooks", "PLLPublicApp", "ActivityUpdate", "SingleSignOn"
     *
     * @param {string} extension - Extension name
     * @return {boolean} Returns Promise object that represents a boolean which informs extension is licensed (true) or not (false)
     */
  licensedExtensionCheck(extension: string) {
    return new Promise((resolve, reject) => {
      if(typeof(this.extensions[extension])=='undefined') {
        reject(new CWError(4, 'Extension provided does not exist or is mispelled.', {'provided': extension, 'available': this.extensions}))
        return
      }
      let data = {
        "Extension": this.extensions[extension]
      }
      let path = 'General/Authorization/LicensedExtensionCheck'
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Check a whole list to see if current Cityworks install is licensed to use extensions
     *
     * Possible extensions currently include: "UnknownExtension", "CwAnalytics", "WebHooks", "PLLPublicApp", "ActivityUpdate", "SingleSignOn"
     *
     * @param {Array<string>} extension - Extension names
     * @return {Object} Returns Promise object that represents a boolean which informs extension is licensed (true) or not (false)
     */
  licensedExtensionsCheck(extensions: Array<string>) {
    return new Promise((resolve, reject) => {
        var data: { Extensions: Array<number> } = {
          Extensions: []
        }
      _.forEach(extensions, (v) => {
        if(typeof(this.extensions[v])=='undefined') {
          reject(new CWError(5, 'Extension provided does not exist or is mispelled.', {'provided': v, 'available': this.extensions}))
        } else {
          data.Extensions.push(this.extensions[v])
        }
      })
      let path = 'General/Authorization/LicensedExtensionsCheck'
      this.runRequest(path, data).then((response: any) => {
        let rez: Object = {}
        // reverse boolean to numeric dictionary to a boolean to string dictionary
        let inv_extensions = _.invert(this.extensions)
        _.forEach(response, (ext_num, bool) => {
          if(typeof(inv_extensions[ext_num])=='undefined') {
            reject(new CWError(6, 'Extension index provided does not exist or isn\'t configured properly.', {'provided_num_returned': ext_num, 'available': this.extensions}))
          } else {
            // Put string name of extension in rezponse object and set boolean on it.
            rez[inv_extensions[ext_num]] = bool
          }
        })
        resolve(rez)
      })
    })
  }

  /**
     * Check if current user is licensed to use a feature:
     *
     * "UnknownFeature", "ViewInspections", "EditInspections", "ViewServiceRequest", "EditServiceRequest", "ViewWorkOrder", "EditWorkOrder", "EquipmentCheckOut", "OfficeField", "Respond", "Eurl", "PaverInterface", "Contracts", "Storeroom", "PLL", "Cw4XL", "TableEditor", "CCTVInterface", "MobileAndroid", "MobileiOS", "PerformanceBudgeting", "Insights", "RespondCase", "RespondInspection", "RespondServiceRequest", "RespondTaskManager", "RespondWorkOrder", "Workload", "OpX", "TrimbleUnityMobile", "TrimbleVegetationManager"
     *
     * @param {string} [feature] - Feature to check to see if ciurrently authenticated user can utilize
     * @return {Object} Returns Promise object that represents a boolean which communicates license state as licensed (true) or not (false)
     */
  licensedFeatureCheck(feature: string) {
    return new Promise((resolve, reject) => {
      if(typeof(this.features[feature])=='undefined') {
        reject(new CWError(7, 'Feature provided does not exist or is mispelled.', {'provided': feature, 'available': this.features}))
        return
      }
      let data = {
        "Feature": this.features[feature]
      }
      let path = 'General/Authorization/LicensedFeatureCheck'
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Check if current user is licensed to use features:
     *
     * "UnknownFeature", "ViewInspections", "EditInspections", "ViewServiceRequest", "EditServiceRequest", "ViewWorkOrder", "EditWorkOrder", "EquipmentCheckOut", "OfficeField", "Respond", "Eurl", "PaverInterface", "Contracts", "Storeroom", "PLL", "Cw4XL", "TableEditor", "CCTVInterface", "MobileAndroid", "MobileiOS", "PerformanceBudgeting", "Insights", "RespondCase", "RespondInspection", "RespondServiceRequest", "RespondTaskManager", "RespondWorkOrder", "Workload", "OpX", "TrimbleUnityMobile", "TrimbleVegetationManager"
     *
     * @param {Array<string>} [feature] - Features to check to see if currently authenticated user can utilize
     * @return {Object} Returns Promise object that represents a boolean which communicates license state as licensed (true) or not (false)
     */
  licensedFeaturesCheck(features: Array<string>) {
    return new Promise((resolve, reject) => {
      var data: { Features: Array<number> } = {
        Features: []
      }
      _.forEach(features, (v: string) => {
        if(typeof(this.features[v])=='undefined') {
          reject(new CWError(8, 'Feature provided does not exist or is mispelled.', {'provided': v, 'available': this.features}))
        } else {
          data.Features.push(this.features[v])
        }
      })
      let path = 'General/Authorization/LicensedFeaturesCheck'
      this.runRequest(path, data).then((response: any) => {
        let rez: Object = {}
        // reverse boolean to numeric dictionary to a boolean to string dictionary
        let inv_features = _.invert(this.features)
        _.forEach(response.Value, (feat_num, bool) => {
          if(typeof(inv_features[feat_num])=='undefined') {
            reject(new CWError(9, 'Feature index provided does not exist or isn\'t configured properly.', {'provided': feat_num, 'available': inv_features}))
          } else {
            // Put string name of extension in rezponse object and set boolean on it.
            rez[inv_features[feat_num]] = bool
          }
        })
        resolve(rez)
      })
    })
  }

  // LicensedServicesCheck
  // Check if current user is licensed to use services
  // List req ServicesList of 'Area/Service', i.e. ['AMS/Inspection','AMS/WorkOrder','PLL/Case']
  /**
     * Check if current user is licensed to use services. List req ServicesList of 'Area/Service', i.e.:
     *
     * ['AMS/Inspection','AMS/WorkOrder','PLL/Case']
     *
     * @param {Array<string>} [services] - Services to check to see if currently authenticated user can utilize
     * @return {Object} Returns Promise object that represents a boolean which communicates license state as licensed (true) or not (false)
     */
  licensedServicesCheck(services: Array<string>) {
    return new Promise((resolve, reject) => {
      let path = 'General/Authorization/LicensedServicesCheck'
      var data: { Services: Array<string> } = {
        Services: services
      }
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get a list of CityworksOnline sites for this user
     *
     * @param {string} [login] - Login Name to use when checking. Defaults to previously-stored login name.
     * @param {string} [password] - Password to use when checking. Defaults to previously-stored password.
     * @return {Object} Returns Promise object that represents an array of cityworks online sites available to this user.
     */
  cityworksOnlineSites(login?: string, password?: string) {
    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/CityworksOnlineSites'
      var data = {
        LoginName: (typeof(login)!='undefined') ? login: this.login,
        Password:  (typeof(password)!='undefined') ? password : this.password
      }
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get a list of Domains (not tld, but organizations) in the currently-connected Cityworks install
     *
     * @return {Object} Returns Promise object that represents a collection of the configured domains.
     */
  domains() {
    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/Domains'
      var data = {}
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get a list of Domains (not tld, but organizations) in the currently-connected Cityworks install
     *
     * @param {string} [login] - Optional login name to get user information for. Defaults to currently-set user name used for login.
     * @return {Object} Returns Promise object that represents an Object with the user information
     */
  user(login?: string) {
    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/User'
      let data = { LoginName: (typeof(login)!='undefined') ? login: this.login }
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }

  /**
     * Get the software version number of the currently-connected Cityworks install
     *
     * @return {Object} Returns Promise object that represents a string of the version number
     */
  version() {
    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/Version'
      var data = {}
      this.runRequest(path, data).then((response: any) => {
        resolve(response.Value)
      })
    })
  }
}

const cw = new Cityworks()

/**
 * Memoize a factory so each module is built once, the first time it is used
 */
function once<T>(factory: () => T): () => T {
  let instance: T | undefined
  let built = false
  return () => {
    if(!built) {
      instance = factory()
      built = true
    }
    return instance as T
  }
}

/**
 * Stand-in for a module instance which builds the real instance on first use. All access is forwarded to the real instance,
 * so `cw.request.create(...)` behaves exactly as if `request` had been built up front.
 */
function lazy<T extends object>(name: string, build: () => T): T {
  const get = () => {
    if(!cw.isLoaded(name)) {
      throw new CWError(16, 'The "' + name + '" module is not loaded. It was left out of the load list given to Cityworks.configure().', {'module': name})
    }
    return build()
  }
  return new Proxy({} as T, {
    get: (_t, prop) => Reflect.get(get(), prop, get()),
    set: (_t, prop, value) => Reflect.set(get(), prop, value, get()),
    has: (_t, prop) => Reflect.has(get(), prop),
    deleteProperty: (_t, prop) => Reflect.deleteProperty(get(), prop),
    ownKeys: () => Reflect.ownKeys(get()),
    getOwnPropertyDescriptor: (_t, prop) => {
      const d = Reflect.getOwnPropertyDescriptor(get(), prop)
      if(d) d.configurable = true
      return d
    },
    getPrototypeOf: () => Reflect.getPrototypeOf(get())
  })
}

const modules = {
  general: once(() => new General(cw)),
  activity_link: once(() => new ActivityLinks(cw)),
  message_queue: once(() => new MessageQueue(cw)),
  search: once(() => new Search(cw)),
  query: once(() => new Query(cw)),
  gis: once(() => new Gis(cw)),
  request: once(() => {
    const request = new Request(cw)
    request.customerCall = new CustomerCall(cw)
    return request
  }),
  inspection: once(() => new Inspection(cw)),
  workorder: once(() => new WorkOrder(cw)),
  briefcase: once(() => new Briefcase(cw)),
  report: once(() => new Report(cw, modules.inspection(), modules.workorder(), modules.request(), modules.briefcase())),
  employee: once(() => new Employee(cw)),
  equipment: once(() => new Equipment(cw)),
  contractor: once(() => new Contractor(cw)),
  recent_activity: once(() => new RecentActivity(cw)),
  general_admin: once(() => new GeneralAdmin(cw))
}

// Each module is only constructed when first touched, e.g. `request.create(...)`.
const general = lazy('general', modules.general)
const activity_link = lazy('activity_link', modules.activity_link)
const message_queue = lazy('message_queue', modules.message_queue)
const search = lazy('search', modules.search)
const query = lazy('query', modules.query)
const gis = lazy('gis', modules.gis)
const request = lazy('request', modules.request)
const inspection = lazy('inspection', modules.inspection)
const workorder = lazy('workorder', modules.workorder)
const briefcase = lazy('case', modules.briefcase)
const report = lazy('report', modules.report)
const employee = lazy('employee', modules.employee)
const equipment = lazy('equipment', modules.equipment)
const contractor = lazy('contractor', modules.contractor)
const recent_activity = lazy('recent_activity', modules.recent_activity)
const general_admin = lazy('general_admin', modules.general_admin)

Object.defineProperty(cw, 'contractor', {get: () => contractor, configurable: true, enumerable: true})

export { CWError, cw as Cityworks, general, activity_link, message_queue, search, query, gis, request, inspection, workorder, briefcase, report, employee, equipment, contractor, recent_activity, general_admin }
export type { CWErrorCategory, CWErrorOptions, CWErrorMsgs, CWErrorInt } from './error'
