import { isBooleanArray } from 'src/utils/isBooleanArray'

import { isStringArray } from '../utils/isStringArray'

/************************************************
 * Types and guards
 ************************************************/

export interface ParsedParams {
  fromWorkspace?: boolean
  hspobjectid?: string
  q?: string
  qf?: string
  rows?: number
  start?: number
  sort?: string
  hl?: boolean
  fq?: FilterQuery
  isExtended?: boolean
}

export interface FilterQuery {
  [fieldName: string]:
    | undefined
    | string
    | boolean
    | (string | boolean)[]
    | RangeFilterData
}

export interface RangeFilterData {
  from: number
  to: number
  missing?: boolean
  exact?: boolean
}

export function isRangeFilterData(item: any): item is RangeFilterData {
  return (
    typeof item === 'object' &&
    typeof item.from === 'number' &&
    typeof item.to === 'number'
  )
}

/************************************************
 * Search params to parsed params and vice versa
 ************************************************/

function parseHspObjectIdParam(
  hspobjectid: string | null,
): ParsedParams['hspobjectid'] {
  return hspobjectid || undefined
}

function parseQueryParam(q: string | null): ParsedParams['q'] {
  return q || undefined
}

function parseTrueStringParam(hl: string | null): ParsedParams['hl'] {
  return hl ? hl === 'true' : undefined
}

function parseStartParam(start: string | null): ParsedParams['start'] {
  return parseInt(start as string, 10) || undefined
}

function parseRowsParam(rows: string | null): ParsedParams['start'] {
  return parseInt(rows as string, 10) || undefined
}

function parseSortParam(sort: string | null): ParsedParams['sort'] {
  return sort || undefined
}

function parseQueryFieldsParam(qf: string | null): ParsedParams['qf'] {
  return qf || undefined
}

function parseFilterQueryParam(fq: string | null): ParsedParams['fq'] {
  if (fq === null) {
    return undefined
  }

  let _fq

  // fq must be a valid json string
  try {
    _fq = JSON.parse(fq)
  } catch (e) {
    return undefined
  }

  // fq must be an object
  if (typeof _fq !== 'object') {
    return undefined
  }

  // each entry of fq must be an string, a string|boolean array or range filter data
  if (
    !Object.values(_fq).every(
      (val) =>
        typeof val === 'string' ||
        isBooleanArray(val) ||
        isStringArray(val) ||
        isRangeFilterData(val),
    )
  ) {
    return undefined
  }

  return _fq
}

export function parseSearchParams(search: string): ParsedParams {
  const params = new URLSearchParams(search)

  return {
    hspobjectid: parseHspObjectIdParam(params.get('hspobjectid')),
    fromWorkspace: parseTrueStringParam(params.get('fromWorkspace')),
    q: parseQueryParam(params.get('q')),
    hl: parseTrueStringParam(params.get('hl')),
    start: parseStartParam(params.get('start')),
    rows: parseRowsParam(params.get('rows')),
    sort: parseSortParam(params.get('sort')),
    qf: parseQueryFieldsParam(params.get('qf')),
    fq: parseFilterQueryParam(params.get('fq')),
    isExtended: parseTrueStringParam(params.get('isExtended')),
  }
}

export function toSearchParams(params: ParsedParams): string {
  const search = new URLSearchParams()
  const {
    hspobjectid,
    fromWorkspace,
    q,
    hl,
    start,
    rows,
    qf,
    fq,
    sort,
    isExtended,
  } = params

  hspobjectid && search.set('hspobjectid', hspobjectid)
  fromWorkspace && search.set('fromWorkspace', 'true')
  q && search.set('q', q)
  hl && search.set('hl', 'true')
  start && search.set('start', start.toString())
  rows && search.set('rows', rows.toString())
  sort && search.set('sort', sort.toString())
  qf && search.set('qf', qf)
  fq && search.set('fq', JSON.stringify(fq))
  isExtended && search.set('isExtended', 'true')

  return search.toString()
}
