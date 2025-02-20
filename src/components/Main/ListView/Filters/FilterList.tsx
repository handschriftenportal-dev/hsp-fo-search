import clsx from 'clsx'
import React from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import MuiGrid from '@material-ui/core/Grid'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'

import * as config from 'src/components/config'
import { Facets, Stats } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { FilterQuery } from 'src/contexts/location'
import { chunkObject } from 'src/utils/chunkObject'

import { Filter } from './Filter'

const useStyles = makeStyles((theme) => ({
  filter: {
    marginBottom: theme.spacing(1),
  },
  filterAccordion: {
    backgroundColor: 'transparent !important',
    borderBottom: '1px solid #aaa',
    boxShadow: 'none',
    fontSize: 15,
    margin: 'unset !important',
  },
  filterColumn: {
    width: 300,
    backgroundColor: 'transparent !important',
    padding: '20px',
  },
  filterDetails: {
    display: 'block',
    padding: 'unset',
    marginTop: theme.spacing(1),
  },
  filterSummary: {
    flexDirection: 'row-reverse',
    padding: '0px',
    '& .hsp-search-MuiIconButton-edgeEnd': {
      marginRight: '0px',
      padding: '8px',
    },
  },
  groupAccordion: {
    backgroundColor: 'inherit',
    boxShadow: 'none',
    margin: '8px 0',
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.spacing(1),
    },
  },
  groupDetails: {
    display: 'block',
    padding: 0,
  },
  groupSummary: {
    backgroundColor: 'white',
    fontWeight: 800,
    letterSpacing: '1px',
    lineHeight: '1.75',
    textTransform: 'uppercase',
  },
  filterList: {
    display: 'flex',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
}))

interface Props {
  facets: Facets
  stats: Stats
  filterQuery: FilterQuery
  onChange: (
    filterName: string,
    selected: FilterQuery[keyof FilterQuery],
  ) => void
}

export function FilterList(props: Props) {
  const { facets, stats, filterQuery, onChange } = props
  const cls = useStyles()
  const theme = useTheme()
  const xl = useMediaQuery(theme.breakpoints.only('xl'), { noSsr: true })
  const lg = useMediaQuery(theme.breakpoints.only('lg'), { noSsr: true })
  const md = useMediaQuery(theme.breakpoints.only('md'), { noSsr: true })
  const sm = useMediaQuery(theme.breakpoints.only('sm'), { noSsr: true })
  const xs = useMediaQuery(theme.breakpoints.only('xs'), { noSsr: true })
  const { t } = useTranslation()

  const cols =
    0 || (xl && 4) || (lg && 4) || (md && 3) || (sm && 2) || (xs && 1) || 0

  const filterGroupCols = chunkObject(config.filterGroups, cols)

  return (
    <MuiGrid item xs={12} className={cls.filterList}>
      {filterGroupCols.map((col) => {
        const colKeys = Object.keys(col)
        return (
          <div
            className={cls.filterColumn}
            key={`grid-for-${colKeys.join('-')}`}
          >
            {colKeys.map((groupName) => (
              <Accordion
                className={cls.groupAccordion}
                defaultExpanded={
                  cols > 1 ||
                  col[groupName].some(
                    (filterName) => filterQuery[filterName] !== undefined,
                  )
                }
                key={groupName}
                square={true}
              >
                <AccordionSummary
                  className={clsx(cls.groupSummary, cls.filterSummary)}
                  expandIcon={<ArrowDropDownIcon />}
                >
                  {t('filterPanel', 'filterGroups', groupName)}
                </AccordionSummary>
                <AccordionDetails className={cls.groupDetails}>
                  {col[groupName].map((filterName) => (
                    <Accordion
                      className={cls.filterAccordion}
                      defaultExpanded={filterQuery[filterName] !== undefined}
                      // defaultExpanded={true} // use for lighthouse a11y testing
                      key={filterName}
                      square={true}
                      TransitionProps={{ unmountOnExit: true }}
                    >
                      <AccordionSummary
                        className={cls.filterSummary}
                        expandIcon={<ArrowDropDownIcon />}
                      >
                        {t('data', filterName, '__field__')}
                      </AccordionSummary>
                      <AccordionDetails className={cls.filterDetails}>
                        <Filter
                          className={cls.filter}
                          filterName={filterName}
                          filterQuery={filterQuery}
                          facets={facets}
                          stats={stats}
                          onChange={(selected) =>
                            onChange(filterName, selected)
                          }
                        />
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        )
      })}
    </MuiGrid>
  )
}
