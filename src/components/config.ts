import { HspObject } from 'src/contexts/discovery'

export const searchBarOptions = [
  'FIELD-GROUP-ALL',
  'FIELD-GROUP-SIGNATURE',
  // 'FIELD-GROUP-FULLTEXT',
  'FIELD-GROUP-BASIC',
  'FIELD-GROUP-ORIGIN',
  'FIELD-GROUP-PERSON',
  'FIELD-GROUP-TITLE',
  // 'work-title-search', // TODO: reactivate when Data available, see #19043
  'FIELD-GROUP-INCIPIT',
  'FIELD-GROUP-QUOTE',
  // 'explicit-search', // TODO: reactivate when Data available, see #19043
]

export const sortOptions = [
  'score-desc',
  'ms-identifier-asc',
  'ms-identifier-desc',
  'orig-date-asc',
  'orig-date-desc',
]

export const hitKeyData: (keyof HspObject)[] = [
  'object-type-display',
  'material-display',
  'leaves-count-display',
  'dimensions-display',
  'orig-place-display',
  'orig-date-lang-display',
]

export const dataTableFieldsLeft: (keyof HspObject)[] = [
  'id',
  'settlement-display',
  'repository-display',
  'idno-display',
  'former-ms-identifier-display',
  'status-display',
  'title-display',
  'orig-date-lang-display',
  'orig-place-display',
]

export const dataTableFieldsRight: (keyof HspObject)[] = [
  'object-type-display',
  'material-display',
  'leaves-count-display',
  'format-display',
  'dimensions-display',
  'illuminated-display',
  'has-notation-display',
  'language-display',
]

export const filterGroups: Record<string, string[]> = {
  general: ['settlement-facet', 'repository-facet'],
  materiality: [
    'object-type-facet',
    'material-facet',
    'leaves-count-facet',
    'format-facet',
    'height-facet',
    'width-facet',
  ],
  history: ['orig-place-facet', 'orig-date-facet', 'orig-date-type-facet'],
  content: ['language-facet', 'illuminated-facet', 'has-notation-facet'],
}

export const filterTypes: Record<string, string> = {
  'format-facet': 'list',
  'orig-date-type-facet': 'list',
  'illuminated-facet': 'list',
  'has-notation-facet': 'list',
  'settlement-facet': 'list',
  'repository-facet': 'list',
  'object-type-facet': 'list',
  'language-facet': 'list',
  'orig-place-facet': 'list',
  'material-facet': 'list',
  'height-facet': 'range',
  'width-facet': 'range',
  'leaves-count-facet': 'range',
  'type-facet': 'list',
  'digitized-object-facet': 'boolean-list',
  'digitized-iiif-object-facet': 'boolean-list',
  'described-object-facet': 'boolean-list',
  'orig-date-facet': 'range',
}

export const filterUnits: Record<string, string> = {
  'width-facet': 'cm',
  'height-facet': 'cm',
}

export const extendedSearchFilterGroups = [
  { id: 0, name: 'default' },
  { id: 1, name: 'administration' },
  { id: 9, name: 'institution' },
  { id: 4, name: 'persons' },
  { id: 2, name: 'materiality' },
  { id: 3, name: 'origin' },
  { id: 5, name: 'content' },
  { id: 6, name: 'description-text' },
  { id: 7, name: 'description' },
  { id: 8, name: 'digital-image' },
]

