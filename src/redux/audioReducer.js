import {AUDIO_PATH} from './types';

const initialState = {
  visible: false,
  audioPath: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUDIO_PATH:
      return {
        ...state,
        visible: action.visible,
        audioPath: action.audioPath,
      };
    default:
      return state;
  }
}
