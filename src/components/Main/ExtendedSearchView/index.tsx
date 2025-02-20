import clsx from 'clsx'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import SinglePageWrapper from 'src/components/shared/SinglePageWrapper'
import { actions } from 'src/contexts/actions'
import { useEvent } from 'src/contexts/events'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { useTriggerLink } from 'src/contexts/link'
import { ParsedParams, toSearchParams } from 'src/contexts/location'
import { selectors } from 'src/contexts/state'
import {
  getRsql,
  parseFromRSQL,
  useGetExtendedSearchTerm,
} from 'src/utils/extendedSearch'

import { Grid } from '../Grid'
import BottomControl from './BottomControl'
import Preview from './Preview'
import SearchPanel from './SearchPanel'

const useStyles = makeStyles((theme) => ({
  root: {
    scrollMarginTop: '350px',
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  description: {
    paddingTop: theme.spacing(1),
    [theme.breakpoints.only('xs')]: {
      paddingRight: theme.spacing(2),
      paddingLeft: theme.spacing(3.5),
    },
  },

  searchPanel: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey[100],
    padding: theme.spacing(0.5),
  },
}))

interface Props {
  className?: string
}

export function ExtendedSearchView({ className }: Readonly<Props>) {
  const cls = useStyles()
  const { t } = useTranslation()

  const triggerLink = useTriggerLink()
  const fireSearchButtonClicked = useEvent('searchButtonClicked')
  const dispatch = useDispatch()
  const params: ParsedParams = useParsedParams()

  const searchGroup = useSelector(selectors.getExtendedSearchGroups)
  const rsqlQuery = getRsql(searchGroup)
  const getExtendedSearchTerm = useGetExtendedSearchTerm()
  const preview = getExtendedSearchTerm(rsqlQuery)

  useEffect(() => {
    if (params.isExtended && params.q) {
      const { searchList } = parseFromRSQL(params.q)
      dispatch(actions.setExtSearchList(searchList))
    }
  }, [params.q])

  const search = () => {
    if (fireSearchButtonClicked(JSON.stringify(searchGroup))) {
      dispatch(actions.setModifiedFilterQuery(undefined))

      triggerLink({
        pathname: '/',
        hash: '',
        search: toSearchParams({
          sort: params.sort,
          hl: true,
          q: rsqlQuery,
          fq: params.fq,
          isExtended: true,
        }),
      })
    }
  }

  return (
    <div className={clsx(cls.root, className)}>
      <Grid>
        <SinglePageWrapper>
          <Typography className={cls.title} variant="h1">
            {t('extendedSearch', 'extendedSearch')}
          </Typography>
        </SinglePageWrapper>
        <Box className={cls.description}>{t('searchBar', 'description')}</Box>
        <SearchPanel search={search} />
        <Preview preview={preview} />
        <BottomControl search={search} />
      </Grid>
    </div>
  )
}
