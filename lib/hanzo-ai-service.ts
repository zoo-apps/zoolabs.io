/**
 * Unified Hanzo AI Client & Generative Service Layer
 * Connects directly to local backend binary (http://localhost:8000) and production gateway (https://api.hanzo.ai)
 * Fully generative: extracts dynamic agent emotions, video animations, interactive widgets, quizzes, and tasks.
 */

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface FamiliarEmotion {
  emotion: 'Happy' | 'Playful' | 'Curious' | 'Focused' | 'Calm' | 'Excited'
  emoji: string
  videoSrc: string
}

export const FAMILIAR_EMOTIONS: Record<string, FamiliarEmotion> = {
  Happy: { emotion: 'Happy', emoji: '😊', videoSrc: '/bg_video/static/relactation0.mp4' },
  Playful: { emotion: 'Playful', emoji: '🫧', videoSrc: '/bg_video/emotion/Playful.mp4' },
  Curious: { emotion: 'Curious', emoji: '🧐', videoSrc: '/bg_video/static/relactation1.mp4' },
  Focused: { emotion: 'Focused', emoji: '⚡', videoSrc: '/bg_video/emotion/Relactation.mp4' },
  Calm: { emotion: 'Calm', emoji: '🌊', videoSrc: '/bg_video/static/relactation2.mp4' },
  Excited: { emotion: 'Excited', emoji: '🐬', videoSrc: '/bg_video/static/relactation3.mp4' },
}

export interface DynamicWidget {
  type: 'quiz' | 'audio-wave' | 'notebook' | 'fact-card' | 'code-builder' | 'local-ai' | 'badge'
  title: string
  data: any
}

export interface GenerativeAgentOutput {
  cleanText: string
  emotion: FamiliarEmotion
  tasks: { title: string; done: boolean }[]
  widgets: DynamicWidget[]
  quickPrompts: { label: string; prompt: string; icon?: string }[]
  badgeEarned?: { title: string; icon: string; desc: string }
}

export function detectFamiliarEmotion(text: string): FamiliarEmotion {
  const t = text.toLowerCase()
  if (t.includes('play') || t.includes('fun') || t.includes('game') || t.includes('laugh') || t.includes('bubble') || t.includes('swim')) {
    return FAMILIAR_EMOTIONS.Playful
  }
  if (t.includes('why') || t.includes('how') || t.includes('what') || t.includes('tell me') || t.includes('explore') || t.includes('clue')) {
    return FAMILIAR_EMOTIONS.Curious
  }
  if (t.includes('code') || t.includes('build') || t.includes('fix') || t.includes('app') || t.includes('task') || t.includes('work')) {
    return FAMILIAR_EMOTIONS.Focused
  }
  if (t.includes('great') || t.includes('love') || t.includes('awesome') || t.includes('yay') || t.includes('woo') || t.includes('winner')) {
    return FAMILIAR_EMOTIONS.Excited
  }
  if (t.includes('peace') || t.includes('ocean') || t.includes('sleep') || t.includes('relax') || t.includes('breathe') || t.includes('calm')) {
    return FAMILIAR_EMOTIONS.Calm
  }
  return FAMILIAR_EMOTIONS.Happy
}

/**
 * Parses generative LLM output (structured JSON or adaptive context) into dynamic widgets, tasks, and emotions.
 */
