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

import React from 'react'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import MuiGrid from '@material-ui/core/Grid'
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import { Accordion } from './Accordion'
import { chunkObject } from 'src/utils/chunkObject'
import { Filter } from './Filter'
import { Facets, Stats } from 'src/contexts/discovery'
import { FilterQuery } from 'src/contexts/location'


const useStyles = makeStyles(theme => ({
  filterColumn: {
    width: 300,
  },
  filterGroup: {
    marginBottom: theme.spacing(1),
  },
  filterGroupHead: {
    background: 'white',
    // textTransform: 'uppercase',
    fontWeight: 500,
  },
  filterHead: {
    borderBottom: '1px solid #aaa'
  },
  filter: {
    marginBottom: theme.spacing(1)
  }
}))

interface Props {
  className?: string;
  facets: Facets;
  stats: Stats;
  filterQuery: FilterQuery;
  onChange: (filterName: string, selected: FilterQuery[keyof FilterQuery]) => void;
}

export function FilterList(props: Props) {
  const { className, facets, stats, filterQuery, onChange } = props
  const cls = useStyles()
  const theme = useTheme()
  const xl = useMediaQuery(theme.breakpoints.only('xl'))
  const lg = useMediaQuery(theme.breakpoints.only('lg'))
  const md = useMediaQuery(theme.breakpoints.only('md'))
  const sm = useMediaQuery(theme.breakpoints.only('sm'))
  const xs = useMediaQuery(theme.breakpoints.only('xs'))
  const { t } = useTranslation()

  const cols = 0 ||
    (xl && 4) ||
    (lg && 4) ||
    (md && 3) ||
    (sm && 2) ||
    (xs && 1) || 0

  const filterGroupCols = chunkObject(config.filterGroups, cols)

  return (
    <MuiGrid
      className={className}
      container
      spacing={5}
      wrap="nowrap"
      justifyContent="center"
    >
      {
        filterGroupCols.map((col, i) => (
          <MuiGrid
            className={cls.filterColumn}
            item
            key={i}
          >
            {
              Object.keys(col).map(groupName => (
                <Accordion
                  className={cls.filterGroup}
                  classes={{ head: cls.filterGroupHead }}
                  label={t('filterPanel', 'filterGroups', groupName)}
                  key={groupName}
                  defaultOpen={cols > 1}
                >
                  {
                    col[groupName].map(filterName => (
                      <Accordion
                        className={cls.filterHead}
                        label={t('data', filterName, '__field__')}
                        key={filterName}
                        defaultOpen={false}
                      >
                        <Filter
                          className={cls.filter}
                          filterName={filterName}
                          filterQuery={filterQuery}
                          facets={facets}
                          stats={stats}
                          onChange={selected => onChange(filterName, selected)}

                        />
                      </Accordion>
                    ))
                  }
                </Accordion>
              ))
            }
          </MuiGrid>
        ))
      }
    </MuiGrid>
  )
}
