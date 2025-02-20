import React, { ReactNode } from 'react'

import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles((theme) => ({
  center: {
    [theme.breakpoints.up('lg')]: {
      width: '50%',
    },
    [theme.breakpoints.down('lg')]: {
      width: '75%',
    },
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
  // style right is same as topbar right in app
  right: {
    width: '50%',
    position: 'fixed',
    left: 'calc(100% / 3)',
    [theme.breakpoints.down('sm')]: {
      left: '40%',
    },
  },
}))

interface FilterButtonWrapperProps {
  children: ReactNode
  mobile: boolean
}

export function FilterButtonWrapper(props: FilterButtonWrapperProps) {
  const cls = useStyles()

  const { children, mobile } = props
  return (
    <div className={mobile ? '' : cls.right}>
      <div className={mobile ? '' : cls.center}>{children}</div>
    </div>
  )
}
