/*
 * MIT License
 *
 * Copyright (c) 2023 Staatsbibliothek zu Berlin - Preußischer Kulturbesitz
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
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import React, { forwardRef } from 'react'
import { WebModuleLocation } from 'hsp-web-module'
import { useEvent } from './events'
import { useConfig } from './config'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  a: {
    '&:focus-visible': {
      outline: `3px solid ${theme.palette.black.main} !important`,
    },
  },
}))

interface Props {
  className?: string
  location: WebModuleLocation
  children: React.ReactNode
  role?: string
  ariaLabel?: string
}

export const WebModuleLink = forwardRef<HTMLAnchorElement, Props>(
  function WebModuleLink(props, ref) {
    const fireLinkClicked = useEvent('linkClicked')
    const { createAbsoluteURL } = useConfig()
    const url = createAbsoluteURL(props.location)
    const cls = useStyles()

    function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
      if (fireLinkClicked(url)) {
        window.location.href = url.href
      } else {
        e.preventDefault()
      }
    }

    return (
      <a
        ref={ref}
        className={clsx(props.className, cls.a)}
        onClick={handleClick}
        href={url.href}
        role={props.role}
        aria-label={props.ariaLabel}
      >
        {props.children}
      </a>
    )
  }
)

export function useTriggerLink() {
  const { createAbsoluteURL } = useConfig()
  const fireLinkClicked = useEvent('linkClicked')

  return (location: WebModuleLocation) => {
    const url = createAbsoluteURL(location)

    if (fireLinkClicked(url)) {
      window.location.href = url.href
    }
  }
}
