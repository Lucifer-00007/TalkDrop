import { existsSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const legacyRoomExportDir = path.join(projectRoot, 'out', 'room')

if (existsSync(legacyRoomExportDir)) {
  rmSync(legacyRoomExportDir, { recursive: true, force: true })
  console.log(`Removed legacy exported room pages at ${legacyRoomExportDir}`)
} else {
  console.log('No legacy exported room pages found to clean up.')
}
