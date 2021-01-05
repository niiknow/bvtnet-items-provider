[![Build Status](https://travis-ci.org/niiknow/bvtnet-items-provider.svg?branch=master)](https://travis-ci.org/niiknow/bvtnet-items-provider)
# bvtnet-items-provider
> datatables.net ajax items provider for bootstrap-vue b-table

Demo https://niiknow.github.io/bvtnet-items-provider/

The goal if this library is to connect the datatables.net server-side REST endpoint with b-table of the bootstrap-vue as described here:
https://bootstrap-vue.js.org/docs/components/table/#using-items-provider-functions and
https://datatables.net/manual/server-side

```html
<b-table 
  :items="ip.items"
  :fields="ip.fields"
  :busy="ip.busy"
  :current-page="ip.state.currentPage"
  :per-page="ip.state.perPage"
  :filter="ip.state.filter"
  :filter-ignored-fields="ip.state.filterIgnoredFields"
  :filter-included-fields="ip.state.filterIncludedFields"
/>
<div 
  v-if="ip.totalRows > 0"
  class="row"
>
  <b-pagination
    v-model="ip.state.currentPage"
    :per-page="ip.state.perPage"
    :total-rows="ip.totalRows"
  />
</div>
```

```js
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

Vue.use(BootstrapVue)

import ItemsProvider from 'bvtnet-items-provider'

export default {
  name: 'App',
  data() {
    const fields = [ ... your fields here ... ]
    const ip = new ItemsProvider({axios: axios, fields: fields})

    return {
      ip: ip
    }
  }
}
````
# NOTE
This plugin support most server-side features except for:

1. Per column filtering - https://github.com/bootstrap-vue/bootstrap-vue/issues/1970
2. Multi-column sorting - https://github.com/bootstrap-vue/bootstrap-vue/issues/2068

This is because b-table does not currently natively support it.  Future work is in progress, see b-table issue links.

Although this Component was written for datatables.net and b-table, it is a completely independent library written based off API contracts.

# State Object
> Below are fields on the state object, which are useful for binding to various components in Vue.  If `saveStateId` is provided, then this object get saved after successful data returned from ajax called and reload right after ItemsProvider construction.


[x] `currentPage` - save the current page

[x] `perPage` - save the per page selection

[x] `filter` - save the search filter

[x] `filterIgnoredFields` - array of ignored fields - see b-table

[x] `filterIncludedFields` - array of included fields - see b-table

[x] `searchFields` - per-column field search/filter

[x] `extraQuery` - additional query parameters

[x] `sortFields` - per-column field sorting

# RELEASE
1.0.0 - Future release with new features.  Big change in this release is the moving several bindable properties `perPage, currentPage, filter, filterIgnoredFields, filterIncludedFields` to `provider.state` object.  This allow for logical separation between what are being saved to the `localStorage`

* custom per-column filtering provide `options.searchFields` as key-value object
* additional `options.extraQuery` as key-value object - allow for custom advance search, such as range search on date or numeric column
* custom multi-column sorting with `options.sortFields` as key-value object
* introducing `saveStateId` property for saving previous state and query on `localStorage`.  

0.9.9 - remove multi-parameters constructor for single object parameter, update doc to prep for version 1.0.0 release.

# MIT
