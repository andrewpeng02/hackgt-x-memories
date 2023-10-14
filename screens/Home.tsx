import { Button, Icon, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import BackgroundImage from '../assets/background.jpeg';
import { findUser } from '../utils/firebase/realtimedb';

function SearchBar() {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('');

  if (opened) {
    return (
      <View style={styles.searchBar}>
        <Icon
          reverse
          name='close'
          color='#517fa4'
          onPress={() => {
            setOpened(false);
          }}
          containerStyle={styles.close}
        />
        <Input
          placeholder='Email'
          value={email}
          onChangeText={(text) => setEmail(text)}
          containerStyle={styles.inputContainerStyle}
          inputContainerStyle={{ borderBottomWidth: 0 }}
        />
        <Icon
          reverse
          name='forward'
          color='#517fa4'
          onPress={() => {
            setOpened(true);
            //user either exists or undefined
            findUser(email).then((user) => {
              console.log(user);
            });
          }}
          containerStyle={styles.add}
        />
      </View>
    );
  }

  return (
    <Icon
      reverse
      name='add'
      color='#517fa4'
      onPress={() => {
        setOpened(true);
      }}
      containerStyle={styles.add}
    />
  );
}

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.image}>
        <Text>Home screen!</Text>
        <SearchBar />
      </ImageBackground>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: 'absolute',
    bottom: 0,
    height: 120,
    width: '100%',
  },
  inputContainerStyle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 20,
    bottom: 45,
    left: 90,
    width: 250,
    height: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  add: {
    position: 'absolute',
    bottom: 30,
    right: 20,
  },
  close: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
});
