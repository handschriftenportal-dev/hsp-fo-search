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

import { makeStore, actions, selectors } from 'src/contexts/state'
import { ResourceInfo } from 'src/contexts/types'


test('showFilterList', function() {
  const store = makeStore()
  expect(selectors.getShowFilterList(store.getState())).toBe(false)
  store.dispatch(actions.toggleFilterList())
  expect(selectors.getShowFilterList(store.getState())).toBe(true)
  store.dispatch(actions.toggleFilterList())
  expect(selectors.getShowFilterList(store.getState())).toBe(false)
})

test('modifiedFilterQuery', function() {
  const store = makeStore()
  expect(selectors.getModifiedFilterQuery(store.getState())).toBeUndefined()
  store.dispatch(actions.setModifiedFilterQuery({ field1: 'foo' }))
  expect(selectors.getModifiedFilterQuery(store.getState())).toEqual({ field1: 'foo' })
  store.dispatch(actions.setModifiedFilterQuery({ field1: 'bar', field2: 'baz' }))
  expect(selectors.getModifiedFilterQuery(store.getState())).toEqual({ field1: 'bar', field2: 'baz' })
})

test('hitListVariant', function() {
  const store = makeStore()
  expect(selectors.getHitListVariant(store.getState())).toBe('keyData')
  store.dispatch(actions.setHitListVariant('expanded'))
  expect(selectors.getHitListVariant(store.getState())).toBe('expanded')
  store.dispatch(actions.setHitListVariant('keyData'))
  expect(selectors.getHitListVariant(store.getState())).toBe('keyData')
})

test('selectedResources', function() {
  const resources: ResourceInfo[] = [
    { type: 'hsp:description', id: 'foo' },
    { type: 'iiif:manifest', id: 'bar' }
  ]

  const store = makeStore()
  expect(selectors.getSelectedResources(store.getState())).toEqual([])
  store.dispatch(actions.setSelectedResources(resources))
  expect(selectors.getSelectedResources(store.getState())).toEqual(resources)
})
