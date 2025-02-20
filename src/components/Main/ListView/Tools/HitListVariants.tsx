import clsx from 'clsx'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip } from 'src/components/shared/Tooltip'
import { actions } from 'src/contexts/actions'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'
import { MainState } from 'src/contexts/types'

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

export function HitListVariants(props: Readonly<Props>) {
  const { className } = props
  const cls = useStyles()
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const variant = useSelector(selectors.getHitListVariant)

  const hitsExpandedLabel = t('listVariants', 'hitsExpanded') as string
  const hitsTopLabel = t('listVariants', 'hitsTop') as string
  const hitsBottomLabel = t('listVariants', 'hitsBottom') as string
  const hitsCollapsedLabel = t('listVariants', 'hitsCollapsed') as string

  const change = (variant: MainState['hitListVariant']) => () => {
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
