import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import DeleteIcon from '@material-ui/icons/Delete'

import { LogicOperator } from 'src/components/config'
import { actions } from 'src/contexts/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'

interface Props {
  index: number
  groupId: string
}

export default function BoolControl(props: Readonly<Props>) {
  const { t } = useTranslation()
  const { index, groupId } = props
  const dispatch = useDispatch()

  const handleAddField = (index: number, logicOperator: LogicOperator) => {
    dispatch(actions.addToExtSearchList({ index, groupId, logicOperator }))
  }
  const removeSearchField = (index: number, groupId: string) => {
    dispatch(actions.removeFromExtSearchList({ index, groupId }))
  }

  const listLength = useSelector(selectors.getExtendedSearchGroups)[0].elements
    .length

  return (
    <>
      <IconButton
        onClick={() => removeSearchField(index, groupId)}
        aria-label={t('extendedSearch', 'removeField')}
        disabled={index === 0 && listLength === 1}
      >
        <DeleteIcon />
      </IconButton>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleAddField(index, LogicOperator.OR)}
        aria-label={t('extendedSearch', 'addSearchField')}
      >
        {t('extendedSearch', 'or')}
      </Button>
      <Button
        startIcon={<AddCircleOutlineIcon />}
        onClick={() => handleAddField(index, LogicOperator.AND)}
        aria-label={t('extendedSearch', 'addSearchField')}
      >
        {t('extendedSearch', 'and')}
      </Button>
    </>
  )
}