export const extendedSearchTextFields = [
  ...searchBarOptions.map((name, index) => ({
    group: 0,
    groupCategory: index,
    name,
    type: 'text',
  })),
  { group: 1, groupCategory: 1, name: 'settlement-search', type: 'text' },
  { group: 1, groupCategory: 2, name: 'repository-search', type: 'text' },
  { group: 1, groupCategory: 3, name: 'idno-search', type: 'text' },
  { group: 1, groupCategory: 4, name: 'idno-alternative-search', type: 'text' },
  {
    group: 1,
    groupCategory: 5,
    name: 'former-ms-identifier-search',
    type: 'text',
  },
  {
    group: 2,
    groupCategory: 1,
    name: 'object-type-search',
    type: 'enum',
    values: [
      'codex',
      'collection',
      'composite',
      'fragment',
      'hostVolume',
      'leporello',
      'printWithManuscriptParts',
      'other',
      'sammelband',
      'scroll',
      'singleSheet',
    ],
  },
  { group: 2, groupCategory: 2, name: 'material-search', type: 'text' },
  { group: 2, groupCategory: 3, name: 'leaves-count-search', type: 'integer' },
  {
    group: 2,
    groupCategory: 4,
    name: 'format-search',
    type: 'enum',
    values: [
      'larger than folio',
      'folio',
      'quarto',
      'octavo',
      'smaller than octavo',
      'oblong',
      'long and narrow',
      'square',
      'other',
    ],
  },
  { group: 2, groupCategory: 5, name: 'height-search', type: 'float' },
  { group: 2, groupCategory: 6, name: 'width-search', type: 'float' },
  { group: 3, groupCategory: 1, name: 'orig-place-search', type: 'text' },
  { group: 3, groupCategory: 2, name: 'orig-date-from-search', type: 'year' },
  { group: 3, groupCategory: 3, name: 'orig-date-to-search', type: 'year' },
  { group: 3, groupCategory: 4, name: 'orig-date-when-search', type: 'year' },
  {
    group: 3,
    groupCategory: 5,
    name: 'orig-date-type-search',
    type: 'enum',
    values: ['datable', 'dated'],
  },
  { group: 4, groupCategory: 1, name: 'person-author-search', type: 'text' },
  { group: 4, groupCategory: 2, name: 'person-scribe-search', type: 'text' },
  {
    group: 4,
    groupCategory: 3,
    name: 'person-mentioned-in-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 4,
    name: 'person-previous-owner-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 5,
    name: 'person-translator-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 6,
    name: 'person-illuminator-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 7,
    name: 'person-bookbinder-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 8,
    name: 'person-commissioned-by-search',
    type: 'text',
  },
  {
    group: 4,
    groupCategory: 9,
    name: 'person-conservator-search',
    type: 'text',
  },
  { group: 4, groupCategory: 10, name: 'person-other-search', type: 'text' },

  { group: 5, groupCategory: 1, name: 'language-search', type: 'text' },
  { group: 5, groupCategory: 2, name: 'work-title-search', type: 'text' },
  { group: 5, groupCategory: 3, name: 'title-in-ms-search', type: 'text' },
  { group: 5, groupCategory: 4, name: 'initium-search', type: 'text' },
  { group: 5, groupCategory: 5, name: 'incipit-search', type: 'text' },
  { group: 5, groupCategory: 6, name: 'explicit-search', type: 'text' },
  { group: 5, groupCategory: 7, name: 'colophon-search', type: 'text' },
  { group: 5, groupCategory: 8, name: 'quotation-search', type: 'text' },
  {
    group: 5,
    groupCategory: 9,
    name: 'illuminated-search',
    type: 'enum',
    values: ['yes', 'no'],
  },
  {
    group: 5,
    groupCategory: 10,
    name: 'has-notation-search',
    type: 'enum',
    values: ['yes', 'no'],
  },
  {
    group: 6,
    groupCategory: 1,
    name: 'physical-description-search',
    type: 'text',
  },
  { group: 6, groupCategory: 2, name: 'binding-search', type: 'text' },
  { group: 6, groupCategory: 3, name: 'fragment-search', type: 'text' },
  { group: 6, groupCategory: 4, name: 'history-search', type: 'text' },
  { group: 6, groupCategory: 5, name: 'fulltext-search', type: 'text' },

  { group: 7, groupCategory: 1, name: 'author-search', type: 'text' },
  {
    group: 7,
    groupCategory: 2,
    name: 'publish-year-search',
    type: 'year',
  },
  {
    group: 8,
    groupCategory: 1,
    name: 'described-object-search',
    type: 'boolean',
  },
  {
    group: 8,
    groupCategory: 2,
    name: 'digitized-object-search',
    type: 'boolean',
  },
  {
    group: 8,
    groupCategory: 3,
    name: 'digitized-iiif-object-search',
    type: 'boolean',
  },
  {
    group: 9,
    groupCategory: 1,
    name: 'institution-producing-search',
    type: 'text',
  },
  {
    group: 9,
    groupCategory: 2,
    name: 'institution-previously-owning-search',
    type: 'text',
  },
  {
    group: 9,
    groupCategory: 3,
    name: 'institution-mentioned-search',
    type: 'text',
  },
]

export enum LogicOperator {
  AND = ';',
  OR = ',',
}

export enum ComparisonOperator {
  EQ = '==',
  NEQ = '!=',
  LE = '<=',
  GE = '>=',
  LT = '<',
  GT = '>',
}
