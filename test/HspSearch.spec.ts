import { fireEvent, screen } from '@testing-library/dom'
import { mockLocation } from 'test/testutils'

import { HspSearch, createHspSearch } from 'src/HspSearch'
import { defaultConfig } from 'src/contexts/config'
import { defaultSearchGroupItem } from 'src/contexts/reducers/extendedSearchReducer'
import { mainState } from 'src/contexts/reducers/mainReducer'
import { ResourceInfo } from 'src/contexts/types'

mockLocation()

test('addEventListener', function (done) {
  const search = createHspSearch(defaultConfig)
  search.addEventListener('linkClicked', (e) => {
    expect(e.detail.href).toBe('http://example.com/foo')
    done()
  })
  search.eventTarget.dispatchEvent(
    new CustomEvent('linkClicked', {
      detail: new URL('http://example.com/foo'),
    }),
  )
})

test('addEventListener returns a function to remove listener', function () {
  let counter1 = 0
  let counter2 = 0
  const search = createHspSearch(defaultConfig)

  function triggerEvent() {
    search.eventTarget.dispatchEvent(
      new CustomEvent('linkClicked', {
        detail: new URL('http://example.com/foo'),
      }),
    )
  }

  const removeListener1 = search.addEventListener(
    'linkClicked',
    () => counter1++,
  )
  const removeListener2 = search.addEventListener(
    'linkClicked',
    () => counter2++,
  )

  triggerEvent()
  expect(counter1).toBe(1)
  expect(counter2).toBe(1)

  removeListener1()
  triggerEvent()
  expect(counter1).toBe(1)
  expect(counter2).toBe(2)

  removeListener2()
  triggerEvent()
  expect(counter1).toBe(1)
  expect(counter2).toBe(2)
})

test('getConfig returns the config values passed to the constructor', function () {
  const config = createHspSearch(defaultConfig).getConfig()
  expect(config).toEqual(defaultConfig)
})

test('getConfig returns default values for missing config values', function () {
  const config = createHspSearch({
    discoveryEndpoint: '/foo',
  }).getConfig()
  expect(config).toEqual({
    ...defaultConfig,
    discoveryEndpoint: '/foo',
  })
})

test('mount, umount, isMounted', async function () {
  const mainContainer = document.createElement('div')
  const searchBarContainer = document.createElement('div')
  document.body.appendChild(mainContainer)
  document.body.appendChild(searchBarContainer)

  const search = createHspSearch(defaultConfig)

  expect(document.getElementById('hsp-search-root')).toBeNull()
  expect(search.isMounted()).toBe(false)

  await search.mount({
    main: mainContainer,
    searchBar: searchBarContainer,
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).not.toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  // Nothing should change here because we did not invoke unmount()
  // before we call mount() a second time. So this call should be ignored.
  await search.mount({
    searchBar: searchBarContainer,
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).not.toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  search.unmount()
  expect(document.getElementById('hsp-search-root')).toBeNull()
  expect(document.getElementById('hsp-search-main')).toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).toBeNull()
  expect(search.isMounted()).toBe(false)

  // render only the seach bar
  await search.mount({
    searchBar: searchBarContainer,
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  search.unmount()
  // At least one container element must be given
  await expect(search.mount({})).rejects.toThrow()
})

test('setState and getState', function () {
  const search = createHspSearch(defaultConfig)
  expect(search.getState().main).toEqual(mainState)
  expect(search.getState().extendedSearch).toEqual({
    extendedSearchGroups: [defaultSearchGroupItem],
  })

  search.setState({
    main: { ...mainState, hitListVariant: 'citations' },
    extendedSearch: { extendedSearchGroups: [defaultSearchGroupItem] },
  })
  expect(search.getState().main.hitListVariant).toEqual('citations')
})

test('setLocation and getLocation', function () {
  const location = {
    pathname: '/foo',
    search: 'q=bar',
    hash: 'baz',
  }

  const search = createHspSearch(defaultConfig)
  search.setLocation(location)

  expect(search.getLocation()).toEqual(location)
})

test('setLanguage and getLanguage', function () {
  const search = createHspSearch(defaultConfig)
  expect(search.getLanguage()).toBe('de')
  search.setLanguage('en')
  expect(search.getLanguage()).toBe('en')
})

test('setSelectedResources and getSelectedResources', function () {
  const resources: ResourceInfo[] = [
    { type: 'hsp:description', id: 'foo' },
    { type: 'iiif:manifest', id: 'bar' },
  ]

  const search = createHspSearch(defaultConfig)
  expect(search.getSelectedResources()).toEqual([])
  search.setSelectedResources(resources)
  expect(search.getSelectedResources()).toEqual(resources)
})

describe('events', function () {
  let search: HspSearch

  beforeAll(async function () {
    const searchBarContainer = document.createElement('div')
    document.body.append(searchBarContainer)

    search = createHspSearch(defaultConfig)
    search.setLanguage('de')

    await search.mount({
      searchBar: searchBarContainer,
    })
  })

  test('searchButtonClicked', function (done) {
    search.addEventListener('searchButtonClicked', (e) => {
      expect(e.detail).toBe('elephants')
      done()
    })

    const box = screen.getByRole('textbox')
    fireEvent.change(box, { target: { value: 'elephants' } })
    const btn = screen.getByRole('button', { name: /suchen/i })
    fireEvent.click(btn)
  })
})
