/**
 * MII Illuminator Class - Message
 * https://openui5.hana.ondemand.com/#/api/sap.ui.base.ManagedObject/methods/sap.ui.base.ManagedObject.extend
 */

// Provides an implementation of a Message in MII Illuminator concept
sap.ui.define(["jquery.sap.global", "mii/util/library", "sap/ui/base/ManagedObject"], function(jQuery, library, ManagedObject) {
	"use strict";

	var Message = ManagedObject.extend("mii.util.type.illuminator.Message", /** @lends basic.model.mii.type.illuminator.Message.prototype */ {
		metadata: {
			library: "mii.util",
			properties: {
				"message": {
					type: "string"
				}
			}
		},
		constructor: function(oMessage) {
			ManagedObject.apply(this, arguments);
		}
	});

	return Message;

}, /*bExport=*/ true);