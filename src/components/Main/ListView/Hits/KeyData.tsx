import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, { useEffect, useState } from 'react'

import Collapse from '@material-ui/core/Collapse'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import * as config from 'src/components/config'
import { DirectResourceLinks } from 'src/components/shared/DirectResourceLinks'
import { Tooltip } from 'src/components/shared/Tooltip'
import { HspObjectGroup } from 'src/contexts/discovery'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLink } from 'src/contexts/link'
import { toSearchParams } from 'src/contexts/location'

import { Thumbnails } from './Thumbnails'

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: 1,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(3),
    scrollMarginTop: '200px',
    scrollBehavior: 'smooth',
  },
  headline: {
    display: 'flex',
    alignItems: 'center',
  },
  headRight: {
    display: 'flex',
    flexShrink: 0,
    marginRight: theme.spacing(8),
  },
  headLeft: {
    width: '64%',
  },
  fillerLeft: {
    width: theme.spacing(2),
  },
  fillerRight: {
    width: theme.spacing(2),
  },
  headContent: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingLeft: theme.spacing(2),
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(7.5),
    paddingLeft: theme.spacing(4),
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  title: {
    marginTop: theme.spacing(2),
  },
  details: {
    marginTop: theme.spacing(2),
  },
  link: {
    color: 'inherit',
    display: 'inline-block',
    textDecoration: 'none',
  },
  thumbnailsMobile: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  itemIcon: {
    verticalAlign: 'text-top',
    position: 'absolute',
  },
  arrowIcon: {
    color: theme.palette.primary.main,
    marginLeft: '5px',
  },
  headTypography: {
    width: '100%',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  expandLess: {},
  expandMore: {
    paddingTop: theme.spacing(1),
  },
}))

interface Props {
  className?: string
  open: boolean
  hspObjectGroup: HspObjectGroup
}

export function KeyData(props: Readonly<Props>) {
  const cls = useStyles()
  const { className, open: openProp, hspObjectGroup } = props
  const { hspObject } = hspObjectGroup
  const [open, setOpen] = useState(openProp)
  const { t } = useTranslation()
  const params = useParsedParams()

  const linkToDetailView: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      ...params,
      hspobjectid: hspObject.id,
    }),
  }

  useEffect(() => {
    setOpen(openProp)
  }, [openProp])

  function toggle() {
    setOpen(!open)
  }

  return (
    <Paper
      data-testid="discovery-list-view-hits-key-data"
      className={clsx(cls.root, className, 'addFocusable')}
      square
      elevation={24}
      id="searchHit"
      tabIndex={-1}
    >
      <div className={cls.headline}>
        <div className={cls.fillerLeft} />
        <div className={cls.headContent}>
          <div className={cls.headLeft}>
            <Tooltip title={t('overview', 'showKodOverview')}>
              <WebModuleLink className={cls.link} location={linkToDetailView}>
                <Typography variant="h2" className={cls.headTypography}>
                  {[
                    hspObject['settlement-display'],
                    hspObject['repository-display'],
                    hspObject['idno-display'],
                  ].join(', ')}
                  <ListItemIcon className={cls.itemIcon}>
                    <ArrowForwardIcon className={cls.arrowIcon} />
                  </ListItemIcon>
                </Typography>
              </WebModuleLink>
            </Tooltip>
          </div>
          <div className={cls.headRight}>
            <Hidden xsDown>
              {!open && (
                <DirectResourceLinks
                  vertical={false}
                  numOfDescriptions={hspObjectGroup.hspDescriptions.length}
                  numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
                  linkToDetailView={linkToDetailView}
                />
              )}
            </Hidden>
            <IconButton
              onClick={toggle}
              aria-label={open ? t('hit', 'collapse') : t('hit', 'expand')}
              className={open ? cls.expandLess : cls.expandMore}
            >
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>
        <div className={cls.fillerRight} />
      </div>
      <Collapse in={open}>
        <div className={cls.content}>
          <div className={cls.textual}>
            <Typography className={cls.title} variant="body2">
              {hspObject['title-display']}
            </Typography>
            <Typography className={cls.details} variant="body1">
              {config.hitKeyData
                .map((field) => t('data', field, hspObject[field]))
                .filter((x) => typeof x === 'string')
                .join(', ')}
            </Typography>
          </div>
          <Hidden xsDown>
            <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
          </Hidden>
          {open && (
            <DirectResourceLinks
              vertical={true}
              numOfDescriptions={hspObjectGroup.hspDescriptions.length}
              numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
              linkToDetailView={linkToDetailView}
            />
          )}
        </div>
        <Hidden smUp>
          <div className={cls.thumbnailsMobile}>
            <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
          </div>
        </Hidden>
      </Collapse>
    </Paper>
  )
}
