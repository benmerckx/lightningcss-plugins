import {
  Rule,
  Selector,
  SelectorComponent,
  SelectorList,
  Visitor
} from 'lightningcss'

export const suffixes: Visitor<{}> = {
  Rule: {
    style: addSuffixes
  }
}

function addSuffixes(rule: Rule, parent: SelectorList = []): Rule {
  if (rule.type !== 'style') throw new Error('Expected style Rule')
  const selectors = rule.value.selectors.flatMap(selector =>
    processSelector(selector, parent)
  )
  return {
    ...rule,
    value: {
      ...rule.value,
      selectors,
      rules: rule.value.rules?.map(rule => {
        switch (rule.type) {
          case 'style':
            return addSuffixes(rule, selectors)
          default:
            return rule
        }
      })
    }
  }
}

function processSelector(
  selector: Selector,
  parent: SelectorList
): SelectorList {
  const [first, second, ...rest] = selector
  if (first.type !== 'nesting' || !second) return [selector]
  if (second.type !== 'type')
    return parent.map(s => s.concat(selector.slice(1)))
  return parent.map(selector =>
    selector
      .slice(0, -1)
      .concat(
        concatSelectorComponent(selector[selector.length - 1], second.name)
      )
      .concat(rest)
  )
}

function concatSelectorComponent(component: SelectorComponent, name: string) {
  switch (component.type) {
    case 'class':
    case 'type':
    case 'id':
      return {
        ...component,
        name: component.name + name
      }
    case 'pseudo-class':
      if (component.kind === 'custom') {
        return {
          ...component,
          name: component.name + name
        }
      }
    default:
      return component
  }
}
