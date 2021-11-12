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
import { makeStyles } from '@material-ui/core/styles'
import Pagination, { PaginationRenderItemParams } from '@material-ui/lab/Pagination'
import PaginationItem from '@material-ui/lab/PaginationItem'
import { Link } from 'src/contexts/routing'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { useParsedParams, toSearchParams } from 'src/contexts/location'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLocation } from 'hsp-web-module'


const useStyles = makeStyles(theme => ({
  paginationLink: {
    '&:focus': {
      background: theme.palette.grey[200]
    }
  }
}))

interface Props {
  className?: string;
  result: HspObjectsByQueryOutput;
}

export function Paging(props: Props) {
  const { result, className } = props
  const params = useParsedParams()
  const cls = useStyles()
  const { t, tt } = useTranslation()

  const { numGroupsFound, start, rows } = result.metadata

  if (numGroupsFound < 1 || rows < 1) {
    return null
  }

  const pageLength = Math.ceil(numGroupsFound / rows)
  const pageIndex = Math.floor(start / rows) // zero-based


  const renderItem = (item: PaginationRenderItemParams) => {
    const disabled = item.page === 0 || item.page > pageLength

    const link: WebModuleLocation = {
      path: '/',
      hash: '',
      params: toSearchParams({
        ...params,
        start: (item.page - 1) * rows,
      })
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
      return <PaginationItem
        {...item}
        component={'span'}
        disabled={true}
      />
    }

    return <PaginationItem
      {...item as any}
      className={cls.paginationLink}
      component={Link}
      linkInfo={link}
      disabled={false}
      role="link"
      ariaLabel={ariaLabel}
    />
  }

  return (
    <Pagination
      className={className}
      count={pageLength}
      page={pageIndex + 1}
      renderItem={renderItem}
    />
  )
}
