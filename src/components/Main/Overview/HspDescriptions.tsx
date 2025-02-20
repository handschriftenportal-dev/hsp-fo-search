import clsx from 'clsx'
import React from 'react'
import { useSelector } from 'react-redux'

import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { ResourceActionCard } from 'src/components/shared/ResourceActionCard'
import { getAuthorDateLine } from 'src/components/shared/getAuthorDateLine'
import { HspDescription } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { selectors } from 'src/contexts/state'

const useStyles = makeStyles((theme) => ({
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    marginTop: theme.spacing(3),
    width: 400,
    minHeight: 100,
    marginRight: theme.spacing(6),
    padding: theme.spacing(2),
    paddingRight: theme.spacing(4),
  },
  hspId: {
    fontWeight: 350,
  },
  manuscriptDescriptions: {
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
}))

interface Props {
  className?: string
  hspDescriptions: HspDescription[]
}

export function HspDescriptions({ className, hspDescriptions }: Props) {
  const sortedDescriptions = hspDescriptions.slice().sort((a, b) => {
    if (a['publish-year-display'] && b['publish-year-display']) {
      // newest first
      return b['publish-year-display'] - a['publish-year-display']
    } else if (a['publish-year-display']) {
      // put descriptions with date before descriptions without
      return -1
    } else if (b['publish-year-display']) {
      // put descriptions with date before descriptions without
      return 1
    }
    return 0
  })
  const cls = useStyles()
  const { t } = useTranslation()
  const retroDescDisplayEnabled = useSelector(
    selectors.getRetroDescDisplayEnabled,
  )

  return (
    <section
      aria-label={t('overview', 'manuscriptDescriptions')}
      className={clsx(cls.manuscriptDescriptions, 'addFocusable')}
      id="hsp-descriptions"
      tabIndex={-1}
    >
      <div className={className}>
        <Typography variant="h2">
          {t('overview', 'manuscriptDescriptions')}: {sortedDescriptions.length}
        </Typography>
        <div className={cls.cards}>
          {sortedDescriptions.map((desc) => {
            const authorDateLine = getAuthorDateLine(desc)
            const off =
              desc.type === 'hsp:description_retro' &&
              (!desc['catalog-iiif-manifest-url-display'] ||
                !retroDescDisplayEnabled)

            return (
              <ResourceActionCard
                key={desc.id}
                className={cls.card}
                resource={desc}
                off={off}
                head={
                  <>
                    <Typography>{authorDateLine}</Typography>
                    <Typography gutterBottom>
                      {desc['title-display']}
                    </Typography>
                    <Typography variant="body2" className={cls.hspId}>
                      {desc.id}
                    </Typography>
                  </>
                }
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
