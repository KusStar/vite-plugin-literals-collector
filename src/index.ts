import { createFilter, FilterPattern } from '@rollup/pluginutils'
import { walk } from 'estree-walker'
import { Plugin } from 'vite'

interface Options {
  /**
   * included filed or folder, defaults to [/\.ts$/, /\.js$/]
   */
  include?: FilterPattern
  /**
   * excluded files or folder, defaults to undefined
   */
  exclude?: FilterPattern
  /**
   * wanted matching characters
   */
  target?: FilterPattern
  /**
   * onResult logger, defaults to (final: string[]) =>
   *  console.log(`* LiteralsCollector: collected ${final.length} characters`)
   */
  formatter?: (result: string[]) => void
  /**
   * result callback, defaults to undefined
   */
  onResult?: (result: string[]) => void
}

export const CJK = /[\u4E00-\u9FCC\u3400-\u4DB5\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d]/
// eslint-disable-next-line no-control-regex
export const ASCII = /[\x00-\x7F]/

export function literalsCollector(options: Options = {}) {
  if (!options.include) {
    options.include = [/\.ts$/, /\.js$/]
  }

  if (!options.target) {
    options.target = [CJK, ASCII]
  }

  if (!options.formatter) {
    options.formatter = (final: string[]) =>
      console.log(`* LiteralsCollector: collected ${final.length} characters`)
  }

  const fileFilter = createFilter(options.include, options.exclude)
  const targetFilter = createFilter(options.target)
  let content = ''

  const add = (t: unknown) => {
    if (targetFilter(t)) {
      content += String(t)
    }
  }

  return <Plugin>{
    name: 'vite-plugin-literals-collector',
    enforce: 'post',
    transform(code, id) {
      if (!fileFilter(id)) return

      const ast = this.parse(code)
      walk(ast, {
        enter(node) {
          const { type, value } = node
          if (type === 'TemplateElement') {
            add(value.cooked)
          } else if (type === 'Literal') {
            add(value)
          }
        }
      })
    },
    closeBundle() {
      const final = Array.from(new Set(content))
      options.formatter(final)
      options?.onResult?.(final)
    }
  }
}
