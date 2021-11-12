/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { screen, fireEvent } from '@testing-library/dom'
import { mockLocation } from 'test/testutils'
import { defaultConfig } from 'src/contexts/config'
import { ResourceInfo } from 'src/contexts/types'
import { defaultState } from 'src/contexts/state'
import { createHspSearch, HspSearch } from 'src/HspSearch'

mockLocation()

test('addEventListener', function(done) {
  const search = createHspSearch(defaultConfig)
  search.addEventListener('linkClicked', e => {
    expect(e.detail.href).toBe('http://example.com/foo')
    done()
  })
  search.eventTarget.dispatchEvent(
    new CustomEvent('linkClicked', {
      detail: new URL('http://example.com/foo')
    }))
})

test('getConfig returns the config values passed to the constructor', function() {
  const config = createHspSearch(defaultConfig).getConfig()
  expect(config).toEqual(defaultConfig)
})

test('getConfig returns default values for missing config values', function() {
  const config = createHspSearch({
    discoveryEndpoint: '/foo'
  }).getConfig()
  expect(config).toEqual({
    ...defaultConfig,
    discoveryEndpoint: '/foo'
  })
})

test('mount, umount, isMounted', async function() {
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
    overviewNavigation: null,
    searchBarOrOverviewNavigation: null,
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).not.toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  // Nothing should change here because we did not invoke unmount()
  // before we call mount() a second time. So this call should be ignored.
  await search.mount({
    main: null,
    searchBar: searchBarContainer,
    overviewNavigation: null,
    searchBarOrOverviewNavigation: null
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).not.toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  await search.unmount()
  expect(document.getElementById('hsp-search-root')).toBeNull()
  expect(document.getElementById('hsp-search-main')).toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).toBeNull()
  expect(search.isMounted()).toBe(false)

  // render only the seach bar
  await search.mount({
    main: null,
    searchBar: searchBarContainer,
    overviewNavigation: null,
    searchBarOrOverviewNavigation: null
  })
  expect(document.getElementById('hsp-search-root')).not.toBeNull()
  expect(document.getElementById('hsp-search-main')).toBeNull()
  expect(document.getElementById('hsp-search-search-bar')).not.toBeNull()
  expect(search.isMounted()).toBe(true)

  await search.unmount()
  // At least one container element must be given
  await expect(search.mount({
    main: null,
    searchBar: null,
    overviewNavigation: null,
    searchBarOrOverviewNavigation: null
  })).rejects.toThrow()
})

test('setState and getState', function() {
  const search = createHspSearch(defaultConfig)
  expect(search.getState()).toEqual(defaultState)
  search.setState({ ...defaultState, hitListVariant: 'citations' })
  expect(search.getState().hitListVariant).toEqual('citations')
})

test('setLocation and getLocation', function() {
  const location = {
    path: '/foo',
    params: new URLSearchParams('q=bar'),
    hash: 'baz',
  }

  const search = createHspSearch(defaultConfig)
  search.setLocation(location)

  expect(search.getLocation()).toEqual(location)
})


test('setLanguage and getLanguage', function() {
  const search = createHspSearch(defaultConfig)
  expect(search.getLanguage()).toBe('de')
  search.setLanguage('en')
  expect(search.getLanguage()).toBe('en')
})

test('setSelectedResources and getSelectedResources', function() {
  const resources: ResourceInfo[] = [
    { type: 'hsp:description', id: 'foo' },
    { type: 'iiif:manifest', id: 'bar' }
  ]

  const search = createHspSearch(defaultConfig)
  expect(search.getSelectedResources()).toEqual([])
  search.setSelectedResources(resources)
  expect(search.getSelectedResources()).toEqual(resources)
})

describe('events', function() {
  let search: HspSearch

  beforeAll(async function() {
    const searchBarContainer = document.createElement('div')
    document.body.append(searchBarContainer)

    search = createHspSearch(defaultConfig)
    search.setLanguage('de')

    await search.mount({
      main: null,
      searchBar: searchBarContainer,
      overviewNavigation: null,
      searchBarOrOverviewNavigation: null,
    })
  })

  test('searchButtonClicked', function(done) {
    search.addEventListener('searchButtonClicked', e => {
      expect(e.detail).toBe('elephants')
      done()
    })

    const box = screen.getByRole('searchbox')
    fireEvent.change(box, { target: { value: 'elephants' } })
    const btn = screen.getByRole('button', { name: /suchen/i })
    fireEvent.click(btn)
  })
})
