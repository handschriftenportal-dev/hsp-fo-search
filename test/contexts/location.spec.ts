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

import {
  parseSearchParams,
  toSearchParams,
  FilterQuery,
} from 'src/contexts/location'


describe('parseSearchParams', function() {
  test('no keys in search params', function() {
    const parsedParams = parseSearchParams(new URLSearchParams(''))
    expect(parsedParams).toEqual({})
  })

  test('unknown keys in search params', function() {
    const parsedParams = parseSearchParams(new URLSearchParams('foo=bar'))
    expect(parsedParams).toEqual({})
  })

  test('parse hspobjectid', function() {
    const parsedParams = parseSearchParams(new URLSearchParams('hspobjectid=xyz'))
    expect(parsedParams).toEqual({ hspobjectid: 'xyz' })
  })

  test('parse q', function() {
    const parsedParams = parseSearchParams(new URLSearchParams('q=foo'))
    expect(parsedParams).toEqual({ q: 'foo' })
  })

  test('parse hl', function() {
    let parsedParams = parseSearchParams(new URLSearchParams('hl=true'))
    expect(parsedParams).toEqual({ hl: true })
    parsedParams = parseSearchParams(new URLSearchParams('hl=false'))
    expect(parsedParams).toEqual({ hl: false })
    parsedParams = parseSearchParams(new URLSearchParams('hl=whatsoever'))
    expect(parsedParams).toEqual({ hl: false })
  })

  test('parse start', function() {
    let parsedParams = parseSearchParams(new URLSearchParams('start=3'))
    expect(parsedParams).toEqual({ start: 3 })
    parsedParams = parseSearchParams(new URLSearchParams('start=nonumber'))
    expect(parsedParams).toEqual({})
  })

  test('parse rows', function() {
    let parsedParams = parseSearchParams(new URLSearchParams('rows=3'))
    expect(parsedParams).toEqual({ rows: 3 })
    parsedParams = parseSearchParams(new URLSearchParams('rows=nonumber'))
    expect(parsedParams).toEqual({})
  })

  test('parse qf', function() {
    const parsedParams = parseSearchParams(new URLSearchParams('qf=foo'))
    expect(parsedParams).toEqual({ qf: 'foo' })
  })

  describe('parse fq', function() {
    test('json string is valid filter query', function() {
      const fq: FilterQuery = {
        field1: 'foo',
        field2: ['bar', 'baz'],
        field3: { from: 1600, to: 1650 }
      }
      const fqJson = JSON.stringify(fq)
      const parsedParams = parseSearchParams(new URLSearchParams(`fq=${fqJson}`))
      expect(parsedParams).toEqual({ fq: fq })
    })

    test('json string is invalid filter query', function() {
      const fq = {
        field1: 'foo',
        field2: [5, 6, 7], // invalid
        field3: { from: 1600, to: 1650 }
      }
      const fqJson = JSON.stringify(fq)
      const parsedParams = parseSearchParams(new URLSearchParams(`fq=${fqJson}`))
      expect(parsedParams).toEqual({})
    })

    test('it is not an json string', function() {
      const parsedParams = parseSearchParams(new URLSearchParams('fq=nojson'))
      expect(parsedParams).toEqual({})
    })
  })

  test('multiple keys', function() {
    const search = 'hspobjectid=xyz&q=foo&hl=true&start=4'
    const parsedParams = parseSearchParams(new URLSearchParams(search))
    expect(parsedParams).toEqual({
      hspobjectid: 'xyz',
      q: 'foo',
      hl: true,
      start: 4
    })
  })
})

describe('toSearchParams', function() {
  test('all parsed params undefined', function() {
    const searchParams = toSearchParams({})
    expect([...searchParams.keys()].length).toBe(0)
  })

  test('set hspobjectid', function() {
    const searchParams = toSearchParams({ hspobjectid: 'xyz' })
    expect(searchParams.get('hspobjectid')).toBe('xyz')
  })

  test('set q', function() {
    const searchParams = toSearchParams({ q: 'foo' })
    expect(searchParams.get('q')).toBe('foo')
  })

  test('set hl', function() {
    let searchParams = toSearchParams({ hl: true })
    expect(searchParams.get('hl')).toBe('true')
    searchParams = toSearchParams({ hl: false })
    expect(searchParams.get('hl')).toBeNull()
  })

  test('set start', function() {
    const searchParams = toSearchParams({ start: 3 })
    expect(searchParams.get('start')).toBe('3')
  })

  test('set rows', function() {
    const searchParams = toSearchParams({ rows: 6 })
    expect(searchParams.get('rows')).toBe('6')
  })

  test('set qf', function() {
    const searchParams = toSearchParams({ qf: 'baz' })
    expect(searchParams.get('qf')).toBe('baz')
  })

  test('set qf', function() {
    const fq: FilterQuery = {
      field1: 'foo',
      field2: ['bar', 'baz'],
      field3: { from: 1600, to: 1650 }
    }
    const searchParams = toSearchParams({ fq })
    expect(searchParams.get('fq')).toBe(JSON.stringify(fq))
  })

})
