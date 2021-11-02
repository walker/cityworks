!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(require("reversible-map")):"function"==typeof define&&define.amd?define(["reversible-map"],t):t((e||self).reversibleMap)}(this,function(e){function t(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var n=t(e),i=function(e,t,n){this.name=void 0,this.code=void 0,this.message=void 0,this.info=void 0,this.name="Cityworks Exception",this.code=e,this.message=t,void 0!==n&&(this.info=JSON.stringify(n))},s=require("lodash"),o=function(){function e(e){this.cw=void 0,this.cw=e}var t=e.prototype;return t.notifications=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("General/ActivityNotification/User",{}).then(function(e){t(e.Value)})})},t.amIWatching=function(e,t){var n=this;return new Promise(function(s,o){var u={null:0,case:1,task:2};void 0===u[e]?o(new i(1,"Activity type provided does not exist.",{provided:e,potential_activities:u})):n.cw.runRequest("General/ActivityNotification/UserWatching",{ActivityType:u[e],ActivityId:t}).then(function(e){s(e.Value)}).catch(function(e){o(new i(2,"Unknown error."))})})},t.quickSearch=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("General/QuickSearch/QuickSearch",{QuickSearchText:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getActivityMetadataByIds=function(e,t){var n=this;return new Promise(function(o,u){var r=["INSPECTION","REQUEST","WORKORDER"];-1==s.indexOf(r,t)&&u(new i(2,"TableName provided does not exist or is mispelled.",{provided:t,available:r})),n.cw.runRequest("General/CwMetaData/ByTableNameSids",{Ids:e,TableName:t}).then(function(e){console.log(e),o(e.Value)}).catch(function(e){u(e)})})},t.getWOEntityCostSummary=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("General/CostSummary/WorkOrderEntity",{ObjectIds:e}).then(function(e){console.log(e),n(e.Value)}).catch(function(e){i(e)})})},t.searchWOEntityCostSummary=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("General/CostSummary/WorkOrderEntitySearch",{SearchId:e}).then(function(e){console.log(e),n(e.Value)}).catch(function(e){i(e)})})},e}(),u=require("lodash"),r=function(){function e(e){this.activityTypes=void 0,this.linkTypes=void 0,this.cw=void 0,this.cw=e,this.activityTypes=new n.default,this.activityTypes.set("null",0),this.activityTypes.set("case",1),this.activityTypes.set("inspection",2),this.activityTypes.set("request",3),this.activityTypes.set("workorder",4),this.activityTypes.set("wipcase",5),this.linkTypes=new n.default,this.linkTypes.set("null",0),this.linkTypes.set("parent",1),this.linkTypes.set("related",2)}var t=e.prototype;return t.add=function(e,t,n,s,o){var u=this;return void 0===o&&(o="related"),new Promise(function(r,c){u.activityTypes.has(e)||c(new i(1,"Source type not found.",{provided:e,options:u.activityTypes})),u.activityTypes.has(n)||c(new i(2,"Destination type not found.",{provided:n,options:u.activityTypes})),u.linkTypes.has(o)||c(new i(3,"Link type not found.",{provided:o,options:u.linkTypes}));var a={SourceType:u.activityTypes.get(e),SourceSid:t,DestType:u.activityTypes.get(n),DestSid:s,LinkType:u.linkTypes.get(o)};u.cw.runRequest("General/ActivityLink/Add",a).then(function(e){r(e.Value)})})},t.get=function(e,t){var n=this;return new Promise(function(s,o){n.activityTypes.has(e)||o(new i(4,"Activity type not found.",{provided:e,options:n.activityTypes}));var r={ActivityType:n.activityTypes.get(e),ActivitySids:t},c=n;n.cw.runRequest("General/ActivityLink/ByActivitySids",r).then(function(e){var t=new Array;u.forEach(e.Value,function(e,n){e.DestType=c.activityTypes.get(e.DestType),e.SourceType=c.activityTypes.get(e.SourceType),e.LinkType=c.linkTypes.get(e.LinkType),t.push(e)}),s(t)})})},t.clone=function(e,t,n,s){var o=this;return new Promise(function(u,r){o.activityTypes.has(e)||r(new i(1,"Source type not found.",{provided:e,options:o.activityTypes})),o.activityTypes.has(n)||r(new i(1,"Destination type not found.",{provided:n,options:o.activityTypes}));var c={SourceActivityType:o.activityTypes.get(e),SourceActivitySid:t,DestinationActivityType:o.activityTypes.get(n),DestinationActivitySid:s};o.cw.runRequest("General/ActivityLink/CloneByActivitySid",c).then(function(e){u(e.Value)})})},t.delete=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("General/ActivityLink/Delete",{ActivityLinkId:e}).then(function(e){n(e.Value)})})},t.remove=function(e,t,n,s,o){var u=this;return void 0===o&&(o="related"),new Promise(function(r,c){u.activityTypes.has(e)||c(new i(1,"Source type not found.",{provided:e,options:u.activityTypes})),u.activityTypes.has(n)||c(new i(1,"Destination type not found.",{provided:n,options:u.activityTypes})),u.linkTypes.has(o)||c(new i(1,"Link type not found.",{provided:o,options:u.linkTypes}));var a={SourceType:u.activityTypes.get(e),SourceSid:t,DestType:u.activityTypes.get(n),DestSid:s,LinkType:u.linkTypes.get(o)};u.cw.runRequest("General/ActivityLink/Remove",a).then(function(e){r(e.Value)})})},e}();require("lodash");var c=function(){function e(e){this.cw=void 0,this.cw=e}var t=e.prototype;return t.getConfig=function(e,t,n,i){var s=this;return new Promise(function(t,n){e=e.toLowerCase(),s.cw.runRequest("Gis/MapService/Domain",{}).then(function(e){t(e.Value)})})},t.domain=function(e,t){var n=this;return new Promise(function(e,t){n.cw.runRequest("Gis/MapService/Domain",{}).then(function(t){e(t.Value)})})},t.downloadMobile=function(e,t){var n=this;return new Promise(function(e,t){n.cw.runRequest("Gis/MapService/DownloadMobileMapCache",{}).then(function(t){e(t.Value)})})},t.initialExtent=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Gis/MapService/InitialExtent",{}).then(function(e){t(e.Value)})})},t.request=function(e,t){var n=this;return new Promise(function(e,t){n.cw.runRequest("Gis/MapService/ServiceRequestConfiguration",{}).then(function(t){e(t.Value)})})},t.inspection=function(e,t){var n=this;return new Promise(function(e,t){n.cw.runRequest("Gis/MapService/InspectionConfiguration",{}).then(function(t){e(t.Value)})})},t.workOrder=function(e,t){var n=this;return new Promise(function(e,t){n.cw.runRequest("Gis/MapService/WorkOrderConfiguration",{}).then(function(t){e(t.Value)})})},t.user=function(e,t,n,i){var s=this;return new Promise(function(e,t){s.cw.runRequest("Gis/MapService/User",{}).then(function(t){e(t.Value)})})},t.selectedEntities=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("General/AppData/SelectedEntities",{}).then(function(e){t(e.Value)})})},e}(),a=require("lodash"),d=function(){function e(e){this.cw=void 0,this.status=void 0,this.hook_types=void 0,this.cw=e,this.status={Pending:0,Processing:1,Complete:2,Failed:3},this.hook_types={Unknown:0,ActivityUpdate:1,Email:2,WebHook:3}}var t=e.prototype;return t.processMessages=function(e,t){var n=this;return void 0===t&&(t=!1),new Promise(function(i,s){n.cw.runRequest("General/WebHookEvent/ProcessMessages",{Ids:e,Delete:t}).then(function(e){})})},t.get=function(e,t,n){var s=this;return void 0===n&&(n=15),new Promise(function(o,u){void 0===s.status[t]&&u(new i(1,"Status provided does not exist or is mispelled.",{provided:t,available:s.status})),s.cw.runRequest("General/MessageQueue/ByIds",{Ids:e,MaxCount:void 0!==n?n:15,Status:s.status[t]}).then(function(e){})})},t.delete=function(e,t,n){var s=this;return new Promise(function(o,u){void 0===s.status[t]&&u(new i(2,"Status provided does not exist or is mispelled.",{provided:t,available:s.status})),s.cw.runRequest("General/MessageQueue/Delete",{Ids:e,Status:s.status[t],HoursToKeep:n}).then(function(e){})})},t.preferences=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("General/MessageQueue/Preferences",{}).then(function(e){})})},t.search=function(e,t){var n,s=this;return new Promise(function(o,u){void 0!==e.status&&void 0===s.status[e.status]?u(new i(3,"Status provided does not exist or is mispelled.",{provided:e.status,available:s.status})):void 0!==e.status&&void 0!==s.status[e.status]&&(n.Status=s.status[e.status]),void 0!==t&&(n.MaxResults=t);var r=["Id","HookId","HookType","Result","DateCreatedBegin","DateCreatedEnd","DateUpdatedBegin","DateUpdatedEnd"],c=["Status","MaxResults"];a.forEach(e,function(e,t){-1!=a.indexOf(r,t)&&-1==a.indexOf(c,t)?n[t]=e:-1==a.indexOf(c,t)&&u(new i(4,"Provided parameter does not exist or is mispelled.",{provided:t,value:e,available:a.concat(r,c)}))}),s.cw.runRequest("General/MessageQueue/Search",n).then(function(e){void 0===e.Value&&(e.Value=[]),o(e.Value)})})},t.update=function(e){var t,n=this;return new Promise(function(s,o){void 0!==e.status&&void 0===n.status[e.status]?o(new i(3,"Status provided does not exist or is mispelled.",{provided:e.status,available:n.status})):void 0!==e.status&&void 0!==n.status[e.status]&&(t.Status=n.status[e.status]),void 0!==e.hook_types&&void 0===n.hook_types[e.hook_types]?o(new i(3,"Status provided does not exist or is mispelled.",{provided:e.hook_types,available:n.hook_types})):void 0!==e.hook_types&&void 0!==n.hook_types[e.hook_types]&&(t.HookType=n.hook_types[e.hook_types]);var u=["Id","HookId","Packet","Result"],r=["Status","HookType"];a.forEach(e,function(e,n){-1!=a.indexOf(u,n)&&-1==a.indexOf(r,n)?t[n]=e:-1==a.indexOf(r,n)&&o(new i(5,"Provided parameter does not exist or is mispelled.",{provided:n,value:e,available:a.concat(u,r)}))}),n.cw.runRequest("General/MessageQueue/Update",t).then(function(e){void 0===e.Value&&(e.Value=[]),s(e.Value)})})},t.updateMessageStatus=function(e,t,n){var s=this;return new Promise(function(o,u){void 0===s.status[t]&&u(new i(2,"Status provided does not exist or is mispelled.",{provided:t,available:s.status})),s.cw.runRequest("General/MessageQueue/UpdateMessageStatus",{Ids:e,Status:s.status[t],HoursToKeep:n}).then(function(e){})})},t.getWebooks=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("General/MessageQueue/WebHooks",{HookIds:e}).then(function(e){})})},e}();require("lodash");var h=function(e){this.cw=void 0,this.cw=e},f=require("lodash"),l=function(){function e(e){this.cw=void 0,this.cw=e}var t=e.prototype;return t.create=function(e){var t=this;return new Promise(function(n,s){f.has(e,"ProblemSid")?t.cw.runRequest("Ams/ServiceRequest/Create",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(2,"ProblemSid must be provided.",{provided:e}))})},t.update=function(e){var t=this;return new Promise(function(n,s){f.has(e,"RequestId")?t.cw.runRequest("Ams/ServiceRequest/Update",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(3,"RequestId must be provided.",{provided:e}))})},t.changeProblem=function(e,t){var n=this;return new Promise(function(i,s){n.cw.runRequest("Ams/ServiceRequest/ChangeProblem",{RequestId:e,ProblemSid:t}).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.getById=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/ById",{RequestId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getByIds=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/ByIds",{RequestIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getAuditLog=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/AuditLog",{RequestId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getCustomFields=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/CustomFields",{RequestIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.changeCustomFieldCategory=function(e,t){var n=this;return new Promise(function(i,s){n.cw.runRequest("Ams/ServiceRequest/ChangeCustomFieldCategory",{RequestIds:e,CategoryId:t}).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.comment=function(e,t){var n=this;return new Promise(function(i,s){n.cw.runRequest("Ams/ServiceRequest/AddComments",{RequestId:e,Comments:t}).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.cancel=function(e,t,n){var i=this;return new Promise(function(s,o){var u={RequestIds:e};void 0!==t&&(u.CancelReason=t),void 0!==n&&(u.DateCancelled=n),i.cw.runRequest("Ams/ServiceRequest/Cancel",u).then(function(e){s(e.Value)}).catch(function(e){o(e)})})},t.uncancel=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/Uncancel",{RequestIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.close=function(e){var t=this;return new Promise(function(n,s){t.cw.runRequest("Ams/ServiceRequest/Close",{RequestIds:e}).then(function(e){e.Status>0?s(new i(5,e.Message,{response:e})):n(e.Value)}).catch(function(e){s(e)})})},t.reopen=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/Reopen",{RequestIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.delete=function(e){var t=this;return new Promise(function(n,s){t.cw.runRequest("Ams/ServiceRequest/Delete",{RequestIds:e}).then(function(e){e.Status>0?s(new i(4,e.Message,{response:e})):n(e.Value)}).catch(function(e){s(e)})})},t.search=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/Search",e).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.searchObject=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/SearchObject",{RequestId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.createSearchDefinition=function(e,t,n,i,s){var o=this;return void 0===i&&(i=!0),void 0===s&&(s=!0),new Promise(function(n,u){var r=e;f.isString(t)&&(f.set(r,"SearchName",t),f.set(r,"SaveDefinition",i),f.set(r,"EnableEurl",s)),o.cw.runRequest("Ams/ServiceRequest/CreateSearchDefinition",r).then(function(e){n(e.Value)}).catch(function(e){u(e)})})},t.getProblemNodes=function(e,t,n,i){var s=this;return void 0===t&&(t=!1),void 0===i&&(i=!1),new Promise(function(o,u){var r={DomainId:e,IncludeCancelled:i,ViewOnly:t};null!=n&&f.has(n,"DisplayTextMode")&&(f.set(r,"DisplayTextMode",f.get(n,"DisplayTextMode")),"CD"==f.get(n,"DisplayTextMode")&&f.has(n,"DisplayTextDelimeter")&&f.set(r,"DisplayTextDelimeter",f.get(n,"DisplayTextDelimeter"))),s.cw.runRequest("Ams/ServiceRequest/ProblemNodes",r).then(function(e){o(e.Value)}).catch(function(e){u(e)})})},t.getProblems=function(e,t,n){var i=this;return void 0===e&&(e=!1),void 0===t&&(t=!0),new Promise(function(s,o){var u={ForPublicOnly:e,OnlyActiveTemplates:t};void 0!==n&&f.set(u,"DomainIds",n),i.cw.runRequest("Ams/ServiceRequest/Problems",u).then(function(e){s(e.Value)}).catch(function(e){o(e)})})},t.getProblemsByKeywords=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/ProblemsByKeywords",{Keywords:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getPriorities=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/Priorities",{ProblemSids:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getCustomFieldTemplate=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/TemplateCustomFields",{ProblemSids:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getQASettings=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/QA",{ProblemSids:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getProblemLeaf=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/ProblemLeafBySid",{ProblemSid:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getStatuses=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/DefaultStatus",{DomainIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getDispatchTo=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/DispatchTo",{DomainId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getSubmitTo=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/SubmitTo",{DmainId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.streetCodes=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/ServiceRequest/AllStreetCode",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.getTemplatesById=function(e,t,n){var i=this;return new Promise(function(e,s){var o={ProblemSids:null};void 0!==t&&f.set(o,"MinimumDateModified",t),void 0!==n&&f.set(o,"MaximumDateModified",n),i.cw.runRequest("Ams/ServiceRequestTemplate/ByIds",o).then(function(t){e(t.Value)}).catch(function(e){s(e)})})},t.createTemplateSearchDefinition=function(e,t,n,i){var s=this;return void 0===i&&(i=!0),new Promise(function(n,o){var u=e;f.isString(t)&&(f.set(u,"SearchName",t),f.set(u,"SaveDefinition",i)),s.cw.runRequest("Ams/ServiceRequestTemplate/CreateSearchDefinition",u).then(function(e){n(e.Value)}).catch(function(e){o(e)})})},t.getTemplateQAs=function(e,t,n){var i=this;return new Promise(function(e,t){i.cw.runRequest("Ams/ServiceRequestTemplate/QA",{ProblemSids:null}).then(function(t){e(t.Value)}).catch(function(e){t(e)})})},t.searchTemplates=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequestTemplate/Search",e).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getTemplates=function(e,t,n,i,s){var o=this;return void 0===t&&(t=!1),void 0===n&&(n=!1),new Promise(function(u,r){var c={CanCreate:t,IncludeInactiveIf:n};void 0!==e&&f.set(c,"TemplateIds",e),void 0!==i&&f.set(c,"MinimumDateModified",i),void 0!==s&&f.set(c,"MaximumDateModified",s),o.cw.runRequest("Ams/ServiceRequestTemplate/Templates",c).then(function(e){u(e.Value)}).catch(function(e){r(e)})})},t.getWOTemplates=function(e,t){var n=this;return void 0===t&&(t=!1),new Promise(function(i,s){n.cw.runRequest("Ams/ServiceRequestTemplate/WorkOrderTemplates",{ProblemSids:e,IncludeInactive:t}).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},e}(),v=require("lodash"),p=function(){function e(e){this.cw=void 0,this.cw=e}var t=e.prototype;return t.create=function(e){var t=this;return new Promise(function(n,s){v.has(e,"EntityType")&&v.has(e,"InspTemplateId")?t.cw.runRequest("Ams/Inspection/Create",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"EntityType and InspTemplateId properties must be provided.",{provided:e}))})},t.createFromEntities=function(e){var t=this;return new Promise(function(n,s){v.has(e,"EntityType")&&v.has(e,"InspTemplateId")?t.cw.runRequest("Ams/Inspection/CreateFromEntities",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"EntityType and InspTemplateId properties must be provided.",{provided:e}))})},t.createFromParent=function(e){var t=this;return new Promise(function(n,s){v.has(e,"EntityType")&&v.has(e,"InspTemplateId")&&v.has(e,"InspectionId")?t.cw.runRequest("Ams/Inspection/CreateFromParent",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"EntityType and InspTemplateId properties must be provided.",{provided:e}))})},t.createFromServiceRequest=function(e){var t=this;return new Promise(function(n,s){v.has(e,"EntityType")&&v.has(e,"InspTemplateId")&&v.has(e,"RequestId")?t.cw.runRequest("Ams/Inspection/CreateFromServiceRequest",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"EntityType and InspTemplateId properties must be provided.",{provided:e}))})},t.createFromWorkOrder=function(e){var t=this;return new Promise(function(n,s){v.has(e,"EntityType")&&v.has(e,"InspTemplateId")&&v.has(e,"WorkOrderSid")?t.cw.runRequest("Ams/Inspection/CreateFromWorkOrder",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"EntityType and InspTemplateId properties must be provided.",{provided:e}))})},t.update=function(e){var t=this;return new Promise(function(n,s){return new Promise(function(n,s){v.has(e,"InspectionId")?t.cw.runRequest("Ams/Inspection/Update",e).then(function(e){n(e.Value)}).catch(function(e){s(e)}):s(new i(1,"InspectionId must be provided.",{provided:e}))})})},t.getById=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/ById",{InspectionId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getByIds=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/ByIds",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.cancel=function(e,t,n){var i=this;return new Promise(function(s,o){var u={InspectionIds:e};void 0!==t&&(u.CancelReason=t),void 0!==n&&(u.DateCancelled=n),i.cw.runRequest("Ams/Inspection/Cancel",u).then(function(e){s(e.Value)}).catch(function(e){o(e)})})},t.uncancel=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/Uncancel",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.close=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/Close",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.reopen=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/Reopen",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.delete=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/Delete",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.search=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/Search",e).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.searchObject=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/ServiceRequest/SearchObject",{InspectionId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.statuses=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/Inspection/Statuses",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.submitTos=function(e,t){var n=this;return void 0===e&&(e=!1),new Promise(function(i,s){var o={};e&&(o.IncludeInactiveEmployees=!0),void 0!==t&&(o.DomainIds=t),n.cw.runRequest("Ams/Inspection/SubmitTos",o).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.connectAsset=function(e,t,n,i){var s=this;return void 0===i&&(i={}),new Promise(function(n,o){var u={InspectionId:t};v.has(e,"EntityType")&&v.has(e,"EntityUid")?(u.EntityType=e.EntityType,u.EntityUid=e.EntityUid):v.has(e,"Entity")&&(u.Entity=e.Entity),v.has(i,"Facility_Id")&&(u.Facility_Id=i.Facility_Id),v.has(i,"Level_Id")&&(u.Level_Id=i.Level_Id),s.cw.runRequest("Ams/Inspection/AddEntity",u).then(function(e){n(e.Value)}).catch(function(e){o(e)})})},t.getAnswers=function(e){var t=this;return new Promise(function(n,i){var s={};0==e.length?s.InspectionId=e[0]:s.InspectionIds=e,t.cw.runRequest("Ams/Inspection/Answers",s).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getAuditLog=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Inspection/AuditLog",{InspectionId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.createSearchDefinition=function(e,t,n,i,s){var o=this;return void 0===i&&(i=!0),void 0===s&&(s=!0),new Promise(function(n,u){var r=e;v.isString(t)&&(v.set(r,"SearchName",t),v.set(r,"SaveDefinition",i),v.set(r,"EnableEurl",s)),o.cw.runRequest("Ams/Inspection/CreateSearchDefinition",r).then(function(e){n(e.Value)}).catch(function(e){u(e)})})},t.getCycleFrom=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/Inspection/CycleFrom",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.getCycleIntervals=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/Inspection/CycleIntervals",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.getCycleTypes=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/Inspection/CycleTypes",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.getDistricts=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Ams/Inspection/Districts",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.move=function(e,t,n,i,s){var o=this;return new Promise(function(u,r){var c={InspectionId:e,x:t,y:n};void 0!==s&&v.set(c,"z",s),void 0!==i&&(v.has(i,"WKID")?v.set(c,"WKID",v.get(i,"WKID")):v.has(i,"WKT")&&v.set(c,"WKT",v.get(i,"WKT")),v.has(i,"VcsWKID")&&v.set(c,"VcsWKID",v.get(i,"VcsWKID"))),o.cw.runRequest("Ams/Inspection/Move",{}).then(function(e){u(e.Value)}).catch(function(e){r(e)})})},t.getTemplates=function(e,t,n){var i=this;return new Promise(function(s,o){var u={};void 0!==e&&(u.EntityTypes=e),u.CanCreate=void 0===t||t,"object"==typeof n&&v.forIn(n,function(e,t){u[t]=e}),i.cw.runRequest("Ams/InspectionTemplate/Templates",u).then(function(e){s(e.Value)}).catch(function(e){o(e)})})},t.getTemplatesByIds=function(e,t){var n=this;return new Promise(function(i,s){var o={InspTemplateIds:e};"object"==typeof t&&v.forIn(t,function(e,t){o[t]=e}),n.cw.runRequest("Ams/InspectionTemplate/ByIds",o).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.getTemplateEntityTypes=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/InspectionTemplate/EntityTypes",{InspTemplateIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getQA=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/InspectionTemplate/QA",{InspTemplateIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getQConditions=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/InspectionTemplate/QuestionConditions",{InspTemplateIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.deleteAttachments=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Attachments/DeleteInspectionAttachments",{AttachmentIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.downloadAttachment=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Attachments/DownloadInspectionAttachment",{AttachmentId:e}).then(function(e){}).catch(function(e){i(e)})})},t.getAttachmentById=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Attachments/InspectionAttachmentById",{AttachmentId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.getAttachments=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Ams/Attachments/InspectionAttachments",{InspectionIds:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},e}();require("lodash");var m=function(e){this.cw=void 0,this.cw=e};require("lodash");var w=function(e){this.cw=void 0,this.cw=e},y=require("lodash"),q=function(){function e(e){this.cw=void 0,this.cw=e}var t=e.prototype;return t.addCaseFee=function(e,t,n){var i=this;return new Promise(function(n,s){i.cw.runRequest("Pll/CaseFees/Add",{CaObjectId:e,FeeSetupId:t}).then(function(e){n(e.Value)}).catch(function(e){s(e)})})},t.addDefaultCaseFees=function(e,t){var n=this;return new Promise(function(i,s){n.cw.runRequest("Pll/CaseFees/AddDefault",{CaObjectId:e,BusCaseId:t}).then(function(e){i(e.Value)}).catch(function(e){s(e)})})},t.getCaseFees=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Pll/CaseFees/ByCaObjectId",{CaObjectId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.deleteCaseFee=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Pll/CaseFees/Delete",{CaFeeId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.deleteCaseFeesByCAObjectId=function(e){var t=this;return new Promise(function(n,i){t.cw.runRequest("Pll/CaseFees/DeleteByCaObjectId",{CaObjectId:e}).then(function(e){n(e.Value)}).catch(function(e){i(e)})})},t.searchCaseFees=function(e,t,n,s){var o=this;return new Promise(function(u,r){void 0===e&&void 0===t&&void 0===n&&void 0===s&&r(new i(1,"At least one of the arguments (caFeeId, caObjectId, feeCode, feeDesc) must be defined."));var c={};void 0!==e&&y.set(c,"CaFeeId",e),void 0!==t&&y.set(c,"CaObjectId",t),void 0!==n&&y.set(c,"FeeCode",n),void 0!==s&&y.set(c,"FeeDesc",s),o.cw.runRequest("Pll/CaseFees/Search",c).then(function(e){u(e.Value)}).catch(function(e){r(e)})})},t.getAllFees=function(){var e=this;return new Promise(function(t,n){e.cw.runRequest("Pll/FeeSetup/All",{}).then(function(e){t(e.Value)}).catch(function(e){n(e)})})},t.searchFees=function(e,t,n,s,o){var u=this;return new Promise(function(r,c){void 0===e&&void 0===t&&void 0===n&&void 0===s&&void 0===o&&c(new i(1,"At least one of the arguments (caFeeId, caObjectId, feeCode, feeDesc) must be defined."));var a={};void 0!==e&&y.set(a,"FeeSetupId",e),void 0!==t&&y.set(a,"FeeTypeId",t),void 0!==n&&y.set(a,"FeeCode",n),void 0!==s&&y.set(a,"FeeDesc",s),void 0!==o&&y.set(a,"AccountCode",o),u.cw.runRequest("Pll/FeeSetup/Search",a).then(function(e){r(e.Value)}).catch(function(e){c(e)})})},e}();require("lodash");var I=function(e){this.cw=void 0,this.cw=e},R=require("https"),T=require("querystring"),g=require("lodash");module.exports=function(){function e(e,t,n){this.base_url=void 0,this.Token=void 0,this.login=void 0,this.password=void 0,this.gisToken=void 0,this.gisTokenUrl=void 0,this.settings=void 0,this.error=void 0,this.general=void 0,this.activity_link=void 0,this.message_queue=void 0,this.gis=void 0,this.search=void 0,this.request=void 0,this.inspection=void 0,this.case=void 0,this.case_data=void 0,this.case_workflow=void 0,this.case_financial=void 0,this.extensions=void 0,this.features=void 0,this.potential_loads=void 0,this.base_url="cityworksonline",this.extensions={UnknownExtension:0,CwAnalytics:1,WebHooks:2,PLLPublicApp:3,ActivityUpdate:4,SingleSignOn:5},this.features={UnknownFeature:0,ViewInspections:1,EditInspections:2,ViewServiceRequest:3,EditServiceRequest:4,ViewWorkOrder:5,EditWorkOrder:6,EquipmentCheckOut:7,OfficeField:8,Respond:9,Eurl:10,PaverInterface:11,Contracts:12,Storeroom:13,PLL:14,Cw4XL:15,TableEditor:16,CCTVInterface:17,MobileAndroid:18,MobileiOS:19,PerformanceBudgeting:20,Insights:21,RespondCase:22,RespondInspection:23,RespondServiceRequest:24,RespondTaskManager:25,RespondWorkOrder:26,Workload:27,OpX:28,TrimbleUnityMobile:29,TrimbleVegetationManager:30},this.settings={path:"cityworks",secure:!0,expires:null,default_domain:null},this.potential_loads=["general","activity_link","message_queue","gis","search","request","case","case_financial"],void 0!==e&&this.configure(e,t,n)}var t=e.prototype;return t.configure=function(e,t,n){var i=this;if(this.base_url=void 0!==e?e:"cityworksonline",this.settings={path:"cityworks",secure:!0,expires:null,default_domain:null},void 0!==t&&g.forEach(t,function(e,t){void 0!==i.settings[t]&&(i.settings[t]=e)}),void 0===n)this.general=new o(this),this.activity_link=new r(this),this.message_queue=new d(this),this.request=new l(this),this.inspection=new p(this),this.case=new m(this),this.case_data=new w(this),this.case_workflow=new I(this),this.case_financial=new q(this);else{var s=this;g.forEach(this.potential_loads,function(e){switch(e){case"general":s.general=new o(s);break;case"activity_link":s.activity_link=new r(s);break;case"message_queue":s.message_queue=new d(s);break;case"gis":s.gis=new c(s);break;case"search":s.search=new h(s);break;case"request":s.request=new l(s);break;case"case":s.case=new m(s);break;case"case_data":s.case_data=new w(s);break;case"case_workflow":s.case_workflow=new I(s);break;case"case_financial":s.case_financial=new q(s);break;case"inspection":s.inspection=new p(s)}})}},t.runRequest=function(e,t){var n=this;return new Promise(function(s,o){var u={};u.data=JSON.stringify(t),void 0!==n.Token&&""!=n.Token&&"General/Authentication/CityworksOnlineAuthenticate"!=e&&"General/Authentication/Authenticate"!=e&&(u.token=n.Token);var r={hostname:n.base_url,port:443,path:"/"+n.settings.path+"/services/"+e,method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded","Content-Length":Buffer.byteLength(T.stringify(u))},timeout:1e7},c=R.request(r,function(e){var t="";e.on("error",function(e){console.log(e,"Caught on error"),o(new i(13,"Unknown error.",e))}),e.on("data",function(e){t+=e}),e.on("end",function(){try{if(null==(JSON.stringify(t)+"[test string]").match(/\<h2\>Object\ moved\ to/)){var e=JSON.parse(t);void 0===e?o(new i(10,"No response received from Cityworks API.")):void 0!==e&&void 0!==e.Value?s(e):o(new i(3,"Unknown error.",{options:r,postedData:u,api_returned_string:e}))}else o(new i(1,"Error parsing JSON. Cityworks returned HTML.",{response:t}))}catch(e){e instanceof SyntaxError?(console.log("try/catch error on JSON"),o(new i(1,"Error parsing JSON.",{error:e}))):(console.log("try/catch error on JSON"),o(new i(1,"Error parsing JSON.")))}})});c.write(T.stringify(u)),c.end()})},t.authenticate=function(e,t){var n=this;return new Promise(function(s,o){var u="General/Authentication/Authenticate";"cityworksonline"==n.base_url&&(u="General/Authentication/CityworksOnlineAuthenticate"),n.runRequest(u,{LoginName:e,Password:t}).then(function(u){u.Status>0?o(new i(10,u.Message)):void 0!==u.Value&&void 0!==u.Value.Token?(n.login=e,n.password=t,n.Token=u.Value.Token,s(!0)):o(new i(11,"Unknown Error"))}).catch(function(e){o(e)})})},t.authenticateWithGISToken=function(e,t,n,i){var s=this;return this.login=e,this.gisToken=t,this.gisTokenUrl=n,void 0!==i&&(i=12096e5),new Promise(function(e,t){s.runRequest("General/Authentication/AuthenticateGisToken",{LoginName:s.login,GisToken:s.gisToken,GisTokenUrl:s.gisTokenUrl,Expires:i}).then(function(t){void 0!==t.Status&&t.Status>0||(void 0!==t.Value&&void 0!==t.Value.Token?(s.Token=t.Value.Token,e(!0)):e(!1))}).catch(function(e){throw e})})},t.validateToken=function(e,t){var n=this;return new Promise(function(i,s){n.runRequest("General/Authentication/Validate",{Token:e}).then(function(s){s.Status>0?i(!1):(t&&(n.Token=e),i(s.Value))}).catch(function(e){throw e})})},t.setToken=function(e){return""!=e&&null!=e&&(this.Token=e,!0)},t.getToken=function(){return""!=this.Token&&null!=this.Token&&this.Token},t.revokeToken=function(e){var t=this;return new Promise(function(n,i){t.runRequest("General/Token/RevokeUser",{RevokeDate:e}).then(function(e){n(!(void 0!==e.Status&&e.Status>0))}).catch(function(e){throw e})})},t.getLocalizationSettings=function(){var e=this;return new Promise(function(t,n){e.runRequest("General/Localization/LocalizationSettings",{}).then(function(e){t(e.Value)})})},t.getTimezoneOptions=function(){var e=this;return new Promise(function(t,n){e.runRequest("General/Localization/TimeZones",{}).then(function(e){t(e.Value)})})},t.getCurrentLocation=function(){var e=this;return new Promise(function(t,n){e.runRequest("General/AppData/CurrentLocation",{}).then(function(e){t(e.Value)})})},t.licensedApiCheck=function(e,t){var n=this;return new Promise(function(i,s){n.runRequest("General/AppData/SelectedEntities",{Area:e,Service:t}).then(function(e){i(e.Value)})})},t.licensedExtensionCheck=function(e){var t=this;return new Promise(function(n,s){void 0===t.extensions[e]&&s(new i(4,"Extension provided does not exist or is mispelled.",{provided:e,available:t.extensions})),t.runRequest("General/Authorization/LicensedExtensionCheck",{Extension:t.extensions[e]}).then(function(e){n(e.Value)})})},t.licensedExtensionsCheck=function(e){var t=this;return new Promise(function(n,s){var o={Extensions:[]};g.forEach(e,function(e){void 0===t.extensions[e]?s(new i(5,"Extension provided does not exist or is mispelled.",{provided:e,available:t.extensions})):o.Extensions.push(t.extensions[e])}),t.runRequest("General/Authorization/LicensedExtensionsCheck",o).then(function(e){var o={},u=g.invert(t.extensions);g.forEach(e,function(e,n){void 0===u[e]?s(new i(6,"Extension index provided does not exist or isn't configured properly.",{provided_num_returned:e,available:t.extensions})):o[u[e]]=n}),n(o)})})},t.licensedFeatureCheck=function(e){var t=this;return new Promise(function(n,s){void 0===t.features[e]&&s(new i(7,"Feature provided does not exist or is mispelled.",{provided:e,available:t.features})),t.runRequest("General/Authorization/LicensedFeatureCheck",{Feature:t.features[e]}).then(function(e){n(e.Value)})})},t.licensedFeaturesCheck=function(e){var t=this;return new Promise(function(n,s){var o={Features:[]};g.forEach(e,function(e){void 0===t.features[e]?s(new i(8,"Feature provided does not exist or is mispelled.",{provided:e,available:t.features})):o.Features.push(t.features[e])}),t.runRequest("General/Authorization/LicensedFeaturesCheck",o).then(function(e){var o={},u=g.invert(t.features);g.forEach(e.Value,function(e,t){void 0===u[e]?s(new i(9,"Feature index provided does not exist or isn't configured properly.",{provided:e,available:u})):o[u[e]]=t}),n(o)})})},t.licensedServicesCheck=function(e){var t=this;return new Promise(function(n,i){t.runRequest("General/Authorization/LicensedServicesCheck",{Services:e}).then(function(e){n(e.Value)})})},t.cityworksOnlineSites=function(e,t){var n=this;return new Promise(function(i,s){n.runRequest("General/Authentication/CityworksOnlineSites",{LoginName:void 0!==e?e:n.login,Password:void 0!==t?t:n.password}).then(function(e){i(e.Value)})})},t.domains=function(){var e=this;return new Promise(function(t,n){e.runRequest("General/Authentication/Domains",{}).then(function(e){t(e.Value)})})},t.user=function(e){var t=this;return new Promise(function(n,i){t.runRequest("General/Authentication/User",{LoginName:void 0!==e?e:t.login}).then(function(e){n(e.Value)})})},t.version=function(){var e=this;return new Promise(function(t,n){e.runRequest("General/Authentication/Version",{}).then(function(e){t(e.Value)})})},e}()});
//# sourceMappingURL=index.umd.js.map
