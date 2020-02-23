let _name = new WeakMap(),
 _ajaxUrl = new WeakMap(),
 _query = new WeakMap(),
 _axios = new WeakMap(),
 _localItems = new WeakMap()

class ItemsProvider {
  /**
	 * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
	 * @return             an instance of ItemsProvider
	 */
  constructor(opts, fields) {
    const that = this

    // temp support backward compatibility with version < 1.0
    if (typeof(fields) !== 'undefined') {
      console.log('multi-parameters constructor has been deprecated in 0.9.9 and will be removed in 1.0.0 release.')
      return that.init({
        fields: fields,
        axios: opts
      })
    }

    return that.init(opts)
  }

  /**
	 * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
	 * @return ItemsProvider       an instance of ItemsProvider
	 */
  init(opts = {}) {
    const that   = this
    const fields = opts.fields
    const axios  = opts.axios
    // validate fields and axios

    const isFieldsArray = fields.constructor === Array || Array.isArray(fields)
    const copyable = [
      'onFieldTranslate', 'searchable', 'isLocal', 'key', 'label',
      'headerTitle', 'headerAbbr', 'class', 'formatter', 'sortable',
      'sortDirection', 'sortByFormatted', 'filterByFormatted', 'tdClass',
      'thClass', 'thStyle', 'variant', 'tdAttr', 'thAttr', 'isRowHeader',
      'stickyColumn'
    ] // these are either internal or fields listed from b-table

    _name.set(that, 'ItemsProvider')
    _axios.set(that, axios)

    that.opts                 = opts
    that.fields               = fields
    that.perPage              = 15
    that.currentPage          = 1
    that.filter               = null
    that.filterIgnoredFields  = []
    that.filterIncludedFields = []
    that.busy                 = false
    that.totalRows            = 0
    that.isLocal              = false
    that.pageLengths = [
      { value: 15, text: '15'},
      { value: 100, text: '100'},
      { value: 500, text: '500'},
      { value: 1000, text: '1000'},
      { value: -1, text: 'All'}
    ]
    that.resetCounterVars()

    if (!isFieldsArray) {
      that.fields = []

      for (let k in fields) {
        const field = fields[k]
        let col = {}

        field.key  = `${field.key || field.name || field.data || k}`

        // disable search and sort for local field
        if (field.isLocal || `${field.key}` === '') {
          field.searchable = false
          field.sortable  = false
          delete field['filterByFormatted']
        }

        for(let i = 0; i < copyable.length; i++) {
          if (field.hasOwnProperty(copyable[i])) {
            col[copyable[i]] = field[copyable[i]]
          }
        }

        that.fields.push(col)
      }
    }

    // retaining the this context
    // passing the b-table component as 3rd parameter
    that.items = function (ctx, cb) {
      return that.executeQuery(ctx, cb, this)
    }

    return that
  }

  /**
   * Reset counter ariables
   *
   * @return void
   */
  resetCounterVars() {
    const that = this
    that.startRow = that.endRow = 0
  }

  /**
   * get the component name
   *
   * @return String component name
   */
  getName() {
    return _name.get(this)
  }

  /**
   * Get last server params
   *
   * @return Object last server parameters/query object
   */
  getServerParams() {
    return _query.get(this)
  }

  /**
   * get the axios
   *
   * @return Object the axios object
   */
  getAxios() {
    return _axios.get(this)
  }

  /**
   * get last ajax url (without query)
   *
   * @return String the last ajax url without query/server parameters object
   */
  getAjaxUrl() {
    return _ajaxUrl.get(this)
  }

  /**
   * Get the local items
   *
   * @param  Function a callback function to return local items data
   * @return Array array of local items or empty
   */
  getLocalItems(cb = null) {
    const items = _localItems.get(this)
    if (items && cb) {
      cb(items)
    }

    return items
  }

  /**
   * Set local items
   *
   * @param Array items list of local items
   */
  setLocalItems(items) {
    const that       = this
    that.currentPage = 1
    that.startRow    = 1
    that.totalRows   = items ? items.length : 0
    that.endRow      = that.totalRows
    that.perPage     = -1
    that.isLocal     = true

    _localItems.set(this, items)
  }

  /**
   * safely decode the string
   *
   * @param  String str
   * @return String url decoded string
   */
  decode(str) {
    try {
      return decodeURIComponent(str.replace(/\+/g, ' '))
    } catch (e) {
      return str
    }
  }

  /**
   * safely encode the string
   *
   * @param  String str
   * @return String url encoded string
   */
  encode(str) {
    try {
      return encodeURIComponent(str)
    } catch (e) {
      return str
    }
  }

  /**
   * helper method to parse querystring to object
   *
   * @param  String qstr the querystring
   * @return Object      result
   */
  queryParseString(qstr) {
    qstr = (qstr || '').replace('?', '').replace('#', '')

    const pattern = /(\w+)\[(\d+)\]/
    const decode = this.decode,
      obj = {},
      a = qstr.split('&')

    for (let i = 0; i < a.length; i++) {
      let parts = a[i].split('='),
        key = decode(parts[0]),
        m = pattern.exec(key)

      if (m) {
        obj[m[1]] = obj[m[1]] || []
        obj[m[1]][m[2]] = decode(parts[1])
        continue
      }

      obj[parts[0]] = decode(parts[1] || '')
    }

    return obj
  }

