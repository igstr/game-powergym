
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

  Defaults: {

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
        resetCount: 0,

      },

      forceMobile: true,

      playerProgress: {

          torso: 1,
          arms: 1,
          legs: 1,
          head: 1,
          shorts: 1,
          sixPack: 1

      }
    },
  },

  // User save data and preferences
  UserData: {},

  // Runtime game data
  GameData: {

    scale: 1,

    aspectRatio: 1

  }

};

// Clone default user data
PowerGym.UserData = JSON.parse(JSON.stringify(PowerGym.Defaults.UserData));

