import {expect, test} from 'bun:test'
import {transform} from 'lightningcss'
import {PxToRemOptions, pxToRem} from './pxToRem.ts'

function convert(input: string, options: PxToRemOptions = {}): string {
  const {code} = transform({
    filename: 'test.css',
    minify: true,
    visitor: pxToRem(options),
    code: Buffer.from(input)
  })
  return Buffer.from(code).toString('utf-8')
}

test('conversion', () => {
  expect(convert('h1{font-size:16px}')).toBe('h1{font-size:1rem}')
  expect(convert('h1{font-size:16em}')).toBe('h1{font-size:16em}')
  expect(convert('h1{width:1px}', {minPixelValue: 2})).toBe('h1{width:1px}')
  expect(convert('h1{width:2px}')).toBe('h1{width:.125rem}')
  expect(convert('h1{width:1px}', {unitPrecision: 2})).toBe('h1{width:.06rem}')
})
