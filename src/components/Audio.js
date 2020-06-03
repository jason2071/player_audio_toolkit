import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import {connect} from 'react-redux';
import Sound from 'react-native-sound';
import Slider from '@react-native-community/slider';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {setAudioPathForPlay} from '../redux/audioAction';

const Audio = ({visible, audioPath, setAudioPathForPlay}) => {
  if (!visible) return null;
  if (!audioPath) return null;

  const [playback, setPlayback] = useState('pause');
  const [soundState, setSoundState] = useState(null);
  const [currentPath, setCurrentPath] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [timeout, setTimeout] = useState('');

  useEffect(() => {
    Sound.setCategory('Playback', true);
    togglePlayback();
  }, [audioPath]);

  const togglePlayback = () => {
    setPlayback((prevState) => (prevState === 'play' ? 'pause' : 'play'));

    if (soundState) {
      playback === 'play' ? soundState.pause() : soundState.play();
    }

    const callback = (error, sound) => {
      if (error) {
        Alert.alert('error', error.message);
        setAudioPathForPlay({visible: false, audioPath: null});
        setPlayback('pause');
        setSoundState(null);
        setCurrentTime(0);
        setDuration(0);
        return;
      }

      const duration = sound.getDuration();
      if (duration !== -0.001) {
        setDuration(duration);
      }

      const timeout = setInterval(() => {
        sound.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
        });
      }, 1000);

      setSoundState(sound);
      setCurrentPath(sound._filename);
      setTimeout(timeout);

      sound.play(() => {
        sound.release();
      });
    };

    if (audioPath !== currentPath) {
      if (soundState) {
        soundState.setCurrentTime(0);
        soundState.stop();
        setPlayback('pause');
        setSoundState(null);
        setCurrentTime(0);
        setDuration(0);
        if (timeout) clearInterval(timeout);
      }

      const sound = new Sound(audioPath, '', (error) => callback(error, sound));
    }
  };

  const onClosePlayer = () => {
    setAudioPathForPlay({visible: false, audioPath: null});
    if (soundState) {
      soundState.setCurrentTime(0);
      soundState.stop();
    }
    setPlayback('pause');
    setSoundState(null);
    setCurrentTime(0);
    setDuration(0);
    if (timeout) clearInterval(timeout);
  };

  return (
    <View style={styles.audioBar}>
      <View style={styles.left}>
        <Text style={styles.timePresent}>{getTimeString(currentTime)}</Text>
      </View>

      <Slider
        style={{
          width: '60%',
          height: 20,
          marginBottom: 10,
          alignSelf: 'center',
        }}
        minimumTrackTintColor="red"
        maximumTrackTintColor="white"
        value={currentTime}
        minimumValue={0}
        maximumValue={duration}
      />

      <View style={styles.right}>
        <View style={styles.toolBtn}>
          <Text style={styles.timeFull}>{getTimeString(duration)}</Text>
          <TouchableOpacity style={styles.btnPlay} onPress={togglePlayback}>
            {playback === 'pause' ? (
              <FontAwesomeIcon name="play" style={styles.play} />
            ) : (
              <FontAwesomeIcon name="pause" style={styles.pause} />
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnClose} onPress={onClosePlayer}>
          <MaterialCommunityIconsIcon name="window-close" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

function getTimeString(number) {
  const seconds = number.toFixed(0);
  const m = parseInt((seconds % (60 * 60)) / 60, 10);
  const s = parseInt(seconds % 60, 10);
  return m + ':' + (s < 10 ? '0' + s : s);
}

const mapStateToProps = (state) => ({
  visible: state.audio.visible,
  audioPath: state.audio.audioPath,
});

const mapDispatchToProps = {
  setAudioPathForPlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(Audio);

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
