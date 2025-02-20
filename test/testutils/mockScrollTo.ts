export function mockScrollTo() {
  ;(window as any).scrollTo = () => {}
}
