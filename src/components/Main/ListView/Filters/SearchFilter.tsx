/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  useCallback,
} from 'react'

import { makeStyles } from '@material-ui/core/styles'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import FormControl from '@material-ui/core/FormControl'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'

import clsx from 'clsx'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import { useTranslation } from 'src/contexts/i18n'
import Collapse from '@material-ui/core/Collapse'
import Button from '@material-ui/core/Button'

const useStyles = makeStyles((theme) => ({
  root: {
    minHeight: 'var(--minHeight)',
  },
  btn: { fontWeight: 'unset' },
  btnDisable: {
    display: 'none',
  },
  btnWrapper: {
    transition: 'all 0.55s',
  },
  btnWrapperDisable: {
    opacity: 0,
    height: 0,
  },
  iconDiv: {
    minWidth: 'auto',
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
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  option: {
    display: 'flex',
    alignItems: 'flex-start',
  },
  caption: {
    alignSelf: 'center',
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
  selected: string[]
  toggleValue: (ev: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchFilter(props: Props) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { sortedOptions, selected, toggleValue, filterName } = props

  const inputRef = useRef<HTMLInputElement>(null)
  const moreBtnRef = useRef<HTMLButtonElement>(null)
  const checkBoxRef = useRef<HTMLLinkElement>(null)
  const [showAll, setShowAll] = useState(false)
  const [visible, setVisible] = useState(true)
  const [expandedAtLeastOnce, setExpandedAtLeastOnce] = useState(false)
  const [filteredResults, setFilteredResults] = useState([''])
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [inputQuery, setInputQuery] = useState(debouncedQuery)

  const searchFilter = () => {
    const query = debouncedQuery.toLocaleLowerCase()
    return Object.keys(sortedOptions).filter((key) =>
      key === '__MISSING__'
        ? t('data', '__MISSING__').toLowerCase().includes(query)
        : t('data', filterName, key).toLocaleLowerCase().includes(query)
    )
  }

  const renderOptions = (start: number, end?: number, renderMore?: boolean) => {
    return (
      <div>
        {filteredResults.length ? (
          filteredResults.slice(start, end).map((value, index) => {
            const text =
              value === '__MISSING__'
                ? t('filterPanel', 'missing')
                : t('data', filterName, value) + ` (${sortedOptions[value]})`
            return (
              <div key={value} className={cls.option}>
                <FormControlLabel
                  inputRef={renderMore && index === 0 ? checkBoxRef : undefined}
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
            )
          })
        ) : (
          <div className={cls.option}>
            <Typography
              variant="caption"
              component="span"
              className={cls.noHit}
            >
              {t('filterPanel', 'noHits')}
            </Typography>
          </div>
        )}
      </div>
    )
  }

  const label = `${t('searchBar', 'search')}: ${t(
    'data',
    filterName,
    '__field__'
  )}`

  function handleInputChange(ev: ChangeEvent<HTMLInputElement>): void {
    setInputQuery(ev.target.value)
  }

  function handleChange() {
    setInputQuery('')
    inputRef.current?.focus()
  }

  function handleBtn() {
    setShowAll(!showAll)
    if (!expandedAtLeastOnce) {
      setExpandedAtLeastOnce(true)
    }
  }
  function handleBtnLess() {
    handleBtn()
    moreBtnRef.current?.focus()
  }

  const moreBtn = (tabIndex: number) => {
    return (
      <Button
        className={clsx(cls.btn)}
        tabIndex={tabIndex}
        onClick={() => {
          handleBtn()
        }}
        ref={moreBtnRef}
      >
        {t('filterPanel', 'showMoreFilterOptions')}
      </Button>
    )
  }

  const wrappedBtn = () => {
    if (visible) {
      return <div className={cls.btnWrapper}>{moreBtn(0)}</div>
    } else {
      return <div className={cls.btnWrapperDisable}>{moreBtn(-1)}</div>
    }
  }

  const ref = useCallback(
    (node) => {
      if (node !== null) {
        document.documentElement.style.setProperty(
          '--minHeight',
          node.getBoundingClientRect().height
        )
      }
    },
    [visible]
  )

  // debounce the inputQuery with 500ms
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(inputQuery), 500)
    return () => clearTimeout(timer)
  }, [inputQuery])

  // after a debouncedinput is received, set filteredResults
  useEffect(() => {
    setFilteredResults(() => searchFilter())
  }, [debouncedQuery, sortedOptions])

  useEffect(() => {
    if (checkBoxRef.current) {
      checkBoxRef.current.focus()
    }
  }, [visible])

  return (
    <div className={cls.root} ref={ref}>
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
              <ListItemIcon
                className={cls.iconDiv}
                role="button"
                onClick={handleChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleChange()
                  }
                }}
                tabIndex={0}
              >
                <CloseIcon className={clsx(cls.icon, cls.closeIcon)} />
              </ListItemIcon>
            )}
          </InputAdornment>
        }
        inputProps={{
          'aria-label': label,
          className: cls.input,
        }}
      />
      <FormControl variant="outlined">
        {debouncedQuery.length >= 1 ? (
          renderOptions(0, sortedOptions.length)
        ) : (
          <div>
            {renderOptions(0, 8)}
            {wrappedBtn()}
            <Collapse
              in={showAll}
              onEnter={() => setVisible(false)}
              onExited={() => setVisible(true)}
            >
              {expandedAtLeastOnce &&
                renderOptions(8, sortedOptions.length, true)}
            </Collapse>
            <Button
              className={clsx(cls.btn, { [cls.btnDisable]: !showAll })}
              onClick={() => {
                handleBtnLess()
              }}
            >
              {t('filterPanel', 'showLessFilterOptions')}
            </Button>
          </div>
        )}
      </FormControl>
    </div>
  )
}
