import { actions } from 'src/contexts/actions'
import { mainState } from 'src/contexts/reducers/mainReducer'
import { makeStore, selectors } from 'src/contexts/state'
import { ResourceInfo } from 'src/contexts/types'

test('location', function () {
  const store = makeStore()
  expect(selectors.getLocation(store.getState()).pathname).toBe('/')
  expect(selectors.getLocation(store.getState()).search).toBe(
    mainState.location.search,
  )
  expect(selectors.getLocation(store.getState()).hash).toBe('')
  store.dispatch(
    actions.setLocation({
      pathname: '/foo',
      search: 'q=bar',
      hash: 'baz',
    }),
  )
  expect(selectors.getLocation(store.getState()).pathname).toBe('/foo')
  expect(selectors.getLocation(store.getState()).search).toBe('q=bar')
  expect(selectors.getLocation(store.getState()).hash).toBe('baz')
})

test('i18nConfig', function () {
  const store = makeStore()
  expect(selectors.getI18nConfig(store.getState())).toEqual({
    language: 'de',
    disableTranslation: false,
  })
  store.dispatch(
    actions.setI18nConfig({
      language: 'en',
      disableTranslation: true,
    }),
  )
  expect(selectors.getI18nConfig(store.getState())).toEqual({
    language: 'en',
    disableTranslation: true,
  })
})

test('showFilterList', function () {
  const store = makeStore()
  expect(selectors.getShowFilterList(store.getState())).toBe(false)
  store.dispatch(actions.toggleFilterList())
  expect(selectors.getShowFilterList(store.getState())).toBe(true)
  store.dispatch(actions.toggleFilterList())
  expect(selectors.getShowFilterList(store.getState())).toBe(false)
})

test('modifiedFilterQuery', function () {
  const store = makeStore()
  expect(selectors.getModifiedFilterQuery(store.getState())).toBeUndefined()
  store.dispatch(actions.setModifiedFilterQuery({ field1: 'foo' }))
  expect(selectors.getModifiedFilterQuery(store.getState())).toEqual({
    field1: 'foo',
  })
  store.dispatch(
    actions.setModifiedFilterQuery({ field1: 'bar', field2: 'baz' }),
  )
  expect(selectors.getModifiedFilterQuery(store.getState())).toEqual({
    field1: 'bar',
    field2: 'baz',
  })
})

test('hitListVariant', function () {
  const store = makeStore()
  expect(selectors.getHitListVariant(store.getState())).toBe('expanded')
  store.dispatch(actions.setHitListVariant('keyData'))
  expect(selectors.getHitListVariant(store.getState())).toBe('keyData')
  store.dispatch(actions.setHitListVariant('expanded'))
  expect(selectors.getHitListVariant(store.getState())).toBe('expanded')
})

test('selectedResources', function () {
  const resources: ResourceInfo[] = [
    { type: 'hsp:description', id: 'foo' },
    { type: 'iiif:manifest', id: 'bar' },
  ]

  const store = makeStore()
  expect(selectors.getSelectedResources(store.getState())).toEqual([])
  store.dispatch(actions.setSelectedResources(resources))
  expect(selectors.getSelectedResources(store.getState())).toEqual(resources)
})
