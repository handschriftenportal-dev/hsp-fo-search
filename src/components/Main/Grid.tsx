import React, { ReactNode } from 'react'

import MuiGrid from '@material-ui/core/Grid'

interface Props {
  children: ReactNode
  className?: string
  id?: string
}

export function Grid({ className, children, id }: Props) {
  return (
    <MuiGrid className={className} container justifyContent="center" id={id}>
      <MuiGrid item xs={12} sm={11} md={11} lg={11} xl={8}>
        {children}
      </MuiGrid>
    </MuiGrid>
  )
}
