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

import React from 'react'
import { setupServer } from 'msw/node'
import { rest } from 'msw'
import { render, screen } from '@testing-library/react'
import { TestProviders } from 'test/testutils'
import { ParsedParams } from 'src/contexts/location'
import { useHspObjectsByQuery, useHspObjectById } from 'src/contexts/discovery'

let status = 200

setupServer(
  rest.get('http://example.com/api/search/hspobjects/:id', (req, res, ctx) => {
    return res(ctx.status(status), ctx.json('hsp object by id output'))
  }),
  rest.get('http://example.com/api/search/hspobjects', (req, res, ctx) => {
    return res(ctx.status(status), ctx.json('hsp object by query output'))
  })
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

function TestById(props: { id: string }) {
  const { data, error, isIdle } = useHspObjectById(props.id)

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
      </TestProviders>
    )

    await screen.findByText('server did not respond with status code 200')
  })

  test('otherwise return the data', async function () {
    const params = { q: 'foo' }
    status = 200

    render(
      <TestProviders>
        <TestByQuery params={params} />
      </TestProviders>
    )

    await screen.findByText(/hsp object by query output/)
  })
})

describe('useHspObjectById', function () {
  test('return idle status if id parameter is empty string', async function () {
    const id = ''
    status = 200

    render(
      <TestProviders>
        <TestById id={id} />
      </TestProviders>
    )

    await screen.findByText('idle')
  })

  test('return error if response is not 200 (or on network error)', async function () {
    const id = 'xyz'
    status = 404

    render(
      <TestProviders>
        <TestById id={id} />
      </TestProviders>
    )

    await screen.findByText('server did not respond with status code 200')
  })

  test('otherwise return the data', async function () {
    const id = 'xyz'
    status = 200

    render(
      <TestProviders>
        <TestById id={id} />
      </TestProviders>
    )

    await screen.findByText(/hsp object by id output/)
  })
})
