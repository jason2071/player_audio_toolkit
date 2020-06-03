import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import {setAudioPathForPlay} from '../redux/audioAction';
// const song = require('../data/song.json');
const places = require('../data/place.json');

const Home = ({setAudioPathForPlay}) => {
  const renderItem = (item) => {
    return (
      <View key={item.object_id} style={styles.item}>
        <Text style={{fontSize: 16}}>{item.name}</Text>
        <TouchableOpacity
          onPress={() =>
            setAudioPathForPlay({visible: true, audioPath: item.sound_url})
          }
          style={{width: 50}}>
          <Ionicons name="ios-play" style={{fontSize: 30, color: 'tomato'}} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {places.map((item) => renderItem(item))}
    </View>
  );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setAudioPathForPlay,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    paddingVertical: 16,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#8e8e8e',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
