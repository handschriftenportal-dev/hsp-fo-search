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

import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import { useDispatch, useSelector } from 'react-redux'
import { State, actions, selectors } from 'src/contexts/state'
import { Tooltip } from 'src/components/shared/Tooltip'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 0,
    padding: 0,
    border: 'none',
    display: 'flex',
    flexWrap: 'nowrap',
  },
  button: {
    height: theme.spacing(4),
    boxShadow: 'none',
    borderRadius: 0,
    marginRight: theme.spacing(0.5),
    background: theme.palette.platinum.main,
    '&:focus': {
      background: theme.palette.white,
    },
  },
  selected: {
    background: 'white',
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  img: {
    filter:
      'invert(65%) sepia(80%) saturate(440%) hue-rotate(122deg) brightness(90%) contrast(91%)',
  },
}))

interface Props {
  className?: string
}

export function HitListVariants(props: Props) {
  const { className } = props
  const cls = useStyles()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const variant = useSelector(selectors.getHitListVariant)

  const hitsExpandedLabel = t('listVariants', 'hitsExpanded') as string
  const hitsTopLabel = t('listVariants', 'hitsTop') as string
  const hitsBottomLabel = t('listVariants', 'hitsBottom') as string
  const hitsCollapsedLabel = t('listVariants', 'hitsCollapsed') as string

  const change = (variant: State['hitListVariant']) => () => {
    dispatch(actions.setHitListVariant(variant))
  }

  return (
    <fieldset
      className={clsx(cls.root, className)}
      aria-label={t('listVariants', 'listVariants')}
    >
      <Tooltip title={hitsExpandedLabel}>
        <IconButton
          disableRipple
          aria-label={hitsExpandedLabel}
          onClick={change('expanded')}
          className={clsx(cls.button, {
            [cls.selected]: variant === 'expanded',
          })}
        >
          <img
            src="/img/hits_expanded.svg"
            className={clsx({ [cls.img]: variant === 'expanded' })}
            alt={hitsExpandedLabel}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={hitsTopLabel}>
        <IconButton
          disableRipple
          aria-label={hitsTopLabel}
          onClick={change('keyData')}
          className={clsx(cls.button, {
            [cls.selected]: variant === 'keyData',
          })}
        >
          <img
            src="/img/hits_top.svg"
            className={clsx({ [cls.img]: variant === 'keyData' })}
            alt={hitsTopLabel}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={hitsBottomLabel}>
        <IconButton
          disableRipple
          aria-label={hitsBottomLabel}
          onClick={change('citations')}
          className={clsx(cls.button, {
            [cls.selected]: variant === 'citations',
          })}
        >
          <img
            src="/img/hits_bottom.svg"
            className={clsx({ [cls.img]: variant === 'citations' })}
            alt={hitsBottomLabel}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title={hitsCollapsedLabel}>
        <IconButton
          disableRipple
          aria-label={hitsCollapsedLabel}
          onClick={change('collapsed')}
          className={clsx(cls.button, {
            [cls.selected]: variant === 'collapsed',
          })}
        >
          <img
            src="/img/hits_collapsed.svg"
            className={clsx({ [cls.img]: variant === 'collapsed' })}
            alt={hitsCollapsedLabel}
          />
        </IconButton>
      </Tooltip>
    </fieldset>
  )
}
