sap.ui.define(["sap/ui/core/library"], /* library dependency */ function() {
	"use strict";
	/* global mii */

	/**
	 * @alias mii.util
	 */
	sap.ui.getCore().initLibrary({
		name: "mii.util",
		version: "0.1.7",
		dependencies: [
			"sap.ui.core"
		],
		types: [],
		interfaces: [],
		controls: [],
		elements: [
			"mii.util.model.illum.QueryTemplateModel"
		],
		noLibraryCSS: true
	});

	var thisLib = mii.util;

	/**
	 * An addition to mii.util. If you used the @alias tag above, JSDoc will recognize this as mii.util.QueryTemplateType.
	 * @ui5-metamodel The UI5 metamodel restoration logic also can handle this kind of definition and will create an enumeration type
	 *         mii/util/QueryTemplateType.type. 
	 * The name of the variable (<code>oMIIUtil</code>) is not mandatory.
	 */
	thisLib.QueryTemplateType = {
		AggregateQuery: "AggregateQuery",
		AlarmQuery: "AlarmQuery",
		OLAPQuery: "OLAPQuery",
		MDOQuery: "MDOQuery",
		KPIFrameworkQuery: "KPIFrameworkQuery",
		SQLQuery: "MDOQuery",
		TagQuery: "SQLQuery",
		XacuteQuery: "XacuteQuery",
		XMLQuery: "XMLQuery",
		PCoQuery: "PCoQuery",
		CatalogQuery: "CatalogQuery"
	};

	thisLib.operationMode = {
		Create: "INSERT",
		Read: "SELECT",
		Update: "UPDATE",
		Delete: "DELETE"
	};

	// don’t forget to return the value
	return thisLib;

});