# Cityworks node.js API wrapper

This API wrapper for Cityworks follows the Cityworks release schedule as closely as possible. Functionality may be missing depending on necessity or use.

Require the class:

      const cw = require('cityworks')

or

      import * as cw from 'cityworks'

Instantiate the Class for the instance of Cityworks available given a domain:

      cw.Cityworks.configure('cwoffice.domain.tld', {path: 'cityworks', version: 15})

or 

      cw.Cityworks.configure('cw.domain.tld', {path: 'cityworks', version: 23});


## Authentication

Authenticate with the Cityworks install:

      cw.Cityworks.authenticate('myuser', 'mypassword').then(resp => {}).catch(error => {
        console.log(error.message)
      })

Get the currently valid token in order to store it in a session or cookie:

      cw.Cityworks.getToken()

Provide a saved token instead of the standard u/p auth:

      cw.Cityworks.setToken('mytoken')

## Errors

The package exports `CWError`, which extends `Error`. Existing `Name`, `Code`, `Message`, `Error_messages`, and JSON-string `Info` fields remain available. Standard `message` and `stack` are also available, and `Message` stays in sync with `message`.

`error.category` distinguishes `validation`, `api`, `network`, `http`, `response`, and `operation` errors where the origin is known; otherwise it is `unknown`. A wrapped error may include `cause`, `servicePath`, and `statusCode`. Codes are not globally unique, so use the category as well as `Code` when handling errors.

`Info` may contain request or response data; treat it as sensitive. Circular references and big integers are represented as strings so the rest of the information remains readable.

## Main method calls

For custom endpoints, TypeScript callers can opt into `Cityworks.runRequest<T>(path, data)`, where `T` is the response's `Value` type. Its result is `CityworksResponse<T> | true | string`: an API envelope, `true` for a successful response without `Value`, or a download string. Narrow the result before accessing `Value`:

```typescript
const result = await cw.Cityworks.runRequest<{RequestId: number}>('Ams/ServiceRequest/ById', {RequestId: 123})
if(typeof result === 'object' && result.Value) {
  console.log(result.Value.RequestId)
}
```

Calls without a type argument retain their legacy untyped return for compatibility. JSON responses are checked for an object envelope with an integer `Status` and an optional string or null `Message`; malformed envelopes reject with `CWError`. The supplied `T` describes `Value` but does not validate it at runtime.

