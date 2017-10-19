/**
 * MII Illuminator Class - Row
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a Row in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";

	var Row = ManagedObject.extend("mii.util.type.illuminator.Row", /** @lends basic.model.mii.type.illuminator.Row.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"rowId": {
					type: "int",
					defaultValue: 0,
					bindable: false
				}
			},
			defaultProperty: "rowId",
			aggregations: {
				"attributes": {
					type: "any",
					multiple: true,
					singularName: "attribute"
				}
			},
			defaultAggregation: "properties",
			association: {
				"columnRef": {
					type: "mii.util.type.illuminator.Colmn",
					multiple: false
				}
			}
		},
		constructor: function(oRow) {
			ManagedObject.apply(this, arguments);
		}
	});

	return Row;

}, /*bExport=*/ true);