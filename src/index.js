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
	 * @param  Object axios  an instance of axios
	 * @param  Object fields object containing our fields definition
	 * @return ItemsProvider       an instance of ItemsProvider
	 */
  init(axios, fields) {
    const that = this

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
    that.isBusy = false
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
  queryStringify(obj) {
    let str = '',
      encode = this.encode

    for(let k in obj) {
      str += `&${k}=${encode(obj[k])}`
    }

    return str.replace('&', '')
  }

  /**
   * translate the context to datatables.net query object
   *
   * @param  Object ctx the context object
   * @return Object    the query object
   */
  translateContext(ctx) {
    const that = this
    const query = {
      draw: 1,
      start: that.currentPage * that.perPage,
      length: that.perPage,
      search: { value: `${ctx.filter || ''}`, regex: (ctx.filter instanceof RegExp) },
      order:[ { column: 0, dir: ctx.sortDesc ? 'desc' : 'asc' } ],
      columns: []
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
  items(ctx) {
    const that = this
    const apiParts = ctx.apiUrl.split('?')
    let query = {},
      promise = null

    if (apiParts.length > 1) {
      query = that.queryParseString(apiParts[1])
    }

    query = that.translateContext(ctx, query)

    if (typeof(that.onBeforeQuery) === 'function') {
      that.onBeforeQuery(query, ctx)
    }

    that.isBusy = true
    that.ajaxResponse = null
    that.ajaxError = null
    that.sortDirection = ctx.sortDesc ? 'desc' : 'asc'

    if (that.method === 'POST') {
      promise = that.axios.post(ctx.apiUrl, query, that.axiosConfig)
    } else {
      const apiUrl = apiParts[0] + '?' + that.queryStringify(query)
      promise = that.axios.get(apiUrl, that.axiosConfig)
    }

    return promise.then((rsp) => {
      that.ajaxResponse = rsp
   		that.totalRows = rsp.recordsTotal
      that.isBusy = false
      return (rsp.data)
    }).catch(error => {
      that.ajaxError = error
      that.isBusy = false
      return []
    })
  }
}

export default ItemsProvider
