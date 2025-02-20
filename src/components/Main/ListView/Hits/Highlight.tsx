import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    '& em': {
      background: theme.palette.electricBlue.main,
    },
  },
}))

export interface Props {
  children: string
}

export function Highlight(props: Props) {
  const cls = useStyles()
  const { children } = props

  return (
    <span
      data-testid="discovery-highlight"
      className={cls.root}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  )
}
