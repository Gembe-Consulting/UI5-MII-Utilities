sap.ui.define(["sap/ui/core/library"], /* library dependency */ function() {
	"use strict";
	/* global mii */

	/**
	 * @alias mii.util
	 */
	sap.ui.getCore().initLibrary({
		name: "mii.util",
		version: "0.1.3",
		dependencies: [
			"sap.ui.core"
		],
		types: [
			"mii.util.QueryTemplateType",
			"mii.util.RowsetsObject",
			"mii.util.MIIJSONModel",
			"mii.util.MIIQueryTemplate",
			"mii.util.type.illuminator.Rowset",
			"mii.util.type.illuminator.Column",
			"mii.util.type.illuminator.Row",
			"mii.util.type.illuminator.Message",
			"mii.util.type.illuminator.FatalError"
		],
		interfaces: [],
		controls: [

		],
		elements: [],
		noLibraryCSS: true
	});

	/**
	 * An addition to mii.util. If you used the @alias tag above, JSDoc will recognize this as mii.util.QueryTemplateType.
	 * @ui5-metamodel The UI5 metamodel restoration logic also can handle this kind of definition and will create an enumeration type
	 *         mii/util/QueryTemplateType.type. 
	 * The name of the variable (<code>oMIIUtil</code>) is not mandatory.
	 */
	mii.util.QueryTemplateType = {
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

	mii.util.operationMode = {
		Create: "INSERT",
		Read: "SELECT",
		Update: "UPDATE",
		Delete: "DELETE"
	};

	// don’t forget to return the value
	return mii.util;

});