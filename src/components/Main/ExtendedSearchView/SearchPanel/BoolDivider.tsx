import React from 'react'

import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import makeStyles from '@material-ui/core/styles/makeStyles'

import { LogicOperator } from 'src/components/config'
import { useTranslation } from 'src/contexts/i18n'

const useStyles = makeStyles((theme) => ({
  dividerContainer: {
    position: 'relative',
  },
  divider: {
    marginBlock: theme.spacing(1),
  },
  dividerText: {
    backgroundColor: theme.palette.grey[100],
    clear: 'both',
    display: 'block',
    fontSize: '0.8571rem;',
    left: theme.spacing(2),
    lineHeight: '0.2rem',
    padding: '0px 4px',
    position: 'absolute',
    top: '0px',
  },
}))

interface BoolLabelProps {
  boolRelation?: LogicOperator
}

export default function BoolDivider(props: BoolLabelProps) {
  const { t } = useTranslation()
  const { boolRelation } = props
  const cls = useStyles()

  return (
    <Grid className={cls.dividerContainer}>
      <Divider className={cls.divider} />
      <Typography className={cls.dividerText}>
        {boolRelation === LogicOperator.OR && t('extendedSearch', 'boolOr')}
        {boolRelation === LogicOperator.AND && t('extendedSearch', 'boolAnd')}
      </Typography>
    </Grid>
  )
}
