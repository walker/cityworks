/**
 * The parts of the Cityworks client that the modules (Request, WorkOrder, Briefcase, ...) rely on
 */
export interface CityworksClient {
  /**
   * Send a request to the Cityworks API
   */
  runRequest(service_path: string, post_data?: unknown, post_file?: string): Promise<any>
  runRequest<T>(service_path: string, post_data?: unknown, post_file?: string): Promise<CityworksRequestResult<T>>
  /**
   * The configured Cityworks version
   */
  v(): number
  /**
   * The absolute URL of the configured Cityworks install, e.g. https://cw.domain.tld/cityworks
   */
  getBaseUrl(): string
  /**
   * The currently-set token, or false if none
   */
  getToken(): string | false | undefined
  /**
   * Whether the account is a non-employee (public access) user
   */
  isPublicUser(): boolean
}

export interface CityworksResponse<T = unknown> {
  Status: number
  Message?: string | null
  Value?: T
  ErrorMessages?: unknown
  [key: string]: unknown
}

export type CityworksRequestResult<T = unknown> = CityworksResponse<T> | true | string

export function isCityworksResponse(value: unknown): value is CityworksResponse {
  if(typeof value !== 'object' || value === null || Array.isArray(value)) return false
  return 'Status' in value && typeof value.Status === 'number' && Number.isInteger(value.Status)
    && (!('Message' in value) || value.Message === null || typeof value.Message === 'string')
}