  /**
   * reverse object to query string
   *
   * @param  Object obj the object
   * @return String     the query string
   */
  queryStringify(obj, prefix) {
    const that   = this
    const encode = that.encode

    let str = [], p

    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + '[' + p + ']' : p, v = obj[p]

        str.push((v !== null && typeof v === 'object') ?
          that.queryStringify(v, k) :
          encode(k) + '=' + encode(v))
      }
    }

    return str.join('&')
  }

  /**
   * translate the context to datatables.net query object
   *
   * @param  Object  ctx the context object
   * @param  inQuery the additional query data
   * @return Object    the query object
   */
  translateContext(ctx, inQuery = {}) {
    const that   = this
    const fields = that.fields
    const opts   = that.opts
    const qry    = opts.extraQuery || {}
    const query  = {
      draw: 1,
      start: (ctx.currentPage - 1) * ctx.perPage,
      length: ctx.perPage,
      search: { value: `${ctx.filter || ''}`, regex: (ctx.filter instanceof RegExp) },
      order: [],
      columns: [],
      // object spread allow for overriding or passing additional query parameters
      ...qry
    }

    for(let k in inQuery) {
      query[k] = inQuery[k]
    }

    if (query.search.regex) {
      query.search.value = ctx.filter.source
    }

    let index = 0
    for (const i = 0; i < fields.length; i++) {
      let field = fields[i]
      if (typeof field === 'string') {
        field = { key: field }
      }

      const col = {
        data: field.key,
        name: field.key,
        searchable: true,
        orderable: field.sortable || true
      }

      if (that.filterIgnoredFields && that.filterIgnoredFields.indexOf(field.key) > -1) {
        col.searchable = false
      }

      if (that.filterIncludedFields && that.filterIncludedFields.indexOf(field.key) > -1) {
        col.searchable = true
      }

      if (typeof that.onFieldTranslate === 'function') {
        that.onFieldTranslate(field, col)
      }

      // skip local field or empty key
      if (field.isLocal || `${field.key}` === '') {
        continue
      } else {
        query.columns.push(col)
        index++
      }

      // handle server-side for non-local fields
      if (col.orderable && ctx.sortBy === field.key) {
        query.order.push({column: index, dir: ctx.sortDesc ? 'desc' : 'asc' })
      }

      // implement per field search/filtering
      if (col.searchable && opts.search) {
        const val = opts.search[field.key]

        if (val) {
          col.search = col.search || {}
          col.search.regex  = (val instanceof RegExp) || false
          col.search.value =  ol.search.regex ? val.source : `${val || ''}`
        }
      }

      // handle multi-columns sorting
      if (col.orderable && opts.sorts) {
        const sort = opts.sorts[col.key]

        // validate valid values
        if (sort === 'asc' || sort  === 'desc') {
          query.order.push({ column: index, dir: sort })
        }
      }
    }

    if (query.columns.length <= 0) {
      delete query['columns']
    }

    return query
  }

  /**
	 * the provider function to use with bootstrap vue
	 *
	 * @param  Object   ctx bootstrap-vue context object
   * @param  Function cb the callback function
	 * @return Array   array of items
	 */
  executeQuery(ctx, cb = null) {
    const that     = this
    const locItems = that.getLocalItems(cb)
    const apiParts = (ctx.apiUrl || that.apiUrl).split('?')
    let query = {},
      promise = null

    if (apiParts.length > 1) {
      query = that.queryParseString(apiParts[1])
    }

    query = that.translateContext(ctx, query)

    if (typeof that.onBeforeQuery  === 'function') {
      that.onBeforeQuery(query, ctx)
    }

    _ajaxUrl.set(that, apiParts[0])
    _query.set(that, query)

    if (locItems) {
      return locItems
    }

    that.resetCounterVars()
    that.busy    = true
    that.isLocal = false

    const axios = that.getAxios()

    if (that.method === 'POST') {
      promise = axios.post(that.getAjaxUrl(), query)
    } else {
      const apiUrl = that.getAjaxUrl() + '?' + that.queryStringify(query)
      promise = axios.get(apiUrl)
    }

    return promise.then(rsp => {
      let myData     = rsp.data
   		that.totalRows = myData.recordsFiltered || myData.recordsTotal
      that.startRow  = query.start + 1
      that.endRow    = query.start + query.length

      if (that.endRow > that.totalRows || that.endRow < 0) {
        that.endRow = that.totalRows
      }

      if (typeof that.onResponseComplete === 'function') {
        that.onResponseComplete(rsp)
      }

      that.busy = false

      return myData.data || []
    }).catch(err => {
      that.busy = false

      if (typeof that.onResponseError === 'function') {
        that.onResponseError(err)
      }

      return []
    })
  }
}

export default ItemsProvider
