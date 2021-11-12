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
import Typography from '@material-ui/core/Typography'
import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import { Citation } from './Citation'
import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles(theme => ({
  root: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    background: theme.palette.grey[200],
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(0),
    paddingLeft: theme.spacing(2),
    cursor: 'pointer'
  },
  content: {
    width: '70%',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(0),
  },
  citation: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }
}))

interface Props {
  className?: string;
  open: boolean;
  hspObjectGroup: HspObjectGroup;
  highlighting: Highlighting;
}

export function Citations(props: Props) {
  const { className, open, hspObjectGroup, highlighting } = props
  const cls = useStyles()
  const { t } = useTranslation()
  const [_open, setOpen] = useState(open)
  const docs = [hspObjectGroup.hspObject, ...hspObjectGroup.hspDescriptions]


  useEffect(() => {
    setOpen(open)
  }, [open])

  function toggle() {
    setOpen(!_open)
  }

  return (
    <div
      data-testid="discovery-list-view-hits-citations"
      className={clsx(cls.root, className)}
    >
      <div
        className={cls.headline}
        onClick={toggle}
        role="button"
      >
        <Typography variant="body2">
          { !_open && t('hit', 'showResultContext')}
        </Typography>
        <IconButton aria-label={_open ? t('hit', 'collapse') : t('hit', 'expand')}>
          {
            _open
              ? <span className="material-icons">expand_less</span>
              : <span className="material-icons">expand_more</span>
          }
        </IconButton>
      </div>
      <Collapse in={_open}>
        <div className={cls.content}>
          {
            docs.map(doc => (
              <Citation
                className={cls.citation}
                key={doc.id}
                document={doc}
                highlighting={highlighting}
              />
            ))
          }
        </div>
      </Collapse>
    </div>
  )
}
