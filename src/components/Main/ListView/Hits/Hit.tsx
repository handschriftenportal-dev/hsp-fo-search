import clsx from 'clsx'
import React from 'react'

import { makeStyles } from '@material-ui/core/styles'

import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'

import { Citations } from './Citations'
import { KeyData } from './KeyData'

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
}))

interface Props {
  className?: string
  variant: 'expanded' | 'collapsed' | 'keyData' | 'citations'
  hspObjectGroup: HspObjectGroup
  highlighting: Highlighting
}

export function Hit({
  className,
  variant,
  hspObjectGroup,
  highlighting,
}: Props) {
  const cls = useStyles()

  const docIds = [
    ...hspObjectGroup.hspDescriptions.map((desc) => desc.id),
    hspObjectGroup.hspObject.id,
  ]

  const groupHasHighlighting = docIds.some((id) => {
    return highlighting[id] && Object.keys(highlighting[id]).length > 0
  })

  return (
    <div className={clsx(cls.root, className)}>
      <KeyData
        hspObjectGroup={hspObjectGroup}
        open={variant === 'expanded' || variant === 'keyData'}
      />
      {groupHasHighlighting && (
        <Citations
          hspObjectGroup={hspObjectGroup}
          highlighting={highlighting}
          open={variant === 'expanded' || variant === 'citations'}
        />
      )}
    </div>
  )
}
