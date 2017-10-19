/**
 * MII Illuminator Class - Column
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a Column in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";

	var Column = ManagedObject.extend("mii.util.type.illuminator.Column", /** @lends basic.model.mii.type.illuminator.Column.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"name": {
					type: "string"
				},
				"description": {
					type: "string"
				},
				"sourceColumn": {
					type: "string"
				},
				"minRange": {
					type: "int",
					defaultValue: 0
				},
				"maxRange": {
					type: "int",
					defaultValue: 1
				},
				"SQLDataType": {
					type: "int"
				}
			}
		},
		constructor: function(oColumn) {
			ManagedObject.apply(this, arguments);
		}
	});

	return Column;

}, /*bExport=*/ true);