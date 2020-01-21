import test from 'ava'
import ItemsProvider from '../src/index.js'

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
  t.is(items[0].name, 'test')
})

test('ItemsProvider.setLocalItems with nulls result in empty array', t => {
  const ip = new ItemsProvider(null, [])
  ip.setLocalItems(null)

  const items = ip.getLocalItems()

  t.is(items, null)
  t.is(ip.totalRows, -1)
  t.is(ip.perPage, -1)
})
