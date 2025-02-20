import clsx from 'clsx'
import React from 'react'

import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import { InputBaseComponentProps } from '@material-ui/core/InputBase'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Select from '@material-ui/core/Select'
import { SelectInputProps } from '@material-ui/core/Select/SelectInput'
import { makeStyles } from '@material-ui/core/styles'
import CloseIcon from '@material-ui/icons/Close'

import { useParsedParams, useSearchModuleLocation } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { useGetExtendedSearchTerm } from 'src/utils/extendedSearch'

// todo: fix magic number
const useStyles = makeStyles((theme) => ({
  hide: {
    visibility: 'hidden',
  },
  inputBase: {
    borderRadius: 2,
    border: '1px solid #ccc',
    background: theme.palette.background.default,
    flexGrow: 1,
    boxShadow: 'inset 4px 5px 4px -4px rgb(0 0 0 / 20%)',
    [theme.breakpoints.only('xs')]: {
      minWidth: '164px',
    },
    '&:has(input:invalid)': {
      background: theme.palette.darkTerracotta.light,
    },
  },
  input: {
    paddingLeft: theme.spacing(1),
  },
  icon: {
    cursor: 'pointer',
  },
  select: {
    marginRight: 8,
    '&:hover': {
      backgroundColor: theme.palette.platinum.main,
    },
  },
  selectPadding: {
    padding: theme.spacing(1),
  },
  iconButton: {
    padding: 0,
  },
}))

export interface SearchInputFieldProps {
  searchTerm: string | string[]
  handleInputKeyDown: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >
  handleResetClick?: React.MouseEventHandler
  handleInputChange?: React.ChangeEventHandler<HTMLInputElement>
  'aria-label': string
  className?: string
  inputRefBar?: React.RefObject<HTMLInputElement>
  type?: string
}

export function SearchInputField({
  searchTerm,
  handleInputKeyDown,
  handleResetClick,
  handleInputChange,
  'aria-label': ariaLabel,
  inputRefBar,
  className,
  type = 'text',
}: Readonly<SearchInputFieldProps>) {
  const cls = useStyles()
  const { t } = useTranslation()
  const { extendedButNotInExtendedView } = useSearchModuleLocation()
  const getExtendedSearchTerm = useGetExtendedSearchTerm()
  const { q } = useParsedParams()
  const isRange = type === 'integer' || type === 'float' || type === 'year'

  const handleInputPlaceholder = () => {
    if (type === 'year') {
      return t('extendedSearch', 'placeholderYear')
    } else if (isRange) {
      return '1'
    }
    return ''
  }

  const handleInputProps = () => {
    const inputProps = {} as InputBaseComponentProps
    if (type === 'integer') {
      inputProps.min = 0
      inputProps.max = 10000
    } else if (type === 'float') {
      inputProps.min = 0
      inputProps.max = 10000
      inputProps.step = 0.01
    } else if (type === 'year') {
      inputProps.min = -9999
      inputProps.max = 9999
      inputProps.step = 1
    }
    return inputProps
  }

  return (
    <OutlinedInput
      className={clsx(cls.inputBase, className)}
      disabled={extendedButNotInExtendedView}
      endAdornment={
        <InputAdornment
          position="end"
          className={clsx({
            [cls.hide]: !searchTerm || extendedButNotInExtendedView,
          })}
        >
          <IconButton
            aria-label="reset"
            onClick={handleResetClick}
            className={cls.iconButton}
          >
            <CloseIcon className={cls.icon} />
          </IconButton>
        </InputAdornment>
      }
      onChange={handleInputChange}
      onKeyDown={handleInputKeyDown}
      type={isRange ? 'number' : 'text'}
      value={
        extendedButNotInExtendedView
          ? getExtendedSearchTerm(q || '')
          : searchTerm
      }
      inputProps={{
        'aria-label': ariaLabel,
        className: cls.input,
        ...handleInputProps(),
      }}
      placeholder={handleInputPlaceholder()}
      inputRef={inputRefBar}
    />
  )
}

interface SearchFieldSelectionProps {
  searchField: string
  handleFieldChange: SelectInputProps['onChange']
  'aria-label': string
  children: React.ReactElement | React.ReactElement[]
  className?: string
  native?: boolean
}

export function SearchFieldSelection({
  searchField,
  handleFieldChange,
  'aria-label': ariaLabel,
  className,
  children,
  native = false,
}: Readonly<SearchFieldSelectionProps>) {
  const cls = useStyles()
  const { inExtendedView, inSimpleSearch } = useSearchModuleLocation()

  if (inExtendedView || inSimpleSearch) {
    return (
      <Select
        native={native}
        className={clsx(cls.select, className, 'searchSelect')}
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': ariaLabel,
        }}
        onChange={handleFieldChange}
        value={searchField}
        id="searchBarSelect"
      >
        {children}
      </Select>
    )
  }

  return <></>
}
