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

## Activity Links

      cw.activity_link.add(source_type, source_sid, destination_type, destination_sid)

## Build

`npm run build` produces Node.js CommonJS and ES module bundles. The package does not provide a browser UMD bundle.
