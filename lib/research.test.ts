import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { search, type Corpus } from './research.ts'

const corpus: Corpus = JSON.parse(readFileSync('public/research.json', 'utf8'))
const everything = [...corpus.papers, ...corpus.zips]

test('the corpus is not empty and nothing in it is nameless', () => {
  assert.ok(corpus.papers.length > 50, `only ${corpus.papers.length} papers`)
  assert.ok(corpus.zips.length > 100, `only ${corpus.zips.length} proposals`)
  for (const work of everything) {
    assert.ok(work.title.trim(), `${work.id} has no title`)
    assert.ok(work.id.trim(), 'a work has no id')
  }
})

// Both link shapes were wrong once: proposals pointed at zips.zoo.ngo/<slug>,
// which 404s — the site serves them under /docs/<slug>/. Shape is what a test
// can hold; that these hosts are reachable is checked by opening them.
test('every proposal links to the page zips.zoo.ngo actually serves', () => {
  for (const zip of corpus.zips) {
    assert.match(zip.url, /^https:\/\/zips\.zoo\.ngo\/docs\/zip-[\w-]+\/$/, `${zip.id}: ${zip.url}`)
  }
})

test('every paper links into the papers repository', () => {
  for (const paper of corpus.papers) {
    assert.match(paper.url, /^https:\/\/github\.com\/zooai\/papers\/tree\/main\/[\w.-]+$/, paper.url)
  }
})

test('no two works share an id', () => {
  const ids = everything.map((w) => w.id)
  assert.equal(new Set(ids).size, ids.length)
})

test('search needs every term, and prefers titles', () => {
  const hits = search(corpus.papers, 'beluga')
  assert.ok(hits.length > 0 && hits.length < corpus.papers.length)
  assert.match(hits[0].title.toLowerCase(), /beluga/)

  assert.deepEqual(search(corpus.papers, 'beluga zzzznotaword'), [])
  assert.equal(search(corpus.papers, '   ').length, corpus.papers.length)
})
