/**
 * JSON-based DataBinding for MII Services
 */

// Provides the JSON object based model implementation
sap.ui.define(["jquery.sap.global", "sap/ui/model/json/JSONModel", "mii/util/libs/validatejs/validate"],
	function(jQuery, JSONModel, validate) {
		"use strict";

		/**
		 * Constructor for a new QueryTemplateModel.
		 *
		 * @class
		 * Model implementation for JSON based MII Services
		 *
		 * @extends sap.ui.model.JSONModel
		 *
		 * @author Philipp Gembe
		 * @version 0.1
		 *
		 * @param {object} oData either the URL where to load the JSON from or a JS object
		 * @param {object} oURLParameters
		 * @public
		 */
		var QueryTemplateModel = JSONModel.extend("mii.util.model.illum.QueryTemplateModel", /** @lends mii.util.model.illum.QueryTemplateModel.prototype */ {
			constructor: function(oData, oParameters) {
				
				this.oParameters = oParameters;
				
				if(this.oParameters){
					this.bPreventInitialLoad = 	this.oParameters.preventInitialLoad || false;	//true, false, null (if it was true)
				}
				
				if (typeof oData == "string") {
					this._sBaseUrl = oData;
				}
				
				JSONModel.apply(this, arguments);
				
			}
		});

		/**
		 * Override JSON Models loadData method, to only load data, if oParameters is given. 
		 * This is to ensure having proper input data for MII QueryTemplate
		 * @public
		 */
		QueryTemplateModel.prototype.loadData = function(sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders) {
			
			if(this.bPreventInitialLoad){
				this.bPreventInitialLoad = null;
				return;
			};
			
			var oUrlParams = this.oParameters || oParameters;
			
			if (oUrlParams) {

				this.loadMiiData(sUrl, oUrlParams, bAsync, sType, bMerge, bCache);
				//JSONModel.prototype.loadData.apply(this, [sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders]);

			} else {
				jQuery.sap.log.warning("Method loadData() is missing either sUrl or oParameters. Data not loaded.", null, this.toString());
			}

		};

		QueryTemplateModel.prototype.loadMiiData = function(sMiiQueryTemplatePath, oMiiQueryTemplateParams, bAsync, sType, bMerge, bCache) {

			var sBaseUrl = this.getIllumBaseUrl(),
				bAsync = (bAsync !== false), // false if flase, true in all other cases (null, undefined, 1, "X", ...)
				bMerge = (bMerge === true), // true if true, false in all other cases
				sType = sType === "POST" ? sType : "GET", // only allow GET (defaut) and POST
				bCache = (bCache === true), // true if true, false in all other cases
				oMiiQueryTemplateParams = oMiiQueryTemplateParams || this.oMiiServiceParameters,
				pImportCompleted,
				oURLParameters;

			oURLParameters = this.buildIllumParamList(oMiiQueryTemplateParams);

			var fnSuccess = function(oData) {
				if (!oData) {
					jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by MII service: " + sMiiQueryTemplatePath);
				}
				this.setData(oData, bMerge);
				this.fireRequestCompleted({
					url: sBaseUrl,
					type: sType,
					async: bAsync,
					info: "cache=" + bCache + ";bMerge=" + bMerge,
					infoObject: {
						cache: bCache,
						merge: bMerge
					},
					success: true
				});
			}.bind(this);

			var fnError = function(oParams) {
				var oError = {
					message: oParams.textStatus,
					statusCode: oParams.request.status,
					statusText: oParams.request.statusText,
					responseText: oParams.request.responseText
				};
				jQuery.sap.log.fatal("The following problem occurred: " + oParams.textStatus, oParams.request.responseText + "," + oParams.request.status +
					"," + oParams.request.statusText);

				this.fireRequestCompleted({
					url: sBaseUrl,
					type: sType,
					async: bAsync,
					info: "cache=" + bCache + ";bMerge=" + bMerge,
					infoObject: {
						cache: bCache,
						merge: bMerge
					},
					success: false,
					errorobject: oError
				});
				this.fireRequestFailed(oError);
			}.bind(this);

			var _loadData = function(fnSuccess, fnError) {
				this._ajax({
					url: sBaseUrl,
					async: bAsync,
					dataType: 'json',
					cache: bCache,
					data: oMiiQueryTemplateParams,
					type: sType,
					success: fnSuccess,
					error: fnError
				});
			}.bind(this);

			if (bAsync) {
				pImportCompleted = new Promise(function(resolve, reject) {
					var fnReject = function(oXMLHttpRequest, sTextStatus, oError) {
						reject({
							request: oXMLHttpRequest,
							textStatus: sTextStatus,
							error: oError
						});
					};
					_loadData(resolve, fnReject);
				});

				return pImportCompleted.then(fnSuccess, fnError).catch(function() {
					alert("Fatal Error. Debug me plz.");
				});

			} else {
				_loadData(fnSuccess, fnError);
			}

		};

		QueryTemplateModel.prototype.buildIllumParamList = function(oMiiQueryTemplateParams) {
			this._validateMiiParameters();

			return oMiiQueryTemplateParams;

		};
		QueryTemplateModel.prototype._validateMiiParameters = function(oMiiQueryTemplateParams) {
			return true;
		};

		QueryTemplateModel.prototype.getIllumBaseUrl = function(sIllumServiceName) {
			sIllumServiceName = sIllumServiceName || "QueryTemplate";
			return "/XMII/Illuminator/" + sIllumServiceName;
		};

		return QueryTemplateModel;

	});