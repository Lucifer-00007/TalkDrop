export const ROOM_ID_QUERY_PARAM = 'roomid'

export const normalizeRoomId = (roomId: string | string[] | null | undefined) => {
  const value = Array.isArray(roomId) ? roomId[0] : roomId
  return typeof value === 'string' ? value.trim() : ''
}

export const getRoomPath = (roomId: string) => {
  const params = new URLSearchParams({
    [ROOM_ID_QUERY_PARAM]: normalizeRoomId(roomId),
  })

  return `/room?${params.toString()}`
}

export const getRoomUrl = (origin: string, roomId: string) => {
  return new URL(getRoomPath(roomId), origin).toString()
}
