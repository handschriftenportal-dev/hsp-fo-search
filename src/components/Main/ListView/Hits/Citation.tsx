import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'
import { useSelector } from 'react-redux'

import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { ResourceActionCard } from 'src/components/shared/ResourceActionCard'
import { Tooltip } from 'src/components/shared/Tooltip'
import { getAuthorDateLine } from 'src/components/shared/getAuthorDateLine'
import {
  Highlighting,
  HspDescription,
  HspDocument,
  HspObject,
} from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink } from 'src/contexts/link'
import { toSearchParams } from 'src/contexts/location'
import { selectors } from 'src/contexts/state'

import { Highlight } from './Highlight'

const useStyles = makeStyles(() => ({
  hspId: {
    fontWeight: 350,
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
  },
  highlight: {
    marginBottom: '1rem',
  },
  snippetContainer: {
    margin: '1rem 0',
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
  const retroDescDisplayEnabled = useSelector(
    selectors.getRetroDescDisplayEnabled,
  )
  const params = useParsedParams()

  if (!docHighlighting || Object.keys(docHighlighting).length === 0) {
    return null
  }

  const snippets = Object.entries(docHighlighting).map(([field, fragments]) => (
    <div key={field} className={cls.snippetContainer}>
      <Typography component="div" variant="body2">
        {t('data', field, '__field__') + ': '}
      </Typography>
      <div>
        {fragments.map((elem, index) => (
          <div
            key={`${document.id}-search-fragment-${index}`}
            className={cls.highlight}
          >
            <Typography component="span" variant="body1">
              <Highlight>{elem}</Highlight>
            </Typography>
          </div>
        ))}
      </div>
    </div>
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
