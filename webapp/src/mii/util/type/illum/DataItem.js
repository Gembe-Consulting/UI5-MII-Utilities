/**
 * MII Illuminator Class - DataItem
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a DataItem in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";

	var DataItem = ManagedObject.extend("mii.util.type.illuminator.DataItem", /** @lends basic.model.mii.type.illuminator.DataItem.prototype */ {
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

	return DataItem;

}, /*bExport=*/ true);