<template>
  <div
    id="app"
    class="col-12"
  >
    <div class="row">
      <div class="col-12 col-md-9">
        Demo
      </div>
      <div class="col-12 col-md-3">
        <form
          class="form-inline d-flex mx-1 justify-content-end"
          @submit.stop.prevent="doSearch"
        >
          <div class="input-group">
            <input
              v-model="quickSearch"
              type="search"
              placeholder="Quick search"
              class="form-control"
            >
            <div class="input-group-append">
              <button
                type="submit"
                class="btn btn-outline-secondary"
              >
                <i class="mdi mdi-magnify" /> Go
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <!-- Using the b-table component -->
    <b-table
      bordered
      borderless
      hover
      small
      responsivve="sm"
      head-variant="light"
      :items="fetchItems"
      :fields="ip.fields"
      :busy="ip.isBusy"
      :sort-by="ip.sortBy"
      :sort-desc="ip.sortDesc"
      :current-page="ip.currentPage"
      :per-page="ip.perPage"
      :filter="ip.filter"
      :filter-ignored-fields="ip.filterIgnoredFields"
      :filter-included-fields="ip.filterIncludedFields"
      api-url="https://laratt.niiknow.org/api/v1/democontact/example?x-tenant=test&x-api-key=demo123"
    />

    <p class="mt-3">
      Current Page: {{ ip.currentPage }}
    </p>

    <b-pagination
      v-model="ip.currentPage"
      :total-rows="ip.totalRows"
      :per-page="ip.perPage"
      aria-controls="my-table"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import ItemsProvider from '../src'

export default {
  name: 'App',
  data() {
    const vm = this
    const fields = {
      id: {
        sortable: true, searchable: true, label: 'Email'
      },
      email: {
        sortable: true, searchable: true, label: 'Email'
      },
      first_name: {
        sortable: true, searchable: true, label: 'First name'
      },
      last_name: {
        sortable: true, searchable: true, label: 'Last name'
      },
      photo_url: {
        sortable: true, searchable: true, label: 'Photo url'
      },
      address1: {
        sortable: true, searchable: true, label: 'Address1'
      },
      address2: {
        sortable: true, searchable: true, label: 'Address2'
      },
      city: {
        sortable: true, searchable: true, label: 'City'
      },
      state: {
        sortable: true, searchable: true, label: 'State'
      },
      postal: {
        sortable: true, searchable: true, label: 'Postal'
      },
      country: {
        sortable: true, searchable: true, label: 'Country'
      },
      phone: {
        sortable: true, searchable: true, label: 'Phone'
      },
      occupation: {
        sortable: true, searchable: true, label: 'Occupation'
      },
      employer: {
        sortable: true, searchable: true, label: 'Employer'
      },
      note: {
        sortable: true, searchable: true, label: 'Note'
      },
      lat: {
        sortable: true, searchable: true, label: 'Latitude'
      },
      lng: {
        sortable: true, searchable: true, label: 'Longitude'
      }
    }

    const ip = new ItemsProvider(axios, fields)

    return {
      ip: ip,
      quickSearch: ''
    }
  },
  methods: {
    fetchItems(ctx) {
      return this.ip.items(ctx)
    },
    doSearch() {
      this.ip.filter = this.quickSearch
    }
  }
}
</script>

<style scoped>
</style>
