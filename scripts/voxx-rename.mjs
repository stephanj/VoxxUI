#!/usr/bin/env node
/**
 * VoxxUI rename pass: primeng -> voxx-ui / @voxxui, p-* selectors -> vx-*,
 * pXxx directives -> vxXxx, providePrimeNG -> provideVoxxUI.
 *
 * Deliberately does NOT touch:
 *  - `.p-*` CSS classes and `--p-*` tokens: they are defined in the external
 *    @primeuix/styles|styled|themes packages, not in this repo. The variable
 *    prefix is configurable at app level (theme.options.prefix); the class
 *    names would require forking PrimeUIX. See docs/CFP-COMPONENT-AUDIT.md.
 *  - `pi pi-*` icon classes (external `primeicons` package).
 *  - `data-pc-*` attributes (derived from component names at runtime).
 *  - LICENSE.md / README.md prose — license hygiene is a separate manual pass.
 *
 * Usage:
 *   node scripts/voxx-rename.mjs          # dry run: per-rule counts + files
 *   node scripts/voxx-rename.mjs --write  # apply in place
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, extname, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const WRITE = process.argv.includes('--write');

const SCAN_DIRS = ['packages', 'apps'];
const ROOT_FILES = ['package.json', 'tsconfig.json', 'eslint.config.js', 'commitlint.config.ts'];
const SKIP_DIRS = new Set(['node_modules', 'dist', '.angular', '.git', 'coverage']);
const EXTS = new Set(['.ts', '.mts', '.html', '.json', '.js', '.mjs', '.md', '.scss', '.css']);

// Rewrites the parts of an Angular `selector:` string: 'p-button' -> 'vx-button',
// '[pButton]' -> '[vxButton]'; leaves anything else (e.g. 'input[type=text]') alone.
const mapSelector = (sel) =>
    sel
        .split(',')
        .map((part) => part.trim().replace(/^p-/, 'vx-').replace(/^\[p(?=[A-Z])/, '[vx'))
        .join(', ');

// Each rule: name, file-extension gate, regex, replacement.
const RULES = [
    // -- package identity & import paths ------------------------------------
    { name: 'scoped package @primeng/* -> @voxxui/*', exts: null, re: /@primeng\//g, to: '@voxxui/' },
    { name: "import path 'primeng/x' -> 'voxx-ui/x'", exts: ['.ts', '.mts', '.js', '.mjs', '.html', '.md'], re: /(['"])primeng\//g, to: '$1voxx-ui/' },
    { name: 'json key/path "primeng" -> "voxx-ui"', exts: ['.json'], re: /"primeng(?=[/"])/g, to: '"voxx-ui' },
    { name: 'pnpm --filter primeng -> voxx-ui', exts: ['.json'], re: /--filter primeng\b/g, to: '--filter voxx-ui' },
    // -- public config API ---------------------------------------------------
    { name: 'providePrimeNG -> provideVoxxUI', exts: null, re: /\bprovidePrimeNG\b/g, to: 'provideVoxxUI' },
    { name: 'PRIME_NG_CONFIG -> VOXX_UI_CONFIG', exts: null, re: /\bPRIME_NG_CONFIG\b/g, to: 'VOXX_UI_CONFIG' },
    { name: 'PrimeNG* identifiers -> VoxxUI*', exts: ['.ts', '.mts', '.html'], re: /\bPrimeNG([A-Za-z]*)\b/g, to: 'VoxxUI$1' },
    // -- selectors -----------------------------------------------------------
    {
        name: "selector: 'p-x' / '[pX]' -> vx",
        exts: ['.ts', '.mts'],
        re: /(selector:\s*)(['"`])([^'"`]+)\2/g,
        to: (_m, pre, q, sel) => `${pre}${q}${mapSelector(sel)}${q}`
    },
    { name: 'exportAs pXxx -> vxXxx', exts: ['.ts', '.mts'], re: /(exportAs:\s*['"`])p(?=[A-Z])/g, to: '$1vx' },
    { name: 'template tags <p-x> -> <vx-x>', exts: ['.ts', '.mts', '.html', '.md'], re: /<(\/?)p-(?=[a-zA-Z])/g, to: '<$1vx-' },
    { name: 'directive/input tokens pXxx -> vxXxx', exts: ['.ts', '.mts', '.html'], re: /\bp([A-Z][A-Za-z0-9]*)\b/g, to: 'vx$1' },
    // -- test selector queries ----------------------------------------------
    { name: "By.css('p-x') / querySelector('p-x')", exts: ['.ts', '.mts'], re: /((?:By\.css|querySelector(?:All)?|createElement)\(\s*['"`])p-(?=[a-z])/g, to: '$1vx-' }
];

function* walk(dir) {
    for (const entry of readdirSync(dir)) {
        if (SKIP_DIRS.has(entry)) continue;
        const full = join(dir, entry);
        const st = statSync(full);
        if (st.isDirectory()) yield* walk(full);
        else if (EXTS.has(extname(entry))) yield full;
    }
}

const files = [
    ...ROOT_FILES.map((f) => join(ROOT, f)).filter((f) => { try { return statSync(f).isFile(); } catch { return false; } }),
    ...SCAN_DIRS.flatMap((d) => { try { return [...walk(join(ROOT, d))]; } catch { return []; } })
];

const counts = Object.fromEntries(RULES.map((r) => [r.name, 0]));
let changedFiles = 0;

for (const file of files) {
    const ext = extname(file);
    const before = readFileSync(file, 'utf8');
    let after = before;
    for (const rule of RULES) {
        if (rule.exts && !rule.exts.includes(ext)) continue;
        const matches = after.match(rule.re);
        if (!matches) continue;
        counts[rule.name] += matches.length;
        after = after.replace(rule.re, rule.to);
    }
    if (after !== before) {
        changedFiles++;
        if (WRITE) writeFileSync(file, after);
        else console.log(`would change: ${relative(ROOT, file)}`);
    }
}

console.log(`\n${WRITE ? 'Applied' : 'Dry run'} — ${changedFiles} files:`);
for (const [name, n] of Object.entries(counts)) console.log(`  ${String(n).padStart(6)}  ${name}`);

console.log(`
Manual follow-ups the script does not attempt:
  - package.json metadata: author, description, homepage, repository, bugs, keywords
  - PrimeTemplate class name (the pTemplate ATTRIBUTE is renamed; the class is not)
  - 'primeicons' dependency and 'pi pi-*' icon classes (external package, kept)
  - .p-* CSS classes / --p-* tokens (external @primeuix packages — see audit doc;
    set theme.options.prefix = 'vx' at app level for the CSS variables)
  - showcase branding: logos, primeng.org URLs, LICENSE.md, README.md
  - optionally rename the packages/primeng directory itself (imports don't require it)
After --write: pnpm run format && pnpm run build:lib && pnpm run test:unit`);