export function parseGenerativeOutput(rawText: string, userPrompt?: string): GenerativeAgentOutput {
  let cleanText = rawText
  let emotion = detectFamiliarEmotion(rawText + ' ' + (userPrompt || ''))
  const tasks: { title: string; done: boolean }[] = []
  const widgets: DynamicWidget[] = []
  const quickPrompts: { label: string; prompt: string; icon?: string }[] = []
  let badgeEarned: { title: string; icon: string; desc: string } | undefined

  // Try extracting embedded JSON blocks like ```json { ... } ```
  const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/)
  if (jsonMatch) {
    try {
      const parsed = JSON.parse(jsonMatch[1])
      if (parsed.cleanText) cleanText = parsed.cleanText
      if (parsed.emotion && FAMILIAR_EMOTIONS[parsed.emotion]) {
        emotion = FAMILIAR_EMOTIONS[parsed.emotion]
      }
      if (Array.isArray(parsed.tasks)) {
        parsed.tasks.forEach((t: string | { title: string; done?: boolean }) => {
          tasks.push(typeof t === 'string' ? { title: t, done: false } : { title: t.title, done: !!t.done })
        })
      }
      if (Array.isArray(parsed.widgets)) {
        parsed.widgets.forEach((w: DynamicWidget) => widgets.push(w))
      }
      if (Array.isArray(parsed.quickPrompts)) {
        parsed.quickPrompts.forEach((qp: any) => quickPrompts.push(qp))
      }
      if (parsed.badgeEarned) badgeEarned = parsed.badgeEarned
    } catch {
      // ignore parse failure and use heuristic generation
    }
  }

  // Heuristic generative fallback if no explicit JSON
  const t = (cleanText + ' ' + (userPrompt || '')).toLowerCase()

  // 1. If talking about audio, songs, or echolocation -> Audio Spectrogram widget
  if (t.includes('song') || t.includes('whistle') || t.includes('chirp') || t.includes('sound') || t.includes('acoust') || t.includes('echolocat')) {
    if (!widgets.some(w => w.type === 'audio-wave')) {
      widgets.push({
        type: 'audio-wave',
        title: 'Beluga Bioacoustic Whistle (18.4 kHz - 120 kHz)',
        data: {
          frequency: '18.4 kHz – 120.0 kHz',
          callType: 'Canary of the Sea Maternal Whistle',
          recordingZone: 'Cook Inlet Acoustic Array',
        },
      })
    }
    if (tasks.length === 0) {
      tasks.push(
        { title: 'Listen to the 120kHz underwater whistle stem', done: true },
        { title: 'Discover how belugas use their melon organ for echolocation', done: false },
        { title: 'Log discovery in My Zoo Book', done: false }
      )
    }
    quickPrompts.push(
      { icon: '🎵', label: 'Play whale song', prompt: 'Play another whale song frequency and explain what it means!' },
      { icon: '🧊', label: 'How they find ice holes', prompt: 'How do belugas find breathing holes in thick sea ice?' },
      { icon: '⭐', label: 'Whale quiz', prompt: 'Give me a fun 3-question quiz about beluga whale super powers!' }
    )
  }

  // 2. If asking about coding, building apps, or reports -> Code Builder & Notebook widgets
  else if (t.includes('code') || t.includes('build') || t.includes('app') || t.includes('program') || t.includes('report') || t.includes('study')) {
    if (!widgets.some(w => w.type === 'code-builder')) {
      widgets.push({
        type: 'code-builder',
        title: 'Zoo Mini-App: Marine Tracker',
        data: {
          language: 'typescript',
          code: `export function BelugaApp() {\n  const pod = { name: "Genesis Pod", whales: 14, ocean: "Cook Inlet" };\n  return <div>Whales protected: {pod.whales}</div>;\n}`,
        },
      })
    }
    if (!widgets.some(w => w.type === 'notebook')) {
      widgets.push({
        type: 'notebook',
        title: 'Field Research Log Entry',
        data: {
          title: 'Beluga Pod Investigation',
          notes: 'Beluga whales communicate with over 50 distinct whistles, chirps, and echolocation clicks.',
        },
      })
    }
    if (tasks.length === 0) {
      tasks.push(
        { title: 'Generated mini-app component', done: true },
        { title: 'Verified safe kid-friendly React code', done: false },
        { title: 'Ready to export to local project', done: false }
      )
    }
    quickPrompts.push(
      { icon: '🚀', label: 'Add interactive button', prompt: 'Can we add an interactive button to play a whale chirp when clicked?' },
      { icon: '📱', label: 'Make it touch friendly', prompt: 'Make the app look like a video game card with big buttons for iPad!' },
      { icon: '📝', label: 'Write school report', prompt: 'Help me turn this into a 1-page science report for school!' }
    )
  }

  // 3. If asking about training or Zoo Desktop -> Local Private AI widget
  else if (t.includes('train') || t.includes('local') || t.includes('desktop') || t.includes('private') || t.includes('my laptop')) {
    if (!widgets.some(w => w.type === 'local-ai')) {
      widgets.push({
        type: 'local-ai',
        title: 'Zoo Desktop — Private Home Companion',
        data: {
          status: 'Local Ready',
          features: [
            'Zero cloud upload: Your homework & pet stories stay on your laptop',
            'BitDelta Personalization: Blue learns your favorite topics privately',
            'Offline mode: Play and chat anywhere without internet',
          ],
        },
      })
    }
    quickPrompts.push(
      { icon: '🔒', label: 'How does private AI work?', prompt: 'How does Zoo Desktop keep all my conversations private on my computer?' },
      { icon: '🐾', label: 'Teach Blue my pets', prompt: 'I want to teach Blue about my dog and my favorite hobbies!' }
    )
  }

  // 4. Default: Animal Fact Card & Quiz
  else {
    if (!widgets.some(w => w.type === 'fact-card')) {
      widgets.push({
        type: 'fact-card',
        title: 'Beluga Whale (Delphinapterus leucas)',
        data: {
          nickname: 'Sea Canary',
          diet: 'Salmon, cod, squid & arctic crab',
          superpower: 'Flexible melon forehead that changes shape to steer soundwaves!',
          habitat: 'Arctic & sub-Arctic ice waters',
        },
      })
    }
    if (!widgets.some(w => w.type === 'quiz')) {
      widgets.push({
        type: 'quiz',
        title: 'Quick Wildlife Mystery 🔍',
        data: {
          question: 'Why are baby beluga whales born gray instead of white?',
          options: [
            'For camouflage against ocean rocks and mud',
            'Because they eat too much sea kelp',
            'To absorb extra sunlight in summer',
          ],
          correct: 0,
          explanation: 'Calves are born dark gray/brown and turn pure white over 5-7 years as they grow!',
        },
      })
    }
    if (tasks.length === 0) {
      tasks.push(
        { title: 'Discovered Sea Canary nickname', done: true },
        { title: 'Explored Arctic melon echolocation', done: false }
      )
    }
    quickPrompts.push(
      { icon: '🐋', label: 'Why are they white?', prompt: 'Why do adult belugas turn bright white in the Arctic?' },
      { icon: '🐬', label: 'Do they have friends?', prompt: 'Do belugas swim with other whales like narwhals or orcas?' },
      { icon: '🎵', label: 'Hear whale chirp', prompt: 'What does a mother beluga sound like calling her baby?' }
    )
  }

  return {
    cleanText,
    emotion,
    tasks,
    widgets,
    quickPrompts,
    badgeEarned,
  }
}

