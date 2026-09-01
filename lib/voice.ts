// Blue out loud.
//
// The clips are silent — one of the twenty-nine carries an audio track — so
// there is no sound to unmute. The voice is the browser's own synthesiser,
// which every modern one ships, needs no network and no key, and reads at
// whatever rate we ask. For a reader who is eight, that is the difference
// between a paragraph and a wall.

export const canSpeak = () =>
  typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined'

/** Strip what should not be read: markdown scaffolding and bare URLs. */
export function sayable(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/[*_`#>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/** A voice that suits the character, if the platform has one. */
function pick(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices()
  const english = voices.filter((v) => v.lang.startsWith('en'))
  return english.find((v) => /female|samantha|karen|moira/i.test(v.name)) ?? english[0] ?? voices[0]
}

/** Reads text aloud, cancelling anything already in progress. */
export function say(text: string) {
  if (!canSpeak()) return
  const words = sayable(text)
  if (!words) return

  window.speechSynthesis.cancel()
  const line = new SpeechSynthesisUtterance(words)
  line.rate = 0.95
  line.pitch = 1.1
  const voice = pick()
  if (voice) line.voice = voice
  window.speechSynthesis.speak(line)
}

export function hush() {
  if (canSpeak()) window.speechSynthesis.cancel()
}
