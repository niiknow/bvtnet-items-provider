/*!
 * bvtnet-items-provider
 * datatables.net ajax items provider for bootstrap-vue b-table

 * @version v0.6.0
 * @author Tom Noogen
 * @homepage undefined
 * @repository undefined
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
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ItemsProvider =
/*#__PURE__*/
function () {
  /**
  * Initialize an instance of ItemsProvider
  *
  * @return an instance of ItemsProvider
  */
  function ItemsProvider(axios, fields) {
    _classCallCheck(this, ItemsProvider);

    return this.init(axios, fields);
  }
  /**
  * Initialize an instance of ItemsProvider
  * @param  Object  axios                  an instance of axios
  * @param  Object  fields                 object containing our fields definition
  * @return ItemsProvider       an instance of ItemsProvider
  */


  _createClass(ItemsProvider, [{
    key: "init",
    value: function init(axios, fields) {
      var that = this;
      var isFieldsArray = fields.constructor === Array || Array.isArray(fields);
      var copyable = ['onFieldTranslate', 'key', 'label', 'headerTitle', 'headerAbbr', 'class', 'formatter', 'sortable', 'sortDirection', 'sortByFormatted', 'filterByFormatted', 'tdClass', 'thClass', 'thStyle', 'variant', 'tdAttr', 'thAttr', 'isRowHeader', 'stickyColumn'];
      that._name = 'ItemsProvider';
      that.axios = axios;
      that.fields = fields;
      that.perPage = 15;
      that.currentPage = 1;
      that.totalRows = 0;
      that.sortBy = '';
      that.sortDesc = false;
      that.filter = null;
      that.filterIgnoredFields = [];
      that.filterIncludedFields = [];
      that.axiosConfig = {};
      that.columns = [];
      that.busy = false;
      that.startRow = 0;
      that.endRow = 0;

      if (!isFieldsArray) {
        that.fields = [];

        for (var k in fields) {
          var field = fields[k];
          var col = {};
          field.key = field.name || field.key || k; // disable search and sort for local field

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
      } // retaining the this context
      // passing the b-table component ad 3rd parameter


      that.items = function (ctx, cb) {
        return that.executeQuery(ctx, cb, this);
      };
    }
    /**
     * safely decode the string
     * @param  String str
     * @return String url decoded string
     */

  }, {
    key: "decode",
    value: function decode(str) {
      try {
        return decodeURIComponent(str.replace(/\+/g, ' '));
      } catch (e) {
        return str;
      }
    }
    /**
     * safely encode the string
     * @param  String str
     * @return String url encoded string
     */

  }, {
    key: "encode",
    value: function encode(str) {
      try {
        return encodeURIComponent(str);
      } catch (e) {
        return str;
      }
    }
    /**
     * helper method to parse querystring to object
     * @param  String qstr the querystring
     * @return Object      result
     */

  }, {
    key: "queryParseString",
    value: function queryParseString(qstr) {
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
     * @param  Object obj the object
     * @return String     the query string
     */

  }, {
    key: "queryStringify",
    value: function queryStringify(obj, prefix) {
      var that = this;
      var encode = that.encode;
      var str = [],
          p;

      for (p in obj) {
        if (obj.hasOwnProperty(p)) {
          var k = prefix ? prefix + '[' + p + ']' : p,
              v = obj[p];
          str.push(v !== null && _typeof(v) === 'object' ? that.queryStringify(v, k) : encode(k) + '=' + encode(v));
        }
      }

      return str.join('&');
    }
    /**
     * get the last server Params
     * @return Object server params as an object
     */

  }, {
    key: "getServerParams",
    value: function getServerParams() {
      return this._query;
    }
    /**
     * translate the context to datatables.net query object
     *
     * @param  Object  ctx the context object
     * @param  inQuery the additional query data
     * @return Object    the query object
     */

  }, {
    key: "translateContext",
    value: function translateContext(ctx) {
      var inQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var that = this;
      var fields = that.fields;
      var query = {
        draw: 1,
        start: (that.currentPage - 1) * that.perPage,
        length: that.perPage,
        search: {
          value: "".concat(ctx.filter || ''),
          regex: ctx.filter instanceof RegExp
        },
        order: [{
          column: 0,
          dir: ctx.sortDesc ? 'desc' : 'asc'
        }],
        columns: []
      };

      for (var k in inQuery) {
        query[k] = inQuery[k];
      }

      if (that.sortBy) {
        query.order.column = (that.serverFields[that.sortBy] || {
          __index: 0
        }).__index;
      }

      for (var i = 0; i < fields.length; i++) {
        var field = fields[i];

        if (!field.key) {
          field = {
            key: field
          };
        }

        var col = {
          data: field.key,
          name: field.key,
          searchable: true,
          // implement this only when we allow for per field filter
          // search: { value: '', regex: false },
          orderable: field.sortable || true
        };

        if (that.filterIgnoredFields && that.filterIgnoredFields.indexOf(field.key) > -1) {
          col.searchable = false;
        }

        if (that.filterIncludedFields && that.filterIncludedFields.indexOf(field.key) > -1) {
          col.searchable = true;
        }

        if (typeof that.onFieldTranslate === 'function') {
          that.onFieldTranslate(field, col);
        }

        query.columns.push(col);
      }

      return query;
    }
    /**
    * the provider function to use with bootstrap vue
    *
    * @param  Object ctx bootstrap-vue context object
    * @return Array   array of items
    */

  }, {
    key: "executeQuery",
    value: function executeQuery(ctx) {
      var that = this;
      var apiParts = (ctx.apiUrl || that.apiUrl).split('?');
      var query = {},
          promise = null;

      if (that._name !== 'ItemsProvider') {
        throw new Error('Calling context must be of ItemsProvider.');
      }

      if (apiParts.length > 1) {
        query = that.queryParseString(apiParts[1]);
      }

      query = that.translateContext(ctx, query);

      if (typeof that.onBeforeQuery === 'function') {
        that.onBeforeQuery(query, ctx);
      }

      that.totalRows = that.startRow = that.endRow = 0;
      that.busy = true;
      that.responseResponse = null;
      that.responseError = null;
      that.sortDirection = ctx.sortDesc ? 'desc' : 'asc';
      that._apiUrl = apiParts[0];
      that._query = query;

      if (that.method === 'POST') {
        promise = that.axios.post(that._apiUrl, query, that.axiosConfig);
      } else {
        var apiUrl = that._apiUrl + '?' + that.queryStringify(query);
        promise = that.axios.get(apiUrl, that.axiosConfig);
      }

      return promise.then(function (rsp) {
        that.responseResponse = rsp;
        var myData = rsp.data;
        that.totalRows = myData.recordsFiltered || myData.recordsTotal;
        that.startRow = query.start + 1;
        that.endRow = query.start + query.length;

        if (that.endRow > that.totalRows || that.endRow < 0) {
          that.endRow = that.totalRows;
        }

        that.busy = false;

        if (that.onComplete) {
          that.onResponseComplete(rsp);
        }

        return myData.data || [];
      }).catch(function (error) {
        that.responseError = error;
        that.busy = false;

        if (that.onError) {
          that.onResponseError(rsp);
        }

        return [];
      });
    }
  }]);

  return ItemsProvider;
}();

/* harmony default export */ __webpack_exports__["default"] = (ItemsProvider);

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/tomnoogen/Desktop/work/niiknow/bvtnet-items-provider/src/index.js */"./src/index.js");


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=index.js.map