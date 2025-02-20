import { AnyWebModule } from 'hsp-web-module'

export function route(m: AnyWebModule) {
  function setModuleLocation(location: URL | Location) {
    const { pathname, search, hash } = location
    m.setLocation({ pathname, search, hash })
    if (!hash) {
      window.scrollTo(0, 0)
    }
  }

  m.addEventListener('linkClicked', (e) => {
    e.preventDefault()
    history.pushState(null, '', e.detail.href)
    setModuleLocation(e.detail)
  })

  window.addEventListener('popstate', () => {
    setModuleLocation(window.location)
  })

  setModuleLocation(window.location)
}
