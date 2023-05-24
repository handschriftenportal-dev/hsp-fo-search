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
import Grid from '@material-ui/core/Grid'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { HitListVariants } from './HitListVariants'
import { ResultCounts } from './ResultCounts'
import { Paging } from './Paging'
import { SortOptionSelect } from 'src/components/Main/ListView/Tools/SortOptionSelect'

const useStyles = makeStyles((theme) => ({
  root: {
    scrollMarginTop: '350px',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  space: {
    marginTop: theme.spacing(2),
  },
}))

interface Props {
  className?: string
  result: HspObjectsByQueryOutput
}

export function Tools(props: Props) {
  const { className, result } = props
  const cls = useStyles()

  return (
    <Grid
      data-testid="discovery-list-view-tools"
      className={clsx(cls.root, className)}
      container
      justifyContent="space-between"
      id="pageNav"
      tabIndex={-1}
    >
      <Grid className={cls.space} xs={12} sm={12} md={4} item>
        <ResultCounts result={result} />
      </Grid>
      <Grid className={cls.space} xs={12} sm={6} md={4} item>
        <Paging result={result} />
      </Grid>
      <Grid
        className={cls.space}
        xs={12}
        sm={6}
        md={4}
        container
        item
        wrap="nowrap"
        justifyContent="space-between"
      >
        <SortOptionSelect />
        <HitListVariants />
      </Grid>
    </Grid>
  )
}
