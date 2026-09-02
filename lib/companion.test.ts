import assert from 'node:assert/strict'
import { existsSync, readdirSync } from 'node:fs'
import { test } from 'node:test'
import { clipFor, FEELINGS, read, RESTING, visible } from './companion.ts'

const asset = (url: string) => `public${url}`

test('every feeling Blue can show has a clip on disk', () => {
  for (const feeling of FEELINGS) {
    assert.ok(existsSync(asset(clipFor(feeling))), `missing clip for ${feeling}`)
  }
})

test('every clip on disk is a feeling Blue can show', () => {
  const onDisk = readdirSync('public/bg_video/emotion')
    .filter((f) => f.endsWith('.mp4'))
    .map((f) => f.replace('.mp4', ''))
  assert.deepEqual([...onDisk].sort(), [...FEELINGS].sort())
})

test('resting clips exist', () => {
  for (const url of RESTING) assert.ok(existsSync(asset(url)), `missing ${url}`)
})

test('reads the feeling off a reply and keeps the prose', () => {
  const { text, feeling } = read('Calves are born grey.\n\n[feeling: Interest]')
  assert.equal(text, 'Calves are born grey.')
  assert.equal(feeling, 'Interest')
})

test('a reply with no tag leaves the feeling alone', () => {
  assert.deepEqual(read('Just prose.'), { text: 'Just prose.', feeling: null })
})

test('an unknown feeling is refused rather than shown', () => {
  assert.equal(read('Hi.\n[feeling: Hungry]').feeling, null)
})

test('a half-arrived tag stays hidden while streaming', () => {
  assert.equal(visible('Sound moves faster in water.\n\n[feeli'), 'Sound moves faster in water.')
  assert.equal(visible('Sound moves faster in water.'), 'Sound moves faster in water.')
})

test('what gets read aloud drops the scaffolding, not the sentence', async () => {
  const { sayable } = await import('./voice.ts')
  assert.equal(sayable('**Calves** are grey.'), 'Calves are grey.')
  assert.equal(sayable('See https://zoo.ngo for more.'), 'See for more.')
  assert.equal(sayable('Try this:\n```js\nconst a = 1\n```\nDone.'), 'Try this: Done.')
  assert.equal(sayable('   '), '')
})

// A 3B model writes the tag its own way. The feeling still lands, and the
// bracket never survives into what a child reads.
test('a tag the model spelled its own way still lands', () => {
  assert.deepEqual(read('Calves start grey.\n[Calmness: Blue]'), {
    text: 'Calves start grey.',
    feeling: 'Calmness',
  })
  assert.deepEqual(read('Sound carries.\n[Interest]'), {
    text: 'Sound carries.',
    feeling: 'Interest',
  })
  assert.deepEqual(read('Ice is thinning.\n[ feeling = Sadness ]'), {
    text: 'Ice is thinning.',
    feeling: 'Sadness',
  })
})

test('a bracket that is the reply own prose is left alone', () => {
  const cite = 'Belugas use echolocation [see the 2019 survey]'
  assert.deepEqual(read(cite), { text: cite, feeling: null })
})
