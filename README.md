# Cityworks node.js API wrapper

This API wrapper for Cityworks follows the Cityworks release schedule as closely as possible. Functionality may be missing depending on necessity or use.

Require the class:

      const Cityworks = require('cityworks');

Instantiate the Class for the instance of Cityworks available given a domain:

      let cw = new Cityworks(CW_DOMAIN)

## Authentication

Authenticate with the Cityworks install:

      cw.authenticate('myuser', 'mypassword').then(resp => {

      }).catch(error => {
        console.log(error.message);
      });


Get the currently valid token in order to store it in a session or cookie:

      cityworks.getToken();

Provide a saved token instead of the standard u/p auth:

      cityworks.setToken('mytoken');

## Main method calls

Access the primary AMS ([Inspection](https://walker.github.io/cityworks/classes/inspection.Inspection.html), [WorkOrder](https://walker.github.io/cityworks/classes/workorder.WorkOrder.html), & [{Service} Request](https://walker.github.io/cityworks/classes/request.Request.html)) & [PLL](https://walker.github.io/cityworks/classes/case.Case.html) object libraries like so:

      cw.inspection.methodHere().then(resp => {

      })
      cw.workorder.methodHere().then(resp => {

      })
      cw.request.methodHere().then(resp => {

      })
      cw.case.methodHere().then(resp => {

      })

Some of the methods are general or top-level, and so, are accessed separately are at the same level of reference from the cityworks object:

[General methods](https://walker.github.io/cityworks/classes/general.General.html) including authentication:

      cw.general.methodHere().then(resp => {

      })

[Message queue](https://walker.github.io/cityworks/classes/message_queue.MessageQueue.html) methods for examining, processing, and troubleshooting webhooks and activity events:

      cw.message_queue.methodHere().then(resp => {

      })

[Activity link](https://walker.github.io/cityworks/classes/activity_link.ActivityLinks.html) for linking one node/object to another:

      cw.activity_link.methodHere().then(resp => {

      })

[Mapping and GIS methods](https://walker.github.io/cityworks/classes/gis.Gis.html) not specific to a single object type:

      cw.gis.methodHere().then(resp => {

      })

[General search methods](https://walker.github.io/cityworks/classes/search.Search.html):

      cityworks.search.methodHere().then(resp => {

      })

## Case finnacials, data details, and admin

For the sake of organizing some of the other methods needed by the primary and secondary libraries, there are also objects and methods accessed within those main libraries:

For [PLL case financial actions](https://walker.github.io/cityworks/classes/case_financial.CaseFinancial.html):

      cw.case.financial.methodHere().then(resp => {

      })

For [PLL case data details & data groups](https://walker.github.io/cityworks/classes/case_data.CaseData.html):

      cw.case.data.methodHere().then(resp => {

      })

For PLL case [workflow and task actions](https://walker.github.io/cityworks/classes/case_workflow.CaseWorkflow.html):

      cw.case.workflow.methodHere().then(resp => {

      })

For [PLL administration actions](https://walker.github.io/cityworks/classes/case_admin.CaseAdmin.html):

      cw.case.admin.methodHere().then(resp => {

      })

## Commenting

For any object in Cityworks which can be commented on, use the [Comments class](https://walker.github.io/cityworks/classes/case_admin.CaseAdmin.html) via the class the comment is to be made on:

      cw.case.comment.add(CaObjectIdGoesHere, "Comment goes here").then(resp => {

      })

      cw.workorder.comment.add(WorkOrderSIDGoesHere, "Comment goes here").then(resp => {

      })

      cw.request.comment.add(RequestIDGoesHere, "Comment goes here").then(resp => {

      })
