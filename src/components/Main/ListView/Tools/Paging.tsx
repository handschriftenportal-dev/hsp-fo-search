import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import { useMediaQuery } from '@material-ui/core'
import makeStyles from '@material-ui/core/styles/makeStyles'
import useTheme from '@material-ui/core/styles/useTheme'
import Pagination, {
  PaginationRenderItemParams,
} from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'

import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink } from 'src/contexts/link'
import { toSearchParams } from 'src/contexts/location'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.up('md')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  itemTypo: theme.typography.caption,
}))

interface Props {
  className?: string
  result: HspObjectsByQueryOutput
}

export function Paging(props: Props) {
  const { result, className } = props
  const theme = useTheme()
  const smallerThanMd = useMediaQuery(theme.breakpoints.down('md'), {
    noSsr: true,
  })
  const params = useParsedParams()
  const cls = useStyles()
  const { t, tt } = useTranslation()

  const { numFound, start, rows } = result.metadata

  if (numFound < 1 || rows < 1) {
    return null
  }

  const pageLength = Math.ceil(numFound / rows)
  const pageIndex = Math.floor(start / rows) // zero-based

  const renderItem = (item: PaginationRenderItemParams) => {
    const disabled = item.page === 0 || item.page > pageLength

    const location: WebModuleLocation = {
      pathname: '/',
      hash: '',
      search: toSearchParams({
        ...params,
        start: (item.page - 1) * rows,
      }),
    }

    let ariaLabel
    if (item.type === 'previous') {
      ariaLabel = t('paging', 'goToPreviousPage')
    } else if (item.type === 'next') {
      ariaLabel = t('paging', 'goToNextPage')
    } else if (item.type === 'page') {
      ariaLabel = tt({ pageNumber: item.page.toString() }, 'paging', 'goToPage')
    } else {
      ariaLabel = ''
    }

    if (disabled) {
      return (
        <PaginationItem
          {...item}
          className={cls.itemTypo}
          component={'span'}
          disabled={true}
        />
      )
    }

    return (
      <PaginationItem
        {...(item as any)}
        className={clsx(cls.itemTypo)}
        component={WebModuleLink}
        location={location}
        disabled={false}
        role="link"
        ariaLabel={ariaLabel}
      />
    )
  }

  return (
    <Pagination
      className={clsx(className, cls.root)}
      count={pageLength}
      page={pageIndex + 1}
      renderItem={renderItem}
      siblingCount={0}
      size={smallerThanMd ? 'small' : 'medium'}
    />
  )
}
