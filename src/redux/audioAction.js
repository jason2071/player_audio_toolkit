import {AUDIO_PATH} from './types';

export const setAudioPathForPlay = ({visible, audioPath}) => (dispatch) => {
  dispatch({type: AUDIO_PATH, visible, audioPath});
};
