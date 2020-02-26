import test from 'ava'
import ItemsProvider from '../src/index.js'
import sinon from 'sinon'

test('ItemsProvider decode, encode error', t => {
  const ip = new ItemsProvider({axios: null, fields: []})

  t.is(ip.decode(undefined), undefined)
  t.is(ip.encode('\uD800'), '\uD800')
})

test('ItemsProvider return correct name', t => {
  const ip = new ItemsProvider({axios: null, fields: []})
  t.is(ip.getName(), 'ItemsProvider')
})

test('ItemsProvider can set and return local items', t => {
  const ip = new ItemsProvider({axios: null, fields: []})
  ip.setLocalItems([{name: 'test'}])
  let called = false
  const items = ip.getLocalItems((data) => {
    called = true
  })

  t.is(called, true)
  t.is(!!items, true)
  t.is(items.length, 1)
  t.is(ip.state.totalRows, 1)
  t.is(ip.state.perPage, -1)
  t.is(ip.state.isLocal, true)
  t.is(items[0].name, 'test')
})

test('ItemsProvider executeQuery returns local items', t => {
  const ip = new ItemsProvider({axios: null, fields: []})
  ip.setLocalItems([{name: 'test'}])

  const items = ip.executeQuery({ apiUrl: 'test' })

  t.is(!!items, true)
  t.is(items.length, 1)
  t.is(ip.state.totalRows, 1)
  t.is(ip.state.perPage, -1)
  t.is(ip.state.isLocal, true)
  t.is(items[0].name, 'test')
})

test('ItemsProvider.setLocalItems with nulls', t => {
  const ip = new ItemsProvider({axios: null, fields: { test1: { name: 'test', isLocal: true }}})
  ip.setLocalItems(null)

  const items = ip.getLocalItems()

  t.is(items, null)
  t.is(ip.state.totalRows, 0)
  t.is(ip.state.perPage, -1)
  t.is(ip.state.isLocal, true)
})

test('ItemsProvider.executeQuery fail and return error', async (t) => {
  const fakeAxios = {}
  fakeAxios.get = sinon.fake.returns(new Promise((resolve, reject) => {
    reject('test')
  }))

  const ip = new ItemsProvider({axios: fakeAxios, fields: ['fake']})
  let errorCalled = false
  ip.onResponseError = (err) => {
    errorCalled = (err === 'test')
  }

  await ip.executeQuery({
    apiUrl: 'https://www.google.com/?test=unit&fakeArray[1]=a',
    currentPage: 1,
    perPage: 1,
    filter: /asdf/gi
  })

  t.is(errorCalled, true)
})


test('ItemsProvider.executeQuery and return empty array', async (t) => {
  const fakeAxios = {}
  fakeAxios.get = sinon.fake.returns(new Promise((resolve, reject) => {
    reject('test')
  }))

  const ip = new ItemsProvider({axios: fakeAxios, fields: ['fake']})

  const rst = await ip.executeQuery({
    apiUrl: 'https://www.google.com/?test=unit&fakeArray[1]=a',
    currentPage: 1,
    perPage: 1,
    filter: /asdf/gi
  })

  t.is(Array.isArray(rst), true)
  t.is(rst.length, 0)
})

test('ItemsProvider.items success', async (t) => {
  const fakeAxios = {}
  fakeAxios.get = sinon.fake.returns(new Promise((resolve, reject) => {
    resolve({
      data: {
        recordsFiltered: 0,
        recordsTotal: 1,
        data: null
      }
    })
  }))
  let translated = false

  const ip = new ItemsProvider({
    axios: fakeAxios,
    fields: [
      {
        key: 'test0',
        sortable: false
      },
      { key: 'test1',
        sortable: true,
        searchable: false
      },
      { key: 'test2',
        sortable: true
      },
      { key: 'test3',
        sortable: true
      },
      { key: 'test4',
        sortable: true
      },
      {
        key: ''
      }
    ],
    sortFields: { test0: 'desc', test1: 'asc', test3: 'desc' },
    searchFields: { test1: { value: 'test', regex: true }, test2: 'test', test3: /test/gi },
    filterIgnoredFields: ['test4'],
    filterIncludedFields: ['test1']  // revert defined above, test below
  })

  let success = false, beforeQuery = false
  ip.onResponseComplete = () => {
    success = true
  }
  ip.onBeforeQuery = () => {
    beforeQuery = true
  }
  ip.onFieldTranslate = () => {
    translated = true
  }

  await ip.items({
    apiUrl: 'https://www.google.com/?test=unit',
    currentPage: 1,
    perPage: 15,
    filter: 'test',
    sortBy: 'test4'
  })

  t.true(translated)
  t.true(success)
  t.true(beforeQuery)

  const query = ip.state.query
  // console.log(query)

  // assert sortFields test1 above
  t.is(query.order[0].column, 1)
  t.is(query.order[0].dir, 'asc')

  // assert sortFields test1 above
  t.is(query.columns[0].search, undefined)
  // filter included fields
  t.not(query.columns[1].search, undefined)
  // filter excluded fields
  t.is(query.columns[4].search, undefined)
})
