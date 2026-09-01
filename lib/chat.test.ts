import assert from 'node:assert/strict'
import { afterEach, test } from 'node:test'
import { reply } from './chat.ts'

const realFetch = globalThis.fetch
afterEach(() => {
  globalThis.fetch = realFetch
})

/** Serves the given chunks as a streaming body, byte boundaries and all. */
function serve(chunks: string[], init: ResponseInit = {}) {
  globalThis.fetch = (async () =>
    new Response(
      new ReadableStream({
        start(c) {
          const enc = new TextEncoder()
          for (const chunk of chunks) c.enqueue(enc.encode(chunk))
          c.close()
        },
      }),
      { status: 200, ...init }
    )) as typeof fetch
}

const frame = (content: string) =>
  `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}\n\n`

const drain = async () => {
  let out = ''
  for await (const token of reply([{ role: 'user', content: 'hi' }])) out += token
  return out
}

test('reads tokens in order and stops at [DONE]', async () => {
  serve([frame('Calves '), frame('are '), frame('grey.'), 'data: [DONE]\n\n', frame('ignored')])
  assert.equal(await drain(), 'Calves are grey.')
})

test('a frame split across two reads is not lost', async () => {
  const whole = frame('Sound travels further in water.')
  serve([whole.slice(0, 12), whole.slice(12), 'data: [DONE]\n\n'])
  assert.equal(await drain(), 'Sound travels further in water.')
})

test('keep-alives and non-JSON lines are skipped, not thrown on', async () => {
  serve([': ping\n\n', frame('Still '), 'data: not json\n\n', frame('here.'), 'data: [DONE]\n\n'])
  assert.equal(await drain(), 'Still here.')
})

// The whole point of the rewrite: a refusal must reach the page as itself.
test("a refusal surfaces the endpoint's own words", async () => {
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ error: { message: 'a billable tenant is required' } }), {
      status: 402,
      statusText: 'Payment Required',
    })) as typeof fetch
  await assert.rejects(drain, /a billable tenant is required/)
})

test('a refusal with no message body still says something useful', async () => {
  globalThis.fetch = (async () =>
    new Response('nope', { status: 503, statusText: 'Service Unavailable' })) as typeof fetch
  await assert.rejects(drain, /503 Service Unavailable/)
})
