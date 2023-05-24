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
import clsx from 'clsx'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Typography from '@material-ui/core/Typography'
import { toSearchParams } from 'src/contexts/location'
import { useParsedParams } from 'src/contexts/hooks'
import { HspObjectDataTable } from './HspObjectDataTable'
import { HspObject } from 'src/contexts/discovery'
import { ResourceInfo } from 'src/components/shared/ResourceInfo'
import { WebModuleLocation } from 'hsp-web-module'
import { useTranslation } from 'src/contexts/i18n'
import { useSetMetatag, useSetTitle } from 'src/contexts/Metatags'

interface StyleProps {
  resourceInfoFlexWrap: 'wrap' | 'nowrap'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginTop: theme.spacing(2),
    flexWrap: 'wrap',
  },
  summary: {
    marginTop: theme.spacing(2),
  },
  table: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(0),
    marginTop: theme.spacing(2),
    flexWrap: (props: StyleProps) => props.resourceInfoFlexWrap,
    [theme.breakpoints.only('xs')]: {
      paddingLeft: theme.spacing(3.5),
      paddingRight: theme.spacing(3.5),
    },
  },
  resourceInfo: {
    marginTop: theme.spacing(2),
    flexShrink: 0,
  },
}))

interface Props {
  className?: string
  hspObject: HspObject
  numOfDescriptions: number
  numOfDigitizeds: number
  onResourceInfoClicked?: (
    resourceType: 'hsp-descriptions' | 'hsp-digitizeds'
  ) => void
}

export function HspObject({
  className,
  hspObject,
  numOfDescriptions,
  numOfDigitizeds,
  onResourceInfoClicked,
}: Props) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'))
  const cls = useStyles({ resourceInfoFlexWrap: isMobile ? 'wrap' : 'nowrap' })
  const params = useParsedParams()
  const { t } = useTranslation()

  const linkToDetailView: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      ...params,
      hspobjectid: hspObject.id,
    }),
  }

  const {
    'settlement-display': settlementDisplay,
    'repository-display': repositoryDisplay,
    'idno-display': idnoDisplay,
    'object-type-display': objectTypeDisplay,
    'orig-date-lang-display': origDateLangDisplay,
    'title-display': titleDisplay,
  } = hspObject

  const signatureId = [settlementDisplay, repositoryDisplay, idnoDisplay].join(
    ', '
  )
  const objectType =
    t('data', 'object-type-display', objectTypeDisplay) ??
    t('data', 'object-type-display', '__MISSING__')
  const origDateLang = origDateLangDisplay ? ` (${origDateLangDisplay}):` : ''
  const title = titleDisplay ? ` ${titleDisplay}` : ''
  const desc = `${objectType}${origDateLang}${title}`

  useSetTitle(signatureId)
  useSetMetatag({ key: 'name', value: 'description', content: desc })

  return (
    <div className={clsx(cls.root, className)}>
      <div className={clsx(cls.headline, className)}>
        <div>
          <Typography className={cls.title} variant="h1">
            {signatureId}
          </Typography>
          <Typography className={cls.summary} component="p">
            {titleDisplay}
          </Typography>
        </div>
        <div className={cls.resourceInfo}>
          <ResourceInfo
            vertical={false}
            numOfDescriptions={numOfDescriptions}
            numOfDigitizeds={numOfDigitizeds}
            linkToDetailView={linkToDetailView}
            onClick={onResourceInfoClicked}
            detailPage={true}
            permalink={hspObject['persistent-url-display']}
          />
        </div>
      </div>
      <HspObjectDataTable className={cls.table} hspObject={hspObject} />
    </div>
  )
}
