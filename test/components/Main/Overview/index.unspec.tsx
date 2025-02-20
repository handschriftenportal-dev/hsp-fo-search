import { render } from '@testing-library/react'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { Overview } from 'src/components/Main/Overview'

// tracking
// import * as tracking from 'src/app/tracking'

describe('<Overview/>', function () {
  test('dummy', function () {
    expect(true).toBe(true)
  })

  // tracking
  /* it('calls useRouteTracking hook', function() {

    jest.spyOn(tracking, 'useRouteTracking')

    render(
      <AppContext>
        <Overview />
      </AppContext>
    )

    expect(tracking.useRouteTracking).toHaveBeenCalledWith('Overview')
  }) */
})
