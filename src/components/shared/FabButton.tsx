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

import Fab from '@material-ui/core/Fab'
import { Tooltip } from 'src/components/shared/Tooltip'
import React from 'react'
import CheckIcon from '@material-ui/icons/Check'
import AddIcon from '@material-ui/icons/Add'
import { useTranslation } from 'src/contexts/i18n'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'

const useStyles = makeStyles((theme) => ({
  fab: {
    right: theme.spacing(-3),
    position: 'absolute',
    top: theme.spacing(2),
    color: 'white',
  },
  fabIcon: {
    lineHeight: 'unset',
  },
  digitizedOutline: {
    '&:focus-visible': {
      outlineColor: theme.palette.white.main + '!important',
    },
  },
  liver: {
    backgroundColor: theme.palette.liver.main,
    '&:hover': {
      backgroundColor: theme.palette.liver.main,
    },
  },
  turquoise: {
    backgroundColor: theme.palette.turquoise.main,
    '&:hover': {
      backgroundColor: theme.palette.turquoise.main,
    },
  },
}))

interface Props {
  className?: string
  isAlreadyAdded: boolean
  onClickSelect: () => void
  onClickUnselect: () => void
  isDescription?: boolean
  isThumbnail?: boolean
}

export function FabButton(props: Props) {
  const {
    isAlreadyAdded,
    onClickSelect,
    onClickUnselect,
    isDescription,
    isThumbnail,
  } = props

  const cls = useStyles()
  const { t } = useTranslation()

  const alreadyAddedTitle = isDescription
    ? t('resources', 'removeDescription')
    : t('resources', 'removeDigitalImage')

  const notAddedTitle = isDescription
    ? t('resources', 'addDescription')
    : t('resources', 'addDigitalImage')

  const digiOutlineOverview = {
    [cls.digitizedOutline]: !isDescription && !isThumbnail,
  }

  return (
    <>
      {isAlreadyAdded ? (
        <Tooltip title={alreadyAddedTitle}>
          <Fab
            size="medium"
            className={clsx(cls.fab, cls.liver, {
              ...digiOutlineOverview,
            })}
            onClick={onClickUnselect}
            aria-label={alreadyAddedTitle}
          >
            <CheckIcon className={cls.fabIcon} />
          </Fab>
        </Tooltip>
      ) : (
        <Tooltip title={notAddedTitle}>
          <Fab
            size="medium"
            className={clsx(cls.fab, cls.turquoise, {
              ...digiOutlineOverview,
            })}
            onClick={onClickSelect}
            aria-label={notAddedTitle}
          >
            <AddIcon className={cls.fabIcon} />
          </Fab>
        </Tooltip>
      )}
    </>
  )
}
