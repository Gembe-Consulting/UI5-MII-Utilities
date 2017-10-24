/**
 * MII Illuminator Class - FatalError
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a FatalError in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";

	var FatalError = ManagedObject.extend("mii.util.type.illuminator.FatalError", /** @lends basic.model.mii.type.illuminator.FatalError.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"fatalError": {
					type: "string"
				}
			}
		},
		constructor: function(oFatalError) {
			ManagedObject.apply(this, arguments);
		}
	});

	return FatalError;

}, /*bExport=*/ true);