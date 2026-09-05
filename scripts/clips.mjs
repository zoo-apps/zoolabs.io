// Stamp every clip's URL with a hash of its own bytes, before the build.
//
// A CDN caches by URL. `/bg_video/emotion/Happiness.mp4` is the same URL after
// the file behind it changes, so a visitor keeps whatever they were served the
// first time — for a day, by the origin's own max-age. That is not theoretical
// here: these files shipped for weeks as 132-byte Git LFS pointers, and when
// the real 6.5MB clips finally reached the origin the edge went on serving the
// pointers. Blue was a black screen and every layer said it was fine.
//
// Purging is the other answer and it is worse: it needs a credential at deploy
// time, it is a step someone has to remember, and it throws away the whole
// zone's cache to fix one file. A URL that names its own contents needs
// nothing, cannot be forgotten, and re-downloads exactly the clips that
// actually changed.
//
// Written to a JSON file the app imports, so the hash is computed ONCE per
// build rather than by every page, and a page with JavaScript off still has
// the right URL in its markup.

import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const PUBLIC = 'public'
const HERE = ['bg_video/emotion', 'bg_video/static']

const stamp = (file) => createHash('sha256').update(readFileSync(file)).digest('hex').slice(0, 8)

const clips = {}
for (const dir of HERE) {
  for (const name of readdirSync(join(PUBLIC, dir)).sort()) {
    if (!name.endsWith('.mp4')) continue
    clips[`/${dir}/${name}`] = `/${dir}/${name}?v=${stamp(join(PUBLIC, dir, name))}`
  }
}

writeFileSync('lib/clips.json', JSON.stringify(clips, null, 2) + '\n')
console.log(`clips.json — ${Object.keys(clips).length} clips stamped`)
