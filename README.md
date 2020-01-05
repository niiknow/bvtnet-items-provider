# bvtnet-items-provider
> datatables.net ajax items provider for bootstrap-vue b-table

Demo https://niiknow.github.io/bvtnet-items-provider/

The goal if this library is to connect the datatables.net server-side REST endpoint with b-table of the bootstrap-vue as described here - https://bootstrap-vue.js.org/docs/components/table/#using-items-provider-functions

```html
<b-table 
  :items="ip.items"
  :fields="ip.fields"
  :busy="ip.busy"
  :sort-by="ip.sortBy"
  :sort-desc="ip.sortDesc"
  :current-page="ip.currentPage"
  :per-page="ip.perPage"
  :filter="ip.filter"
  :filter-ignored-fields="ip.filterIgnoredFields"
  :filter-included-fields="ip.filterIncludedFields"
/>
```

```js
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'

Vue.use(BootstrapVue)

import ItemsProvider from '../src'

export default {
  name: 'App',
  data() {
    const fields = [ ... your fields here ... ]
    const ip = new ItemsProvider(axios, fields)

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

This is because b-table does not currently natively support this.  Future work is in progress, see b-table issue links.

# MIT
