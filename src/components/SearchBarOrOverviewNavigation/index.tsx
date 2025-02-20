import { WebModuleLocation } from 'hsp-web-module'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { useParsedParams } from 'src/contexts/hooks'
import { ParsedParams, toSearchParams } from 'src/contexts/location'

import { OverviewNavigation } from '../OverviewNavigation'
import { SearchBar } from '../SearchBar'
import BackButton from '../shared/BackButton'
import BackWorkspaceButton from '../shared/BackWorkspaceButton'

interface Props {
  className?: string
}

const useStyles = makeStyles(() => ({
  backButton: {
    display: 'flex',
    justifyContent: 'end',
  },
}))

export function SearchBarOrOverviewNavigation({ className }: Props) {
  const params: ParsedParams = useParsedParams()
  const cls = useStyles()

  if (params.fromWorkspace) {
    const backLocation: WebModuleLocation = {
      pathname: '/',
      hash: '',
      search: toSearchParams({
        ...params,
        hspobjectid: undefined,
        fromWorkspace: undefined,
      }),
    }
    return (
      <div id="resultNav" tabIndex={-1} className={cls.backButton}>
        <BackWorkspaceButton />
        <BackButton backLocation={backLocation} btnType="back" />
      </div>
    )
  }

  return params.hspobjectid ? (
    <OverviewNavigation className={className} />
  ) : (
    <SearchBar className={className} />
  )
}
