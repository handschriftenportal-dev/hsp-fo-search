import qs from 'qs'
import { useQuery } from 'react-query'
import urlJoin from 'url-join'

import { useConfig } from './config'
import { ParsedParams } from './location'

// /////////////////////////////////////////////////////////
// building blocks
// /////////////////////////////////////////////////////////

export interface HspDocument {
  id: string
  type:
    | 'hsp:object'
    | 'hsp:description'
    | 'hsp:description_retro'
    | 'hsp:digitized'
  'group-id': string
}

export interface HspCoreData {
  'dimensions-display': string | null
  'format-display': string | null
  'has-notation-display': string | null
  'idno-display': string | null
  'illuminated-display': string | null
  'language-display': string[] | null
  'leaves-count-display': string | null
  'material-display': string[] | null
  'object-type-display': string | null
  'orig-date-lang-display': string[] | null
  'orig-place-display': string[] | null
  'persistent-url-display': string | null
  'repository-display': string | null
  'settlement-display': string | null
  'status-display': string | null
  'title-display': string | null
}

export interface HspObject extends HspDocument, HspCoreData {
  type: 'hsp:object'
  'former-ms-identifier-display': string[] | null
}

export interface HspDescription extends HspDocument, HspCoreData {
  type: 'hsp:description' | 'hsp:description_retro'
  'catalog-id-display': string | null
  'catalog-iiif-manifest-range-url-display': string | null
  'catalog-iiif-manifest-url-display': string | null
  'author-display': string[] | null
  'publish-year-display': number | null
}

export interface HspDigitized extends HspDocument {
  'digitization-date-display': string | null
  'digitization-institution-display': string | null
  'digitization-settlement-display': string | null
  'external-uri-display': string | null
  'issuing-date-display': string | null
  'manifest-uri-display': string | null
  'subtype-display': string | null
  'thumbnail-uri-display': string | null
  type: 'hsp:digitized'
}

export interface HspObjectGroup {
  hspObject: HspObject
  hspDescriptions: HspDescription[]
  hspDigitizeds: HspDigitized[]
}

export interface Facets {
  [facet: string]: {
    [value: string]: number
  }
}

export interface Highlighting {
  [id: string]: {
    [field: string]: string[]
  }
}

export interface Stats {
  [field: string]: {
    min: number | null
    max: number | null
    count: number
    missing: number
  }
}

// /////////////////////////////////////////////////////////
// Endpoint: /hspobjects
//
// Takes a query string and returns a list of hsp objects
// and related hsp descriptions
/// ////////////////////////////////////////////////////////

export interface HspObjectsByQueryInput {
  q: string // a phrase to search for or a query in rsql syntax
  qf?: string[]
  start?: number
  rows?: number
  sort?: string
  fq?: string // the filter query as JSON string
  hl?: boolean
  isExtended?: boolean
}

export interface HspObjectsByQueryOutput {
  payload: HspObjectGroup[]
  metadata: {
    numFound: number
    start: number
    rows: number
    facets?: Facets
    highlighting?: Highlighting
    stats?: Stats
  }
}

// /////////////////////////////////////////////////////////
// Endpoint: /hspobjects/:id
//
// Takes an id as path variable and returns a hsp object
// and the related hsp descriptions
//
// 404 if nothing found
// /////////////////////////////////////////////////////////

export interface HspObjectByIdOutput {
  payload: HspObjectGroup
}

// ////////////////////////////////////////////////////////
// Requests as hooks
// ////////////////////////////////////////////////////////

async function fetchJson<TResult, TQuery = any>(
  fetcher: typeof fetch,
  path: string,
  query?: TQuery,
): Promise<TResult> {
  const url = query
    ? `${path}?${qs.stringify(query, { indices: false })}`
    : path

  const response = await fetcher(url)

  if (response.status !== 200) {
    throw new Error('server did not respond with status code 200')
  }

  return response.json()
}

/**
 * Fetches a list of hsp objects from the discovery service based on a set of query parameters.
 * Uses react-query to cache the result.
 */
export function useHspObjectsByQuery(params: ParsedParams) {
  const config = useConfig()
  const api = urlJoin(config.discoveryEndpoint, '/hspobjects/search')
  // Because caching with react-query works by checking deep equality of the keys passed ('hspObjectByQuery' and 'query' in that case)
  // we need to make shure that we always have the same shape of keys for the same resources that we request.
  // That means, even though the API of the discovery service allows to omit some parameters and uses defaults we will be strict
  // with composing the query.
  const query: HspObjectsByQueryInput = {
    q: params.q || '*',
    // N.B.: hsp-fo-discovery expects an array for qf; hsp-fo-search currently only supports a single value
    qf: params.qf ? [params.qf] : [],
    start: params.start || 0,
    rows: params.rows || 10,
    sort: params.sort || 'score-desc',
    fq: JSON.stringify(params.fq || {}),
    hl: params.hl === undefined ? true : params.hl,
    isExtended: params.isExtended === true,
  }

  return useQuery<HspObjectsByQueryOutput, Error>(
    ['hspObjectsByQuery', query],
    () => fetchJson<HspObjectsByQueryOutput>(config.customFetch, api, query),
    { keepPreviousData: true },
  )
}

/**
 * Fetches a hsp object by its id.
 * Uses react-query to cache the result.
 */
export function useHspObjectById(id: string | undefined) {
  const config = useConfig()
  const url = urlJoin(config.discoveryEndpoint, '/hspobjects', id || '')

  return useQuery<HspObjectByIdOutput, Error>(
    ['hspObjectById', id],
    () => fetchJson(config.customFetch, url),
    // The 'id' is nescesary to perfom the request. We disable the request
    // if it is undefined. If this is the case the 'isIdle' prop of the return object will be 'true'
    { enabled: !!id },
  )
}
