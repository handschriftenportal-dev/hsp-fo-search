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

import { HspObject } from 'src/contexts/discovery'

export const searchBarOptions = [
  '__ALLFIELDS__',
  'FIELD-GROUP-SIGNATURE',
  'FIELD-GROUP-FULLTEXT',
  'FIELD-GROUP-BASIC',
  'FIELD-GROUP-ORIGIN',
  'FIELD-GROUP-PERSON',
  'work-title-search',
  'incipit-search',
  'explicit-search',
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
  'language-display'
]

export const filterGroups: Record<string, string[]> = {
  general: [
    'settlement-facet',
    'repository-facet',
  ],
  appearance: [
    'object-type-facet',
    'material-facet',
    'leaves-count-facet',
    'height-facet',
    'width-facet',
  ],
  history: [
    'orig-place-facet',
    'orig-date-facet',
  ],
  language: [
    'language-facet',
  ]
}

export const filterTypes: Record<string, string> = {
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
