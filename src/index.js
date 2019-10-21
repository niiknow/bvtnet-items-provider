class ItemsProviderWrapper {
  /**
	 * Initialize an instance of ItemsProviderWrapper
	 *
	 * @return ItemsProviderWrapper an instance of ItemsProviderWrapper
	 */
  constructor(axios, fields) {
    return this.init(axios, fields)
  }

  /**
	 * Initialize an instance of ItemsProviderWrapper
	 * @param  Object axios  an instance of axios
	 * @param  Object fields object containing our fields definition
	 * @return ItemsProviderWrapper       an instance of ItemsProviderWrapper
	 */
  init(axios, fields) {
    const that = this

    that._name = 'ItemsProviderWrapper'
    that.axios = axios
    that.fields = fields
    that.perPage = 15
    that.currentPage = 1
    that.totalRows = 0
    that.sortBy = ''
    that.sortDesc = false
    that.sortDirection = 'asc'
    that.filter = null
    that.filterOn = []

    if (that.fields) {
      const fields = that.fields

      for (let i = 0; i < fields.length; i++) {
        const field = fields[i]
      }
    }
  }

  /**
	 * the provider function to use with bootstrap vue
	 *
	 * @param  Object ctx bootstrap-vue context object
	 * @return Array   array of items
	 */
  provider(ctx) {
    const that = this

    that.isBusy = true

    const promise = axios.get(ctx.apiUrl)

    return promise.then((rsp) => {
      that.response = rsp
   		that.totalRows = rsp.recordsTotal
      const items = rsp.data

      that.isBusy = false
      return (items)
    }).catch(error => {
      that.isBusy = false
      that.error = error
      return []
    })
  }
}

export default ItemsProviderWrapper
