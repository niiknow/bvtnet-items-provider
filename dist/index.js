/*!
 * bvtnet-items-provider
 * datatables.net ajax items provider for bootstrap-vue b-table

 * @version v1.0.7
 * @author Tom Noogen
 * @homepage https://github.com/niiknow/bvtnet-items-provider
 * @repository https://github.com/niiknow/bvtnet-items-provider.git
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("bvtnet-items-provider", [], factory);
	else if(typeof exports === 'object')
		exports["bvtnet-items-provider"] = factory();
	else
		root["bvtnet-items-provider"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ownKeys(object, enumerableOnly) {var keys = Object.keys(object);if (Object.getOwnPropertySymbols) {var symbols = Object.getOwnPropertySymbols(object);if (enumerableOnly) {symbols = symbols.filter(function (sym) {return Object.getOwnPropertyDescriptor(object, sym).enumerable;});}keys.push.apply(keys, symbols);}return keys;}function _objectSpread(target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i] != null ? arguments[i] : {};if (i % 2) {ownKeys(Object(source), true).forEach(function (key) {_defineProperty(target, key, source[key]);});} else if (Object.getOwnPropertyDescriptors) {Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));} else {ownKeys(Object(source)).forEach(function (key) {Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));});}}return target;}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}function _createClass(Constructor, protoProps, staticProps) {if (protoProps) _defineProperties(Constructor.prototype, protoProps);if (staticProps) _defineProperties(Constructor, staticProps);return Constructor;}var _name = new WeakMap(),
_axios = new WeakMap(),
_localItems = new WeakMap();var

ItemsProvider = /*#__PURE__*/function () {
  /**
  * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
  * @return             an instance of ItemsProvider
  */
  function ItemsProvider(opts) {_classCallCheck(this, ItemsProvider);
    return this.init(opts);
  }

  /**
  * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
  * @return ItemsProvider       an instance of ItemsProvider
  */_createClass(ItemsProvider, [{ key: "init", value:
    function init() {var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var that = this;
      var fields = opts.fields || [];
      var axios = opts.axios;
      var state = {};
      var isFieldsArray = fields.constructor === Array || Array.isArray(fields);

      _name.set(that, 'ItemsProvider');
      _axios.set(that, axios);

      that.stateId = opts.stateId;
      that.state = state;
      that.fields = fields;
      that.busy = false;
      that.storage = opts.storage || window.localStorage;
      that.pageLengths = [
      { value: 15, text: '15' },
      { value: 100, text: '100' },
      { value: 500, text: '500' },
      { value: 1000, text: '1000' },
      { value: -1, text: 'All' }];

      that.resetCounterVars();

      state.perPage = opts.perPage || 15;
      state.currentPage = opts.currentPage || 1;
      state.filter = opts.filter;
      state.filterIgnoredFields = opts.filterIgnoredFields || [];
      state.filterIncludedFields = opts.filterIncludedFields || [];
      state.searchFields = opts.searchFields || {};
      state.sortFields = opts.sortFields || {};
      state.query = opts.query || {};
      state.queryUrl = opts.queryUrl;

      // field is not array, must be object type
      if (!isFieldsArray) {
        that.fields = [];
        // these are either internal or fields listed from b-table
        var copyable = ['onFieldTranslate', 'searchable', 'isLocal', 'key', 'label', 'headerTitle', 'headerAbbr', 'class', 'formatter', 'sortable', 'sortDirection', 'sortByFormatted', 'filterByFormatted', 'tdClass', 'thClass', 'thStyle', 'variant', 'tdAttr', 'thAttr', 'isRowHeader', 'stickyColumn', 'data', 'name'];

        for (var k in fields) {
          var field = fields[k];
          var col = {};

          field.key = "".concat(field.key || field.name || field.data || k);

          // disable search and sort for local field
          if (field.isLocal) {
            field.searchable = false;
            field.sortable = false;
            delete field['filterByFormatted'];
          }

          for (var i = 0; i < copyable.length; i++) {
            if (field.hasOwnProperty(copyable[i])) {
              col[copyable[i]] = field[copyable[i]];
            }
          }

          that.fields.push(col);
        }
      }

      // retaining the this context
      // passing the b-table component as 3rd parameter
      that.items = function (ctx, cb) {
        return that.executeQuery(ctx, cb, this);
      };

      // finally, load states
      if (typeof that.stateId === 'string') {

        if (typeof that.onStateLoading === 'function') {
          that.onStateLoading();
        }

        // begin saving state
        var savedState = that.storage.getItem(that.getStateId());
        if (typeof savedState === 'string' && savedState.indexOf('}') > 0) {
          var _state = JSON.parse(savedState);
          for (var _k in _state) {
            that.state[_k] = _state[_k];
          }

          if (typeof that.onStateLoaded === 'function') {
            that.onStateLoaded(_state);
          }
        }
      }

      return that;
    }

    /**
     * Reset counter ariables
     *
     * @return void
     */ }, { key: "resetCounterVars", value:
    function resetCounterVars() {
      var that = this;
      that.totalRows = that.recordsTotal = that.startRow = that.endRow = 0;
    }

    /**
     * get the component name
     *
     * @return String component name
     */ }, { key: "getName", value:
    function getName() {
      return _name.get(this);
    }

    /**
     * get the axios
     *
     * @return Object the axios object
     */ }, { key: "getAxios", value:
    function getAxios() {
      return _axios.get(this);
    }

    /**
     * Get the local items
     *
     * @param  Function a callback function to return local items data
     * @return Array array of local items or empty
     */ }, { key: "getLocalItems", value:
    function getLocalItems() {var cb = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var items = _localItems.get(this);
      if (items && cb) {
        cb(items);
      }

      return items;
    }

    /**
     * Set local items
     *
     * @param Array items list of local items
     */ }, { key: "setLocalItems", value:
    function setLocalItems(items) {
      var that = this;

      that.state.currentPage = 1;
      that.totalRows = items ? items.length : 0;
      that.recordsTotal = that.totalRows;
      that.startRow = that.totalRows > 0 ? 1 : 0;
      that.endRow = that.totalRows;
      that.state.perPage = -1;

      _localItems.set(this, items);
    }

    /**
     * safely decode the string
     *
     * @param  String str
     * @return String url decoded string
     */ }, { key: "decode", value:
    function decode(str) {
      try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
      } catch (e) {
        return str;
      }
    }

    /**
     * safely encode the string
     *
     * @param  String str
     * @return String url encoded string
     */ }, { key: "encode", value:
    function encode(str) {
      try {
        return encodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }

    /**
     * helper method to parse querystring to object
     *
     * @param  String qstr the querystring
     * @return Object      result
     */ }, { key: "queryParseString", value:
    function queryParseString(qstr) {
      qstr = (qstr || '').replace('?', '').replace('#', '');

      var pattern = /(\w+)\[(\d+)\]/;
      var decode = this.decode,
      obj = {},
      a = qstr.split('&');

      for (var i = 0; i < a.length; i++) {
        var parts = a[i].split('='),
        key = decode(parts[0]),
        m = pattern.exec(key);

        if (m) {
          obj[m[1]] = obj[m[1]] || [];
          obj[m[1]][m[2]] = decode(parts[1]);
          continue;
        }

        obj[parts[0]] = decode(parts[1] || '');
      }

      return obj;
    }

    /**
     * reverse object to query string
     *
     * @param  Object obj the object
     * @return String     the query string
     */ }, { key: "queryStringify", value:
    function queryStringify(obj, prefix) {
      var that = this;
      var encode = that.encode;

      var str = [],p;

      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + '[' + p + ']' : p,v = obj[p];

          str.push(v !== null && _typeof(v) === 'object' ?
          that.queryStringify(v, k) :
          encode(k) + '=' + encode(v));
        }
      }

      return str.join('&');
    }

    /**
     * translate the context to datatables.net query object
     *
     * @param  Object  ctx the context object
     * @param  inQuery the additional query data
     * @return Object    the query object
     */ }, { key: "translateContext", value:
    function translateContext(ctx) {var inQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var that = this;
      var fields = that.fields;
      var state = that.state;
      var qry = state.extraQuery || {};
      var query = _objectSpread(_objectSpread({
        draw: 1,
        start: (ctx.currentPage - 1) * ctx.perPage,
        length: ctx.perPage,
        search: { value: "".concat(ctx.filter || '') },
        order: [],
        columns: [] },

      qry),
      inQuery);


      if (ctx.filter instanceof RegExp) {
        query.search.regex = true;
        query.search.value = ctx.filter.source;
      } else if (typeof ctx.filter !== 'string') {
        query.search.value = '';
      }

      var index = -1;
      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        if (typeof field === 'string') {
          field = { key: field };
        }

        var col = {
          data: field.data || field.key,
          name: field.name || field.key,
          searchable: typeof field.searchable === 'undefined' ? true : field.searchable,
          orderable: typeof field.sortable === 'undefined' ? true : field.sortable };


        if (state.filterIgnoredFields && state.filterIgnoredFields.indexOf(field.key) > -1) {
          col.searchable = false;
        }

        if (state.filterIncludedFields && state.filterIncludedFields.indexOf(field.key) > -1) {
          col.searchable = true;
        }

        if (typeof that.onFieldTranslate === 'function') {
          that.onFieldTranslate(field, col);
        }

        // skip local field or empty key
        if (field.isLocal || "".concat(field.key) === '') {
          continue;
        } else {
          query.columns.push(col);
          index++;
        }

        // handle server-side for non-local fields
        if (col.orderable && ctx.sortBy === field.key) {
          query.order.push({ column: index, dir: ctx.sortDesc ? 'desc' : 'asc' });
        }

        // implement per field search/filtering
        if (col.searchable && state.searchFields) {
          var val = state.searchFields[field.key];

          if (val !== null && typeof val !== 'undefined') {
            // if not null or undefined
            if (typeof val.regex === 'boolean') {
              // real search object has regex property, then simply assign it
              col.search = val;

            } else if (val instanceof RegExp) {
              // it is a regexp object, then assign the source
              col.search = { value: val.source, regex: true };

            } else if (_typeof(val) !== 'object' && !Array.isArray(val)) {
              // if not an object or array, then assign the string value
              col.search = { value: "".concat(val || ''), regex: false };

            }

            // don't know what to do otherwise it might serialize as [object object]
            // or even some invalid object
          }
        }

        // handle multi-columns sorting
        if (col.orderable && state.sortFields) {
          var sort = state.sortFields[field.key];

          // validate valid values
          if (sort === 'asc' || sort === 'desc') {
            query.order.push({ column: index, dir: sort });
          }
        }
      }

      if (query.columns.length <= 0) {
        delete query['columns'];
      }

      return query;
    }

    /**
     * computed state id
     *
     * @return String the computed state id
     */ }, { key: "getStateId", value:
    function getStateId() {
      return "bvtnetip.".concat(this.stateId);
    }

    /**
     * perform state saving
     *
     * @return Object ItemsProvider
     */ }, { key: "performSaveState", value:
    function performSaveState() {
      var that = this;

      if (typeof that.stateId !== 'string') {
        return that;
      }

      if (typeof that.onStateSaving === 'function') {
        that.onStateSaving();
      }

      // begin saving state
      that.storage.setItem(that.getStateId(), JSON.stringify(that.state));

      if (typeof that.onStateSaved === 'function') {
        that.onStateSaved();
      }

      return that;
    }

    /**
    * the provider function to use with bootstrap vue
    *
    * @param  Object   ctx bootstrap-vue context object
     * @param  Function cb the callback function
    * @return Array   array of items
    */ }, { key: "executeQuery", value:
    function executeQuery(ctx) {var cb = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
      var that = this;
      var locItems = that.getLocalItems(cb);
      var apiParts = (ctx.apiUrl || that.apiUrl).split('?');
      var query = {};

      if (apiParts.length > 1) {
        query = that.queryParseString(apiParts[1]);
      }

      query = that.translateContext(ctx, query);

      if (typeof that.onBeforeQuery === 'function') {
        that.onBeforeQuery(query, ctx);
      }

      that.state.queryUrl = apiParts[0];
      that.state.query = query;

      if (locItems) {
        return locItems;
      }

      that.resetCounterVars();
      that.busy = true;

      var axios = that.getAxios();
      var ajaxUrl = that.state.queryUrl;
      var promise = that.method === 'POST' ? axios.post(ajaxUrl, query) : axios.get("".concat(ajaxUrl, "?").concat(that.queryStringify(query)));

      return promise.then(function (rsp) {
        var myData = rsp.data;
        that.totalRows = myData.recordsFiltered;
        that.startRow = that.totalRows > 0 ? query.start + 1 : 0;
        that.endRow = query.start + query.length;
        that.recordsTotal = myData.recordsTotal;

        if (that.endRow > that.totalRows) {
          that.endRow = that.totalRows;
        }

        if (typeof that.onResponseComplete === 'function') {
          that.onResponseComplete(rsp);
        }

        that.busy = false;

        // finally, save state on successful response
        that.performSaveState();

        return myData.data || [];
      })["catch"](function (err) {
        that.busy = false;

        if (typeof that.onResponseError === 'function') {
          that.onResponseError(err);
        }

        return [];
      });
    } }]);return ItemsProvider;}();


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ItemsProvider);
__webpack_exports__ = __webpack_exports__["default"];
/******/ 	return __webpack_exports__;
/******/ })()
;
});