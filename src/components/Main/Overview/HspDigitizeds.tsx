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
import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { ResourceActionCard } from 'src/components/shared/ResourceActionCard'
import { HspDigitized } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'
import { Tooltip } from 'src/components/shared/Tooltip'

const useStyles = makeStyles((theme) => ({
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
  externalLink: {
    color: 'inherit',
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
        <Typography variant="body1" color="inherit">
          {hspDigitized['subtype-display'] &&
            t('data', 'subtype-display', hspDigitized['subtype-display'])}
        </Typography>
        <Typography variant="body1" color="inherit">
          {hspDigitized['digitization-organization-display']}
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
      className={cls.digitizedImages}
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
                  <Tooltip
                    title={t('resources', 'openDigitalImagesExternal')}
                    className={cls.tooltip}
                  >
                    <a
                      className={cls.externalLink}
                      target="_blank"
                      href={hspDigitized['external-uri-display']}
                      rel="noreferrer"
                    >
                      <Typography variant="body1" color="inherit" noWrap>
                        {hspDigitized['external-uri-display']}
                      </Typography>
                    </a>
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
