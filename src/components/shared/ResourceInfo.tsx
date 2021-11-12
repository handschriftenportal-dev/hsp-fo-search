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
import clsx from 'clsx'
import { makeStyles, withStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import Badge from '@material-ui/core/Badge'
import { Tooltip } from 'src/components/shared/Tooltip'
import { Link } from 'src/contexts/routing'
import { useTranslation } from 'src/contexts/i18n'
import { WebModuleLocation } from 'hsp-web-module'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  vertical: {
    flexDirection: 'column',
  },
  button: {
    paddingRight: theme.spacing(2),
    cursor: 'pointer',
    '&:hover': {
      background: 'inherit',
    }
  },
  tooltip: {
    fontSize: '1.2em',
    padding: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
  }
}))

interface Props {
  className?: string;
  vertical: boolean;
  numOfDescriptions: number,
  numOfDigitizeds: number,
  linkToDetailView: WebModuleLocation;
  onClick?: (resourceType: 'hsp-descriptions' | 'hsp-digitizeds') => void;
}

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -7,
    top: 13,
    border: '0',
    padding: '0',
    fontSize: 'inherit'
  },
}))(Badge)

export function ResourceInfo(props: Props) {
  const { className, vertical, numOfDescriptions, numOfDigitizeds, linkToDetailView, onClick } = props
  const cls = useStyles()
  const { t } = useTranslation()

  const descriptionLabel = t('overview', 'showManuscriptDescriptions') as string
  const digitalImageLabel = t('overview', 'showDigitalImages') as string

  return (
    <div className={clsx(cls.root, {
      [cls.vertical]: vertical,
    }, className)}>
      <Tooltip title={descriptionLabel}>
        <Link
          className={cls.link}
          linkInfo={{ ...linkToDetailView, hash: 'hsp-descriptions' }}
          ariaLabel={descriptionLabel}
        >
          <IconButton
            size="small"
            className={cls.button}
            onClick={() => onClick && onClick('hsp-descriptions')}
          >
            <StyledBadge badgeContent={numOfDescriptions.toString()}>
              <span className="material-icons">
                insert_drive_file
              </span>
            </StyledBadge>
          </IconButton>
        </Link>
      </Tooltip>
      <Tooltip title={digitalImageLabel}>
        <Link
          className={cls.link}
          linkInfo={{ ...linkToDetailView, hash: 'hsp-digitizeds' }}
          ariaLabel={digitalImageLabel}
        >
          <IconButton
            size="small"
            className={cls.button}
            onClick={() => onClick && onClick('hsp-digitizeds')}
          >
            <StyledBadge badgeContent={numOfDigitizeds.toString()}>
              <span className="material-icons">
                insert_photo
              </span>
            </StyledBadge>
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  )
}
