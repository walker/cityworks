## Tests

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