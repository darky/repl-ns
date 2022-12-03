const namespaces: Record<string, Record<string, unknown>> = {}

export const ns = <T extends object>(
  name: string,
  props: T,
  options?: {
    before?: (props?: T) => Promise<unknown>
    after?: (props: T) => Promise<unknown>
    forceRewrite?: boolean
    rewriteKeys?: (keyof T)[]
  }
) => {
  const ready = (async () => {
    await options?.before?.(namespaces[name] as T)

    const rewriteKeysIdx: Record<string, boolean> = {}
    options?.rewriteKeys?.forEach(k => (rewriteKeysIdx[k as string] = true))
    namespaces[name] ??= {}

    await Promise.resolve(props)
      .then(p => Object.entries(p))
      .then(es =>
        es.filter(
          ([key, value]) =>
            options?.forceRewrite ||
            rewriteKeysIdx[key] ||
            typeof value === 'function' ||
            namespaces[name]![key] == null
        )
      )
      .then(es => Object.fromEntries(es))
      .then(p => Object.assign(namespaces[name]!, p))

    await options?.after?.(namespaces[name] as T)
  })()

  return Object.assign(() => namespaces[name] as T, { ready })
}
