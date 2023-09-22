import {Visitor} from 'lightningcss'

// Resembles the interface of https://www.npmjs.com/package/postcss-pxtorem
// But does not support the following options:
// - propsList
// - selectorBlackList
// - replace
// - mediaQuery
// - exclude

export interface PxToRemOptions {
  /** Represents the root element font size (default: 16) */
  rootValue?: number
  /** The decimal numbers to allow the REM units to grow to (default: 5) */
  unitPrecision?: number
  /** Set the minimum pixel value to replace (default: 0) */
  minPixelValue?: number
}

export function pxToRem(options: PxToRemOptions = {}): Visitor<{}> {
  const {rootValue = 16, unitPrecision = 5, minPixelValue = 0} = options
  return {
    Length(length) {
      if (length.unit !== 'px') return length
      if (length.value < minPixelValue) return length
      const value = length.value / rootValue
      return {
        unit: 'rem',
        value: toFixed(value, unitPrecision)
      }
    }
  }
}

function toFixed(number: number, precision: number) {
  const multiplier = Math.pow(10, precision + 1)
  const wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}
