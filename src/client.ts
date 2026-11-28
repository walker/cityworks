/**
 * The parts of the Cityworks client that the modules (Request, WorkOrder, Briefcase, ...) rely on
 */
export interface CityworksClient {
  /**
   * Send a request to the Cityworks API
   */
  runRequest(service_path: string, post_data?: any, post_file?: string): Promise<any>
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
