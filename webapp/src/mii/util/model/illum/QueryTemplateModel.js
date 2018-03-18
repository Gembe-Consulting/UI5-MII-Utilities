/**
 * JSON-based DataBinding for MII Services
 */

// Provides the JSON object based model implementation
sap.ui.define(["jquery.sap.global", "sap/ui/model/json/JSONModel"],
	function(jQuery, JSONModel) {
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

				if (oParameters) {
					this.bPreventInitialLoad = oParameters.preventInitialLoad || false; //true, false, null (if it was true)
					this.bPreventParameterlessLoad = oParameters.preventParameterlessLoad || false;
					this.bCheckReturnRequired = oParameters.checkReturnRequired || false;
					this.aRequiredRowsets = oParameters.requiredRowsets || [0];
				}

				if (typeof oData === "string") {
					this._sServiceUrl = oData;
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

			if (!this._sServiceUrl) {
				this._sServiceUrl = sUrl;
			}

			if (this.bPreventInitialLoad) {
				this.bPreventInitialLoad = null;
				return Promise.reject(new Error(
					"Method loadData() does not allow loading this time and is preventing initial load (e.g. during app initialization)."));
			}

			if (!sUrl || (!oParameters && this.bPreventParameterlessLoad)) {
				return Promise.reject(new Error("Method loadData() is missing either sUrl or oParameters (while preventing parameterless load)."));
			}

			return this.loadMiiData(sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders);

		};

		QueryTemplateModel.prototype.loadMiiData = function(sUrl, oParameters, bAsync, sType, bMerge, bCache, mHeaders) {

			var bAsync = (bAsync !== false), // false if flase, true in all other cases (null, undefined, 1, "X", ...)
				bMerge = (bMerge === true), // true if true, false in all other cases
				sType = sType === "POST" ? sType : "GET", // only allow GET (defaut) and POST
				bCache = (bCache === true), // true if true, false in all other cases
				pDataLoaded, // Promise for async calls
				sMiiQueryServiceUrl = sUrl,
				oMiiQueryParameters;

			oMiiQueryParameters = this.buildIllumParamList(oParameters);

			// success function to set data to the model and fire request complete event
			var fnSuccess = function(oData) {
				var oError,
					iErrorIndex, bPassed;

				if (!oData) {
					jQuery.sap.log.fatal("The following problem occurred: No data was retrieved by MII service '" + sMiiQueryServiceUrl + "'");
					oError = new Error("No data was retrieved by MII service '" + sMiiQueryServiceUrl + "'");
				} else {

					try {
						oData.success = !this.hasError(oData);
						oData.messages = this._compressMessages(oData);
						oData.rowsets = this._compressRows(oData);
					} catch (err) {
						oError = new Error(err);
					}

					//lets go dirty and check success, if we have a fatal error, we reject a Promise -> caller will be informed
					if (!oData.success) {
						oData.lastErrorMessage = this.getError(oData);
						oError = new Error(oData.lastErrorMessage);
					}

					if (this.bCheckReturnRequired) {
						iErrorIndex;

						bPassed = this.aRequiredRowsets.every(function(rowsetIndex) {
							iErrorIndex = rowsetIndex;
							return oData.rowsets[rowsetIndex] && oData.rowsets[rowsetIndex].length > 0;
						});

						if (!bPassed) {
							oError = new Error("Rowset [" + iErrorIndex + "] is marked as mandatory, but no Rows has been returned!");
						}
					}

				}

				if (!oError) {
					this.setData(oData, bMerge);

					this.fireRequestCompleted({
						url: sMiiQueryServiceUrl,
						type: sType,
						async: bAsync,
						info: "cache=" + bCache + ";bMerge=" + bMerge,
						infoObject: {
							cache: bCache,
							merge: bMerge
						},
						success: true
					});

					// resolving a new promise
					return Promise.resolve(oData);

				} else {
					this.fireRequestCompleted({
						url: sMiiQueryServiceUrl,
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

					// rejecting a new promise
					return Promise.reject(oError);

				}
			}.bind(this);

			// error function to return error object and fire request complete event
			var fnError = function(oParams) {
				var oError = {
					message: oParams.textStatus || oParams.statusText || "",
					statusCode: oParams.request ? oParams.request.status : oParams.status,
					statusText: oParams.request ? oParams.request.statusText : oParams.statusText,
					responseText: oParams.request ? oParams.request.responseText : oParams.responseText
				};
				jQuery.sap.log.fatal("The following problem occurred: " + oError.statusText, oError.responseText + "," + oError.statusCode +
					"," + oError.message);

				this.fireRequestCompleted({
					url: sMiiQueryServiceUrl,
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
				// rejecting a new promise
				return Promise.reject(oError);
			}.bind(this);

			var _loadData = function(onSuccess, onError) {
				this._ajax({
					url: sMiiQueryServiceUrl,
					async: bAsync,
					dataType: 'json',
					cache: bCache,
					data: oMiiQueryParameters,
					type: sType,
					success: onSuccess,
					error: onError
				});
			}.bind(this);

			if (bAsync) {
				pDataLoaded = new Promise(function(resolve, reject) {

					// reject promise if data could not be loaded. This fn is called, when _ajax fails (by fnError)
					// It contains the default return parameters of the ajax call
					var fnReject = function(oXMLHttpRequest, sTextStatus, oError) {
						var oReject = {
							request: oXMLHttpRequest,
							textStatus: sTextStatus,
							error: oError
						};
						// reject this promise to call fnError
						reject(oReject);
					};

					// resolve promise if data was 
					var fnResolve = function(oData) {
						// resolve this promise to call fnSuccess
						resolve(oData);
					};

					// start loading data and pass local fn referances to be called error/success
					_loadData(fnResolve, fnReject);

				});

				//always settle pDataLoaded and return a new promise
				return pDataLoaded.then(fnSuccess, fnError);

			} else {
				_loadData(fnSuccess, fnError);
			}

		};

		/**
		 * Builds a MII Illuminator compliant parameter list like:
		 * Param.1
		 * Param.2
		 * ....
		 * Param.32
		 * 
		 * oMiiQueryTemplateParams can be a object like
		 * {
		 	"Param.1": value1,
		 	"Param.2": value2,
		 	....
		 	"Param.32": value32
		 * }
		 * or can be a array like
		 * [value1, value2, ... value32]
		 * Such an array will be converted into an object as above
		 */
		QueryTemplateModel.prototype.buildIllumParamList = function(oMiiQueryTemplateParams) {

			// hier werden wir notwendige mappings durchführen

			this._validateMiiParameters();

			return oMiiQueryTemplateParams;

		};

		QueryTemplateModel.prototype.hasError = function(oIllumData) {
			oIllumData = oIllumData || this.getData();
			return oIllumData && !!oIllumData.d.results["0"].FatalError;
		};

		QueryTemplateModel.prototype.getError = function(oIllumData) {
			oIllumData = oIllumData || this.getData();
			return oIllumData && oIllumData.d.results["0"].FatalError;
		};

		QueryTemplateModel.prototype.hasRowsAtRowsetIndex = function(oIllumData, iRowset) {
			var bOk = true;
			oIllumData = oIllumData || this.getData();
			iRowset = iRowset || 0;

			//Illum has an array at given Rowset Index?
			bOk = bOk && oIllumData && oIllumData.d.results["0"].Rowset.results[iRowset];

			//Illum Rowset has an Row Object at given Rowset Index?
			bOk = bOk && oIllumData && oIllumData.d.results["0"].Rowset.results[iRowset].Row;

			//Illum Row Object has a Results array at given Rowset Index?
			bOk = bOk && oIllumData && oIllumData.d.results["0"].Rowset.results[iRowset].Row.results;

			//Illum Row Results array has at least one element
			bOk = bOk && oIllumData && oIllumData.d.results["0"].Rowset.results[iRowset].Row.results.length > 0;

			return bOk;
		};

		QueryTemplateModel.prototype.getRowsAtRowsetIndex = function(oIllumData, iRowset) {
			oIllumData = oIllumData || this.getData();
			iRowset = iRowset || 0;

			if (this.hasRowsAtRowsetIndex(oIllumData, iRowset)) {
				return oIllumData.d.results["0"].Rowset.results[iRowset].Row.results;
			}

			return;
		};

		QueryTemplateModel.prototype._compressRows = function(oIllumData) {
			oIllumData = oIllumData || this.getData();

			return oIllumData.d.results["0"].Rowset.results.map(function(rowset) {
				return this._removeMetadata(rowset.Row.results);
			}.bind(this));
		};

		QueryTemplateModel.prototype._removeMetadata = function(vData) {

			var deleteMetadata = function(obj) {
				delete obj.__metadata;
				return obj;
			};

			if (Array.isArray(vData)) {
				return vData.map(function(obj) {
					return deleteMetadata(obj);
				});
			}

			return deleteMetadata(vData);
		};

		QueryTemplateModel.prototype._compressMessages = function(oIllumData) {
			oIllumData = oIllumData || this.getData();

			return oIllumData.d.results["0"].Messages.results.map(function(rowset) {
				return rowset.Message;
			});
		};

		/**
		 * Constrains to consider:
		 * - 32 Parameters max
		 * - Gaps allowed
		 * - Duplications forbidden
		 * - Exact wording
		 */
		QueryTemplateModel.prototype._validateMiiParameters = function(oMiiQueryTemplateParams) {
			// hier werdn wir die Params gegen ein Schema vergleichen
			return true;
		};

		return QueryTemplateModel;

	});