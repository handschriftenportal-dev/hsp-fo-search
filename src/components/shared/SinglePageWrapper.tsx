import clsx from 'clsx'
import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

interface StyleProps {
  resourceInfoFlexWrap: 'wrap' | 'nowrap'
}

const useStyles = makeStyles((theme) => ({
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0),
    marginTop: theme.spacing(2),
    flexWrap: (props: StyleProps) => props.resourceInfoFlexWrap,
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
}))

interface Props {
  className?: string
  children: React.ReactElement | React.ReactElement[]
}

export default function SinglePageWrapper({ className, children }: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'), { noSsr: true })
  const cls = useStyles({ resourceInfoFlexWrap: isMobile ? 'wrap' : 'nowrap' })

  return <div className={clsx(cls.headline, className)}>{children}</div>
}
