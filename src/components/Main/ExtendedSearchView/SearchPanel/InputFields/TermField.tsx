import React, { ChangeEvent } from 'react'
import { useDispatch } from 'react-redux'

import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'

import { extendedSearchTextFields } from 'src/components/config'
import {
  SearchInputField,
  SearchInputFieldProps,
} from 'src/components/shared/SearchInput'
import { actions } from 'src/contexts/actions'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  inputBaseExtended: {
    marginRight: theme.spacing(1),
    marginLeft: theme.spacing(1),
  },
  selectPadding: {
    padding: theme.spacing(1),
  },
}))

interface Props {
  fieldType: string
  searchField: string
  index: number
  groupId: string
}
export default function TermField(
  props: Readonly<SearchInputFieldProps> & Props,
) {
  const cls = useStyles()
  const { t } = useTranslation()
  const {
    index,
    fieldType,
    searchTerm,
    handleInputKeyDown,
    searchField,
    groupId,
  } = props

  const dispatch = useDispatch()
  const inputRefBar = React.useRef<HTMLInputElement>(null)

  const handleResetClick = (index: number) => {
    inputRefBar.current?.focus()
    dispatch(
      actions.setNewExtSearchValue({
        index,
        value: '',
        groupId,
        property: 'searchTerm',
      }),
    )
  }
  const handleInputChange = (
    index: number,
    event:
      | React.ChangeEvent<HTMLInputElement>
      | ChangeEvent<{ value: unknown }>,
  ) => {
    dispatch(
      actions.setNewExtSearchValue({
        index,
        value: event.target.value as string,
        groupId,
        property: 'searchTerm',
      }),
    )
  }

  const sortedSearchValues = (first: string, second: string) => {
    // TODO: introduce ordered enums to remove this explicit check for format-search to return always true
    if (searchField === 'format-search') return 1
    return t('data', searchField, first) > t('data', searchField, second)
      ? 1
      : -1
  }

  if (fieldType === 'enum') {
    const entry = (
      extendedSearchTextFields.find((entry) => entry.name === searchField) as {
        values: string[]
      }
    ).values.toSorted((first, second) => sortedSearchValues(first, second))

    return (
      <Select
        native={false}
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': t('searchBar', 'searchFieldSelection'),
        }}
        id="termSelect"
        onChange={(e) => handleInputChange(index, e)}
        value={searchTerm}
      >
        {entry.map((value) => (
          <MenuItem value={value} key={value}>
            {t('data', searchField, value)}
          </MenuItem>
        ))}
      </Select>
    )
  }

  if (fieldType === 'boolean') {
    const boolOptions = ['true', 'false']
    return (
      <Select
        native={false}
        disableUnderline
        classes={{
          select: cls.selectPadding,
        }}
        inputProps={{
          'aria-label': t('searchBar', 'searchFieldSelection'),
        }}
        id="termSelect"
        onChange={(e) => handleInputChange(index, e)}
        value={searchTerm}
      >
        {boolOptions.map((value) => (
          <MenuItem value={value} key={value}>
            {t('data', searchField, value)}
          </MenuItem>
        ))}
      </Select>
    )
  }

  return (
    <SearchInputField
      searchTerm={searchTerm}
      handleInputKeyDown={handleInputKeyDown}
      handleResetClick={() => handleResetClick(index)}
      handleInputChange={(e) => handleInputChange(index, e)}
      aria-label={t('searchBar', 'search')}
      inputRefBar={inputRefBar}
      className={cls.inputBaseExtended}
      type={fieldType}
    />
  )
}
