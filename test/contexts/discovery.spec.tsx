import { render, screen } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import React from 'react'
import { TestProviders } from 'test/testutils'

import { useHspObjectById, useHspObjectsByQuery } from 'src/contexts/discovery'
import { ParsedParams } from 'src/contexts/location'

let status = 200

setupServer(
  rest.get('http://example.com/api/hspobjects/search*', (req, res, ctx) => {
    return res(ctx.status(status), ctx.json('hsp object by query output'))
  }),
  rest.get('http://example.com/api/hspobjects/:hspId', (req, res, ctx) => {
    return res(ctx.status(status), ctx.json('hsp object by id output'))
  }),
).listen()

function TestByQuery(props: { params: ParsedParams }) {
  const { data, error, isIdle } = useHspObjectsByQuery(props.params)

  if (isIdle) {
    return <p>idle</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }
  if (data) {
    return <p>{JSON.stringify(data)}</p>
  }

  return null
}

function TestById(props: { hspId: string }) {
  const { data, error, isIdle } = useHspObjectById(props.hspId)

  if (isIdle) {
    return <p>idle</p>
  }
  if (error) {
    return <p>{error.message}</p>
  }
  if (data) {
    return <p>{JSON.stringify(data)}</p>
  }

  return null
}

describe('useHspObjectsByQuery', function () {
  test('return error if response is not 200 (or on network error)', async function () {
    const params = { q: 'foo' }
    status = 404

    render(
      <TestProviders>
        <TestByQuery params={params} />
      </TestProviders>,
    )

    await screen.findByText('server did not respond with status code 200')
  })

  test('otherwise return the data', async function () {
    const params = { q: 'foo' }
    status = 200

    render(
      <TestProviders>
        <TestByQuery params={params} />
      </TestProviders>,
    )

    await screen.findByText(/hsp object by query output/)
  })
})

describe('useHspObjectById', function () {
  test('return idle status if id parameter is empty string', async function () {
    const hspId = ''
    status = 200

    render(
      <TestProviders>
        <TestById hspId={hspId} />
      </TestProviders>,
    )

    await screen.findByText('idle')
  })

  test('return error if response is not 200 (or on network error)', async function () {
    const hspId = 'xyz'
    status = 404

    render(
      <TestProviders>
        <TestById hspId={hspId} />
      </TestProviders>,
    )

    await screen.findByText('server did not respond with status code 200')
  })

  test('otherwise return the data', async function () {
    const hspId = 'xyz'
    status = 200

    render(
      <TestProviders>
        <TestById hspId={hspId} />
      </TestProviders>,
    )

    await screen.findByText(/hsp object by id output/)
  })
})
