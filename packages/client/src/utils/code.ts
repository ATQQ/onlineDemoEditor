import prettier from 'prettier/standalone'
import htmlPlugin from 'prettier/parser-html'
import cssPlugin from 'prettier/parser-postcss'
import jsPlugin from 'prettier/parser-babel'

export function formatHtml(html: string) {
  return prettier.format(html, {
    parser: 'html',
    plugins: [htmlPlugin]
  })
}
export function formatJS(tsCode: string) {
  return prettier.format(tsCode, {
    parser: 'babel',
    plugins: [jsPlugin]
  })
}

export function formatCss(css: string) {
  return prettier.format(css, {
    parser: 'css',
    plugins: [cssPlugin]
  })
}
