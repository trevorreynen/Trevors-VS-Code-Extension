const postcss = require('postcss')
const scss = require('postcss-scss')

// The CSS Properties in the Sort Order.
const propertyOrder = [
  '@include',
  'grid-area',
  'grid-row-start',
  'grid-column-start',
  'grid-row-end',
  'grid-column-end',
  'z-index',
  'content',
  'box-sizing',
  'display',
  'justify-content',
  'align-items',
  'place-content',
  'place-items',
  'align-content',
  'justify-items',
  'place-self',
  'align-self',
  'justify-self',
  'flex-direction',
  'grid',
  'grid-auto-rows',
  'grid-auto-columns',
  'grid-auto-flow',
  'grid-column-gap',
  'grid-row-gap',
  'column-gap',
  'row-gap',
  'grid-template',
  'grid-template-columns',
  'grid-template-rows',
  'grid-template-areas',
  'gap',
  'flex',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'order',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'float',
  'opacity',
  'visibility',
  'overflow',
  'overflow-x',
  'overflow-y',
  'width',
  'min-width',
  'max-width',
  'height',
  'min-height',
  'max-height',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'color',
  'font',
  'font-style',
  'font-size',
  'font-weight',
  'font-stretch',
  'line-height',
  'font-family',
  'font-variant',
  'letter-spacing',
  'text-align',
  'text-decoration',
  'text-decoration-line',
  'text-decoration-style',
  'text-decoration-color',
  'text-decoration-thickness',
  'text-transform',
  'text-shadow',
  'text-emphasis',
  'text-emphasis-style',
  'text-emphasis-color',
  'list-style',
  'list-style-image',
  'list-style-position',
  'list-style-type',
  'table-layout',
  'mask',
  'mask-image',
  'mask-mode',
  'mask-repeat',
  'mask-position',
  'mask-clip',
  'mask-origin',
  'mask-size',
  'mask-composite',
  'mask-border',
  'mask-border-mode',
  'mask-border-outset',
  'mask-border-repeat',
  'mask-border-slice',
  'mask-border-source',
  'mask-border-width',
  'background',
  'background-image',
  'background-position',
  'background-size',
  'background-repeat',
  'background-origin',
  'background-clip',
  'background-attachment',
  'background-color',
  'border',
  'border-width',
  'border-style',
  'border-color',
  'border-radius',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'border-image',
  'border-image-outset',
  'border-image-repeat',
  'border-image-slice',
  'border-image-source',
  'border-image-width',
  'box-shadow',
  'outline',
  'outline-width',
  'outline-style',
  'outline-color',
  'animation',
  'animation-name',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
  'animation-direction',
  'animation-iteration-count',
  'animation-fill-mode',
  'animation-play-state',
  'animation-timeline',
  'transform',
  'transition',
  'transition-delay',
  'transition-duration',
  'transition-property',
  'transition-timing-function',
  'transition-behavior',
  'inset',
  'cursor',
  'pointer-events',
  'appearance',
]


// Convert // comments to /* ... */ to keep PostCSS happy
function preprocessScssComments(text) {
  const lines = text.split('\n')
  const newLines = []

  for (let line of lines) {
    const trimmed = line.trim()

    // Full-line SCSS comment
    if (trimmed.startsWith('//')) {
      const indent = line.match(/^\s*/)?.[0] || ''
      const content = trimmed.slice(2).trim()
      newLines.push(`${indent}/* ${content} */`)
      continue
    }

    // Inline comment handling
    const inlineMatch = line.match(/^(.*?)(\s*)\/\/(.*)$/)
    if (inlineMatch) {
      const [_, before, spacing, comment] = inlineMatch

      const lowerBefore = before.toLowerCase()
      // Ignore if the // is inside a url(...)
      const urlStart = lowerBefore.lastIndexOf('url(')
      const urlEnd = lowerBefore.lastIndexOf(')')

      const isInsideUrl = urlStart !== -1 && urlEnd < urlStart

      if (isInsideUrl) {
        newLines.push(line)
        continue
      }

      newLines.push(`${before}${spacing}/* ${comment.trim()} */`)
      continue
    }

    newLines.push(line)
  }

  return newLines.join('\n')
}


// Group decls with comments and sort them
function sortProperties(nodes) {
  const groups = []
  let currentGroup = []

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i]

    if (node.type === 'comment') {
      currentGroup = [node]
    } else if (
      node.type === 'decl' ||
      (node.type === 'atrule' && node.name === 'include' && !node.nodes)
    ) {
      // If it's a decl or a 1-line @include, treat it as sortable
      if (currentGroup.length) {
        currentGroup.push(node)
        groups.push([...currentGroup])
        currentGroup = []
      } else {
        groups.push([node])
      }
    } else {
      if (currentGroup.length) {
        groups.push([...currentGroup])
        currentGroup = []
      }
      groups.push([node]) // keep other content untouched
    }
  }

  groups.sort((a, b) => {
    const aNode = a.find(n => n.type === 'decl' || n.name === 'include')
    const bNode = b.find(n => n.type === 'decl' || n.name === 'include')

    const aKey = aNode?.type === 'decl' ? aNode.prop : `@${aNode?.name ?? ''}`
    const bKey = bNode?.type === 'decl' ? bNode.prop : `@${bNode?.name ?? ''}`

    const aIndex = propertyOrder.indexOf(aKey)
    const bIndex = propertyOrder.indexOf(bKey)

    return (aIndex === -1 ? 9999 : aIndex) - (bIndex === -1 ? 9999 : bIndex)
  })

  return groups.flat()
}


async function sortCssText(cssText) {
  const cleanedText = preprocessScssComments(cssText)
  const root = postcss.parse(cleanedText, { syntax: scss })

  root.walkRules(rule => {
    rule.nodes = sortProperties(rule.nodes || [])
  })

  return root.toString()
}


async function sortCssTextUltra(cssText) {
  const cleanedText = preprocessScssComments(cssText)
  const root = postcss.parse(cleanedText, { syntax: scss })

  root.walkRules(rule => {
    const sorted = sortProperties(rule.nodes || [])

    let lastDecl = null

    for (let node of sorted) {
      if (node.type === 'decl') {
        lastDecl = node

        // 1. Add space after colon
        node.raws.between = ': '

        // 2. Normalize durations like `.5s` → `0.5s`
        node.value = node.value.replace(/(^|[^\d])\.([0-9]+)(s|ms)\b/g, '$10.$2$3')

        // 3. Add px to standalone zero values
        node.value = node.value.replace(/\b0\b(?=\s|;|$)(?!px|%|vh|vw|ch|s|ms|deg)/g, '0px')
      }
    }

    // 4. Add semicolon to last decl and rule
    if (lastDecl && !lastDecl.raws.semicolon) {
      lastDecl.raws.semicolon = true
      rule.raws.semicolon = true
    }

    rule.nodes = sorted
  })

  return root.toString()
}



module.exports = {
  sortCssText,
  sortCssTextUltra
}
