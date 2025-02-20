import clsx from 'clsx'
import React, { ChangeEvent, useState } from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import InputBase from '@material-ui/core/InputBase'
import Slider from '@material-ui/core/Slider'
import Switch from '@material-ui/core/Switch'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { useTranslation } from 'src/contexts/i18n'
import { RangeFilterData } from 'src/contexts/location'

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
  },
  inputDiv: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginRight: theme.spacing(-2),
  },
  inputBase: {
    width: '70px',
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    '& .hsp-search-MuiInputBase-input': {
      textAlign: 'center',
    },
  },
  input: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
  },
  inputPointer: {
    outline: 'none !important',
  },
  to: {
    paddingLeft: theme.spacing(0.5),
    paddingRight: theme.spacing(0.5),
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
  missing: {
    fontStyle: 'italic',
    alignSelf: 'center',
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  slider: {
    width: '90%',
    marginLeft: theme.spacing(2),
    '& .hsp-search-MuiSlider-thumb': {
      backgroundColor: 'white',
      height: theme.spacing(2),
      width: theme.spacing(2),
      '&:focus-visible': {
        outline: `${theme.spacing(0.5)}px solid ${
          theme.palette.liver.main
        } !important`,
      },
    },
    '& .hsp-search-MuiSlider-rail': {
      backgroundColor: '#000',
      height: theme.spacing(0.5),
    },
    '& .hsp-search-MuiSlider-track': {
      height: theme.spacing(0.5),
      width: theme.spacing(0.5),
    },
  },
  switch: {
    paddingTop: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
  },
}))

interface Props {
  label: string
  textMissing: string
  options: [number, number]
  exactOption?: boolean
  selected?: RangeFilterData
  onChange: (selected?: RangeFilterData) => void
  unit?: string
}

