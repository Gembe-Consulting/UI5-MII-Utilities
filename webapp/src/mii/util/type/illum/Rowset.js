/**
 * MII Illuminator Class - Rowset
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a Rowset in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";
	/* global mii */

	var Rowset = ManagedObject.extend("mii.util.type.illuminator.Rowset", /** @lends basic.model.mii.type.illuminator.Rowset.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"rowsetId": {
					type: "int",
					defaultValue: 0
				},
				"queryTemplate": {
					type: "string"
				}
			},
			defaultProperty: "rowsetId",
			aggregations: {
				"rows": {
					type: "mii.util.type.illuminator.Row",
					multiple: true,
					singularName: "row"
				},
				"columns": {
					type: "mii.util.type.illuminator.Column",
					multiple: true,
					singularName: "column"
				}
			},
			defaultAggregation: "rows"
		},
		constructor: function(oRowset) {
			ManagedObject.apply(this, arguments);
			this.setRowsetId(oRowset.RowsetId);
			this.setQueryTemplate(oRowset.QueryTemplate);

			this.setMiiData(oRowset);
		}
	});

	Rowset.prototype.setMiiData = function(oRowset) {
		var aColumns = oRowset.Column.results,
			aRows = oRowset.Row.results;

		jQuery.each(aColumns, function(i, oColumn) {
			this.addColumn(new mii.util.type.illuminator.Column(oColumn));
		}).bind(this);

		jQuery.each(aRows, function(i, oRow) {
			this.addRow(new mii.util.type.illuminator.Row(oRow));
		}).bind(this);

	};

	return Rowset;

}, /*bExport=*/ true);