# bvtnet-items-provider
> jQuery DataTables.Net ajax items provider for bootstrap-vue b-table

The goal if this library is to provide connection between jQuery datatables.net server-side REST endpoint with client-side b-table of the bootstrap-vue described here - https://bootstrap-vue.js.org/docs/components/table/#using-items-provider-functions

```js
import ItemsProvider from 'bvtnet-items-provider'

const ip = new ItemsProvider(axios, fields)
```

```html
<b-table 
  :items="ip.items"
  :fields="ip.fields"
  :busy="ip.isBusy"
  :sort-by="ip.sortBy"
  :sort-desc="ip.sortDesc"
  :current-page="ip.currentPage"
  :per-page="ip.perPage"
  :filter="ip.filter"
  :filter-ignored-fields="ip.filterIgnoredFields"
  :filter-included-fields="ip.filterIncludedFields"
/>
```

# NOTE
This plugin support most server-side features except for:

1. Per column filtering
2. Multi-column sorting

This is because we have not found a good way to wire this up to the current bootstrap-vue b-table implementation.

# MIT
