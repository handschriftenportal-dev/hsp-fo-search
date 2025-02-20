import React from 'react'

import Typography from '@material-ui/core/Typography'

import { HspObjectsByQueryOutput } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

interface Props {
  className?: string
  result: HspObjectsByQueryOutput
}

export function ResultCounts(props: Props) {
  const { className, result } = props
  const { tt } = useTranslation()

  return (
    <div className={className}>
      <Typography variant="h1">
        {tt(
          {
            numFound: result.metadata.numFound.toString(),
          },
          'numberOfHits',
        )}
      </Typography>
    </div>
  )
}
