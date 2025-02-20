import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import BackButton from 'src/components/shared/BackButton'
import { useParsedParams } from 'src/contexts/hooks'
import { useTranslation } from 'src/contexts/i18n'
import { ParsedParams, toSearchParams } from 'src/contexts/location'

const useStyles = makeStyles((theme) => ({
  control: {
    display: 'flex',
    flexWrap: 'wrap',
    whiteSpace: 'nowrap',
    [theme.breakpoints.up('sm')]: {
      justifyContent: 'end',
    },
    [theme.breakpoints.only('xs')]: {
      paddingRight: theme.spacing(2),
    },
  },
  extendedSearchBtn: {
    [theme.breakpoints.only('xs')]: {
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(3),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
}))

interface Props {
  search: () => void
}

export default function BottomControl(props: Readonly<Props>) {
  const { t } = useTranslation()
  const cls = useStyles()
  const { search } = props
  const params: ParsedParams = useParsedParams()

  const backLocation: WebModuleLocation = {
    pathname: '/',
    hash: '',
    search: toSearchParams({
      ...params,
      hspobjectid: undefined,
      isExtended: params.isExtended,
    }),
  }

  return (
    <div className={cls.control}>
      <BackButton backLocation={backLocation} btnType="cancel" />
      <Button
        color="primary"
        className={cls.extendedSearchBtn}
        onClick={search}
        variant="contained"
        aria-label={t('extendedSearch', 'triggerExtendedSearch')}
      >
        {t('extendedSearch', 'triggerExtendedSearch')}
      </Button>
    </div>
  )
}
