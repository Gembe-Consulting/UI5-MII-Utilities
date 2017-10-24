/**
 * MII Illuminator Class - Document
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an abstract base implementation for MII Document
// The Rowsets element is created, but its children are not. 
sap.ui.define(["jquery.sap.global", "./library", "sap/ui/base/Object"], function(jQuery, library, BaseObject) {
	"use strict";

	var MIIQueryTemplate = BaseObject.extend("mii.util.MIIQueryTemplate", /** @lends basic.model.mii.MIIQueryTemplate.prototype */ {
		metadata: {
			"abstract": true, // Don't create an object of this class!
			library: "mii.util",
			properties: {
				"name": {
					type: "string"
				},
				"serviceUrl": {
					type: "string",
					defaultValue: "/XMII/IlluminatorOData"
				},
				"jsonModel": {
					type: "sap.ui.model.json.JSONModel"
				},
				"queryTemplateType": {
					type: "mii.util.QueryTemplateType"
				},
				"queryTemplatePath": {
					type: "string"
				}
			},
			publicMethods: ["setMiiData", "getMiiData"]
		},
		constructor: function(sQueryTemplateType) {
			BaseObject.apply(this, arguments);

			this.setQueryTemplateType(sQueryTemplateType);
		}
	});

	/**
	 * @public
	 */
	MIIQueryTemplate.prototype.alert = function() {
		alert();
	};

	return MIIQueryTemplate;

}, /*bExport=*/ true);