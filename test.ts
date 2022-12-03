import assert from 'node:assert'
import test from 'node:test'

import { ns } from '.'

test('basic', async () => {
  const namespace = ns('basic', {
    fn() {
      return 1 + 1
    },
  })
  await namespace.ready

  const n = namespace().fn()
  assert.strictEqual(n, 2)
})

test('override fn', async () => {
  const namespace = ns('override', {
    fn() {
      return 1 + 1
    },
  })
  await namespace.ready

  await ns('override', {
    fn() {
      return 2 + 2
    },
  }).ready

  const n = namespace().fn()
  assert.strictEqual(n, 4)
})

test('preserve object by default', async () => {
  const namespace = ns('preserve:obj', {
    obj: 1,
  })
  await namespace.ready

  await ns('preserve:obj', {
    obj: 2,
  }).ready

  const n = namespace().obj
  assert.strictEqual(n, 1)
})

test('force rewrite', async () => {
  const namespace = ns('force:rewrite', {
    obj: 1,
  })
  await namespace.ready

  await ns(
    'force:rewrite',
    {
      obj: 2,
    },
    { forceRewrite: true }
  ).ready

  const n = namespace().obj
  assert.strictEqual(n, 2)
})

test('rewrite by keys', async () => {
  const namespace = ns('rewrite:by:keys', {
    obj: 1,
  })
  await namespace.ready

  await ns(
    'rewrite:by:keys',
    {
      obj: 2,
    },
    { rewriteKeys: ['obj'] }
  ).ready

  const n = namespace().obj
  assert.strictEqual(n, 2)
})

test('before', async () => {
  let called = 0

  await ns(
    'before',
    { obj: 1 },
    {
      async before(props) {
        called += 1
        assert.strictEqual(props, void 0)
      },
    }
  ).ready

  await ns(
    'before',
    { obj: 1 },
    {
      async before(props) {
        called += 1
        assert.strictEqual(props?.obj, 1)
      },
    }
  ).ready

  assert.strictEqual(called, 2)
})

test('after', async () => {
  let called = 0

  await ns(
    'after',
    { obj: 1 },
    {
      async after(props) {
        called += 1
        assert.strictEqual(props?.obj, 1)
      },
    }
  ).ready

  assert.strictEqual(called, 1)
})
