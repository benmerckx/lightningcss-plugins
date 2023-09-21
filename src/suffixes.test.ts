import {expect, test} from 'bun:test'
import {Features, transform} from 'lightningcss'
import {suffixes} from './suffixes.ts'

function convert(input: string): string {
  const {code} = transform({
    filename: 'test.css',
    minify: true,
    visitor: suffixes,
    code: Buffer.from(input),
    include: Features.Nesting
  })
  return Buffer.from(code).toString('utf-8')
}

test('conversion', () => {
  expect(
    convert(`
    .A {&-b {color: red}}
  `)
  ).toBe('.A-b{color:red}')

  expect(
    convert(`
    .A, .B {&-b {color: red}}
  `)
  ).toBe('.A-b,.B-b{color:red}')
})

test('any level nesting', () => {
  expect(
    convert(`
    .A {&-b {&-c{color: red}}}
  `)
  ).toBe('.A-b-c{color:red}')
})

test('nesting in nesting', () => {
  expect(
    convert(`
    .A {&-b {&-c{.B {color: red; &-d:hover {color: red}}}}}
  `)
  ).toBe('.A-b-c .B{color:red}.A-b-c .B-d:hover{color:red}')
})

test('we lose this', () => {
  expect(convert(`.a{&div{color:red}}`)).toBe('.adiv{color:red}')
})

test('but we can just do this instead', () => {
  expect(convert(`.a{&:is(div){color:red}}`)).toBe('.a:is(div){color:red}')
})
