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
import { KeyData } from './KeyData'
import { Citations } from './Citations'
import { HspObjectGroup, Highlighting } from 'src/contexts/discovery'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  }
}))

interface Props {
  className?: string;
  variant: 'expanded' | 'collapsed' | 'keyData' | 'citations'
  hspObjectGroup: HspObjectGroup;
  highlighting: Highlighting;
}

export function Hit({ className, variant, hspObjectGroup, highlighting }: Props) {
  const cls = useStyles()

  const docIds = [
    ...hspObjectGroup.hspDescriptions.map(desc => desc.id),
    hspObjectGroup.hspObject.id,
  ]

  const groupHasHighlighting = docIds.some(id => {
    return highlighting[id] && Object.keys(highlighting[id]).length > 0
  })

  return (
    <div className={clsx(cls.root, className)}>
      <KeyData
        hspObjectGroup={hspObjectGroup}
        open={variant === 'expanded' || variant === 'keyData'}
      />
      {
        groupHasHighlighting && (
          <Citations
            hspObjectGroup={hspObjectGroup}
            highlighting={highlighting}
            open={variant === 'expanded' || variant === 'citations'}
          />
        )
       }
    </div>
  )
}
