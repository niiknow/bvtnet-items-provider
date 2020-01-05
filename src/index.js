class ItemsProvider {
  /**
	 * Initialize an instance of ItemsProvider
	 *
	 * @return an instance of ItemsProvider
	 */
  constructor(axios, fields) {
    return this.init(axios, fields)
  }

  /**
	 * Initialize an instance of ItemsProvider
	 * @param  Object  axios                  an instance of axios
	 * @param  Object  fields                 object containing our fields definition
	 * @return ItemsProvider       an instance of ItemsProvider
	 */
  init(axios, fields) {
    const that = this
    const isFieldsArray = fields.constructor === Array || Array.isArray(fields)
    const copyable = ['onFieldTranslate', 'key', 'label', 'headerTitle', 'headerAbbr', 'class', 'formatter', 'sortable', 'sortDirection', 'sortByFormatted', 'filterByFormatted', 'tdClass', 'thClass', 'thStyle', 'variant', 'tdAttr', 'thAttr', 'isRowHeader', 'stickyColumn']

    that._name = 'ItemsProvider'
    that.axios = axios
    that.fields = fields
    that.perPage = 15
    that.currentPage = 1
    that.totalRows = 0
    that.sortBy = ''
    that.sortDesc = false
    that.filter = null
    that.filterIgnoredFields = []
    that.filterIncludedFields = []
    that.axiosConfig = {}
    that.columns = []
    that.busy = false
    that.startRow = 0
    that.endRow = 0

    if (!isFieldsArray) {
      that.fields = []

      for (let k in fields) {
        const field = fields[k]
        let col = {}

        field.key  = field.name || field.key || k

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
    // passing the b-table component ad 3rd parameter
    that.items = function (ctx, cb) {
      return that.executeQuery(ctx, cb, this)
    }
  }

  /**
   * safely decode the string
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
   * get the last server Params
   * @return Object server params as an object
   */
  getServerParams() {
    return this._query
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
    const query  = {
      draw: 1,
      start: (that.currentPage - 1) * that.perPage,
      length: that.perPage,
      search: { value: `${ctx.filter || ''}`, regex: (ctx.filter instanceof RegExp) },
      order:[ { column: 0, dir: ctx.sortDesc ? 'desc' : 'asc' } ],
      columns: []
    }

    for(let k in inQuery) {
      query[k] = inQuery[k]
    }

    if (that.sortBy) {
      query.order.column = (that.serverFields[that.sortBy] || { __index: 0 }).__index
    }

    for (let i = 0; i < fields.length; i++) {
      let field = fields[i]
      if (!field.key) {
        field = { key: field }
      }

      const col = {
        data: field.key,
        name: field.key,
        searchable: true,
        // implement this only when we allow for per field filter
        // search: { value: '', regex: false },
        orderable: field.sortable || true
      }

      if (that.filterIgnoredFields && that.filterIgnoredFields.indexOf(field.key) > -1) {
        col.searchable = false
      }

      if (that.filterIncludedFields && that.filterIncludedFields.indexOf(field.key) > -1) {
        col.searchable = true
      }

      if (typeof(that.onFieldTranslate) === 'function') {
        that.onFieldTranslate(field, col)
      }

      query.columns.push(col)
    }

    return query
  }

  /**
	 * the provider function to use with bootstrap vue
	 *
	 * @param  Object ctx bootstrap-vue context object
	 * @return Array   array of items
	 */
  executeQuery(ctx) {
    const that = this
    const apiParts = (ctx.apiUrl || that.apiUrl).split('?')
    let query = {},
      promise = null

    if (that._name !== 'ItemsProvider') {
      throw new Error('Calling context must be of ItemsProvider.')
    }

    if (apiParts.length > 1) {
      query = that.queryParseString(apiParts[1])
    }

    query = that.translateContext(ctx, query)

    if (typeof(that.onBeforeQuery) === 'function') {
      that.onBeforeQuery(query, ctx)
    }

    that.totalRows = that.startRow = that.endRow = 0
    that.busy = true
    that.responseResponse = null
    that.responseError = null
    that.sortDirection = ctx.sortDesc ? 'desc' : 'asc'
    that._apiUrl = apiParts[0]
    that._query = query

    if (that.method === 'POST') {
      promise = that.axios.post(that._apiUrl, query, that.axiosConfig)
    } else {
      const apiUrl = that._apiUrl + '?' + that.queryStringify(query)
      promise = that.axios.get(apiUrl, that.axiosConfig)
    }

    return promise.then(rsp => {
      that.responseResponse = rsp

      let myData = rsp.data
   		that.totalRows = myData.recordsFiltered || myData.recordsTotal
      that.startRow = query.start + 1
      that.endRow = query.start + query.length
      if (that.endRow > that.totalRows || that.endRow < 0) {
        that.endRow = that.totalRows
      }

      that.busy = false

      if (that.onComplete) {
        that.onResponseComplete(rsp)
      }

      return myData.data || []
    }).catch(error => {
      that.responseError = error
      that.busy = false

      if (that.onError) {
        that.onResponseError(rsp)
      }

      return []
    })
  }
}

export default ItemsProvider
