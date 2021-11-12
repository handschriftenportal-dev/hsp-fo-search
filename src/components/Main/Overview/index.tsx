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

import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import { Grid } from '../Grid'
import { HspObject } from './HspObject'
import { HspDescriptions } from './HspDescriptions'
import { HspDigitizeds } from './HspDigitizeds'
import { useHspObjectById } from 'src/contexts/discovery'
import { useParsedParams, useLocation } from 'src/contexts/location'

// tracking
// import { useRouteTracking } from 'src/app/tracking'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  hspObject: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  hspDescription: {
    background: theme.palette.grey[200],
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  },
  hspDigital: {
    background: 'black',
    color: 'white',
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6)
  }
}))

interface Props {
  className?: string;
}

export function Overview({ className }: Props) {
  // useRouteTracking('Overview')
  const cls = useStyles()
  const params = useParsedParams()
  const { data, error } = useHspObjectById(params.hspobjectid)

  const { hash } = useLocation()
  const descRef = useRef<HTMLDivElement>(null)
  const digiRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hash === '#hsp-descriptions') {
      descRef.current?.scrollIntoView()
    } else if (hash === '#hsp-digitizeds') {
      digiRef.current?.scrollIntoView()
    }
  }, [data, hash])

  // When the user clicks on the resource icons a new route will be dispatched with the
  // hash set to either '#hsp-description' or '#hsp-digitizeds' triggering the useEffect
  // above which scrolls to the wanted section. If the hash is already set to the clicked
  // resource type than no route will be dispatched and the useEffect will not be triggered.
  // In that case the following function will manage the srcolling.
  function handleResourceInfoClicked(resourceType: 'hsp-descriptions' | 'hsp-digitizeds') {
    if (hash === '#hsp-descriptions' && resourceType === 'hsp-descriptions') {
      descRef.current?.scrollIntoView()
    } else if (hash === '#hsp-digitizeds' && resourceType === 'hsp-digitizeds') {
      digiRef.current?.scrollIntoView()
    }
  }

  if (error) return <p>failed!</p>
  if (!data) return <p data-testid="discovery-overview">loading...</p>

  return (
    <div className={clsx(cls.root, className)}>
      <div className={cls.hspObject}>
        <Grid>
          <HspObject
            hspObject={data.payload.hspObject}
            numOfDescriptions={data.payload.hspDescriptions.length}
            numOfDigitizeds={data.payload.hspDigitizeds.length}
            onResourceInfoClicked={handleResourceInfoClicked}
          />
        </Grid>
      </div>
      <div
        className={cls.hspDescription}
        ref={descRef}
      >
        <Grid>
          <HspDescriptions hspDescriptions={data.payload.hspDescriptions} />
        </Grid>
      </div>
      <div
        className={cls.hspDigital}
        ref={digiRef}
      >
        <Grid>
          <HspDigitizeds hspDigitizeds={data.payload.hspDigitizeds} />
        </Grid>
      </div>
    </div>
  )
}
