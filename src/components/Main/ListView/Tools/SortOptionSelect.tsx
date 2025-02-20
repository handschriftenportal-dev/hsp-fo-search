import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, { ChangeEvent } from 'react'

import FormControl from '@material-ui/core/FormControl'
import NativeSelect from '@material-ui/core/NativeSelect'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import * as config from 'src/components/config'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { useTriggerLink } from 'src/contexts/link'
import { toSearchParams } from 'src/contexts/location'

const useStyles = makeStyles((theme) => ({
  itemTypo: theme.typography.caption,
  select: {
    height: 32,
    width: '90%',
    boxShadow: 'none',
    borderRadius: 0,
    marginRight: 2,
    background: theme.palette.platinum.main,
    paddingRight: theme.spacing(0),
  },
  selected: {
    background: 'white',
  },
}))

interface Props {
  className?: string
}

export function SortOptionSelect(props: Props) {
  const { className } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const theme = useTheme()
  const mobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const params = useParsedParams()
  const sortOption =
    params.sort && config.sortOptions.indexOf(params.sort) >= 0
      ? params.sort
      : 'score-desc'
  const triggerLink = useTriggerLink()

  const change = (event: ChangeEvent<{ name?: string; value?: any }>) => {
    const sortOption = event.target.value
    const location: WebModuleLocation = {
      pathname: '/',
      hash: '',
      search: toSearchParams({
        ...params,
        sort: sortOption,
      }),
    }
    triggerLink(location)
  }

  return (
    <FormControl className={className} variant="filled">
      <NativeSelect
        data-testid="discovery-search-bar-sort-select"
        className={clsx(cls.select, cls.itemTypo)}
        value={sortOption}
        onChange={change}
        name={t('sortOptionName')}
        inputProps={{
          'aria-label': t('sortOptionName'),
          style: { textIndent: '8px' },
        }}
      >
        {config.sortOptions.map((option) => (
          <option key={option} value={option}>
            {(mobile &&
              t(
                'sortOptionsMobile',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                }),
              )) ||
              t(
                'sortOptions',
                option.replace(/-([a-z])/g, function (value: string) {
                  return value[1].toUpperCase()
                }),
              )}
          </option>
        ))}
      </NativeSelect>
    </FormControl>
  )
}
