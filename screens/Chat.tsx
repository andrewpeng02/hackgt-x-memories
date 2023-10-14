import { Button, Icon, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import BackgroundImage from '../assets/background.jpeg';
import { addFriend, getFriends } from '../utils/firebase/realtimedb';
import { getAuth } from 'firebase/auth';

const AskFriend = (friend: { name: string; id: string; navigation: any }) => {
  const [opened, setOpened] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    if (auth.currentUser?.uid)
      getFriends(auth.currentUser?.uid).then((friends) => {
        let foundFriend = undefined;
        if (friends) {
          foundFriend = Object.keys(friends).find((f) => f === friend.id);
        }
        if (!foundFriend) setOpened(true);
      });
  }, [friend]);

  if (opened) {
    return (
      <View style={styles.askFriend}>
        <Text style={styles.text}>
          Do you want to be friends with {'\n'}
          {friend.name}?
        </Text>
        <View style={styles.askFriendIconContainer}>
          <Icon
            name='close'
            color='#e03434'
            onPress={() => {
              friend.navigation.goBack();
            }}
            iconStyle={styles.iconStyle}
          />
          <Icon
            name='check'
            color='#517fa4'
            onPress={() => {
              if (auth.currentUser?.uid) {
                addFriend(auth.currentUser?.uid, friend.id).then((res) => {
                  if (res === 1) setOpened(false);
                });
              }
            }}
            iconStyle={styles.iconStyle}
          />
        </View>
      </View>
    );
  } else return <></>;
};

export default function ChatScreen({ navigation, route }) {
  return (
    <View style={styles.container}>
      {/* <ImageBackground source={BackgroundImage} style={styles.image}> */}
      <AskFriend
        name={route.params.user[1].name}
        id={route.params.user[0]}
        navigation={navigation}
      />
      <Text>{route.params.user[1].name}</Text>
      {/* </ImageBackground> */}

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  askFriend: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  askFriendIconContainer: {
    flexDirection: 'row',
    paddingTop: 15,
    width: '100%',
    justifyContent: 'space-around',
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
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMessage: {
    position: 'absolute',
    bottom: 25,
    left: 90,
    color: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  iconStyle: {
    fontSize: 40,
  },
});
