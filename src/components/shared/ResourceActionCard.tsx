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

import React, { ReactNode } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Fab from '@material-ui/core/Fab'
import { useSelector } from 'react-redux'
import { selectors } from 'src/contexts/state'
import { HspDescription, HspDigitized } from 'src/contexts/discovery'
import { useEvent } from 'src/contexts/events'
import { ResourceInfo } from 'src/contexts/types'


const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  fabButton: {
    position: 'absolute',
    top: 16,
    right: -24,
    color: 'white',
  },
  head: {
    cursor: 'pointer',
  }
}))

interface Props {
  className?: string;
  resource: HspDescription | HspDigitized;
  head?: ReactNode;
  children?: ReactNode;
  off?: boolean
}

export function ResourceActionCard(props: Props) {
  const { children, className, head, resource, off } = props
  const cls = useStyles()
  const fireOpenResourceClicked = useEvent('openResourceClicked')
  const fireSelectResourceClicked = useEvent('selectResourceClicked')
  const fireUnselectResourceClicked = useEvent('unselectResourceClicked')
  const selectedResources = useSelector(selectors.getSelectedResources)

  const isAlreadyAdded = resource.type === 'hsp:description'
    ? selectedResources.some(r => r.id === resource.id)
    : selectedResources.some(r => r.id === resource['manifest-uri-display'])


  function fireResourceEvent(what: 'select' | 'unselect' | 'open') {
    const fire = {
      select: fireSelectResourceClicked,
      unselect: fireUnselectResourceClicked,
      open: fireOpenResourceClicked
    }[what]

    if (resource.type === 'hsp:description') {
      fire({
        type: 'hsp:description',
        id: resource.id
      })
    } else if (resource.type === 'hsp:digitized') {
      // this is just a precaution.
      // it's recommended to check in the parent component if manifest-uri-display is present
      // and set props.off to true if not exists.
      if (resource['manifest-uri-display']) {
        fire({
          type: 'iiif:manifest',
          id: resource['manifest-uri-display']
        })
      }
    }
  }

  return (
    <Paper
      className={clsx(cls.root, className)}
      square
    >
      {
        head && (
          <div
            className={clsx(!off && cls.head)}
            onClick={off
              ? undefined
              : () => fireResourceEvent('open')
            }
          >
            {head}
          </div>
        )
      }
      {children}
      {
        !off && (
          <Fab
            size="medium"
            className={cls.fabButton}
            color={isAlreadyAdded ? 'primary' : 'secondary' }
            onClick={() => fireResourceEvent(isAlreadyAdded ? 'unselect' : 'select')}
          >
            {
              isAlreadyAdded
                ? <span className="material-icons">check</span>
                : <span className="material-icons">add</span>
            }
          </Fab>
        )
      }
    </Paper>
  )
}
