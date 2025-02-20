export function setTabIndexSearchBar(tabIndex: number) {
  const elements = document.getElementById('hsp-search-search-bar')
  const select = document.getElementById('searchBarSelect')
  const input = elements?.querySelectorAll('input[aria-label=Suche]')
  const buttons = elements?.querySelectorAll('button')

  if (select) {
    select.tabIndex = tabIndex
  }
  if (input) {
    input.forEach((elem: any) => (elem.tabIndex = tabIndex))
  }
  if (buttons) {
    buttons.forEach((elem: any) => (elem.tabIndex = tabIndex))
  }
}

export function setTabIndexHits(tabIndex: number) {
  const elements = document.getElementById('searchGrid')
  const anchorElements = elements?.querySelectorAll('a, button')
  const select = elements?.querySelector('select')

  if (anchorElements) {
    anchorElements.forEach((elem: any) => (elem.tabIndex = tabIndex))
  }
  if (select) {
    select.tabIndex = tabIndex
  }
}
