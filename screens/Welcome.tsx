import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Image, Text } from '@rneui/themed';

const TreeImage = require('../assets/tree.png')

export default function Welcome({navigation}) {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <Image source={TreeImage} style={styles.image} />
        <Text h1>Memories</Text>
        <Text h2 style={{padding: 10}}>Save photos of your favorite memories together and create new ones</Text>
        <Text h2 style={{padding: 10, fontStyle: 'italic'}}>Grow your friendships and reminisce on the past</Text>
      </View>

      <View style={{width: '100%'}}>
        <Button title="Sign up" containerStyle={styles.button} onPress={() => navigation.navigate("Sign up")}/>
        <Button title="Log in" containerStyle={styles.button} onPress={() => navigation.navigate('Log in')} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8FBC8F',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  image: {
    width: 250,
    height: 300,
  }
});