import test from 'ava'
import ItemsProvider from '../src/index.js'
import sinon from 'sinon'
import axios from 'axios'

test('ItemsProvider return correct name', t => {
  const ip = new ItemsProvider(null, [])
  t.is(ip.getName(), 'ItemsProvider')
})

test('ItemsProvider can set and return local items', t => {
  const ip = new ItemsProvider(null, [])
  ip.setLocalItems([{name: 'test'}])

  const items = ip.getLocalItems()

  t.is(!!items, true)
  t.is(items.length, 1)
  t.is(ip.totalRows, 1)
  t.is(ip.perPage, -1)
  t.is(ip.isLocal, true)
  t.is(items[0].name, 'test')
})

test('ItemsProvider executeQuery returns local items', t => {
  const ip = new ItemsProvider(null, [])
  ip.setLocalItems([{name: 'test'}])

  const items = ip.executeQuery({ apiUrl: 'test' })

  t.is(!!items, true)
  t.is(items.length, 1)
  t.is(ip.totalRows, 1)
  t.is(ip.perPage, -1)
  t.is(ip.isLocal, true)
  t.is(items[0].name, 'test')
})

test('ItemsProvider.setLocalItems with nulls result in empty array', t => {
  const ip = new ItemsProvider(null, [])
  ip.setLocalItems(null)

  const items = ip.getLocalItems()

  t.is(items, null)
  t.is(ip.totalRows, 0)
  t.is(ip.perPage, -1)
  t.is(ip.isLocal, true)
})

test('ItemsProvider.executeQuery fail and return error', async (t) => {
  sinon.stub(axios, 'get')
    .withArgs('https://www.google.com/?draw=1&start=0&length=1&search%5Bvalue%5D=test&search%5Bregex%5D=false&&&test=unit')
    .returns(new Promise((resolve, reject) => {
      reject('test')
    }))

  const ip = new ItemsProvider(axios, [])
  let errorCalled = false
  ip.onResponseError = (err) => {
    errorCalled = (err === 'test')
  }

  await ip.executeQuery({
    apiUrl: 'https://www.google.com/?test=unit',
    currentPage: 1,
    perPage: 1,
    filter: 'test' }
  )

  axios.get.restore()
  t.is(errorCalled, true)
})
