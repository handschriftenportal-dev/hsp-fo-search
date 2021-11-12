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

import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { WebModuleLocation } from 'hsp-web-module'
import { createObservable, Observable } from '../utils/observable'
import { isStringArray } from '../utils/isStringArray'


/************************************************
 * Types and guards
************************************************/

export interface ParsedParams {
  hspobjectid?: string;
  q?: string;
  qf?: string;
  rows?: number;
  start?: number;
  sort?: string;
  hl?: boolean;
  fq?: FilterQuery;
}

export interface FilterQuery {
  [fieldName: string]: undefined | string | string[] | RangeFilterData;
}

export interface RangeFilterData {
  from: number;
  to: number;
  missing?: boolean;
  exact?: boolean;
}

export function isRangeFilterData(item: any): item is RangeFilterData {
  return typeof item === 'object' &&
    typeof item.from === 'number' &&
    typeof item.to === 'number'
}

/************************************************
 * Search params to parsed params and vice versa
************************************************/

function parseHspObjectIdParam(hspobjectid: string | null): ParsedParams['hspobjectid'] {
  return hspobjectid || undefined
}

function parseQueryParam(q: string | null): ParsedParams['q'] {
  return q || undefined
}

function parseHighlightParam(hl: string | null): ParsedParams['hl'] {
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

  // each entry of fq must be an string, a string array or range filter data
  if (!Object.values(_fq).every(val => typeof val === 'string' || isStringArray(val) || isRangeFilterData(val))) {
    return undefined
  }

  return _fq
}

export function parseSearchParams(params: URLSearchParams): ParsedParams {
  return {
    hspobjectid: parseHspObjectIdParam(params.get('hspobjectid')),
    q: parseQueryParam(params.get('q')),
    hl: parseHighlightParam(params.get('hl')),
    start: parseStartParam(params.get('start')),
    rows: parseRowsParam(params.get('rows')),
    sort: parseSortParam(params.get('sort')),
    qf: parseQueryFieldsParam(params.get('qf')),
    fq: parseFilterQueryParam(params.get('fq')),
  }
}

export function toSearchParams(params: ParsedParams): URLSearchParams {
  const search = new URLSearchParams()
  const { hspobjectid, q, hl, start, rows, qf, fq, sort } = params

  hspobjectid && search.set('hspobjectid', hspobjectid)
  q && search.set('q', q)
  hl && search.set('hl', 'true')
  start && search.set('start', start.toString())
  rows && search.set('rows', rows.toString())
  sort && search.set('sort', sort.toString())
  qf && search.set('qf', qf)
  fq && search.set('fq', JSON.stringify(fq))

  return search
}

/************************************************
 * Context
************************************************/

export type LocationStore = Observable<WebModuleLocation>

export function createLocationStore(location: WebModuleLocation): LocationStore {
  return createObservable(location)
}

export const LocationContext = createContext(createLocationStore({
  path: '/',
  params: new URLSearchParams(),
  hash: ''
}))

/************************************************
 * Hooks
************************************************/

export function useLocation() {
  const locationStore = useContext(LocationContext)
  const [location, setLocation] = useState(locationStore.get())

  useEffect(() => {
    return locationStore.subscribe(setLocation)
  }, [])

  return location
}

export function useParsedParams() {
  const location = useLocation()

  return useMemo(() => {
    return parseSearchParams(location.params)
  }, [location.params])
}


