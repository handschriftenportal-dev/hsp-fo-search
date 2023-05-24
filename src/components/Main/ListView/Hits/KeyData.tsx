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

import React, { useState, useEffect } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ArrowForwardIcon from '@material-ui/icons/ArrowForward'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Hidden from '@material-ui/core/Hidden'
import { Tooltip } from 'src/components/shared/Tooltip'

import { Thumbnails } from './Thumbnails'
import { ResourceInfo } from 'src/components/shared/ResourceInfo'
import { WebModuleLink } from 'src/contexts/link'
import { HspObjectGroup } from 'src/contexts/discovery'
import { toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import { WebModuleLocation } from 'hsp-web-module'

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

export function KeyData(props: Props) {
  const cls = useStyles()
  const { className, open, hspObjectGroup } = props
  const { hspObject } = hspObjectGroup
  const [_open, setOpen] = useState(open)
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
    setOpen(open)
  }, [open])

  function toggle() {
    setOpen(!_open)
  }

  return (
    <Paper
      data-testid="discovery-list-view-hits-key-data"
      className={clsx(cls.root, className)}
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
              {!_open && (
                <ResourceInfo
                  vertical={false}
                  numOfDescriptions={hspObjectGroup.hspDescriptions.length}
                  numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
                  linkToDetailView={linkToDetailView}
                />
              )}
            </Hidden>
            <IconButton
              onClick={toggle}
              aria-label={_open ? t('hit', 'collapse') : t('hit', 'expand')}
              className={_open ? cls.expandLess : cls.expandMore}
            >
              {_open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </div>
        </div>
        <div className={cls.fillerRight} />
      </div>
      <Collapse in={_open}>
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
          {_open && (
            <ResourceInfo
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
