/**
 * Line-count linter for source files under ./src.
 *
 * Scans every file inside ./src (excluding ./src/components/ui/) and reports
 * any file that exceeds the configured line threshold. Large files are harder
 * to navigate, review, and maintain, so the script ends with actionable
 * refactoring guidance.
 *
 * Usage:
 *   node scripts/check-file-sizes.mjs
 *
 * Exit code:
 *   0  - all files within the limit
 *   1  - one or more files exceeded the limit
 */

import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

// --- Configuration ---------------------------------------------------------
const SRC_DIR = path.join(projectRoot, 'src')
const IGNORE_DIRS = ['components/ui'] // relative to SRC_DIR
const MAX_LINES = 500
// ---------------------------------------------------------------------------

/**
 * Recursively collect file paths under a directory, skipping any directory
 * whose relative path matches an entry in ignoreDirs.
 */
function collectFiles(dir, baseDir, ignoreDirs, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      const relPath = path.relative(baseDir, fullPath)
      const shouldIgnore = ignoreDirs.some(
        (ignore) => relPath === ignore || relPath.startsWith(ignore + path.sep)
      )
      if (!shouldIgnore) {
        collectFiles(fullPath, baseDir, ignoreDirs, files)
      }
    } else if (entry.isFile()) {
      files.push(fullPath)
    }
  }

  return files
}

/**
 * Count the number of lines in a file (newline-delimited).
 * A trailing newline does not create an extra empty line.
 */
function countLines(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  if (content.length === 0) return 0
  return content.split('\n').length
}

// --- Main ------------------------------------------------------------------

const files = collectFiles(SRC_DIR, SRC_DIR, IGNORE_DIRS)

const offenders = files
  .map((file) => {
    const lines = countLines(file)
    const relPath = path.relative(projectRoot, file)
    return { file: relPath, lines }
  })
  .filter((entry) => entry.lines > MAX_LINES)
  .sort((a, b) => b.lines - a.lines) // largest first

console.log(`\nScanned ${files.length} files under src/ (excluding src/components/ui/)\n`)

if (offenders.length === 0) {
  console.log(`✓ All files are within the ${MAX_LINES}-line limit.\n`)
  process.exit(0)
}

// Report each offending file with its line count
console.log(`✗ ${offenders.length} file${offenders.length > 1 ? 's' : ''} exceed ${MAX_LINES} lines:\n`)
for (const { file, lines } of offenders) {
  console.log(`   ${String(lines).padStart(5)} lines  ${file}`)
}

// Refactoring recommendation
console.log('\n─'.repeat(60))
console.log('Recommendation: split large files into smaller modules\n')
console.log('For each file above, consider the following steps:')
console.log('  1. Create a folder named after the file (e.g. userListing.tsx')
console.log('     → create a folder named userListing/).')
console.log('  2. Move the related modular pieces into that folder as separate')
console.log('     files (components, hooks, utils, types, etc.).')
console.log('  3. Add an index file (index.ts / index.tsx) inside the new folder')
console.log('     that re-exports the public API for clean imports.')
console.log('  4. Delete the original file after the refactor is complete.')
console.log('  5. Update all imports that referenced the old file so they point')
console.log('     to the new module structure (the index file keeps import')
console.log('     paths unchanged in most cases).\n')

process.exit(1)
