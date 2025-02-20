import React from 'react'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  row: {
    borderTop: '1px solid #444',
    display: 'grid',
    gap: theme.spacing(4),
    gridTemplateColumns: 'minmax(100px, 1fr) 3fr',
    hyphens: 'auto',
    paddingBottom: theme.spacing(1),
    paddingTop: theme.spacing(1),
    wordBreak: 'break-word',
  },
  span: {
    display: 'block',
    '&:not(:last-child)': {
      marginBottom: theme.spacing(0.5),
    },
  },
}))

interface Props {
  className?: string
  data: Record<string, string[]>
}

export function KeyValueTable({ className, data }: Props) {
  const cls = useStyles()

  return (
    <div className={className}>
      {Object.keys(data).map((key) => (
        <div className={cls.row} key={key}>
          <Typography variant="body2">{key}:</Typography>
          {Array.isArray(data[key]) ? (
            <Typography variant="body1">
              {data[key].map((elem, index) => (
                <span className={cls.span} key={index}>
                  {elem}
                </span>
              ))}
            </Typography>
          ) : (
            <Typography variant="body1">{data[key]}</Typography>
          )}
        </div>
      ))}
    </div>
  )
}
