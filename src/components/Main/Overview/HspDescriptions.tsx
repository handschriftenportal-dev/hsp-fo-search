/*
 * MIT License
 *
 * Copyright (c) 2021 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE
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
import { getAuthorDateLine } from 'src/components/shared/getAuthorDateLine'
import { HspDescription } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles(theme => ({
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
    paddingRight: theme.spacing(4)
  },
  hspId: {
    fontWeight: 350
  }
}))

interface Props {
  className?: string;
  hspDescriptions: HspDescription[];
}

export function HspDescriptions({ className, hspDescriptions }: Props) {
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <section id='hsp-descriptions' aria-label={t('overview', 'manuscriptDescriptions')}>
      <div className={className}>
        <Typography variant="h5">
          {t('overview', 'manuscriptDescriptions')}: {hspDescriptions.length}
        </Typography>
        <div className={cls.cards}>
          {
            hspDescriptions.map(desc => {
              const authorDateLine = getAuthorDateLine(desc)
              return (
                <ResourceActionCard
                  key={desc.id}
                  className={cls.card}
                  resource={desc}
                  off={!desc.fulltextAvailable}
                  head={(
                    <>
                      <Typography>
                        { authorDateLine }
                      </Typography>
                      <Typography gutterBottom>
                        { desc['title-display'] }
                      </Typography>
                      <Typography variant="body2" className={cls.hspId}>
                        { desc.id }
                      </Typography>
                    </>
                  )}
                />
              )
            })
          }
        </div>
      </div>
    </section>
  )
}
