import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import Button from '@material-ui/core/Button'
import FormGroup from '@material-ui/core/FormGroup'
import { makeStyles } from '@material-ui/core/styles'

import { useParsedParams } from 'src/contexts/hooks'
import { WebModuleLink } from 'src/contexts/link'
import { toSearchParams } from 'src/contexts/location'

const useStyles = makeStyles((theme) => ({
  button: {
    borderRadius: '50%',
    fontWeight: 400,
    height: theme.spacing(4),
    '&:focus': {
      background: theme.palette.white,
    },
    [theme.breakpoints.up('md')]: {
      minWidth: theme.spacing(4),
    },
    [theme.breakpoints.down('md')]: {
      minWidth: theme.spacing(2),
    },
  },
  selected: {
    background: 'white',
    fontWeight: 'bold',
  },
  root: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'nowrap',
    flexDirection: 'row',
    paddingLeft: theme.spacing(1),
  },
}))

interface ShownButtonProps {
  value: number
}
function ShownButton(props: ShownButtonProps) {
  const params = useParsedParams()
  const { rows } = params
  const { value } = props
  const cls = useStyles()

  const location = (rows: number): WebModuleLocation => ({
    pathname: '/',
    hash: '',
    search: toSearchParams({
      ...params,
      rows,
    }),
  })

  const isDefault = !rows && value === 10

  return (
    <Button
      size="small"
      className={clsx(cls.button, {
        [cls.selected]: rows === value || isDefault,
      })}
      component={WebModuleLink}
      location={location(value)}
    >
      {value}
    </Button>
  )
}

export function HitsShown() {
  const cls = useStyles()
  const hitsOptions = [10, 20, 50, 100]

  return (
    <FormGroup className={cls.root}>
      {hitsOptions.map((elem) => {
        return <ShownButton value={elem} key={elem} />
      })}
    </FormGroup>
  )
}
