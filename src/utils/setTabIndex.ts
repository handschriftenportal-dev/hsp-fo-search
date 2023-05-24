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
