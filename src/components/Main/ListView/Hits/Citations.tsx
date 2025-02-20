import clsx from 'clsx'
import React, { useEffect, useState } from 'react'

import Collapse from '@material-ui/core/Collapse'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { Highlighting, HspObjectGroup } from 'src/contexts/discovery'
import { useTranslation } from 'src/contexts/i18n'

import { Citation } from './Citation'

const useStyles = makeStyles((theme) => ({
  root: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    backgroundColor: theme.palette.warmGrey.main,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
  },
  headline: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
    cursor: 'pointer',
  },
  content: {
    width: '70%',
    padding: theme.spacing(3),
    paddingTop: theme.spacing(0),
  },
  citation: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  headRight: {
    marginRight: theme.spacing(8),
  },
}))

interface Props {
  className?: string
  open: boolean
  hspObjectGroup: HspObjectGroup
  highlighting: Highlighting
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
      <div className={cls.headline} onClick={toggle} role="button">
        <div>
          <Typography variant="body1">
            {!_open && t('hit', 'showResultContext')}
          </Typography>
        </div>
        <div className={cls.headRight}>
          <IconButton
            aria-label={_open ? t('hit', 'collapse') : t('hit', 'expand')}
          >
            {_open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </div>
      </div>
      <Collapse in={_open}>
        <div className={cls.content}>
          {docs.map((doc) => (
            <Citation
              className={cls.citation}
              key={doc.id}
              document={doc}
              highlighting={highlighting}
            />
          ))}
        </div>
      </Collapse>
    </div>
  )
}
