/**
 * MII Illuminator Class
 */

// Provides an implementation of MII Illuminator concept
sap.ui.define(["jquery.sap.global", "./library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";
	/* global mii */

	var RowsetsObject = ManagedObject.extend("mii.util.RowsetsObject", /** @lends basic.model.mii.RowsetsObject.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"fatalError": {
					type: "mii.util.type.illuminator.FatalError"
				},
				"queryTemplate": {
					type: "string"
				},
				"startDate": {
					type: "string"
				},
				"endDate": {
					type: "string"
				},
				"dateCreated": {
					type: "string"
				},
				"version": {
					type: "string"
				}
			},
			aggregations: {
				"rowsets": {
					type: "mii.util.type.illuminator.Rowset",
					multiple: true,
					singularName: "rowset"
				},
				"messages": {
					type: "mii.util.type.illuminator.Message",
					multiple: true,
					singularName: "message"
				}
			},
			publicMethods: ["setMiiData"]
		},
		constructor: function(oMiiResponse) {
			ManagedObject.apply(this, arguments);

			this.iDefaultLength = 1;
			this.iDefaultIndex = 0;

			this._checkRowsetsPropertiesValid = function() {
				var bValid = true,
					aRowsets = this._oData.d.results;

				if (!aRowsets || (aRowsets.length !== this.iDefaultLength)) {
					return false;
				}

				if (!aRowsets[this.iDefaultIndex].QueryTemplate ||
					!aRowsets[this.iDefaultIndex].StartDate ||
					!aRowsets[this.iDefaultIndex].EndDate ||
					!aRowsets[this.iDefaultIndex].DateCreated ||
					!aRowsets[this.iDefaultIndex].Version
				) {
					return false;
				}

				return bValid;
			};

			if (oMiiResponse) {
				this.setMiiData(oMiiResponse);
			}
		}
	});

	/**
	 * Converts an MII IlluminatorOdata or non-Odata Illuminator response into an RowsetObject representation
	 */
	RowsetsObject.prototype.setMiiData = function(oMiiResponse) {
		var oRowsetsData,
			aRowsets;

		if (!oMiiResponse || !oMiiResponse.data) {
			throw "MII data object is not provided!";
		} else if (!oMiiResponse.data.d) {
			throw "Non-Odata Illuminator response is currently not supported!";
		}

		this._oData = oMiiResponse.data;

		if (this._checkRowsetsPropertiesValid()) {
			oRowsetsData = this._oData.d.results[0];

			this.setQueryTemplate(oRowsetsData.QueryTemplate);
			this.setStartDate(oRowsetsData.StartDate);
			this.setEndDate(oRowsetsData.EndDate);
			this.setDateCreated(oRowsetsData.DateCreated);
			this.setVersion(oRowsetsData.Version);
		}

		aRowsets = oRowsetsData.Rowset.results;

		jQuery.each(aRowsets, function(i, oRowset) {
			this.addRowset(new mii.util.type.illuminator.Rowset(oRowset));
		}).bind(this);
	};

	return RowsetsObject;

}, /*bExport=*/ true);