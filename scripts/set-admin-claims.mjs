import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pkg from '@next/env'
const { loadEnvConfig } = pkg
import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
loadEnvConfig(path.resolve(__dirname, '..'))

const [, , action, ...targets] = process.argv

const validActions = new Set(['grant', 'revoke', 'list'])

if (!validActions.has(action) || (action !== 'list' && targets.length === 0)) {
  console.error(
    'Usage: node scripts/set-admin-claims.mjs <grant|revoke> <email-or-uid> [more-email-or-uid...]',
  )
  console.error('       node scripts/set-admin-claims.mjs list')
  process.exit(1)
}

const getRequiredEnv = (name) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const projectId = getRequiredEnv('FIREBASE_PROJECT_ID')
const clientEmail = getRequiredEnv('FIREBASE_CLIENT_EMAIL')
const privateKey = getRequiredEnv('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
const databaseURL = process.env.FIREBASE_DATABASE_URL
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

if (!admin.getApps().length) {
  admin.initializeApp({
    credential: admin.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
    ...(databaseURL ? { databaseURL } : {}),
    ...(storageBucket ? { storageBucket } : {}),
  })
}

const auth = getAuth(admin.getApps()[0])

const getUserRecord = async (target) => {
  if (target.includes('@')) {
    return auth.getUserByEmail(target)
  }

  return auth.getUser(target)
}

const updateClaims = async (target) => {
  let user

  try {
    user = await getUserRecord(target)
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      const identifier = target.includes('@') ? `email "${target}"` : `UID "${target}"`
      console.error(
        `Error: No Firebase user found for ${identifier}.\n` +
          '       Create the user first in Firebase Console → Authentication → Users,\n' +
          '       or have them sign in once via the app, then re-run this command.',
      )
      return false
    }
    throw error
  }

  const existingClaims = user.customClaims || {}
  const nextClaims = { ...existingClaims }

  if (action === 'grant') {
    nextClaims.isAdmin = true
    nextClaims.adminRole = 'admin'
  } else {
    delete nextClaims.isAdmin
    delete nextClaims.adminRole
  }

  await auth.setCustomUserClaims(
    user.uid,
    Object.keys(nextClaims).length > 0 ? nextClaims : null,
  )

  console.log(
    `${action === 'grant' ? 'Granted' : 'Revoked'} admin claim for ${user.email || user.uid} (${user.uid})`,
  )
  return true
}

const listUsers = async () => {
  const result = await auth.listUsers(1000)
  console.log(`Found ${result.users.length} user(s):\n`)
  for (const user of result.users) {
    const claims = user.customClaims || {}
    const isAdmin = claims.isAdmin === true
    console.log(`  ${user.email || user.uid}`)
    console.log(`    UID:      ${user.uid}`)
    console.log(`    Admin:    ${isAdmin ? 'YES' : 'no'}`)
    if (claims.adminRole) {
      console.log(`    Role:     ${claims.adminRole}`)
    }
    console.log('')
  }
  if (!result.users.some((u) => (u.customClaims || {}).isAdmin)) {
    console.log('No users have admin claims. Run: npm run admin:claims -- grant <email>')
  }
}

const main = async () => {
  if (action === 'list') {
    await listUsers()
    return
  }

  let updated = 0
  for (const target of targets) {
    const success = await updateClaims(target)
    if (success) updated++
  }

  if (updated > 0) {
    console.log('Done. The affected users should sign out and sign back in to refresh their ID tokens.')
  } else {
    console.log('\nNo users were updated.')
    process.exit(1)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
