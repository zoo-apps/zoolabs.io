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
