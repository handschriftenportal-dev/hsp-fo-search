import clsx from 'clsx'
import React from 'react'

import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

import { SortOptionSelect } from 'src/components/Main/ListView/Tools/SortOptionSelect'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'

import { HitListVariants } from './HitListVariants'
import { HitsShown } from './HitsShown'
import { Paging } from './Paging'
import { ResultCounts } from './ResultCounts'

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'center',
    scrollMarginTop: '350px',
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  space: {
    marginTop: theme.spacing(2),
  },
  results: {
    display: 'flex',
    alignItems: 'center',
  },
}))

interface ToolsProps {
  className?: string
  result: HspObjectsByQueryOutput
}

export function Tools(props: ToolsProps) {
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
      <Grid
        className={clsx(cls.space, cls.results)}
        xs={12}
        sm={12}
        md={4}
        container
        wrap="nowrap"
      >
        <ResultCounts result={result} />
        <HitsShown />
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
