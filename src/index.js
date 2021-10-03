let _name = new WeakMap(),
 _axios = new WeakMap(),
 _localItems = new WeakMap()

class ItemsProvider {
  /**
	 * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
	 * @return             an instance of ItemsProvider
	 */
  constructor(opts) {
    return this.init(opts)
  }

  /**
	 * Initialize an instance of ItemsProvider
   *
   * @param Object opts  options object
	 * @return ItemsProvider       an instance of ItemsProvider
	 */
  init(opts = {}) {
    const that   = this
    const fields = opts.fields || []
    const axios  = opts.axios
    const state  = {}
    const isFieldsArray = fields.constructor === Array || Array.isArray(fields)

    _name.set(that, 'ItemsProvider')
    _axios.set(that, axios)

    that.stateId     = opts.stateId
    that.state       = state
    that.fields      = fields
    that.busy        = false
    that.storage     = opts.storage || window.localStorage
    that.pageLengths = [
      { value: 15, text: '15'},
      { value: 100, text: '100'},
      { value: 500, text: '500'},
      { value: 1000, text: '1000'},
      { value: -1, text: 'All'}
    ]
    that.resetCounterVars()

    state.perPage              = opts.perPage || 15
    state.currentPage          = opts.currentPage || 1
    state.filter               = opts.filter
    state.filterIgnoredFields  = opts.filterIgnoredFields || []
    state.filterIncludedFields = opts.filterIncludedFields || []
    state.searchFields         = opts.searchFields || {}
    state.sortFields           = opts.sortFields || {}
    state.query                = opts.query || {}
    state.queryUrl             = opts.queryUrl

    // field is not array, must be object type
    if (!isFieldsArray) {
      that.fields = []
      // these are either internal or fields listed from b-table
      const copyable = ['onFieldTranslate', 'searchable', 'isLocal', 'key', 'label','headerTitle', 'headerAbbr', 'class', 'formatter', 'sortable', 'sortDirection', 'sortByFormatted', 'filterByFormatted', 'tdClass', 'thClass', 'thStyle', 'variant', 'tdAttr', 'thAttr', 'isRowHeader', 'stickyColumn', 'data', 'name']

      for (let k in fields) {
        const field = fields[k]
        const col   = {}

        field.key = `${field.key || field.name || field.data || k}`

        // disable search and sort for local field
        if (field.isLocal) {
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

    // finally, load states
    if (typeof(that.stateId) === 'string') {

      if (typeof that.onStateLoading === 'function') {
        that.onStateLoading()
      }

      // begin saving state
      const savedState = that.storage.getItem(that.getStateId())
      if (typeof(savedState) === 'string' && savedState.indexOf('}') > 0) {
        const state = JSON.parse(savedState)
        for(let k in state) {
          that.state[k] = state[k]
        }

        if (typeof that.onStateLoaded === 'function') {
          that.onStateLoaded(state)
        }
      }
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
    that.totalRows = that.recordsTotal = that.startRow = that.endRow = 0
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
   * get the axios
   *
   * @return Object the axios object
   */
  getAxios() {
    return _axios.get(this)
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
    const that = this

    that.state.currentPage = 1
    that.totalRows         = items ? items.length : 0
    that.recordsTotal      = that.totalRows
    that.startRow          = that.totalRows > 0 ? 1 : 0
    that.endRow            = that.totalRows
    that.state.perPage     = -1

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
    const state  = that.state
    const qry    = state.extraQuery || {}
    const query  = {
      draw: 1,
      start: (ctx.currentPage - 1) * ctx.perPage,
      length: ctx.perPage,
      search: { value: `${ctx.filter || ''}` },
      order: [],
      columns: [],
      // object spread allow for overriding or passing additional query parameters
      ...qry,
      ...inQuery
    }

    if (ctx.filter instanceof RegExp) {
      query.search.regex = true
      query.search.value = ctx.filter.source
    } else if (typeof(ctx.filter) !== 'string') {
      query.search.value = ''
    }

    let index = -1
    for (let i = 0; i < fields.length; i++) {
      let field = fields[i]
      if (typeof field === 'string') {
        field = { key: field }
      }

      const col = {
        data: field.data || field.key,
        name: field.name || field.key,
        searchable: typeof(field.searchable) === 'undefined' ? true : field.searchable,
        orderable: typeof(field.sortable) === 'undefined' ? true : field.sortable
      }

      if (state.filterIgnoredFields && state.filterIgnoredFields.indexOf(field.key) > -1) {
        col.searchable = false
      }

      if (state.filterIncludedFields && state.filterIncludedFields.indexOf(field.key) > -1) {
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
      if (col.searchable && state.searchFields) {
        const val = state.searchFields[field.key]

        if (val) {
          // actual object with value, then simply assign it
          if (val.value) {
            col.search = val
          } else {
            col.search = col.search || {}
            col.search.value =  { value: `${val || ''}`, regex: false }
            if (val instanceof RegExp) {
              col.search.regex = true
              col.search.value = val.source
            }
          }
        }
      }

      // handle multi-columns sorting
      if (col.orderable && state.sortFields) {
        const sort = state.sortFields[field.key]

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
   * computed state id
   *
   * @return String the computed state id
   */
  getStateId() {
    return `bvtnetip.${this.stateId}`
  }

  /**
   * perform state saving
   *
   * @return Object ItemsProvider
   */
  performSaveState() {
    const that = this

    if (typeof(that.stateId) !== 'string') {
      return that
    }

    if (typeof that.onStateSaving === 'function') {
      that.onStateSaving()
    }

    // begin saving state
    that.storage.setItem(that.getStateId(), JSON.stringify(that.state))

    if (typeof that.onStateSaved === 'function') {
      that.onStateSaved()
    }

    return that
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
    let query = {}

    if (apiParts.length > 1) {
      query = that.queryParseString(apiParts[1])
    }

    query = that.translateContext(ctx, query)

    if (typeof that.onBeforeQuery  === 'function') {
      that.onBeforeQuery(query, ctx)
    }

    that.state.queryUrl = apiParts[0]
    that.state.query    = query

    if (locItems) {
      return locItems
    }

    that.resetCounterVars()
    that.busy = true

    const axios   = that.getAxios()
    const ajaxUrl = that.state.queryUrl
    const promise = (that.method === 'POST') ? axios.post(ajaxUrl, query) : axios.get(`${ajaxUrl}?${that.queryStringify(query)}`)

    return promise.then(rsp => {
      const myData      = rsp.data
   		that.totalRows    = myData.recordsFiltered
      that.startRow     = that.totalRows > 0 ? query.start + 1 : 0
      that.endRow       = query.start + query.length
      that.recordsTotal = myData.recordsTotal

      if (that.endRow > that.totalRows) {
        that.endRow = that.totalRows
      }

      if (typeof that.onResponseComplete === 'function') {
        that.onResponseComplete(rsp)
      }

      that.busy = false

      // finally, save state on successful response
      that.performSaveState()

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
