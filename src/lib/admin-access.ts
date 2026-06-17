import type { User } from 'firebase/auth'

export const ADMIN_CLAIM_KEY = 'isAdmin'
export const ADMIN_ROLE_CLAIM_KEY = 'adminRole'
export const ADMIN_ROLE = 'admin'

export interface AdminClaims {
  isAdmin: boolean
  adminRole?: string
}

export const isAdminClaims = (claims: Record<string, unknown>): claims is Record<string, unknown> & AdminClaims => {
  return claims[ADMIN_CLAIM_KEY] === true
}

export const getAdminClaims = async (
  user: User,
  forceRefresh = false,
): Promise<AdminClaims> => {
  const tokenResult = await user.getIdTokenResult(forceRefresh)

  return {
    isAdmin: isAdminClaims(tokenResult.claims),
    adminRole:
      typeof tokenResult.claims[ADMIN_ROLE_CLAIM_KEY] === 'string'
        ? String(tokenResult.claims[ADMIN_ROLE_CLAIM_KEY])
        : undefined,
  }
}

export const hasAdminAccess = async (user: User, forceRefresh = false) => {
  if (!user || user.isAnonymous) return false

  const claims = await getAdminClaims(user, forceRefresh)
  return claims.isAdmin
}
