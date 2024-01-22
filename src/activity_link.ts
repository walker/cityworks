import { CWError } from './error'
import ReversibleMap from 'reversible-map'

/**
 * ActivityLink interface for ActivityLinks
 *
 */
export interface ActivityLink {
  linkTypes: ReversibleMap<string, number>
  activityTypes: ReversibleMap<string, number>
  cw: any
}

/**
 * ActivityLinks implements the activity link functions via using the ActivityLink interface
 *
 */
export class ActivityLinks implements ActivityLink {
  /**
   * Activity types to map string to number for internal use. Activity types available are: "null", "case", "inspection", "request", "workorder", "wipcase"
   */
  activityTypes: ReversibleMap<string, number>
  /**
   * Link types to map string to number for internal use. Link types available are: "null", "parent", "related"
   */
  linkTypes: ReversibleMap<string, number>
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.activityTypes = new ReversibleMap<string, number>()
    this.linkTypes = new ReversibleMap<string, number>()

    this.setActivityTypes();
    this.setLinkTypes();
  }

  private setActivityTypes(): void {
    const activityTypeMappings = ['null', 'case', 'inspection', 'request', 'workorder', 'wipcase'];

    activityTypeMappings.forEach((type, index) => {
      this.activityTypes.set(type, index);
    })
  }

  private setLinkTypes(): void {
    const linkTypeMappings = ['null', 'parent', 'related'];

    linkTypeMappings.forEach((type, index) => {
      this.linkTypes.set(type, index);
    });
  }

  private validateType(type: string, validTypes: ReversibleMap<string, number>, errorCode: number): void {
    if (!validTypes.has(type)) {
      throw new CWError(errorCode, `Activity type "${type}" not found.`, { provided: type, options: validTypes });
    }
  }

  private transformLinksData(response: any) {
    return response.Value.map(link => ({
      DestType: this.activityTypes.get(link.DestType),
      SourceType: this.activityTypes.get(link.SourceType),
      LinkType: this.linkTypes.get(link.LinkType),
      ...link,
    }));
  }

  private runRequest(path: string, data: any) {
    return this.cw.runRequest(path, data);
  }

  /**
   * Create a new activity link between two items.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
   * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options: "null", "parent", "related"
   * @return {Object} Returns Promise object that represents a
   */
  add(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type: string = 'related') {
    return new Promise((resolve, reject) => {
      this.validateType(source_type, this.activityTypes, 1);
      this.validateType(destination_type, this.activityTypes, 2);
      this.validateType(link_type, this.linkTypes, 3);


      let data = {
        SourceType: this.activityTypes.get(source_type),
        SourceSid: source_sid,
        DestType: this.activityTypes.get(destination_type),
        DestSid: destination_sid,
        LinkType: this.linkTypes.get(link_type)
      }
      let path = 'General/ActivityLink/Add';

      this.runRequest(path, data)
        .then((response: any) => resolve(response.Value))
        .catch(reject);
    })
  }

  /**
   * Get the links for a particular node type by ID.
   *
   * @param {string} type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {Array<number>} sids - Array of numeric (S)IDs you wish to get of the specified type
   * @return {Object} Returns Promise object that represents a collection
   */
  get(type: string, sids: Array<number>) {
    return new Promise((resolve, reject) => {
      this.validateType(type, this.activityTypes, 4);

      let data = {
        ActivityType: this.activityTypes.get(type),
        ActivitySids: sids
      };
      // let _this = this
      let path = 'General/ActivityLink/ByActivitySids';

      this.runRequest(path, data)
        .then((response: any) => resolve(this.transformLinksData(response)))
        .catch(reject);
    });
  }

  /**
   * Clone a current activity link.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to clone a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to clone a link between SID as destination and a particular source
   * @return {Object} Returns Promise object that represents a
   */
  clone(source_type: string, source_sid: number, destination_type: string, destination_sid: number) {
    return new Promise((resolve, reject) => {
      this.validateType(source_type, this.activityTypes, 5);
      this.validateType(destination_type, this.activityTypes, 6);

      let data = {
        SourceActivityType: this.activityTypes.get(source_type),
        SourceActivitySid: source_sid,
        DestinationActivityType: this.activityTypes.get(destination_type),
        DestinationActivitySid: destination_sid
      }
      let path = 'General/ActivityLink/CloneByActivitySid';

      this.runRequest(path, data)
        .then((response: any) => resolve(response.Value))
        .catch(reject)
    })
  }

  /**
   * Delete an activity link by ID
   *
   * @param {number} activity_link_id - The ID of the activity link one wishes to delete
   * @return {Object} Returns Promise object that represents a
   */
  delete(activity_link_id: number) {
    return new Promise((resolve, reject) => {
      let data = {
        ActivityLinkId: activity_link_id
      }
      let path = 'General/ActivityLink/Delete'

      this.runRequest(path, data)
        .then((response: any) => resolve(response))
        .catch(reject(false))
    })
  }

  /**
   * Remove a link by specifying everything.
   *
   * @param {string} source_type - Source type as string. Options: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} source_sid - Source SID (numeric ID) one wishes to remove a link between SID as source and a particular destination
   * @param {string} destination_type - Destination type as string: "null", "case", "inspection", "request", "workorder", "wipcase"
   * @param {number} destination_sid - Destination SID (numeric ID) one wishes to remove a link between SID as destination and a particular source
   * @param {string} link_type - The type of link which exists between provided source and destination. Defaults to `related`. Options: "null", "parent", "related"
   * @return {Object} Returns Promise object that represents a
   */
  remove(source_type: string, source_sid: number, destination_type: string, destination_sid: number, link_type: string = 'related') {
    return new Promise((resolve, reject) => {
      this.validateType(source_type, this.activityTypes, 8);
      this.validateType(destination_type, this.activityTypes, 9);
      this.validateType(link_type, this.linkTypes, 10);

      let data = {
        SourceType: this.activityTypes.get(source_type),
        SourceSid: source_sid,
        DestType: this.activityTypes.get(destination_type),
        DestSid: destination_sid,
        LinkType: this.linkTypes.get(link_type)
      }
      let path = 'General/ActivityLink/Remove';

      this.runRequest(path, data)
        .then((response: any) => resolve(response))
        .catch(reject(false))
    })
  }
}
