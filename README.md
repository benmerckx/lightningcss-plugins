# lightningcss-plugins

## pxToRem

Convert pixel values to rem values.

```ts
import {code} from 'lightningcss'
import {pxToRem} from 'lightningcss-plugins'

interface PxToRemOptions {
  /** Represents the root element font size (default: 16) */
  rootValue?: number
  /** The decimal numbers to allow the REM units to grow to (default: 5) */
  unitPrecision?: number
  /** Set the minimum pixel value to replace (default: 0) */
  minPixelValue?: number
}

const {code} = transform({
  visitor: pxToRem(/* options */),
  filename: 'test.css',
  code: Buffer.from(`
    body {
      font-size: 16px;
      max-width: 960px;
    }
  `)
})
```

Result:

```css
body {font-size: 1rem; max-width: 60rem}
```

## suffixes

Append nested type selectors to the parent selector like is the case in scss/less.
As long as the outer selector ends with an alphanumeric name (like class, ID,
and element selectors), you can use the parent selector to append additional text.

```ts
import {code} from 'lightningcss'
import {suffixes} from 'lightningcss-plugins'

const {code} = transform({
  visitor: suffixes,
  filename: 'test.css',
  code: Buffer.from(`
    .accordion {
      max-width: 600px;

      &__copy {
        display: none;
        color: gray;

        &--open {
          display: block;
        }
      }
    }
  `)
})
```

Result:

```css
.accordion {max-width: 600px}
.accordion__copy {display: none; color: gray}
.accordion__copy--open {display: block}
```

Note: this means it is no longer possible to use nesting to specify the element:

```css
.class {&div {color: red}}
/* Will transform to: */
.classdiv {color: red}
/* But you can use is: */
.class {&:is(div) {color: red}}
/* Which will yield: */
.class:is(div) {color: red}
```
