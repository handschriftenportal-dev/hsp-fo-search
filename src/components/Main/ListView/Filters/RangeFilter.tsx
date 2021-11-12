/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch'
import Checkbox from '@material-ui/core/Checkbox'
import Typography from '@material-ui/core/Typography'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'

import { useTranslation } from 'src/contexts/i18n'
import { RangeFilterData } from 'src/contexts/location'

const useStyles = makeStyles(theme => ({
  root: {
    padding: '0px 16px'
  },
  checkbox: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  input: {
    width: '50px',
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
    border: '1px solid #ccc',
    background: theme.palette.background.default,
  },
  to: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  option: {
    display: 'flex',
    alignItems: 'center',
  },
  missing: {
    fontStyle: 'italic',
  },
}))

interface Props {
  label: string;
  options: [number, number];
  exactOption?: boolean;
  selected?: RangeFilterData;
  onChange: (selected?: RangeFilterData) => void;
  unit?: string;
}

export function RangeFilter(props: Props) {
  const { exactOption, label, options, selected, onChange, unit } = props
  const cls = useStyles()
  const [active, setActive] = useState(!!selected)
  const [value, setValue] = useState(selected || { from: options[0], to: options[1] })
  const [from, setFrom] = useState(value?.from.toString() || '')
  const [to, setTo] = useState(value?.to.toString() || '')
  const [exact, setExact] = useState(value?.exact || (exactOption ? false : undefined))
  const [missing, setMissing] = useState(value?.missing || false)
  const { t } = useTranslation()
  const { from: _from, to: _to, ...restValue } = value

  const handleSwitchToggle = function(checked: boolean) {
    setActive(checked)
    onChange(checked ? value : undefined)
  }

  const setValueFrom = function(v: string) {
    let newValue: RangeFilterData
    const { from, ...rest } = value

    if (v === undefined || !/[0-9]/.test(v) || +v < options[0]) {
      setFrom(options[0].toString())
      newValue = {
        from: options[0],
        ...rest
      }
    } else if (+v > +to) {
      setFrom(to)
      newValue = {
        from: value.to,
        ...rest
      }
    } else {
      newValue = {
        from: +v,
        ...rest
      }
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const setValueTo = function(v: string) {
    let newValue: RangeFilterData
    const { to, ...rest } = value

    if (v === undefined || !/[0-9]/.test(v) || +v > options[1]) {
      setTo(options[1].toString())
      newValue = {
        to: options[1],
        ...rest
      }
    } else if (+v < +from) {
      setTo(from)
      newValue = {
        to: value.from,
        ...rest
      }
    } else {
      newValue = {
        to: +v,
        ...rest
      }
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const toggleExact = function() {
    const newExact = !exact
    const { exact: _exact, ...rest } = value
    const newValue = {
      exact: newExact,
      ...rest,
    }

    setExact(newExact)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  const toggleMissing = function() {
    const newMissing = !missing
    const { missing: _missing, ...rest } = value
    const newValue = {
      missing: newMissing,
      ...rest,
    }

    setMissing(newMissing)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  return (
    <div className={cls.root} data-testid={`range-filter-${label}`}>
      <div>
        <InputBase
          data-testid={`range-filter-${label}-from`}
          className={cls.input}
          placeholder={t('filterPanel', 'rangeFrom')}
          value={from}
          onBlur={() => setValueFrom(from)}
          onChange={(e) => setFrom(e.target.value)}
        />
        <Typography
          className={cls.to}
          variant="body1"
          component="span"
        >
          {t('filterPanel', 'rangeTo')}
        </Typography>
        <InputBase
          data-testid={`range-filter-${label}-to`}
          className={cls.input}
          placeholder={t('filterPanel', 'rangeTo')}
          value={to}
          onBlur={() => setValueTo(to)}
          onChange={(e) => setTo(e.target.value)}
        />
        <Typography
          data-testid={`range-filter-${label}-unit`}
          variant="body1"
          component="span"
        >
          {unit}
        </Typography>
      </div>
      <Slider
        data-testid={`range-filter-${label}-slider`}
        value={[value.from, value.to]}
        onChange={(e, value) => {
          const _value = value as [number, number]
          setValue({
            from: _value[0],
            to: _value[1],
            ...restValue
          })
          setFrom(_value[0].toString())
          setTo(_value[1].toString())
          if (!active) {
            setActive(true)
          }
        }}
        onChangeCommitted={(e, value) => {
          const _value = value as [number, number]
          if (active) {
            onChange({
              from: _value[0],
              to: _value[1],
              ...restValue
            })
          }
        }}
        valueLabelDisplay="auto"
        min={options[0]}
        max={options[1]}
      />
      <div className={cls.option}>
        <Checkbox
          className={cls.checkbox}
          color="primary"
          checked={missing}
          onChange={toggleMissing}
        />
        <Typography
          variant="body2"
          component="span"
          className={cls.missing}
        >
          {t('filterPanel', 'missing')}
        </Typography>
      </div>
      { exactOption && <div className={cls.option}>
        <Checkbox
          className={cls.checkbox}
          color="primary"
          checked={exact}
          onChange={toggleExact}
        />
        <Typography
          variant="body2"
          component="span"
        >
          {t('filterPanel', 'exactPeriod')}
        </Typography>
      </div>
      }
      <FormControlLabel
        control={<Switch
          data-testid={`range-filter-${label}-switch`}
          checked={active}
          onChange={(e, checked) => handleSwitchToggle(checked)}
          color="primary"
        />}
        label={t('filterPanel', 'activateRangeFilter')}
      />
    </div>
  )
}
