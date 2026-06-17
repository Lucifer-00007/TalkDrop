import admin from 'firebase-admin'

const [, , action, ...targets] = process.argv

const validActions = new Set(['grant', 'revoke'])

if (!validActions.has(action) || targets.length === 0) {
  console.error(
    'Usage: node scripts/set-admin-claims.mjs <grant|revoke> <email-or-uid> [more-email-or-uid...]',
  )
  process.exit(1)
}

const getRequiredEnv = (name) => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

const projectId = getRequiredEnv('FIREBASE_ADMIN_PROJECT_ID')
const clientEmail = getRequiredEnv('FIREBASE_ADMIN_CLIENT_EMAIL')
const privateKey = getRequiredEnv('FIREBASE_ADMIN_PRIVATE_KEY').replace(/\\n/g, '\n')

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  })
}

const auth = admin.auth()

const getUserRecord = async (target) => {
  if (target.includes('@')) {
    return auth.getUserByEmail(target)
  }

  return auth.getUser(target)
}

const updateClaims = async (target) => {
  const user = await getUserRecord(target)
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
}

const main = async () => {
  for (const target of targets) {
    await updateClaims(target)
  }

  console.log('Done. The affected users should sign out and sign back in to refresh their ID tokens.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
