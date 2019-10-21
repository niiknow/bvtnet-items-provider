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
  :fields="ipw.bvFields"
  :busy="ipw.busy"
  :sort-by="ipw.sortBy"
  :sort-desc="ipw.sortDesc"
  :sort-direction="ipw.sortDirection"
  :current-page="ipw.currentPage"
  :per-page="ipw.perPage"
  :filter="ipw.filter"
/>
```
