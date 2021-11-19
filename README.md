# Cityworks node.js API wrapper

This API wrapper for Cityworks follows the Cityworks release schedule as closely as possible. Functionality may be missing depending on necessity or use.

Require the class:

      var cityworks = require('cityworks');

Configure the instance that is then available:

      cityworks.configure('my.cityworks.domain')

## Authentication

Authenticate with the Cityworks install:

      cityworks.authenticate('myuser', 'mypassword').then(resp => {

      }).catch(error => {
        console.log(error.message);
      });


Get the currently valid token in order to store it in a session or cookie:

      cityworks.getToken();

Provide a saved token instead of the standard u/p auth:

      cityworks.setToken('mytoken');

## Main method calls

Access the primary AMS ([Inspection](https://walker.github.io/cityworks/classes/inspection.Inspection.html), [WorkOrder](https://walker.github.io/cityworks/classes/workorder.WorkOrder.html), & [{Service} Request](https://walker.github.io/cityworks/classes/request.Request.html)) & [PLL](https://walker.github.io/cityworks/classes/case.Case.html) object libraries like so:

      cityworks.inspection.methodHere().then(resp => {

      })
      cityworks.workorder.methodHere().then(resp => {

      })
      cityworks.request.methodHere().then(resp => {

      })
      cityworks.case.methodHere().then(resp => {

      })

Some of the methods are general or top-level, and so, are accessed separately are at the same level of reference from the cityworks object:

[General methods](https://walker.github.io/cityworks/classes/general.General.html) including authentication:

      cityworks.general.methodHere().then(resp => {

      })

[Message queue](https://walker.github.io/cityworks/classes/message_queue.MessageQueue.html) methods for examining, processing, and troubleshooting webhooks and activity events:

      cityworks.message_queue.methodHere().then(resp => {

      })

[Activity link](https://walker.github.io/cityworks/classes/activity_link.ActivityLinks.html) for linking one node/object to another:

      cityworks.activity_link.methodHere().then(resp => {

      })

[Mapping and GIS methods](https://walker.github.io/cityworks/classes/gis.Gis.html) not specific to a single object type:

      cityworks.gis.methodHere().then(resp => {

      })

[General search methods](https://walker.github.io/cityworks/classes/search.Search.html):

      cityworks.search.methodHere().then(resp => {

      })

## Case finnacials, data details, and admin

For the sake of organizing some of the other methods needed by the primary and secondary libraries, there are also objects and methods accessed within those main libraries:

For [PLL case financial actions](https://walker.github.io/cityworks/classes/case_financial.CaseFinancial.html):

      cityworks.case.financial.methodHere().then(resp => {

      })

For [PLL case data details & data groups](https://walker.github.io/cityworks/classes/case_data.CaseData.html):

      cityworks.case.data.methodHere().then(resp => {

      })

For PLL case [workflow and task actions](https://walker.github.io/cityworks/classes/case_workflow.CaseWorkflow.html):

      cityworks.case.workflow.methodHere().then(resp => {

      })

For [PLL administration actions](https://walker.github.io/cityworks/classes/case_admin.CaseAdmin.html):

      cityworks.case.admin.methodHere().then(resp => {

      })

## Commenting

For any object in Cityworks which can be commented on, use the [Comments class](https://walker.github.io/cityworks/classes/case_admin.CaseAdmin.html) via the class the comment is to be made on:

      cityworks.case.comment.add(CaObjectIdGoesHere, "Comment goes here").then(resp => {

      })

      cityworks.workorder.comment.add(WorkOrderSIDGoesHere, "Comment goes here").then(resp => {

      })

      cityworks.request.comment.add(RequestIDGoesHere, "Comment goes here").then(resp => {

      })
