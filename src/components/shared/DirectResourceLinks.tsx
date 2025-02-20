import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import Icon from '@material-ui/core/Icon'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

import { Tooltip } from 'src/components/shared/Tooltip'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink } from 'src/contexts/link'

import { ShareLink } from './ShareLink'

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    border: 'none',
  },
  anchor: {
    paddingTop: theme.spacing(1),
  },
  button: {
    paddingRight: theme.spacing(1),
    cursor: 'pointer',
    paddingBottom: theme.spacing(1),
    minWidth: 'auto',
    '&:hover': {
      background: 'inherit',
    },
  },
  color: {
    color: theme.palette.liver.light,
  },
  link: {
    textDecoration: 'none',
    paddingLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  vertical: {
    flexDirection: 'column',
  },
  iconBtn: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    padding: theme.spacing(0.25),
  },
}))

interface Props {
  className?: string
  detailPage?: boolean
  linkToDetailView: WebModuleLocation
  numOfDescriptions: number
  numOfDigitizeds: number
  onClick: (resourceType: 'hsp-descriptions' | 'hsp-digitizeds') => void
  permalink?: string | null
  vertical: boolean
}

export function DirectResourceLinks(props: Readonly<Props>) {
  const {
    className,
    vertical,
    numOfDescriptions,
    numOfDigitizeds,
    linkToDetailView,
    onClick,
    detailPage,
    permalink,
  } = props
  const cls = useStyles()
  const { t } = useTranslation()

  return (
    <fieldset
      className={clsx(cls.root, { [cls.vertical]: vertical }, className)}
      aria-label={t('hits', 'resources')}
    >
      {detailPage && permalink && <ShareLink permalink={permalink} />}
      {[
        {
          label: t('overview', 'showManuscriptDescriptions'),
          hash: 'hsp-descriptions',
          icon: 'text_snippet',
          count: numOfDescriptions,
          src: '/img/beschreibung.svg',
        },
        {
          label: t('overview', 'showDigitalImages'),
          hash: 'hsp-digitizeds',
          icon: 'insert_photo',
          count: numOfDigitizeds,
          src: '/img/digitalisat.svg',
        },
      ].map((resource) => (
        <WebModuleLink
          key={resource.label}
          className={clsx(cls.link, { [cls.anchor]: !vertical })}
          location={{ ...linkToDetailView, hash: resource.hash }}
          ariaLabel={resource.label}
        >
          <Tooltip title={resource.label}>
            <ListItemIcon
              tabIndex={-1}
              className={clsx(cls.button, cls.color)}
              onClick={() =>
                onClick(resource.hash as 'hsp-descriptions' | 'hsp-digitizeds')
              }
              aria-label={resource.label}
            >
              <Icon>
                <img
                  className={cls.iconBtn}
                  src={resource.src}
                  aria-hidden={true}
                  alt={resource.label}
                />
              </Icon>
            </ListItemIcon>
            <Typography className={cls.color} component="span" variant="body2">
              {resource.count}
            </Typography>
          </Tooltip>
        </WebModuleLink>
      ))}
    </fieldset>
  )
}

DirectResourceLinks.defaultProps = {
  onClick: () => {},
}
