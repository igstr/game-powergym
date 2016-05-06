
// Game main namespace
var PowerGym = {

  DEBUG_MODE: false,

  MAIN_MENU_DISABLED: false,

  MAX_ASPECT_RATIO: 2.4,

  MIN_ASPECT_RATIO: 4/3,

  ORIGINAL_HEIGHT: 600,

  States: {},

  Prefabs: {},

  Mixins: {},

  Network: {},

  // Input keys
  Keys: {},

  // User save data and preferences
  UserData: {

    Scores: {},

    Stats: {

      overallScore: 0,
      overallLvl1Score: 0,
      overallLvl2Score: 0,
      overallLvl3Score: 0,
      overallLvl4Score: 0,
      overallReps: 0,
      overallFails: 0,
      totalWorkoutTime: 0,

    },

    forceMobile: false

  },

  // Runtime game data
  GameData: {

    scale: 1,

    aspectRatio: 1

  }

};
