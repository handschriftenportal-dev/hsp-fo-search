import clsx from 'clsx'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    position: 'relative',
    padding: theme.spacing(0.5),
    textTransform: 'uppercase',
    cursor: 'pointer',
    color: 'white',
    textAlign: 'center',
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(3),
      marginLeft: theme.spacing(3),
      minWidth: '231px',
    },
  },
  filterBtn: {
    background: theme.palette.liver.main,
    transistion: 'all 20ms',
    '&:after': {
      position: 'absolute',
      content: '""',
      top: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderTop: `12px solid ${theme.palette.liver.main}`,
    },
  },
  applyBtn: {
    background: theme.palette.primary.main,
    transistion: 'all 20ms',
    '&:after': {
      position: 'absolute',
      content: '""',
      bottom: '100%',
      left: '48%',
      borderLeft: '12px solid transparent',
      borderRight: '12px solid transparent',
      borderBottom: `12px solid ${theme.palette.primary.main}`,
    },
  },
}))

interface Props {
  className?: string
  isApplyBtn: boolean
  onClick: () => void
  title: string
}

export function FilterButton(props: Props) {
  const cls = useStyles()
  const { className, isApplyBtn, onClick, title } = props

  return (
    <div
      className={clsx(
        cls.root,
        'addFocusableWithOutline',
        isApplyBtn ? cls.applyBtn : cls.filterBtn,
        className,
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onClick()
        }
      }}
      role="button"
      tabIndex={0}
      id={isApplyBtn ? 'applyFilterOptions' : 'openFilterOptions'}
    >
      {title}
    </div>
  )
}
