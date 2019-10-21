# bvtablenet-items-provider
> jQuery DataTables.Net ajax items provider for bootstrap-vue b-table

The goal if this library is to provide connection between jQuery datatables.net server-side REST endpoint with client-side b-table of the bootstrap-vue described here - https://bootstrap-vue.js.org/docs/components/table/#using-items-provider-functions

```js
import ItemsProviderWrapper from 'bvtablenet-items-provider'

const ipw = new ItemsProviderWrapper(axios, fields)
```

```html
<b-table 
  :items="ipw.provider"
  :fields="ipw.fields"
  :busy="ipw.isBusy"
  :sort-by="ipw.sortBy"
  :sort-desc="ipw.sortDesc"
  :current-page="ipw.currentPage"
  :per-page="ipw.perPage"
  :filter="ipw.filter"
  :filter-ignored-fields="ipw.filterIgnoredFields"
  :filter-included-fields="ipw.filterIncludedFields"
/>
```

# NOTE
This plugin support most searver-side feature except for:

1. Per column filtering
2. Multi-column sorting

# MIT
