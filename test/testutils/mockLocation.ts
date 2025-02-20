const anyWindow = window as any

// Mocks the window.location object that is not supported
// by jest/jsdom.
export function mockLocation(locationObject?: any) {
  delete anyWindow.location
  anyWindow.location = locationObject || {
    href: 'http://example.com/',
    origin: 'http://example.com',
  }
}
