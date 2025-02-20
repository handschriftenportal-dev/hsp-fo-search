import clsx from 'clsx'
import React from 'react'
import { useSelector } from 'react-redux'

import { makeStyles } from '@material-ui/core/styles'

import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'
import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'

import { Hit } from './Hit'

const useStyles = makeStyles((theme) => ({
  root: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  spacing: {
    marginBottom: theme.spacing(3),
  },
}))

interface Props {
  className?: string
  result: HspObjectsByQueryOutput
}

export function Hits({ className, result }: Props) {
  const cls = useStyles()
  const variant = useSelector(selectors.getHitListVariant)
  const { t, tt } = useTranslation()
  const params = useParsedParams()

  const { numFound, start, rows } = result?.metadata ?? {
    start: 0,
    rows: 0,
    numFound: 0,
  }

  const pageIndex = Math.floor(start / rows) + 1

  const titleDesc = `Handschriftenportal: ${t('searchResults')}`
  const descBeginning = tt(
    { numFound: numFound.toString() },
    'filterPanel',
    'filterResult',
  )
  const desc = `${descBeginning}. - ${t('paging', 'page')} ${pageIndex}.${
    params.q ? ` - "${params.q}"` : ''
  }`

  useSetTitle(titleDesc)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  return (
    <ul className={clsx(cls.root, className)} aria-label={t('searchResults')}>
      {result.payload.map((group) => (
        <li key={group.hspObject.id}>
          <Hit
            className={cls.spacing}
            variant={variant}
            hspObjectGroup={group}
            highlighting={result.metadata.highlighting || {}}
          />
        </li>
      ))}
    </ul>
  )
}
