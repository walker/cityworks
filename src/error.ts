import _ from 'lodash'

export interface CWErrorMsgs {
  MessageType: number
  Code: number
  Service: string
  Name: string
  DebugDetails: string
  DisplayText: string
  InnerMessage: string|null
}

export type CWErrorCategory = 'api' | 'validation' | 'network' | 'http' | 'response' | 'operation' | 'unknown'

export interface CWErrorOptions {
  category?: CWErrorCategory
  cause?: unknown
  servicePath?: string
  statusCode?: number
}

export interface CWErrorInt {
  Name: string
  Code: number
  Message: string
  Error_messages?: Array<CWErrorMsgs>
  Info?: string
}

function serializationFailure(): string {
  return JSON.stringify({serializationError: 'Error details could not be serialized'})
}

function serializeInfo(info: unknown): string {
  const ancestors: object[] = []
  try {
    return JSON.stringify(info, function(this: object, _key, value) {
      if(typeof value === 'bigint') return value.toString()
      if(typeof value !== 'object' || value === null) return value
      while(ancestors.length && ancestors[ancestors.length - 1] !== this) ancestors.pop()
      if(ancestors.indexOf(value) !== -1) return '[Circular]'
      ancestors.push(value)
      return value
    }) || serializationFailure()
  } catch(e) {
    return serializationFailure()
  }
}

/**
 * Cityworks error with legacy fields and standard Error behavior.
 */
export class CWError extends Error implements CWErrorInt {
  Name: string
  Code: number
  Message!: string
  Error_messages: Array<CWErrorMsgs>
  Info?: string
  category: CWErrorCategory
  cause?: unknown
  servicePath?: string
  statusCode?: number

  static validation(code: number, message: string, info?: unknown): CWError {
    return new CWError(code, message, info, {category: 'validation'})
  }

  constructor(code: number, message: string, info?: unknown, options: CWErrorOptions = {}) {
    let apiMessage: unknown
    let errorMessages: unknown
    let inspectionFailed = false
    try {
      apiMessage = _.get(info, 'Message')
      errorMessages = _.get(info, 'ErrorMessages')
    } catch(e) {
      inspectionFailed = true
    }
    super(typeof apiMessage === 'string' ? apiMessage : message)
    Object.setPrototypeOf(this, new.target.prototype)
    this.name = 'CWError'
    this.Name = 'Cityworks Exception'
    this.Code = code
    Object.defineProperty(this, 'Message', {
      configurable: true,
      enumerable: true,
      get: () => this.message,
      set: (value: string) => { this.message = value }
    })
    this.Error_messages = []
    this.category = options.category || 'unknown'
    this.servicePath = options.servicePath
    this.statusCode = options.statusCode
    const cause = typeof options.cause !== 'undefined' ? options.cause : info instanceof Error ? info : undefined
    if(typeof cause !== 'undefined') {
      Object.defineProperty(this, 'cause', {value: cause, writable: true, configurable: true, enumerable: false})
    }

    if(typeof info !== 'undefined') {
      try {
        if(inspectionFailed) {
          this.Info = serializationFailure()
          return
        }
        let serializedInfo = info
        if(Array.isArray(errorMessages) || _.isPlainObject(errorMessages)) {
          const normalize = (entry: CWErrorMsgs) => {
            if(!entry || typeof entry !== 'object' || Array.isArray(entry)) return entry
            const copy = {...entry}
            if(typeof copy.Service === 'string') copy.Service = copy.Service.replace(/([a-z])([A-Z])/g, '$1 $2')
            if(typeof copy.Name === 'string') copy.Name = copy.Name.replace(/([a-z])([A-Z])/g, '$1 $2')
            this.Error_messages.push(copy)
            return copy
          }
          const normalized = Array.isArray(errorMessages) ? errorMessages.map(normalize) : _.mapValues(errorMessages, normalize)
          if(_.isPlainObject(info)) serializedInfo = _.assign({}, info, {ErrorMessages: normalized})
        }
        this.Info = serializeInfo(serializedInfo)
      } catch(e) {
        this.Error_messages = []
        this.Info = serializationFailure()
      }
    }
  }
}
