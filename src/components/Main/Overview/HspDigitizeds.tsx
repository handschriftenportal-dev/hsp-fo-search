import clsx from 'clsx'
import React from 'react'

import { Link } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { ResourceActionCard } from 'src/components/shared/ResourceActionCard'
import { Tooltip } from 'src/components/shared/Tooltip'
import { HspDigitized } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  bold: { fontWeight: 'bold' },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  card: {
    background: theme.palette.liver.main,
    minWidth: 250,
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(6),
    width: 200,
    color: 'white',
    padding: theme.spacing(2),
  },
  link: {
    color: 'inherit',
  },
  linkTypo: {
    '&:focus-within': {
      outline: `${theme.spacing(0.5)}px solid ${theme.palette.white.main}`,
    },
  },
  thumbnail: {
    display: 'flex',
    justifyContent: 'center',
  },
  metadata: {
    marginTop: theme.spacing(2),
  },
  marginTop: {
    marginTop: theme.spacing(2),
  },
  digitizedImages: {
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
  thumbnailImg: {
    width: 200,
  },
  tooltip: {
    maxWidth: 450,
  },
}))

interface Props {
  className?: string
  hspDigitizeds: HspDigitized[]
}

export function HspDigitizeds({ className, hspDigitizeds }: Props) {
  const cls = useStyles()
  const { t } = useTranslation()

  const renderCardContent = (hspDigitized: HspDigitized) => (
    <>
      {hspDigitized['thumbnail-uri-display'] && (
        <div className={cls.thumbnail}>
          <img
            className={cls.thumbnailImg}
            src={hspDigitized['thumbnail-uri-display']}
            alt={t('resource', 'thumbnailImage')}
          />
        </div>
      )}
      <div className={cls.metadata}>
        {(hspDigitized['digitization-institution-display']?.length ||
          hspDigitized['digitization-date-display']?.length) && (
          <Typography color="inherit" className={cls.bold}>
            {t('data', 'digitized')}
          </Typography>
        )}
        <Typography variant="body1" color="inherit">
          {hspDigitized['subtype-display'] &&
            t('data', 'subtype-display', hspDigitized['subtype-display'])}
        </Typography>
        <Typography variant="body1" color="inherit">
          {hspDigitized['digitization-institution-display']}
        </Typography>
        <Typography variant="body1" color="inherit">
          {hspDigitized['digitization-date-display'] &&
            new Date(hspDigitized['digitization-date-display']).getFullYear()}
        </Typography>
      </div>
    </>
  )

  return (
    <section
      aria-label={t('overview', 'digitalImages')}
      className={clsx(cls.digitizedImages, 'addFocusable')}
      id="hsp-digitizeds"
      tabIndex={-1}
    >
      <div className={className}>
        <Typography variant="h2" color="inherit">
          {t('overview', 'digitalImages')}: {hspDigitizeds.length}
        </Typography>
        <div className={cls.cards}>
          {hspDigitizeds.map((hspDigitized) => (
            <ResourceActionCard
              key={hspDigitized.id}
              className={cls.card}
              resource={hspDigitized}
              off={!hspDigitized['manifest-uri-display']}
              head={renderCardContent(hspDigitized)}
            >
              {hspDigitized['external-uri-display'] && (
                <div className={cls.marginTop}>
                  <Typography color="inherit" className={cls.bold}>
                    {t('data', 'extPrasentation')}
                  </Typography>
                  <Tooltip
                    title={t('resources', 'openDigitalImagesExternal')}
                    className={cls.tooltip}
                  >
                    <Typography
                      variant="body1"
                      color="inherit"
                      noWrap
                      className={cls.linkTypo}
                    >
                      <Link
                        className={cls.link}
                        target="_blank"
                        href={hspDigitized['external-uri-display']}
                        rel="noreferrer"
                      >
                        {hspDigitized['external-uri-display']}
                      </Link>
                    </Typography>
                  </Tooltip>
                </div>
              )}
            </ResourceActionCard>
          ))}
        </div>
      </div>
    </section>
  )
}
