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

## Main method calls

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

      cw.briefcase.attachment.add(CaObjectIdGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.workorder.attachment.add(WorkOrderSIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.request.attachment.add(RequestIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})

      cw.inspection.attachment.add(InspectionIDGoesHere, path.join('uploads', 'filename.pdf')).then(resp => {})


## Tests

`npm test` / `npm run fulltest` run the mocked test suite: no Cityworks instance or network is needed.

### Live contract check

The mocked tests assume how the Cityworks API behaves (service paths, request parameters, the type of each response). To find out where a real instance disagrees:

1. Put `cwdomain`, `cwpath`, `cwversion`, `cwlogin` and `cwpassword` in `.env`.
2. `npm run contracts` re-records `live/contracts.json` from the mocked tests (every request a wrapper made and the response type the test expected). Commit it when wrappers or tests change.
3. `npm run test:live` replays the recorded **read-only** requests against your instance and reports where it differs: endpoints that don't exist or aren't permitted, and responses whose type differs from the mocked one (mocked keys missing from the live response are noted, or fail with `CW_LIVE_STRICT_KEYS=1`). A summary is also written to `live/report.json`.

Only read-only endpoints are replayed (the replay uses the mocked tests' dummy ids, so "not found" errors are expected and count as reachable). Anything that adds, updates, deletes or moves data is never called; those endpoints, and any it can't classify, are listed as skipped (add safe ones with `CW_LIVE_READONLY=path1,path2`). Some differences will be inaccurate mock data rather than API surprises, since the mocks were written without live responses.

## Activity Links

      cw.activity_link.add(source_type, source_sid, destination_type, destination_sid)
