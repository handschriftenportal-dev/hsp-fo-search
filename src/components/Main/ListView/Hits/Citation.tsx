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
import { useTranslation } from 'src/contexts/i18n'
import { ResourceActionCard } from 'src/components/shared/ResourceActionCard'
import { getAuthorDateLine } from 'src/components/shared/getAuthorDateLine'
import {
  HspDescription,
  Highlighting,
  HspDocument,
  HspObject,
} from 'src/contexts/discovery'
import { Highlight } from './Highlight'
import Paper from '@material-ui/core/Paper'
import { useParsedParams } from 'src/contexts/hooks'
import { useSelector } from 'react-redux'
import { selectors } from 'src/contexts/state'
import { Tooltip } from 'src/components/shared/Tooltip'
import { WebModuleLink } from 'src/contexts/link'
import { WebModuleLocation } from 'hsp-web-module'
import { toSearchParams } from 'src/contexts/location'

const useStyles = makeStyles(() => ({
  hspId: {
    fontWeight: 350,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
}))

interface Props {
  className?: string
  document: HspDocument
  highlighting: Highlighting
}

export function Citation(props: Props) {
  const { className, document, highlighting } = props
  const cls = useStyles()
  const docHighlighting = highlighting[document.id]
  const isHspDescription =
    document.type === 'hsp:description' ||
    document.type === 'hsp:description_retro'
  const { t } = useTranslation()
  const { q } = useParsedParams()
  const retroDescDisplayEnabled = useSelector(
    selectors.getRetroDescDisplayEnabled
  )
  const params = useParsedParams()

  if (!docHighlighting || Object.keys(docHighlighting).length === 0) {
    return null
  }

  const snippets = Object.entries(docHighlighting).map(([field, fragments]) => (
    <p key={field}>
      <Typography component="span" variant="body2">
        {t('data', field, '__field__') + ': '}
      </Typography>
      <Typography component="span" variant="body1">
        <Highlight>{fragments[0]}</Highlight>
      </Typography>
    </p>
  ))

  function renderDescriptionCard(desc: HspDescription) {
    const authorDateLine = getAuthorDateLine(desc)
    const off =
      desc.type === 'hsp:description_retro' &&
      (!desc['catalog-iiif-manifest-url-display'] || !retroDescDisplayEnabled)

    return (
      <ResourceActionCard
        className={className}
        resource={desc}
        off={off}
        query={q}
        head={
          <>
            <Typography variant="body2" gutterBottom>
              {t('data', 'type', document.type)}
            </Typography>
            <Typography>{authorDateLine}</Typography>
            {!authorDateLine && (
              <Typography variant="body1" className={cls.hspId}>
                {desc.id}
              </Typography>
            )}
          </>
        }
      >
        {snippets}
      </ResourceActionCard>
    )
  }

  function renderObjectCard(hspObject: HspObject) {
    const linkToDetailView: WebModuleLocation = {
      pathname: '/',
      hash: '',
      search: toSearchParams({
        ...params,
        hspobjectid: hspObject.id,
      }),
    }

    return (
      <Paper className={className} square>
        <Tooltip title={t('overview', 'showKodOverview')}>
          <WebModuleLink className={cls.link} location={linkToDetailView}>
            <Typography variant="body2">
              {t('data', 'type', hspObject.type)}
            </Typography>
          </WebModuleLink>
        </Tooltip>
        {snippets}
      </Paper>
    )
  }

  return isHspDescription
    ? renderDescriptionCard(document as HspDescription)
    : renderObjectCard(document as HspObject)
}
