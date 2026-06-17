const getErrorCode = (error: unknown) => {
  if (!error || typeof error !== 'object' || !('code' in error)) {
    return ''
  }

  return String(error.code ?? '')
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message.toLowerCase()
  }

  return String(error).toLowerCase()
}

export const isPermissionDeniedError = (error: unknown) => {
  const code = getErrorCode(error)

  return (
    code === 'permission-denied' ||
    code === 'auth/permission-denied' ||
    code.endsWith('/permission-denied') ||
    getErrorMessage(error).includes('permission denied')
  )
}

export const getAdminReadErrorMessage = (error: unknown) => {
  if (isPermissionDeniedError(error)) {
    return 'Firebase rejected this admin read. Verify this account still has the required admin claim and refresh the ID token.'
  }

  return 'Unable to load admin data right now. Try again in a moment.'
}

export const getAdminActionErrorMessage = (error: unknown) => {
  if (isPermissionDeniedError(error)) {
    return 'Firebase rejected this admin action. Verify this account still has the required admin claim and refresh the ID token.'
  }

  return 'Unable to complete that admin action right now. Try again in a moment.'
}
