import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import ListSubheader from '@material-ui/core/ListSubheader'
import MenuItem from '@material-ui/core/MenuItem'
import { makeStyles } from '@material-ui/core/styles'

import {
  extendedSearchFilterGroups,
  extendedSearchTextFields,
} from 'src/components/config'
import { SearchFieldSelection } from 'src/components/shared/SearchInput'
import { actions } from 'src/contexts/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'
import { getFieldTypes, resetSearchEntry } from 'src/utils/extendedSearch'

import BoolControl from './BoolControl'
import OperatorSelect from './OperatorSelect'
import TermField from './TermField'

const useStyles = makeStyles((theme) => ({
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  select: {
    [theme.breakpoints.up('sm')]: {
      minWidth: 250,
    },
  },
  logicOperator: {
    minWidth: 250,
    padding: theme.spacing(1),
  },
  extendedElement: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(1),
    },
  },
  // TODO: removable with mui v5, see https://github.com/mui/material-ui/issues/26164
  listSubHeaderSticky: {
    backgroundColor: theme.palette.white.main,
  },
  visibleSubHeader: {
    paddingTop: theme.spacing(2),
  },
  invisibleSubHeader: {
    visibility: 'hidden',
    lineHeight: 2,
  },
  inputBaseExtended: {
    [theme.breakpoints.up('sm')]: {
      width: '400px',
    },
  },

  searchFieldContainer: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    [theme.breakpoints.up('md')]: {
      padding: theme.spacing(1),
    },
  },
  searchFieldInputContainer: {
    gap: '8px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  iconContainer: {
    gap: '8px',
    paddingLeft: theme.spacing(1),
    flexDirection: 'column',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
}))

interface Props {
  index: number
  searchField: string
  searchOperator: string
  searchTerm: string | string[]
  handleInputKeyDown: React.KeyboardEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >
  id: string
  groupId: string
  disableOr: boolean
  disableAnd: boolean
  disableRemove: boolean
}

export default function SearchField(props: Readonly<Props>) {
  const cls = useStyles()
  const { t } = useTranslation()
  const {
    searchField,
    searchOperator,
    searchTerm,
    handleInputKeyDown,
    index,
    groupId,
  } = props

  const [fieldType, setFieldType] = useState('')
  const dispatch = useDispatch()
  const searchGroups = useSelector(selectors.getExtendedSearchGroups)

  function onFieldChange(
    event: React.ChangeEvent<{ value: unknown }>,
    index: number,
    groupId: string,
  ): void {
    const newSearchGroup = [...searchGroups]
    if ((event.target.value as string) !== undefined) {
      const value = event.target.value as string
      const { oldFieldType, newFieldType } = getFieldTypes(
        groupId,
        index,
        value,
        newSearchGroup,
      )

      dispatch(
        actions.setNewExtSearchValue({
          index,
          value,
          groupId,
          property: 'searchField',
        }),
      )

      if (oldFieldType !== newFieldType) {
        setFieldType(newFieldType)
        if (newFieldType === 'enum') {
          resetSearchEntry(index, value, dispatch, groupId, 'enum')
        }
        if (newFieldType === 'boolean') {
          resetSearchEntry(index, 'true', dispatch, groupId)
        } else if (newFieldType === 'integer' || newFieldType === 'float') {
          resetSearchEntry(index, '1', dispatch, groupId)
        } else if (newFieldType === 'text') {
          resetSearchEntry(index, '', dispatch, groupId)
        }
      }
      if (oldFieldType === 'enum' && newFieldType === 'enum') {
        resetSearchEntry(index, value, dispatch, groupId, 'enum')
      }
    }
  }

  useEffect(() => {
    const entry = extendedSearchTextFields.find((searchTextField) =>
      searchTextField.name.includes(searchField),
    )
    if (entry) {
      setFieldType(entry.type)
    }
  }, [searchField])

  const renderSearchFieldSelection = () => {
    return extendedSearchFilterGroups.reduce(
      (prev: React.ReactElement[], { id, name: groupName }) => {
        const elementsToAdd: React.ReactElement[] = []

        let rootCls = cls.invisibleSubHeader
        if (['description-text', 'description'].includes(groupName)) {
          rootCls = cls.visibleSubHeader
        }

        if (groupName === 'administration') {
          elementsToAdd.push(<Divider key={`divider-${id}`} />)
        }

        elementsToAdd.push(
          <ListSubheader
            key={`extended-search-group-${groupName}`}
            classes={{
              sticky: cls.listSubHeaderSticky,
              root: rootCls,
            }}
          >
            {t('filterPanel', 'filterGroups', groupName)}
          </ListSubheader>,
          ...extendedSearchTextFields
            .filter(({ group }) => group === id)
            .sort(({ groupCategory: a }, { groupCategory: b }) => a - b)
            .map(({ name }) => (
              <MenuItem key={`extended-search-group-${name}`} value={name}>
                {name === 'FIELD-GROUP-ALL'
                  ? t('searchBar', 'allFields')
                  : t('data', name, '__field__')}
              </MenuItem>
            )),
        )

        return prev.concat(elementsToAdd)
      },
      [],
    )
  }

  return (
    <Grid container alignItems="center" className={cls.searchFieldContainer}>
      <Grid
        justifyContent="flex-start"
        className={cls.searchFieldInputContainer}
        container
      >
        <SearchFieldSelection
          searchField={searchField}
          handleFieldChange={(e) => onFieldChange(e, index, groupId)}
          aria-label={t('searchBar', 'searchFieldSelection')}
        >
          {renderSearchFieldSelection()}
        </SearchFieldSelection>
        <OperatorSelect
          index={index}
          searchOperator={searchOperator}
          fieldType={fieldType}
          groupId={groupId}
        />
        <TermField
          searchTerm={searchTerm}
          handleInputKeyDown={handleInputKeyDown}
          aria-label={t('searchBar', 'search')}
          className={cls.inputBaseExtended}
          fieldType={fieldType}
          searchField={searchField}
          index={index}
          groupId={groupId}
        />
      </Grid>
      <Grid justifyContent="flex-end" className={cls.iconContainer} container>
        <BoolControl index={index} groupId={groupId} />
      </Grid>
    </Grid>
  )
}
