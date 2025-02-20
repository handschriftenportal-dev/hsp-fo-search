import clsx from 'clsx'
import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'

import { SearchFilter } from './SearchFilter'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  more: {
    padding: theme.spacing(2),
    cursor: 'pointer',
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  caption: {
    alignSelf: 'center',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  checkbox: {
    paddingLeft: theme.spacing(1.5),
  },
}))

type Options = Record<string, number>

interface Props {
  className?: string
  filterName: string
  isBool?: boolean
  options: Options
  selected: (string | boolean)[]
  onChange: (selected: (string | boolean)[]) => void
  sort?: 'alpha'
}

export function ListFilter(props: Props) {
  const { className, filterName, isBool, options, selected, sort, onChange } =
    props
  const { __MISSING__: missing } = options
  const cls = useStyles()
  let sortedOptions: Options
  const { t } = useTranslation()

  if (isBool) {
    sortedOptions = { true: options.true || 0 }
  } else if (sort === 'alpha') {
    sortedOptions = Object.keys(options)
      .filter((el) => el !== '__MISSING__')
      .sort()
      .reduce((acc, key) => ({ ...acc, [key]: options[key] }), {})
    if (missing) {
      sortedOptions = { __MISSING__: missing, ...sortedOptions }
    }
  } else {
    sortedOptions = options
  }

  function toggleValue(ev: React.ChangeEvent<HTMLInputElement>) {
    if (isBool) {
      onChange(ev.target.checked ? [ev.target.checked] : [])
    } else {
      onChange(
        ev.target.checked
          ? [...selected, ev.target.value]
          : selected.filter((val) => val !== ev.target.value),
      )
    }
  }

  const renderOptions = (start: number, end?: number) =>
    Object.keys(sortedOptions)
      .slice(start, end)
      .map((value) => {
        const text =
          (value === '__MISSING__'
            ? t('filterPanel', 'missing')
            : t('data', filterName, value)) + ` (${sortedOptions[value]})`
        return (
          <div key={value} className={cls.option}>
            <FormControlLabel
              label={
                <Typography
                  variant="caption"
                  component="span"
                  className={
                    value === '__MISSING__' ? cls.missing : cls.caption
                  }
                >
                  {text}
                </Typography>
              }
              control={
                <Checkbox
                  className={cls.checkbox}
                  color="primary"
                  value={value}
                  checked={
                    selected.indexOf(isBool ? Boolean(value) : value) > -1
                  }
                  onChange={toggleValue}
                  icon={
                    <img
                      src="/img/checkbox_unchecked.svg"
                      alt={text + ' ' + t('filterPanel', 'unchecked')}
                    />
                  }
                  checkedIcon={
                    <img
                      src="/img/checkbox_checked.svg"
                      alt={text + ' ' + t('filterPanel', 'checked')}
                    />
                  }
                />
              }
            />
          </div>
        )
      })

  return (
    <div className={clsx(cls.root, className)}>
      {(Object.keys(options).length <= 15 &&
        renderOptions(0, Object.keys(options).length)) || (
        <SearchFilter
          sortedOptions={sortedOptions}
          selected={selected}
          toggleValue={toggleValue}
          filterName={filterName}
        />
      )}
    </div>
  )
}
