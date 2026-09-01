// One way to talk to the model. If the endpoint is unreachable or refuses,
// that surfaces as an error — this site never answers on the model's behalf.

export type Message = { role: 'system' | 'user' | 'assistant'; content: string }

const API = process.env.NEXT_PUBLIC_ZOO_API ?? 'https://api.hanzo.ai'
const MODEL = process.env.NEXT_PUBLIC_ZOO_MODEL ?? 'zen'

/** Whatever the endpoint said went wrong, in its own words. */
async function refusal(res: Response): Promise<string> {
  const body = await res.json().catch(() => null)
  return body?.error?.message ?? `${res.status} ${res.statusText}`
}

/** Yields reply text as it arrives. */
export async function* reply(
  messages: Message[],
  signal?: AbortSignal
): AsyncGenerator<string> {
  const res = await fetch(`${API}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
    signal,
  })

  if (!res.ok || !res.body) throw new Error(await refusal(res))

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let held = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    held += decoder.decode(value, { stream: true })

    const lines = held.split('\n')
    held = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.startsWith('data:')) continue
      const payload = line.slice(5).trim()
      if (payload === '[DONE]') return
      try {
        const token = JSON.parse(payload).choices?.[0]?.delta?.content
        if (token) yield token
      } catch {
        // A partial frame; the next read completes it.
      }
    }
  }
}
