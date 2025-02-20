import {
  FilterQuery,
  parseSearchParams,
  toSearchParams,
} from 'src/contexts/location'

describe('parseSearchParams', function () {
  test('no keys in search params', function () {
    const parsedParams = parseSearchParams('')
    expect(parsedParams).toEqual({})
  })

  test('unknown keys in search params', function () {
    const parsedParams = parseSearchParams('foo=bar')
    expect(parsedParams).toEqual({})
  })

  test('parse hspobjectid', function () {
    const parsedParams = parseSearchParams('hspobjectid=xyz')
    expect(parsedParams).toEqual({ hspobjectid: 'xyz' })
  })

  test('parse q', function () {
    const parsedParams = parseSearchParams('q=foo')
    expect(parsedParams).toEqual({ q: 'foo' })
  })

  test('parse hl', function () {
    let parsedParams = parseSearchParams('hl=true')
    expect(parsedParams).toEqual({ hl: true })
    parsedParams = parseSearchParams('hl=false')
    expect(parsedParams).toEqual({ hl: false })
    parsedParams = parseSearchParams('hl=whatsoever')
    expect(parsedParams).toEqual({ hl: false })
  })

  test('parse start', function () {
    let parsedParams = parseSearchParams('start=3')
    expect(parsedParams).toEqual({ start: 3 })
    parsedParams = parseSearchParams('start=nonumber')
    expect(parsedParams).toEqual({})
  })

  test('parse rows', function () {
    let parsedParams = parseSearchParams('rows=3')
    expect(parsedParams).toEqual({ rows: 3 })
    parsedParams = parseSearchParams('rows=nonumber')
    expect(parsedParams).toEqual({})
  })

  test('parse qf', function () {
    const parsedParams = parseSearchParams('qf=foo')
    expect(parsedParams).toEqual({ qf: 'foo' })
  })

  describe('parse fq', function () {
    test('json string is valid filter query', function () {
      const fq: FilterQuery = {
        field1: 'foo',
        field2: ['bar', 'baz'],
        field3: { from: 1600, to: 1650 },
      }
      const fqJson = JSON.stringify(fq)
      const parsedParams = parseSearchParams(`fq=${fqJson}`)
      expect(parsedParams).toEqual({ fq })
    })

    test('json string is invalid filter query', function () {
      const fq = {
        field1: 'foo',
        field2: [5, 6, 7], // invalid
        field3: { from: 1600, to: 1650 },
      }
      const fqJson = JSON.stringify(fq)
      const parsedParams = parseSearchParams(`fq=${fqJson}`)
      expect(parsedParams).toEqual({})
    })

    test('it is not an json string', function () {
      const parsedParams = parseSearchParams('fq=nojson')
      expect(parsedParams).toEqual({})
    })
  })

  test('multiple keys', function () {
    const search = 'hspobjectid=xyz&q=foo&hl=true&start=4'
    const parsedParams = parseSearchParams(search)
    expect(parsedParams).toEqual({
      hspobjectid: 'xyz',
      q: 'foo',
      hl: true,
      start: 4,
    })
  })
})

describe('toSearchParams', function () {
  test('all parsed params undefined', function () {
    const searchParams = new URLSearchParams(toSearchParams({}))
    expect([...searchParams.keys()].length).toBe(0)
  })

  test('set hspobjectid', function () {
    const searchParams = new URLSearchParams(
      toSearchParams({ hspobjectid: 'xyz' }),
    )
    expect(searchParams.get('hspobjectid')).toBe('xyz')
  })

  test('set q', function () {
    const searchParams = new URLSearchParams(toSearchParams({ q: 'foo' }))
    expect(searchParams.get('q')).toBe('foo')
  })

  test('set hl', function () {
    let searchParams = new URLSearchParams(toSearchParams({ hl: true }))
    expect(searchParams.get('hl')).toBe('true')
    searchParams = new URLSearchParams(toSearchParams({ hl: false }))
    expect(searchParams.get('hl')).toBeNull()
  })

  test('set start', function () {
    const searchParams = new URLSearchParams(toSearchParams({ start: 3 }))
    expect(searchParams.get('start')).toBe('3')
  })

  test('set rows', function () {
    const searchParams = new URLSearchParams(toSearchParams({ rows: 6 }))
    expect(searchParams.get('rows')).toBe('6')
  })

  test('set qf', function () {
    const searchParams = new URLSearchParams(toSearchParams({ qf: 'baz' }))
    expect(searchParams.get('qf')).toBe('baz')
  })

  test('set fq', function () {
    const fq: FilterQuery = {
      field1: 'foo',
      field2: ['bar', 'baz'],
      field3: { from: 1600, to: 1650 },
    }
    const searchParams = new URLSearchParams(toSearchParams({ fq }))
    expect(searchParams.get('fq')).toBe(JSON.stringify(fq))
  })
})
