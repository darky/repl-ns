const namespaces: Record<string, Record<string, unknown>> = {}

export const ns = <T extends object>(
  name: string,
  props: T,
  opts?: {
    before?: (props?: T) => Promise<unknown>
    after?: (props: T) => Promise<unknown>
    forceRewrite?: boolean
    rewriteKeys?: (keyof T)[]
  }
) => {
  const ready = (async () => {
    await opts?.before?.(namespaces[name] as T)

    const rewriteKeysIdx =
      opts?.rewriteKeys?.reduce((acc, k) => ({ ...acc, [k]: true }), {} as Record<string, boolean>) ?? {}
    namespaces[name] ??= {}

    await Promise.resolve(props)
      .then(p => Object.entries(p))
      .then(es =>
        es.filter(
          ([k, v]) => opts?.forceRewrite || rewriteKeysIdx[k] || typeof v === 'function' || namespaces[name]![k] == null
        )
      )
      .then(es => Object.fromEntries(es))
      .then(p => Object.assign(namespaces[name]!, p))

    await opts?.after?.(namespaces[name] as T)
  })()

  return Object.assign(() => namespaces[name] as T, { ready })
}
