import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {connect} from 'react-redux';
import Slider from '@react-native-community/slider';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Player} from '@react-native-community/audio-toolkit';

import {setAudioPathForPlay} from '../redux/audioAction';

let player = null;
let lastSeek = 0;
let progressInterval = null;
let initial = {
  playPauseButton: 'Preparing...',
  stopButtonDisabled: true,
  playButtonDisabled: true,
  progress: 0,
  error: null,
};

const Toolkit = ({visible, audioPath, setAudioPathForPlay}) => {
  if (!visible || !audioPath) return null;

  const [state, setState] = useState(initial);

  useEffect(() => {
    async function firstPlay() {
      if (player) {
        player.destroy();
        clearInterval(progressInterval);
      }

      player = new Player(audioPath, {autoDestroy: false}).prepare((err) => {
        if (err) {
          console.log('error at _reloadPlayer():');
          console.log(err);
        }

        player.play();
        updateState();

        progressInterval = setInterval(() => {
          if (player && shouldUpdateProgressBar()) {
            let currentProgress =
              Math.max(0, player.currentTime) / player.duration;
            if (isNaN(currentProgress)) {
              currentProgress = 0;
            }
            setState({...state, progress: currentProgress});
          }
        }, 100);
      });

      player.on('ended', () => {
        updateState();
      });

      player.on('pause', () => {
        updateState();
      });

      player.on('error', (err) => {
        setState({...state, error: err.message});
      });
    }

    firstPlay();

    return () => {
      clearInterval(progressInterval);
    };
  }, [audioPath]);

  function updateState() {
    setState({
      ...state,
      playPauseButton: player && player.isPlaying ? 'Pause' : 'Play',
      stopButtonDisabled: !player || !player.canStop,
      playButtonDisabled: !player || !player.canPlay,
    });
  }

  function shouldUpdateProgressBar() {
    return Date.now() - lastSeek > 200;
  }

  function playPause() {
    player.playPause((err, paused) => {
      if (err) {
        setState({...state, error: err.message});
      }
      updateState();
    });
  }

  function stop() {
    player.stop(() => updateState());
    clearInterval(progressInterval);
    setAudioPathForPlay({visible: false, audioPath: null});
  }

  function seek(percentage) {
    if (!player) {
      return;
    }

    lastSeek = Date.now();

    let position = percentage * player.duration;

    player.seek(position, () => updateState());
  }

  if (state.error) {
    console.log(state.error);
  }

  return (
    <View style={styles.audioBar}>
      <View style={styles.left}>
        <Text style={styles.timePresent}>{'0.00'}</Text>
      </View>

      <Slider
        style={{
          width: '60%',
          height: 20,
          marginBottom: 10,
          alignSelf: 'center',
        }}
        step={0.0001}
        minimumTrackTintColor="red"
        maximumTrackTintColor="white"
        value={state.progress}
        minimumValue={0}
        maximumValue={1}
        onValueChange={(percentage) => seek(percentage)}
      />

      <View style={styles.right}>
        <View style={styles.toolBtn}>
          <Text style={styles.timeFull}>{'3.00'}</Text>
          <TouchableOpacity style={styles.btnPlay} onPress={playPause}>
            <FontAwesomeIcon name="play" style={styles.play} />
            {/* <FontAwesomeIcon name="pause" style={styles.pause} /> */}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnClose} onPress={stop}>
          <MaterialCommunityIconsIcon name="window-close" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const mapStateToProps = (state) => ({
  visible: state.audio.visible,
  audioPath: state.audio.audioPath,
});

const mapDispatchToProps = {
  setAudioPathForPlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolkit);

const styles = StyleSheet.create({
  audioBar: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(0,0,0,1)',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-around',
    paddingTop: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  left: {
    width: 30,
    height: 15,
  },
  timePresent: {
    color: 'rgba(255,255,255,1)',
    fontSize: 13,
    fontFamily: 'Prompt-Regular',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toolBtn: {
    height: 15,
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-start',
  },
  timeFull: {
    color: 'rgba(247,99,59,1)',
    alignSelf: 'stretch',
    fontSize: 13,
    fontFamily: 'Prompt-Regular',
  },
  btnPlay: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(247,99,59,1)',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: -3,
    marginLeft: 10,
    borderRadius: 100,
  },
  play: {
    color: 'rgba(255,255,255,1)',
    fontSize: 32,
    alignSelf: 'center',
    marginLeft: 4,
  },
  pause: {
    color: 'rgba(255,255,255,1)',
    fontSize: 32,
    alignSelf: 'center',
  },
  btnClose: {
    marginTop: 0,
    fontSize: 32,
  },
  icon: {
    color: 'rgba(255,255,255,1)',
    fontSize: 28,
    alignSelf: 'center',
  },
});
