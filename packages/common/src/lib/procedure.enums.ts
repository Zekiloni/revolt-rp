export const enum ProcedureKey {
  BROWSER_SHOW_GAME_INTERFACE = 'browser_showGameInterface',
  BROWSER_HIDE_GAME_INTERFACE = 'browser_hideGameInterface',
  BROWSER_AUTH_SUGGEST = 'browser_authSuggestion',

  SERVER_PLAYER_CREATE_ACCOUNT = 'server_playerCreateAccount',
  SERVER_PLAYER_AUTHORIZE = 'server_playerAuthorize',
  SERVER_PLAYER_CREATE_CHARACTER = 'server_playerCreateCharacter',
  SERVER_PLAYER_SELECT_CHARACTER = 'server_playerSelectCharacter',

  CLIENT_TOGGLE_PLAYER_AUTHORIZATION = 'client_togglePlayerAuthorization',
  CLIENT_TOGGLE_CHARACTER_CREATOR = "client_toggleCharacterCreator",
  CLIENT_CREATOR_UPDATE_HEAD_BLEND_DATA = "client_creatorUpdateHeadBlendData",
  CLIENT_CREATOR_CHANGE_PED_MODEL = "client_creatorChangePedModel",

  CLIENT_PLAYER_ENTER_VEHICLE = 'client_playerEnterVehicle',
}