export function RangeFilter(props: Props) {
  const { exactOption, label, textMissing, options, selected, onChange, unit } =
    props
  const cls = useStyles()
  const [pointerEvent, setPointerEvent] = useState(false)
  const [active, setActive] = useState(!!selected)
  const [value, setValue] = useState(
    selected || { from: options[0], to: options[1] },
  )
  const [from, setFrom] = useState(value?.from.toString() || '')
  const [to, setTo] = useState(value?.to.toString() || '')
  const [exact, setExact] = useState(
    value?.exact || (exactOption ? false : undefined),
  )
  const [missing, setMissing] = useState(value?.missing || false)
  const { t } = useTranslation()

  const handleSwitchToggle = function (checked: boolean) {
    setActive(checked)
    onChange(checked ? value : undefined)
  }

  const setValueFrom = function (v: string) {
    const newValue: RangeFilterData = { ...value }

    if (v === undefined || !/\d/.test(v) || +v < options[0]) {
      setFrom(options[0].toString())
      newValue.from = options[0]
    } else if (+v > +to) {
      setFrom(to)
      newValue.from = value.to
    } else {
      newValue.from = +v
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const setValueTo = function (v: string) {
    const newValue: RangeFilterData = { ...value }

    if (v === undefined || !/\d/.test(v) || +v > options[1]) {
      setTo(options[1].toString())
      newValue.to = options[1]
    } else if (+v < +from) {
      setTo(from)
      newValue.to = value.from
    } else {
      newValue.to = +v
    }

    setValue(newValue)

    if (active) {
      onChange(newValue)
    }
  }

  const toggleExact = function () {
    const newExact = !exact
    const newValue = { ...value }
    newValue.exact = newExact

    setExact(newExact)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  const toggleMissing = function () {
    const newMissing = !missing
    const newValue = { ...value }
    newValue.missing = newMissing

    setMissing(newMissing)
    setValue(newValue)
    setActive(true)
    onChange(newValue)
  }

  const textExactPeriod = t('filterPanel', 'exactPeriod')

  function handleInputChangeFrom(ev: ChangeEvent<HTMLInputElement>): void {
    setPointerEvent(true)
    setFrom(ev.target.value)
  }

  function handleInputChangeTo(ev: ChangeEvent<HTMLInputElement>): void {
    setPointerEvent(true)
    setTo(ev.target.value)
  }

  return (
    <div className={cls.root} data-testid={`range-filter-${label}`}>
      <div className={cls.inputDiv}>
        <InputBase
          data-testid={`range-filter-${label}-from`}
          className={cls.inputBase}
          placeholder={t('filterPanel', 'rangeFrom')}
          value={from}
          onBlur={() => setValueFrom(from)}
          onChange={handleInputChangeFrom}
          onKeyDown={() => setPointerEvent(false)}
          onPointerDown={() => setPointerEvent(true)}
          inputProps={{
            'aria-label': `${label} ${t('filterPanel', 'rangeFrom')}`,
            className: clsx(cls.input, { [cls.inputPointer]: pointerEvent }),
          }}
        />
        <Typography className={cls.to} variant="caption" component="span">
          {t('filterPanel', 'rangeTo')}
        </Typography>
        <InputBase
          data-testid={`range-filter-${label}-to`}
          className={cls.inputBase}
          placeholder={t('filterPanel', 'rangeTo')}
          value={to}
          onBlur={() => setValueTo(to)}
          onChange={handleInputChangeTo}
          onKeyDown={() => setPointerEvent(false)}
          onPointerDown={() => setPointerEvent(true)}
          inputProps={{
            'aria-label': `${label} ${t('filterPanel', 'rangeTo')}`,
            className: clsx(cls.input, { [cls.inputPointer]: pointerEvent }),
          }}
        />
        <Typography
          className={cls.to}
          data-testid={`range-filter-${label}-unit`}
          variant="caption"
          component="span"
        >
          {unit}
        </Typography>
      </div>
      <Slider
        // TODO: mui (v4) console error after moving slider (lower or upper bound) for first time
        className={cls.slider}
        data-testid={`range-filter-${label}-slider`}
        value={[value.from, value.to]}
        onChange={(e, v) => {
          const newValue = v as [number, number]
          setValue({
            ...value,
            from: newValue[0],
            to: newValue[1],
          })
          setFrom(newValue[0].toString())
          setTo(newValue[1].toString())
          if (!active) {
            setActive(true)
          }
        }}
        onChangeCommitted={(e, v) => {
          const newValue = v as [number, number]
          if (active) {
            onChange({
              ...value,
              from: newValue[0],
              to: newValue[1],
            })
          }
        }}
        valueLabelDisplay="auto"
        min={options[0]}
        max={options[1]}
        getAriaLabel={() => label}
      />
      <div className={cls.option}>
        <FormControlLabel
          label={
            <Typography
              variant="caption"
              component="span"
              className={cls.missing}
            >
              {textMissing}
            </Typography>
          }
          control={
            <Checkbox
              className={cls.checkbox}
              color="primary"
              checked={missing}
              onChange={toggleMissing}
              icon={
                <img
                  src="/img/checkbox_unchecked.svg"
                  alt={textMissing + ' ' + t('filterPanel', 'unchecked')}
                />
              }
              checkedIcon={
                <img
                  src="/img/checkbox_checked.svg"
                  alt={textMissing + ' ' + t('filterPanel', 'checked')}
                />
              }
            />
          }
        />
      </div>
      {exactOption && (
        <div className={cls.option}>
          <FormControlLabel
            label={
              <Typography
                className={cls.caption}
                variant="caption"
                component="span"
              >
                {t('filterPanel', 'exactPeriod')}
              </Typography>
            }
            control={
              <Checkbox
                className={cls.checkbox}
                color="primary"
                checked={exact}
                onChange={toggleExact}
                icon={
                  <img
                    src="/img/checkbox_unchecked.svg"
                    alt={textExactPeriod + ' ' + t('filterPanel', 'unchecked')}
                  />
                }
                checkedIcon={
                  <img
                    src="/img/checkbox_checked.svg"
                    alt={textExactPeriod + ' ' + t('filterPanel', 'checked')}
                  />
                }
              />
            }
          />
        </div>
      )}
      <div className={cls.switch}>
        <FormControlLabel
          control={
            <Switch
              data-testid={`range-filter-${label}-switch`}
              checked={active}
              onChange={(e, checked) => handleSwitchToggle(checked)}
              color="primary"
              size="small"
            />
          }
          label={
            <Typography
              className={cls.caption}
              variant="caption"
              component="span"
            >
              {t('filterPanel', 'activateRangeFilter')}
            </Typography>
          }
        />
      </div>
    </div>
  )
}
