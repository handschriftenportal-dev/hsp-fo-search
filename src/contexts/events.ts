import { WebModuleEvents } from 'hsp-web-module'
import { createContext, useContext } from 'react'

import { CombinedState, ResourceInfo } from './types'

export type Events = WebModuleEvents<CombinedState> & {
  selectResourceClicked: CustomEvent<ResourceInfo>
  unselectResourceClicked: CustomEvent<ResourceInfo>
  openResourceClicked: CustomEvent<ResourceInfo>
  searchButtonClicked: CustomEvent<string>
  backToWorkspace: CustomEvent<string>
}

export const EventTargetContext = createContext<EventTarget | undefined>(
  undefined,
)

export const useEventTarget = () =>
  useContext(EventTargetContext) as EventTarget

export function useEvent<N extends keyof Events>(name: N) {
  const target = useEventTarget()
  return (detail: Events[N]['detail']) =>
    target.dispatchEvent(
      new CustomEvent(name, {
        detail,
        cancelable: true,
      }),
    )
}
