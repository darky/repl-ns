const namespaces: Record<string, Record<string, unknown>> = {}

export const ns = <T extends object>(
  name: string,
  props: T,
  options?: {
    before?: (props?: T) => Promise<unknown>
    after?: (props: T) => Promise<unknown>
    forceRewrite?: boolean
    rewriteKeys?: (keyof T)[]
    sync?: boolean
  }
) => {
  const core = () => {
    const rewriteKeysIdx: Record<string, boolean> = {}
    options?.rewriteKeys?.forEach(k => (rewriteKeysIdx[k as string] = true))
    namespaces[name] ??= {}

    const entries = Object.entries(props)
    const newEntries = entries.filter(
      ([key, value]) =>
        options?.forceRewrite || rewriteKeysIdx[key] || typeof value === 'function' || namespaces[name]![key] == null
    )

    Object.assign(namespaces[name]!, Object.fromEntries(newEntries))
  }

  const ready = options?.sync
    ? (() => {
        options?.before?.(namespaces[name] as T)
        core()
        options?.after?.(namespaces[name] as T)
        return Promise.resolve()
      })()
    : (async () => {
        await options?.before?.(namespaces[name] as T)
        core()
        await options?.after?.(namespaces[name] as T)
      })()

  return Object.assign(() => namespaces[name] as T, { ready })
}
