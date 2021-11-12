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
import { makeStyles } from '@material-ui/core/styles'
import Backdrop from '@material-ui/core/Backdrop'
import Collapse from '@material-ui/core/Collapse'
import { useTranslation } from 'src/contexts/i18n'
import { useSelector, useDispatch } from 'react-redux'
import { actions, selectors } from 'src/contexts/state'
import { FilterPanel } from './FilterPanel'


const useStyles = makeStyles(theme => ({
  filterPanel: {
    transition: '2s',
    [theme.breakpoints.up('sm')]: {
      maxHeight: '80vh',
      overflowY: 'auto',
      overflowX: 'hidden',
    }
  },
  baseline: {
    display: 'flex',
    justifyContent: 'center',
  },
  handle: {
    padding: theme.spacing(1),
    paddingLeft: 64,
    paddingRight: 64,
    boxShadow: 'none',
    color: 'white',
    textTransform: 'uppercase',
    cursor: 'pointer',
    background: theme.palette.primary.main,
    fontWeight: 500,
  },
  handleOpen: {
    background: theme.palette.grey[700],
  }
}))

interface Props {
  className?: string;
}

export function Filters({ className }: Props) {
  const cls = useStyles()
  const dispatch = useDispatch()
  const showFilterList = useSelector(selectors.getShowFilterList)
  const { t } = useTranslation()

  function toggle() {
    dispatch(actions.toggleFilterList())
  }

  return (
    <div
      data-testid="discovery-list-view-filters"
      className={className}>
      <Collapse
        in={showFilterList}
        // By default the child will mount even if the component is closed.
        // But we want to render the child not before the component opens.
        mountOnEnter={true}
        // By default the child stays mounted even if the component closes.
        // But we want the child to unmount if the component closes.
        unmountOnExit={true}
      >
        <FilterPanel
          className={cls.filterPanel}
          onClose={toggle}
        />
      </Collapse>
      <div className={cls.baseline}>
        <span
          className={clsx(cls.handle, showFilterList && cls.handleOpen)}
          onClick={toggle}
        >
          {t('filterPanel', 'filterButton')}
        </span>
      </div>
      <Backdrop
        open={showFilterList}
        onClick={toggle}
      />
    </div>
  )
}
