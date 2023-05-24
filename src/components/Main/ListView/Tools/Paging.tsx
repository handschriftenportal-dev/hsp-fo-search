/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Pagination, {
  PaginationRenderItemParams,
} from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
import { WebModuleLink } from 'src/contexts/link'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLocation } from 'hsp-web-module'

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      position: 'relative',
      left: theme.spacing(-2),
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
    />
  )
}
