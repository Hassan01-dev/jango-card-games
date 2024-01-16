export type CreateGameSettingType = {
  playerCount: number
  requirePassword: boolean
  roomName: string
  roomPassword: string
}

export type JoinGameSettingType = {
  requirePassword: boolean
  roomName: string
  roomPassword: string
}
