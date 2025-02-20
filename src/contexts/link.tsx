import clsx from 'clsx'
import { WebModuleLocation } from 'hsp-web-module'
import React, { forwardRef } from 'react'

import { useConfig } from './config'
import { useEvent } from './events'

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
        className={clsx(props.className, 'addFocusable')}
        onClick={handleClick}
        href={url.href}
        role={props.role}
        aria-label={props.ariaLabel}
      >
        {props.children}
      </a>
    )
  },
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
