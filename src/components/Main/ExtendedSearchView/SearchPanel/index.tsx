import React from 'react'
import { useSelector } from 'react-redux'

import Grid from '@material-ui/core/Grid'
import makeStyles from '@material-ui/core/styles/makeStyles'

import SinglePagePaper from 'src/components/shared/SinglePagePaper'
import { selectors } from 'src/contexts/state'
import { SearchGroup } from 'src/contexts/types'

import BoolDivider from './BoolDivider'
import SearchField from './InputFields'

const useStyles = makeStyles((theme) => ({
  searchPanel: {
    flexGrow: 1,
    backgroundColor: theme.palette.whiteSmoke.main,
    padding: theme.spacing(0.5),
  },
  searchFields: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },

  searchGroup: {
    paddingLeft: theme.spacing(1),
    backgroundColor: 'rgb(255, 255, 255)',
    border: '1px solid rgb(211, 218, 230)',
    margin: theme.spacing(0.5),
  },
}))

interface Props {
  search: () => void
}

export default function SearchPanel(props: Readonly<Props>) {
  const cls = useStyles()
  const { search } = props
  const searchGroups = useSelector(selectors.getExtendedSearchGroups)

  function handleInputKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>,
  ): void {
    if (event.key === 'Enter') {
      search()
    }
  }

  const orDisabled = false
  const andDisabled = false

  const renderGroup = (group: SearchGroup, firstLevel: boolean) => {
    return (
      <Grid key={group.groupId} className={!firstLevel ? cls.searchGroup : ''}>
        {group.elements.map((searchFilter, index, arrayRef) => {
          if ('id' in searchFilter) {
            const showDelimiter =
              group.groupLogicOperators && index + 1 < arrayRef.length
            const { id, searchField, comparisonOperator, searchTerm } =
              searchFilter
            return (
              <Grid key={id}>
                <SearchField
                  disableOr={orDisabled}
                  disableAnd={andDisabled}
                  disableRemove={group.elements.length === 1}
                  index={index}
                  searchField={searchField}
                  searchOperator={comparisonOperator}
                  searchTerm={searchTerm}
                  handleInputKeyDown={handleInputKeyDown}
                  id={id}
                  groupId={group.groupId}
                />
                {showDelimiter && (
                  <BoolDivider
                    boolRelation={group.groupLogicOperators[index]}
                  />
                )}
              </Grid>
            )
          } else {
            return (
              <>
                {renderGroup(searchFilter, false)}
                <BoolDivider boolRelation={group.groupLogicOperators[index]} />
              </>
            )
          }
        })}
      </Grid>
    )
  }

  return (
    <SinglePagePaper>
      <div className={cls.searchPanel}>
        <Grid>{renderGroup(searchGroups[0], true)}</Grid>
      </div>
    </SinglePagePaper>
  )
}