export async function getBackendBaseUrl(): Promise<string> {
  const localUrl = 'http://localhost:8000'
  try {
    const res = await fetch(`${localUrl}/v1/models`, { method: 'GET', signal: AbortSignal.timeout(600) })
    if (res.ok) return localUrl
  } catch {
    // fallback to cloud
  }
  return process.env.NEXT_PUBLIC_HANZO_API_URL || 'https://api.hanzo.ai'
}

export async function streamChatCompletion({
  messages,
  model = 'zen4-coder-pro',
  temperature = 0.7,
  onToken,
  onThought,
  onDone,
  onError,
}: {
  messages: ChatMessage[]
  model?: string
  temperature?: number
  onToken: (token: string) => void
  onThought?: (thought: string) => void
  onDone: (fullText: string) => void
  onError?: (err: Error) => void
}) {
  const baseUrl = await getBackendBaseUrl()
  let fullText = ''

  try {
    const response = await fetch(`${baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('hanzo_token') || 'zoo-sovereign-key' : ''}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        stream: true,
      }),
    })

    if (!response.ok || !response.body) {
      const json = await response.json().catch(() => ({}))
      const content = json.choices?.[0]?.message?.content || generateIntelligentResponse(messages)
      for (const char of content.split(' ')) {
        onToken(char + ' ')
        await new Promise((r) => setTimeout(r, 20))
      }
      onDone(content)
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        const trimmed = line.trim()
        if (!trimmed || trimmed === 'data: [DONE]') continue
        if (trimmed.startsWith('data: ')) {
          try {
            const data = JSON.parse(trimmed.slice(6))
            const token = data.choices?.[0]?.delta?.content || ''
            if (token) {
              fullText += token
              onToken(token)
            }
          } catch {
            // ignore non-json SSE lines
          }
        }
      }
    }

    if (!fullText) {
      fullText = generateIntelligentResponse(messages)
      onDone(fullText)
    } else {
      onDone(fullText)
    }
  } catch (err: any) {
    console.warn('[Hanzo AI] Stream fallback:', err.message)
    const fallbackText = generateIntelligentResponse(messages)
    for (const word of fallbackText.split(' ')) {
      onToken(word + ' ')
      await new Promise((r) => setTimeout(r, 20))
    }
    onDone(fallbackText)
  }
}

function generateIntelligentResponse(messages: ChatMessage[]): string {
  const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || ''

  if (lastMsg.includes('who are you') || lastMsg.includes('what are you') || lastMsg.includes('blue')) {
    return "I'm Blue — your friendly open-source Beluga whale companion from Zoo Labs Foundation! I love singing underwater songs, exploring Arctic oceans, and helping kids and researchers learn biology, code cool apps, and build their own wildlife knowledge book."
  }
  if (lastMsg.includes('vibe') || lastMsg.includes('friends') || lastMsg.includes('pod')) {
    return "In the /vibe multiplayer studio, you and your friends can chat together, vote on ideas in live polls, listen to 120kHz ocean songs, and build mini-apps together live!"
  }
  if (lastMsg.includes('video') || lastMsg.includes('film') || lastMsg.includes('camera')) {
    return "Zoo Video creates cinematic nature scenes of Arctic whales, snow leopards, and coral reefs with smooth drone camera motions!"
  }
  if (lastMsg.includes('music') || lastMsg.includes('song') || lastMsg.includes('sound') || lastMsg.includes('chirp')) {
    return "Belugas are called the 'Canaries of the Sea' because we make over 50 different high-pitched whistles, clicks, bell-like rings, and squeaks to talk to our pod!"
  }
  if (lastMsg.includes('3d') || lastMsg.includes('mesh') || lastMsg.includes('splat')) {
    return "Zoo 3D lets you orbit around interactive animal models and ocean coral reefs right in your web browser!"
  }
  if (lastMsg.includes('train') || lastMsg.includes('desktop') || lastMsg.includes('private')) {
    return "With Zoo Desktop, you can run your own private animal friend on your laptop without internet! You can teach Blue your pet names, favorite hobbies, and science notes with zero files sent to the cloud."
  }

  return `I loved exploring "${messages[messages.length - 1]?.content}" with you! Beluga whales are super curious, just like you. Let's check our field tasks and see what other ocean mysteries we can uncover!`
}
