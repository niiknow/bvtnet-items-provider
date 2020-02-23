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
  :current-page="ip.currentPage"
  :per-page="ip.perPage"
  :filter="ip.filter"
  :filter-ignored-fields="ip.filterIgnoredFields"
  :filter-included-fields="ip.filterIncludedFields"
/>
<b-pagination
  v-model="ip.currentPage"
  :total-rows="ip.totalRows"
  :per-page="ip.perPage"
/>
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

# RELEASE
1.0.0 - Future release with new features
    * custom per column filtering provide options.search object
    * additional options.extraQuery object - hint custom date range search
    * custom multi-column sorting with options.sort object
    * introducing `saveStateId` property saving previous state and query on local storage.  Big change is moving several bindable fields to provider.state object.

0.9.9 - remove multi-parameters construction, opting for single object parameter construction as options

# MIT
