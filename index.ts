const namespaces: Record<string, object> = {}

export const ns = <T extends object>(
  name: string,
  props: T,
  opts: {
    before: (props?: T) => Promise<unknown>
    after: (props: T) => Promise<unknown>
    forceRewrite: boolean
    rewriteKeys: string[]
  } = { forceRewrite: false, rewriteKeys: [], async before() {}, async after() {} }
) => {
  ;(async () => {
    await opts.before(namespaces[name] as T)

    const rewriteKeysIdx = opts.rewriteKeys.reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>)

    await Promise.resolve(props)
      .then(p => Object.entries(p))
      .then(es => es.filter(([k, v]) => opts.forceRewrite || rewriteKeysIdx[k] || typeof v === 'function'))
      .then(es => Object.fromEntries(es))
      .then(p => ((namespaces[name] ??= {}), Object.assign(namespaces[name]!, p)))

    await opts.after(namespaces[name] as T)
  })()

  return () => namespaces[name] as T
}
