import clsx from 'clsx'
import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
} from 'react-virtualized'

import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'
import SearchIcon from '@material-ui/icons/Search'

import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  root: {},
  btn: { fontWeight: 'unset' },
  // btnWrapper: {
  // transition: 'all 0.55s',
  // },
  // btnWrapperDisable: {
  // opacity: 0,
  // height: 0,
  // },
  iconDiv: {
    minWidth: 'auto',
    padding: 0,
  },
  icon: {
    paddingRight: theme.spacing(0.5),
  },
  closeIcon: {
    cursor: 'pointer',
  },
  inputBase: {
    backgroundColor: 'white',
    marginBottom: theme.spacing(0.5),
    width: '100%',
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  option: {
    // display: 'flex',
    // alignItems: 'flex-start',
    paddingLeft: theme.spacing(0.5),
  },
  caption: {
    // alignSelf: 'center',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  checkbox: {
    paddingLeft: theme.spacing(1.5),
  },
  noHit: {
    paddingLeft: theme.spacing(1),
    paddingTop: '5px',
  },
}))

type Options = Record<string, number>

interface Props {
  filterName: string
  sortedOptions: Options
  selected: (string | boolean)[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchFilter(props: Props) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { sortedOptions, selected, toggleValue, filterName } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const checkBoxRef = useRef<HTMLLinkElement>(null)
  const [showAll, setShowAll] = useState(false)
  const [filteredResults, setFilteredResults] = useState([''])
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [inputQuery, setInputQuery] = useState(debouncedQuery)

  const searchFilter = () => {
    const query = debouncedQuery.toLocaleLowerCase()
    return Object.keys(sortedOptions).filter((key) =>
      key === '__MISSING__'
        ? t('data', '__MISSING__').toLowerCase().includes(query)
        : t('data', filterName, key).toLocaleLowerCase().includes(query),
    )
  }

  const cache = new CellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 350,
    minHeight: 36,
  })

  const renderRow = ({ index, key, style, parent }: ListRowProps) => {
    const renderBtn = (btnType: string) => {
      const isMoreBtn = btnType === 'more'
      return (
        <div style={style} className={cls.option}>
          <Button
            className={clsx(cls.btn)}
            onClick={
              isMoreBtn ? () => setShowAll(true) : () => setShowAll(false)
            }
          >
            {isMoreBtn
              ? t('filterPanel', 'showMoreFilterOptions')
              : t('filterPanel', 'showLessFilterOptions')}
          </Button>
        </div>
      )
    }
    if (index === 7 && !showAll && inputQuery.length < 1) {
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {() => renderBtn('more')}
        </CellMeasurer>
      )
    }
    if (index === filteredResults.length - 1 && inputQuery.length < 1) {
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {() => renderBtn('less')}
        </CellMeasurer>
      )
    }

    if (filteredResults.length === 0) {
      return (
        <CellMeasurer
          key={key}
          cache={cache}
          parent={parent}
          columnIndex={0}
          rowIndex={index}
        >
          {() => (
            <div key={key} className={cls.option} style={style}>
              <Typography
                variant="caption"
                component="span"
                className={cls.noHit}
              >
                {t('filterPanel', 'noHits')}
              </Typography>
            </div>
          )}
        </CellMeasurer>
      )
    }

    const value = filteredResults[index]
    const text =
      (value === '__MISSING__'
        ? t('filterPanel', 'missing')
        : t('data', filterName, value)) + ` (${sortedOptions[value]})`
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div key={key} style={style} className={cls.option}>
            <FormControlLabel
              inputRef={index === 0 ? checkBoxRef : undefined}
              onLoad={measure}
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
                  checked={selected.indexOf(value) > -1}
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
        )}
      </CellMeasurer>
    )
  }

  const label = `${t('searchBar', 'search')}: ${t(
    'data',
    filterName,
    '__field__',
  )}`

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    setInputQuery(ev.target.value)
  }

  function handleChange() {
    setInputQuery('')
    inputRef.current?.focus()
  }

  // debounce the inputQuery with 500ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputQuery), 500)
    return () => clearTimeout(timer)
  }, [inputQuery])

  // after a debouncedinput is received, set filteredResults
  useEffect(() => {
    setFilteredResults(() => searchFilter())
  }, [debouncedQuery, sortedOptions])

  return (
    <div className={cls.root}>
      <OutlinedInput
        id={`filter-input-${filterName}`}
        className={cls.inputBase}
        onChange={handleInputChange}
        value={inputQuery}
        inputRef={inputRef}
        endAdornment={
          <InputAdornment position="end">
            {!debouncedQuery.length ? (
              <ListItemIcon className={cls.iconDiv}>
                <SearchIcon className={cls.icon} />
              </ListItemIcon>
            ) : (
              <IconButton className={cls.iconDiv} onClick={handleChange}>
                <CloseIcon className={clsx(cls.icon, cls.closeIcon)} />
              </IconButton>
            )}
          </InputAdornment>
        }
        inputProps={{
          'aria-label': label,
          className: cls.input,
        }}
      />
      <AutoSizer disableHeight>
        {({ width }) => {
          return (
            <List
              style={{
                height: '100%',
                maxHeight: '350px',
              }}
              deferredMeasurementCache={cache}
              height={350}
              tabIndex={-1}
              rowCount={
                filteredResults.length === 0
                  ? 1
                  : showAll
                    ? filteredResults.length
                    : Math.min(filteredResults.length, 8)
              }
              rowRenderer={renderRow}
              rowHeight={cache.rowHeight}
              width={width}
            />
          )
        }}
      </AutoSizer>
    </div>
  )
}
