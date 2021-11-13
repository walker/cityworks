import { CWError } from './error'
import { General } from './general'
import { ActivityLinks } from './activity_link'
import { Gis } from './gis'
import { MessageQueue } from './message_queue'
import { Search } from './search'
import { Request } from './request'
import { Inspection } from './inspection'
import { WorkOrder } from './workorder'

import { Case } from './case'

const https = require('https')
const querystring = require('querystring')
const _ = require('lodash')

interface postData {
  data?: string
  token?: string
}

/**
 * Core interface Citywork which defines the access vars for many of the functions and the connection settings
 */
interface Citywork {
  base_url: any
  settings: Object
  login?: string
  password?: string
  Token?: string
  gisToken?: string
  gisTokenUrl?: string

  default_domain?: any

  general?: Object
  activity_link?: Object
  message_queue?: Object
  gis?: Object
  // case?: Object
  inspection?: Object
  workorder?: Object
  request?: Object

  case?: Object

  extensions: Object
  features: Object
}

/**
 * Core class Cityworks with most of the authentication and install capabilities functions
 */
module.exports = class Cityworks implements Citywork {
  /**
   * The domain of the cityworks install. Defaults to Cityworks Online
   */
  base_url: string
  /**
   * Stores the currently in use authentication token
   */
  Token?: string
  /**
   * Stores the login username
   */
  login?: string
  /**
   * Holds the login password
   */
  password?: string
  /**
   * Holds the GIS Token for GIS-based Authentication (Portal)
   */
  gisToken?: string
  /**
   * Holds the GIS Token URL for GIS-based Authentication (Portal)
   */
  gisTokenUrl?: string
  /**
   * Stores settings including path (defaults to "cityworks"), secure (defaults to true), expires (defaults to null - does not expire), default_domain
   */
  settings: {
    path: string,
    secure: boolean,
    expires: any,
    default_domain?: any
  }
  error?: Object
  general?: Object
  activity_link?: Object
  message_queue?: Object
  gis?: Object
  search?: Object
  request?: Object
  inspection?: Object
  workorder?: Object

  case?: Object

  extensions: Object
  features: Object
  potential_loads: Array<string>

  /**
     * Contructor for a new cityworks instance's object, allows one to optionally configure the domain and other settings right from the get-go
     * @param {string} [base_url] - The first color, in hexadecimal format.
     * @param {object} [settings] - The second color, in hexadecimal format.
     * @param {array} [load] - allows user to choose which modules to load and make available. Full availability array: ['general', 'activity_link', 'message_queue', 'gis', 'workorder', 'inspection', 'request', 'case']
     */
  constructor(base_url?: string, settings?: Object, load?: Array<string>) {
    this.base_url = 'cityworksonline'
    this.extensions = {"UnknownExtension": 0, "CwAnalytics": 1, "WebHooks": 2, "PLLPublicApp": 3, "ActivityUpdate": 4, "SingleSignOn": 5}
    this.features = {"UnknownFeature": 0, "ViewInspections": 1, "EditInspections": 2, "ViewServiceRequest": 3, "EditServiceRequest": 4, "ViewWorkOrder": 5, "EditWorkOrder": 6, "EquipmentCheckOut": 7, "OfficeField": 8, "Respond": 9, "Eurl": 10, "PaverInterface": 11, "Contracts": 12, "Storeroom": 13, "PLL": 14, "Cw4XL": 15, "TableEditor": 16, "CCTVInterface": 17, "MobileAndroid": 18, "MobileiOS": 19, "PerformanceBudgeting": 20, "Insights": 21, "RespondCase": 22, "RespondInspection": 23, "RespondServiceRequest": 24, "RespondTaskManager": 25, "RespondWorkOrder": 26, "Workload": 27, "OpX": 28, "TrimbleUnityMobile": 29, "TrimbleVegetationManager": 30}
    this.settings = {
      path: 'cityworks',
      secure: true,
      expires: null,
      default_domain: null
    }
    this.potential_loads = ['general', 'activity_link', 'message_queue', 'gis', 'search', 'request', 'case', 'case_financial']
    if(typeof(base_url)!='undefined') {
      this.configure(base_url, settings, load)
    }
  }

  /**
     * Configure a new cityworks instance's domain and other settings
     *
     * @param {string} [base_url] - The first color, in hexadecimal format.
     * @param {object} [settings] - The second color, in hexadecimal format.
     * @param {array} [load] - allows user to choose which modules to load and make available. Full availability array: ['general', 'activity_link', 'message_queue', 'gis', 'search', 'workorder', 'inspection', 'request', 'case']
     * @return {boolean} Returns true if successful, otherwise, throws error
     */
  configure(base_url?: string, settings?: Object, load?: Array<string>) {
    if(typeof base_url !== 'undefined') { this.base_url = base_url } else { this.base_url = 'cityworksonline' }
    this.settings = {
      path: 'cityworks',
      secure: true,
      expires: null,
      default_domain: null
    }

    if(typeof(settings)!='undefined') {
      _.forEach(settings, (v,k) => {
        if(typeof(this.settings[k])!='undefined') {this.settings[k] = v}
      })
    }

    if(typeof(load)=='undefined') {
      this.general = new General(this)
      this.activity_link = new ActivityLinks(this)
      this.message_queue = new MessageQueue(this)
      this.request = new Request(this)
      this.inspection = new Inspection(this)
      this.workorder = new WorkOrder(this)
      this.case = new Case(this)
    } else {
      let _this = this
      _.forEach(this.potential_loads, function(v) {
        switch(v) {
          case 'general':
            _this.general = new General(_this)
          break
          case 'activity_link':
            _this.activity_link = new ActivityLinks(_this)
          break
          case 'message_queue':
            _this.message_queue = new MessageQueue(_this)
          break
          case 'gis':
            _this.gis = new Gis(_this)
          break
          case 'search':
            _this.search = new Search(_this)
          break
          case 'request':
            _this.request = new Request(_this)
          break
          case 'case':
            _this.case = new Case(_this)
          break
          case 'inspection':
            _this.inspection = new Inspection(_this)
          break
          case 'workorder':
            _this.workorder = new WorkOrder(_this)
          break
        }
      })
    }
  }

  /**
     * Send a request to the Cityworks API
     *
     * If one ever needs to access or call an unimplemented API endpoint of a Cityworks install, one can call this method directly with the path and data payload:
     *
     * `cityworks.runRequest(path, data)`
     *
     * @param {string} path - The path to the particular endpoint
     * @param {Object} data - The data object to be sent to the Cityworks API
     * @return {Object} Returns Promise object that represents the json object returned from the Cityworks API
     */
  runRequest(path, data) {
    return new Promise((resolve, reject) => {
      let pd = {} as postData
      pd.data = JSON.stringify(data)

      if(typeof(this.Token) !== 'undefined' && this.Token != '' && path!='General/Authentication/CityworksOnlineAuthenticate' && path!='General/Authentication/Authenticate') {
        pd.token = this.Token
      }
      let obj: {
        Status: number,
        Message: string
      }
      let options = {
        hostname: this.base_url,
        port: 443,
        path: '/' + this.settings.path + '/services/' + path,
        method: 'POST',
        headers: {
           'Content-Type': 'application/x-www-form-urlencoded',
           'Content-Length': Buffer.byteLength(querystring.stringify(pd))
        },
        timeout: 10000000
      }

      let request = https.request(options, (response) => {
          let str=''
          response.on('error',function(e){
              console.log(e, 'Caught on error')
              reject(new CWError(13, "Unknown error.", e))
          })

          response.on('data',function(chunk){
              str+=chunk
          })

          response.on('end',function(){
            try {
              var test_str = JSON.stringify(str) + "[test string]"
              if(test_str.match(/\<h2\>Object\ moved\ to/)==null) {
                var obj=JSON.parse(str)
                // if(path=='General/ActivityNotification/UserWatching') {
                //   console.log(str, options, pd, obj)
                // }
                if(typeof(obj)=='undefined') {
                  // failed
                  reject(new CWError(10, 'No response received from Cityworks API.'))
                } else if(typeof(obj)!='undefined' && typeof(obj.Value)!='undefined') { // && typeof(response.Value.Token)!='undefined') {
                  // console.log(str, options, pd, obj)
                  resolve(obj)
                } else {
                  reject(new CWError(3, "Unknown error.", {options: options, postedData: pd, api_returned_string: obj}))
                }
              } else {
                reject(new CWError(1, "Error parsing JSON. Cityworks returned HTML.", {response: str}))
              }
            } catch (e) {
              if (e instanceof SyntaxError) {
                console.log('try/catch error on JSON')
                reject(new CWError(1, "Error parsing JSON.", {error: e}))
              } else {
                console.log('try/catch error on JSON')
                reject(new CWError(1, "Error parsing JSON."))
              }
            }
          })
      })
      request.write(querystring.stringify(pd))
      request.end()
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
      let data = { LoginName:login, Password:password }
      let path = 'General/Authentication/Authenticate'
      if(this.base_url == 'cityworksonline') {
        path = 'General/Authentication/CityworksOnlineAuthenticate'
      }
      this.runRequest(path, data).then((response: any) => {
        if(response.Status>0) {
          // failed
          reject(new CWError(10, response.Message))
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
        reject(error)
      })
    })
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
    if(typeof(expires)!='undefined') {
      expires = 1209600000
    }

    return new Promise((resolve, reject) => {
      let path = 'General/Authentication/AuthenticateGisToken'
      let data = { LoginName:this.login, GisToken: this.gisToken, GisTokenUrl: this.gisTokenUrl, Expires: expires}

      this.runRequest(path, data).then((response: any) => {
        if((typeof(response.Status)!='undefined' && response.Status>0)) {
          // failed
          // TODO: CWError here.
        } else if(typeof(response.Value)!='undefined' && typeof(response.Value.Token)!='undefined') {
          this.Token = response.Value.Token
          resolve(true)
        } else {
          // failed
          resolve(false)
        }
      }).catch(error => {
        throw error
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
      if(typeof(set)=='undefined') {
        let set = false
      }
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
        throw error
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
        throw error
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


 // export default new Cityworks() as cityworks