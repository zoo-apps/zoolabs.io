// Builds public/research.json from the Zoo corpus on disk: LaTeX papers
// (zooai/papers) and Markdown proposals (zooai/ZIPs). Titles and abstracts
// are read from the sources — nothing here is written by hand.
//
//   node scripts/research.mjs [papersDir] [zipsDir]

import { readFileSync, readdirSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { join, basename } from 'node:path'

const papersDir = process.argv[2] ?? '../../zooai/papers'
const zipsDir = process.argv[3] ?? '../../zooai/ZIPs/ZIPs'

// Text-bearing LaTeX commands: keep the argument, drop the command.
const KEEP = /\\(?:textbf|textit|textsc|texttt|textrm|textsf|emph|mbox|text|uppercase|MakeUppercase)\s*\{/

// \newcommand{\Zoo}{Zoo Network} style macros, so their text survives.
const macros = (tex) => {
  const map = new Map()
  const re = /\\(?:newcommand|renewcommand|def)\s*\{?\\([a-zA-Z]+)\}?(?:\[\d+\])?\s*\{/g
  for (const m of tex.matchAll(re)) {
    let depth = 1
    let i = m.index + m[0].length
    for (; i < tex.length && depth; i++) {
      if (tex[i] === '{') depth++
      else if (tex[i] === '}') depth--
    }
    map.set(m[1], tex.slice(m.index + m[0].length, i - 1))
  }
  return map
}

const expand = (s, map) => {
  let out = s
  for (let i = 0; i < 4; i++) {
    out = out.replace(/\\([a-zA-Z]+)(\{\})?/g, (all, name) => (map.has(name) ? map.get(name) : all))
  }
  return out
}

const strip = (s, map = new Map()) => {
  let out = expand(s, map).replace(/(^|[^\\])%.*$/gm, '$1')      // comments
  for (let i = 0; i < 6 && KEEP.test(out); i++) {
    out = out.replace(new RegExp(KEEP.source + '([^{}]*)\\}'), '$1')
  }
  return out
    .replace(/\\(?:thanks|footnote|label|vspace|hspace)\s*\{[^{}]*\}/g, '')
    .replace(/\\\\\s*\[[^\]]*\]/g, ' ')          // \\[0.5em]
    .replace(/\\\\|\\newline|\\par/g, ' ')
    .replace(/\$[^$]*\$/g, '')
    .replace(/\\([%&$#_])/g, '$1')
    .replace(/\\[a-zA-Z]+\s*/g, '')
    .replace(/[{}~]/g, '')
    .replace(/--/g, '\u2013')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^[.,:;\u2013\s]+|[.,:;]$/g, '')
}

const detex = strip

const field = (tex, name, map) => {
  const at = tex.indexOf(`\\${name}{`)
  if (at < 0) return ''
  let depth = 0
  for (let i = at + name.length + 1; i < tex.length; i++) {
    if (tex[i] === '{') depth++
    else if (tex[i] === '}' && --depth === 0) return strip(tex.slice(at + name.length + 2, i), map)
  }
  return ''
}

const abstract = (tex, map) => {
  const m = tex.match(/\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/)
  return m ? strip(m[1], map).slice(0, 420) : ''
}

const dirs = (d) =>
  existsSync(d) ? readdirSync(d).filter((f) => statSync(join(d, f)).isDirectory()) : []

const skip = new Set(['figures', 'pdfs', 'site', 'shared'])

const papers = dirs(papersDir)
  .filter((d) => !skip.has(d))
  .flatMap((dir) => {
    const tex = readdirSync(join(papersDir, dir)).filter((f) => f.endsWith('.tex'))
    const main =
      tex.find((f) => basename(f, '.tex') === dir) ??
      tex.find((f) => readFileSync(join(papersDir, dir, f), 'utf8').includes('\\documentclass'))
    if (!main) return []
    const src = readFileSync(join(papersDir, dir, main), 'utf8')
    const map = macros(src)
    const title = field(src, 'title', map).split(/\s+(?:Zach Kelling|Antje Worring)/)[0].trim()
    if (!title) return []
    return [{
      kind: 'paper',
      id: dir,
      title,
      summary: abstract(src, map),
      url: `https://github.com/zooai/papers/tree/main/${dir}`,
    }]
  })

const zips = (existsSync(zipsDir) ? readdirSync(zipsDir) : [])
  .filter((f) => f.endsWith('.md'))
  .flatMap((file) => {
    const src = readFileSync(join(zipsDir, file), 'utf8')
    const head = src.match(/^---\n([\s\S]*?)\n---/)
    if (!head) return []
    const meta = Object.fromEntries(
      head[1].split('\n').flatMap((line) => {
        const m = line.match(/^(\w+):\s*(.*)$/)
        return m ? [[m[1], m[2].replace(/^["']|["']$/g, '').trim()]] : []
      })
    )
    if (!meta.title) return []
    const body = src.match(/##\s*Abstract\s*\n+([\s\S]*?)(?=\n##\s)/)
    return [{
      kind: 'zip',
      id: `ZIP-${Number(meta.zip)}`,
      title: meta.title,
      summary: body ? body[1].replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim().slice(0, 420) : '',
      topic: meta.category || meta.type || '',
      status: meta.status || '',
      url: `https://zips.zoo.ngo/${basename(file, '.md')}`,
    }]
  })
  .sort((a, b) => Number(a.id.slice(4)) - Number(b.id.slice(4)))

const out = { papers, zips }
writeFileSync('public/research.json', JSON.stringify(out))
console.log(`research.json — ${papers.length} papers, ${zips.length} proposals`)
