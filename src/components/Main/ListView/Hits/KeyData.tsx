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

import React, { useState, useEffect } from 'react'

import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Collapse from '@material-ui/core/Collapse'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Hidden from '@material-ui/core/Hidden'

import { Thumbnails } from './Thumbnails'
import { ResourceInfo } from 'src/components/shared/ResourceInfo'
import { Link } from 'src/contexts/routing'
import { HspObjectGroup } from 'src/contexts/discovery'
import { useParsedParams, toSearchParams } from 'src/contexts/location'
import { useTranslation } from 'src/contexts/i18n'
import * as config from 'src/components/config'
import { WebModuleLocation } from 'hsp-web-module'


const useStyles = makeStyles(theme => ({
  root: {
    zIndex: 1,
    paddingTop: theme.spacing(2),
    paddingRight: theme.spacing(4),
    paddingLeft: theme.spacing(4),
    paddingBottom: theme.spacing(3),
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headRight: {
    display: 'flex',
    flexShrink: 0,
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
  },
  textual: {
    display: 'flex',
    flexDirection: 'column',
    width: '60%',
  },
  summary: {
    marginTop: theme.spacing(2)
  },
  details: {
    marginTop: theme.spacing(2)
  },
  link: {
    textDecoration: 'none',
    color: 'inherit'
  },
  thumbnailsMobile: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2)
  }
}))

interface Props {
  className?: string;
  open: boolean;
  hspObjectGroup: HspObjectGroup;
}

export function KeyData(props: Props) {
  const cls = useStyles()
  const { className, open, hspObjectGroup } = props
  const { hspObject } = hspObjectGroup
  const [_open, setOpen] = useState(open)
  const { t } = useTranslation()
  const params = useParsedParams()

  const linkToDetailView: WebModuleLocation = {
    path: '/',
    hash: '',
    params: toSearchParams({
      ...params,
      hspobjectid: hspObject.id
    })
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
    >
      <div className={cls.headline}>
        <Link
          className={cls.link}
          linkInfo={linkToDetailView}
        >
          <Typography variant="h6">
            {
              [
                hspObject['settlement-display'],
                hspObject['repository-display'],
                hspObject['idno-display'],
              ].join(', ')
            }
          </Typography>
        </Link>
        <div className={cls.headRight}>
          <Hidden xsDown>
            {
              !_open && (
                <ResourceInfo
                  vertical={false}
                  numOfDescriptions={hspObjectGroup.hspDescriptions.length}
                  numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
                  linkToDetailView={linkToDetailView}
                />
              )
            }
          </Hidden>
          <IconButton
            onClick={toggle}
            aria-label={_open ? t('hit', 'collapse') : t('hit', 'expand')}
          >
            {
              _open
                ? <span className="material-icons">expand_less</span>
                : <span className="material-icons">expand_more</span>
            }
          </IconButton>
        </div>
      </div>
      <Collapse in={_open}>
        <div className={cls.content}>
          <div className={cls.textual}>
            <Typography
              className={cls.summary}
              variant="body1"
            >
              {
                hspObject['title-display']
              }
            </Typography>
            <Typography
              className={cls.details}
              variant="body2"
            >
              {
                config.hitKeyData
                  .map(field => t('data', field, hspObject[field]))
                  .filter(x => typeof x === 'string')
                  .join(', ')
              }
            </Typography>
          </div>
          <Hidden xsDown>
            <Thumbnails hspDigitizeds={hspObjectGroup.hspDigitizeds} />
          </Hidden>
          {
            _open && (
              <ResourceInfo
                vertical={true}
                numOfDescriptions={hspObjectGroup.hspDescriptions.length}
                numOfDigitizeds={hspObjectGroup.hspDigitizeds.length}
                linkToDetailView={linkToDetailView}
              />
            )
          }
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
