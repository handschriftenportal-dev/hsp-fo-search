import React from 'react'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'

import * as config from 'src/components/config'
import SinglePagePaper from 'src/components/shared/SinglePagePaper'
import { HspObject } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

import { KeyValueTable } from './KeyValueTable'

const useStyles = makeStyles((theme) => ({
  subTableLeft: {
    marginRight: theme.spacing(8),
    flexBasis: '50%',
  },
  subTableRight: {
    flexBasis: '50%',
  },
}))

interface Props {
  className?: string
  hspObject: HspObject
}

export function HspObjectDataTable({ className, hspObject }: Props) {
  const cls = useStyles()
  const theme = useTheme()
  const { t } = useTranslation()
  const narrow = useMediaQuery(theme.breakpoints.down('md'), {
    // to prevent unwanted layout effects while auto-scrolling to the resource
    // sections of the overview page we render the narrow (heigher) variant by
    // default.
    defaultMatches: true,
    noSsr: true,
  })

  function makeKeyValueData(fields: string[]) {
    return fields.reduce((acc, field) => {
      const value = (hspObject as any)[field]
      const translatedField = t('data', field, '__field__')
      let translatedValue
      if (field === 'former-ms-identifier-display') {
        translatedValue = value
      } else {
        translatedValue = t('data', field, value)
      }
      return { ...acc, [translatedField]: translatedValue }
    }, {})
  }

  const dataLeft = makeKeyValueData(config.dataTableFieldsLeft)
  const dataRight = makeKeyValueData(config.dataTableFieldsRight)

  const renderNarrow = <KeyValueTable data={{ ...dataLeft, ...dataRight }} />

  const renderWide = (
    <>
      <KeyValueTable className={cls.subTableLeft} data={dataLeft} />
      <KeyValueTable className={cls.subTableRight} data={dataRight} />
    </>
  )

  return <SinglePagePaper>{narrow ? renderNarrow : renderWide}</SinglePagePaper>
}