Access the primary AMS ([Inspection](https://walker.github.io/cityworks/classes/inspection.Inspection.html), [WorkOrder](https://walker.github.io/cityworks/classes/workorder.WorkOrder.html), & [Service Request](https://walker.github.io/cityworks/classes/request.Request.html)) & [PLL](https://walker.github.io/cityworks/classes/case.Briefcase.html) object libraries like so:

      cw.inspection.methodHere().then(resp => {})
      cw.workorder.methodHere().then(resp => {})
      cw.request.methodHere().then(resp => {})
      cw.briefcase.methodHere().then(resp => {})

Some of the methods are general or top-level, and so, are accessed separately are at the same level of reference from the cityworks object:

[General methods](https://walker.github.io/cityworks/classes/general.General.html) including authentication:

      cw.general.methodHere().then(resp => {})

[Message queue](https://walker.github.io/cityworks/classes/message_queue.MessageQueue.html) methods for examining, processing, and troubleshooting webhooks and activity events:

      cw.message_queue.methodHere().then(resp => {})

[Activity link](https://walker.github.io/cityworks/classes/activity_link.ActivityLinks.html) for linking one node/object to another:

      cw.activity_link.methodHere().then(resp => {})

[Mapping and GIS methods](https://walker.github.io/cityworks/classes/gis.Gis.html) not specific to a single object type:

      cw.gis.methodHere().then(resp => {})

[General query methods](https://walker.github.io/cityworks/classes/query.Query.html):

      cw.query.methodHere().then(resp => {})

`query.run` returns a paged object with `Results`, `Page`, `HasMore` and `TotalRecordCount`. It accepts query text or a saved query's `Id`; use `PageSize` to limit each page. `query.getSaved` forwards its mobile-visibility filter to Cityworks; verify the filter's results on your instance, as they may not match the returned visibility flags.

For a saved service-request query, append a complete expression, bind `$` variables, and select response fields:

      cw.query.run(savedQueryId, {
        QueryValue: 'ServiceRequest(RequestId = $target)',
        Variables: {target: 123},
        ResponseFields: {RequestId: true, Status: true},
        PageSize: 1
      })

Use `query.validateResponseDefinition('Service Request', {RequestId: true, Status: true})` to check response fields. Invalid field names are returned as validation errors and can otherwise yield empty result objects.

[(Deprecated) General search methods](https://walker.github.io/cityworks/classes/search.Search.html):

      cw.search.methodHere().then(resp => {})

## Case financials, data details, and admin

For the sake of organizing some of the other methods needed by the primary and secondary libraries, there are also objects and methods accessed within those main libraries:

For [PLL case financial actions](https://walker.github.io/cityworks/classes/case_financial.CaseFinancial.html):

      cw.briefcase.financial.methodHere().then(resp => {})

For [PLL case data details & data groups](https://walker.github.io/cityworks/classes/case_data.CaseData.html):

      cw.briefcase.data.methodHere().then(resp => {})

For PLL case [workflow and task actions](https://walker.github.io/cityworks/classes/case_workflow.CaseWorkflow.html):

      cw.briefcase.workflow.methodHere().then(resp => {})

For [PLL administration actions](https://walker.github.io/cityworks/classes/case_admin.CaseAdmin.html):

      cw.briefcase.admin.methodHere().then(resp => {})

## Commenting

For any object in Cityworks which can be commented on, use the [Comments class](https://walker.github.io/cityworks/classes/comments.Comments.html) via the class the comment is to be made on:

      cw.briefcase.comment.add(CaObjectIdGoesHere, "Comment goes here").then(resp => {})

      cw.workorder.comment.add(WorkOrderSIDGoesHere, "Comment goes here").then(resp => {})

      cw.request.comment.add(RequestIDGoesHere, "Comment goes here").then(resp => {})

Case comments are private unless you decide otherwise: pass `true` as the last argument (`cw.briefcase.comment.add(CaObjectIdGoesHere, "Comment", true)`) to make one public. If the connected account is a non-employee (public access) user, configure it with `{publicUser: true}` and case comments default to public instead (a `false` argument still makes one private). Updating never changes visibility by accident: `comment.update(id, text, {activitySid: CaObjectId})` looks up the comment's current visibility and keeps it (a public comment stays public), `update(id, text, false)` makes it private on purpose, and a case comment update with neither is rejected.

## Customer calls (callers)

Customer calls belong to an existing service request. The [CustomerCall class](https://walker.github.io/cityworks/classes/customer_call.CustomerCall.html) is a subclass of `Request`, available as `cw.request.customerCall`:

      cw.request.customerCall.addToRequest(RequestIDGoesHere, {FirstName: 'Pat', LastName: 'Smith', HomePhone: '555-0100'}).then(resp => {})

      cw.request.customerCall.getByRequestId(RequestIDGoesHere).then(resp => {})

      cw.request.customerCall.updateCall(IncidentNumGoesHere, {Email: 'pat@example.com'}).then(resp => {})

You can also pass customer call data straight through `request.create` and `request.update`. The resolved request gets a `CustomerCalls` array:

      cw.request.create({ProblemSid: 309}, {FirstName: 'Pat', LastName: 'Smith'}).then(sr => { sr.CustomerCalls })

      // A call with an IncidentNum updates that call; without one, an existing call on the request with a matching phone number or email is updated; otherwise a new call is added
      cw.request.update({RequestId: 123, Description: 'More info'}, [{IncidentNum: 456, Email: 'pat@example.com'}, {FirstName: 'Lee'}])

      // The same caller phones in again: create a NEW customer call, never updating their previous one
      cw.request.update({RequestId: 123}, {FirstName: 'Pat', LastName: 'Smith', Comments: 'Called again'}, {newCall: true})

`{newCall: true}` ignores any IncidentNum and phone/email matching (e.g. when you copied data from a previous call). Note any `DateTimeCall` you copy over will be sent as well.

## Attachments

For any object in Cityworks which has attachments, (including cases as CaRelDocs), use the [Attachments class](https://walker.github.io/cityworks/modules/attachments.html) via the class the attachment is to be made on:

      cw.briefcase.attachments.add(CaObjectIdGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.workorder.attachments.add(WorkOrderSIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.request.attachments.add(RequestIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.inspection.attachments.add(InspectionIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

Multipart uploads use the same authentication token as other requests and reject Cityworks error statuses. AMS attachment uploads return a record with `Id`; case uploads return an array of related documents with `ReldocsId`. Case `attachments.download(id)` requests the original file; pass `true` as the second argument to request its thumbnail.

AMS attachment updates resolve the owning `RequestId`, `InspectionId`, or `WorkOrderSid` through attachment metadata before sending the update; the live API requires the parent identifier. Existing `attachments.update(attachmentId, title, description)` calls do not change.

Work-order deletion sends `WorkOrderSids`: pass numeric SIDs directly, or displayed IDs as strings to resolve them to SIDs first. Mixed numeric/string arrays and unresolved displayed IDs are rejected before deletion. The live API silently ignores `WorkOrderIds` on this endpoint.

## Build and tests

`npm run build` produces Node.js CommonJS and ES module bundles. The package does not provide a browser UMD bundle.

`npm test` / `npm run fulltest` run the mocked test suite: no Cityworks instance or network is needed.

### Live contract check

The mocked tests assume how the Cityworks API behaves (service paths, request parameters, the type of each response). To find out where a real instance disagrees:

1. Put `cwdomain`, `cwpath`, `cwversion`, `cwlogin` and `cwpassword` in `.env`.
2. `npm run contracts` re-records `live/contracts.json` from the mocked tests (every request a wrapper made and the response type the test expected). Commit it when wrappers or tests change.
3. `npm run test:live` replays the recorded **read-only** requests against your instance and reports where it differs: endpoints that don't exist or aren't permitted, and responses whose type differs from the mocked one (mocked keys missing from the live response are noted, or fail with `CW_LIVE_STRICT_KEYS=1`). A summary is also written to `live/report.json`.

To check comments end to end (service requests, work orders, cases) through the wrapper itself, designate records and run `npm run test:live:comments`:

    CW_LIVE_COMMENTS='{"request":123,"workorder":456,"case":789}' npm run test:live:comments

Reading comments is always safe. Add `CW_LIVE_COMMENT_WRITE=1` to also add and edit a labelled comment on each designated record (comments can't be deleted through the wrapper, so use scratch records). Inspections don't support comments in the wrapper yet; the check reports that.

To verify multipart attachment uploads, designate records and explicitly enable writes:

    CW_LIVE_ATTACHMENTS='{"request":123,"workorder":456,"inspection":789,"case":101}' CW_LIVE_ATTACHMENT_WRITE=1 npm run test:live:attachments

This uploads a uniquely labelled text file to each designated record, checks listing and download contents, and prints the created attachment IDs. Attachments are retained; only the temporary local file is removed. Omit record types you do not want to test.

To recheck an existing test upload without creating more attachments, set `CW_LIVE_ATTACHMENT_FILENAME` to the printed test filename instead of enabling writes.

For service-request writes, explicitly enable a scratch-request run:

    CW_LIVE_REQUEST_WRITE=1 CW_LIVE_REQUEST_SOURCE_ID=123 CW_LIVE_REQUEST_ALTERNATE_PROBLEM=309 CW_LIVE_REQUEST_ALTERNATE_CATEGORY=10 CW_LIVE_REQUEST_CLOSE_PROBLEM=347 npm run test:live:requests

The source request is read only. Supply an active alternate problem in the same domain, a different valid custom-field category, and an active close-test problem without incomplete required fields. The suite creates labelled scratch requests and verifies core writes, caller matching and movement, comments, and attachment writes by reading back persisted data. Closure temporarily uses the close-test problem, then restores the original problem and category. The main request and its test records are retained; deletion tests use disposable records. Permission-denied request deletion is explicitly reported as blocked.

Set `CW_LIVE_REQUEST_ID` to reuse a labelled scratch request. Targeted retries can also specify `CW_LIVE_CALL_ID`, `CW_LIVE_ATTACHMENT_ID`, and `CW_LIVE_REQUEST_DISPOSABLE_ID`; ownership and scratch labels are checked before use. Costs and saved-search writes are not included.

For inspection and work-order writes, explicitly enable a scratch-activity run:

    CW_LIVE_ACTIVITY_WRITE=1 CW_LIVE_INSPECTION_SOURCE_ID=161455 CW_LIVE_WORKORDER_SOURCE_SID=105879 CW_LIVE_INSPECTION_TEMPLATE_ID=11 CW_LIVE_WORKORDER_TEMPLATE_ID=56 npm run test:live:activities

Source records stay read only. Select live templates for the source inspection's entity type and each source's domain, with creation rights and no asset required for closure. The values above are staging fixtures, not portable defaults. The suite verifies create, editable-field update, projected movement, cancel/uncancel, close/reopen, attachment upload/update/download/delete, and private work-order comment add/update through persisted readbacks. Work-order `Description` is template-derived on the verified API; the update test uses editable `Resolution` instead.

Work orders default to the source inspection's entity type. Set `CW_LIVE_WORKORDER_ENTITY_TYPE` when the selected work-order template supports a different type; it is validated against the live template list. For a targeted staging close/reopen check using template 279:

    CW_LIVE_ACTIVITY_WRITE=1 CW_LIVE_INSPECTION_SOURCE_ID=161455 CW_LIVE_WORKORDER_SOURCE_SID=105879 CW_LIVE_INSPECTION_TEMPLATE_ID=11 CW_LIVE_WORKORDER_TEMPLATE_ID=279 CW_LIVE_WORKORDER_ENTITY_TYPE='PROPOSED SPEED CONTROLS' npm run test:live:activities -- --grep 'workorder.*closes and reopens'

This creates a new retained scratch work order unless `CW_LIVE_WORKORDER_SID` identifies a labelled, open scratch record using the selected template. It does not change an existing work order's template.

Main scratch records, comments, and attachments are retained without automatic cleanup. Explicit record-deletion tests use separate labelled disposable records. Permission-denied deletion is reported as blocked; work-order closure and consequent reopening are reported as blocked when live validation requires completed tasks or required custom fields. A pending test is not a successful write verification.

Use `CW_LIVE_INSPECTION_ID` and `CW_LIVE_WORKORDER_SID` to reuse labelled main scratch records. Retries can also set `CW_LIVE_INSPECTION_DISPOSABLE_ID`, `CW_LIVE_WORKORDER_DISPOSABLE_SID`, `CW_LIVE_INSPECTION_ATTACHMENT_ID`, `CW_LIVE_WORKORDER_ATTACHMENT_ID`, and `CW_LIVE_WORKORDER_COMMENT_ID`; scratch labels and ownership are checked before writing. Work orders use SIDs where supported; move/cancel/uncancel/close/reopen use the displayed ID resolved from the scratch record. Costs, saved searches, admin configuration changes, asset writes, tasks, and work-order combination are excluded.

For populated, read-only case checks (including case data, assets, people, flags, workflow and templates), designate a readable case:

    CW_LIVE_CASE_ID=123 npm run test:live:case

Checks requiring a data group or task are skipped when the chosen case has none. Some installations return `null` for a case with no attached assets or data groups.

To verify query metadata, filters and execution without modifying saved queries, designate an accessible saved query that runs without variables:

    CW_LIVE_QUERY_ID=123 npm run test:live:query

The check executes the saved query by ID and by text with a page size of one.
For a saved service-request query with at least one result, it also verifies variable substitution, appended conditions, and response fields using that result's ID.

Only read-only endpoints are replayed (the replay uses the mocked tests' dummy ids, so "not found" errors are expected and count as reachable). Anything that adds, updates, deletes or moves data is never called; those endpoints, and any it can't classify, are listed as skipped (add safe ones with `CW_LIVE_READONLY=path1,path2`). Some differences will be inaccurate mock data rather than API surprises, since the mocks were written without live responses.

The general live contract replay skips inspection creation. To verify the three creation relationships against staging, designate scratch parents and a compatible inspection template, then run:

    CW_LIVE_INSPECTION_WRITE=1 CW_LIVE_INSPECTION_RELATIONSHIPS='{"templateId":11,"entityType":"PARCELS","workOrderSid":123,"parentInspectionId":456,"requestId":789}' npm run test:live:inspection-links

This creates inspections and checks their activity links. It attempts to delete each inspection, and cancels and reports it if deletion fails. Parent links may remain on cancelled inspections, so use scratch records and review cleanup output.

## Activity Links

      cw.activity_link.add(source_type, source_sid, destination_type, destination_sid)
