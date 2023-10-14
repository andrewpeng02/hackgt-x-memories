import { Button, Icon, Image, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useAssets } from 'expo-asset';

import BackgroundImage from '../assets/background.jpeg';
import { getAuth, signOut } from 'firebase/auth';
import { getFriends, findUser } from '../utils/firebase/realtimedb';

type TreeInfo = { name: string; stage: number; treeName: string; uid: string };
type TreeProps = {
  name: string;
  stage: number;
  treeName: string;
  uid: string;
  top: number;
  left: number;
};

const auth = getAuth();

const firTreeDimensions = [
  {
    width: 30,
    height: 40,
  },
  {
    width: 35,
    height: 50,
  },
  {
    width: 40,
    height: 80,
  },
  {
    width: 40,
    height: 120,
  },
  {
    width: 60,
    height: 130,
  },
];

const middleLaneTreeDimensions = [
  {
    width: 30,
    height: 40,
  },
  {
    width: 45,
    height: 50,
  },
  {
    width: 90,
    height: 80,
  },
  {
    width: 100,
    height: 120,
  },
  {
    width: 100,
    height: 130,
  },
];

function Tree({ name, stage, treeName, uid, left, top }: TreeProps) {
  const [firTreeAssets] = useAssets([
    require('../assets/fir_tree/1.png'),
    require('../assets/fir_tree/2.png'),
    require('../assets/fir_tree/3.png'),
    require('../assets/fir_tree/4.png'),
    require('../assets/fir_tree/5.png'),
  ]);
  const [middleLaneTreeAssets] = useAssets([
    require('../assets/middle_lane_tree/1.png'),
    require('../assets/middle_lane_tree/2.png'),
    require('../assets/middle_lane_tree/3.png'),
    require('../assets/middle_lane_tree/4.png'),
    require('../assets/middle_lane_tree/5.png'),
  ]);
  if (!firTreeAssets || !middleLaneTreeAssets) {
    return <Text>No assets found</Text>;
  }

  let asset = firTreeAssets[stage];
  let dimensions = firTreeDimensions[stage];
  if (treeName === 'middle_lane_tree') {
    asset = middleLaneTreeAssets[stage];
    dimensions = middleLaneTreeDimensions[stage];
  }

  const handlePress = () => {};

  return (
    <View style={[treeStyles.container, { left: left, top: top }]}>
      <Button
        buttonStyle={{
          backgroundColor: null,
          flexDirection: 'column',
          flex: 1,
        }}
        onPress={handlePress}
      >
        <Image
          source={{ uri: asset.uri }}
          style={[treeStyles.image, dimensions]}
        />
        <View style={treeStyles.name}>
          <Text>{name}</Text>
        </View>
      </Button>
    </View>
  );
}

const treeStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 80,
    left: 30,
  },
  image: {
    width: 50,
    height: 100,
  },
  name: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 5,
  },
});

async function getTreeInfos(): Promise<[TreeInfo] | undefined> {
  if (!auth.currentUser?.uid) return undefined;
  const friends = await getFriends(auth.currentUser.uid);
}

function getTrees(treeInfos: [TreeInfo]) {
  let left = 30;
  let top = 0;
  return treeInfos.map((treeInfo) => {
    if (top === 500) {
      top = 125;
      left += 150;
    } else {
      top += 125;
    }

    const leftRandomized = left + Math.floor(Math.random() * 30);
    const topRandomized = top + Math.floor(Math.random() * 40);

    return (
      <Tree
        {...treeInfo}
        left={leftRandomized}
        top={topRandomized}
        key={treeInfo.uid}
      />
    );
  });
}

function SearchBar({ navigation }) {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMesssage] = useState('');

  if (opened) {
    return (
      <View style={styles.searchBar}>
        <Icon
          reverse
          name='close'
          color='#517fa4'
          onPress={() => {
            setOpened(false);
            setEmail('');
            setErrorMesssage('');
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
        {errorMessage && (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        )}
        <Icon
          reverse
          name='forward'
          color='#517fa4'
          onPress={() => {
            setOpened(true);
            //user either exists or undefined
            findUser(email).then((user) => {
              if (user) { 
                setEmail('')
                setOpened(false)
                navigation.navigate('Chat', { user: user });
              }
              else setErrorMesssage('User not found');
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

export default function HomeScreen({ navigation }) {
  const [treeInfos, setTreeInfos] = useState<[TreeInfo]>();

  useEffect(() => {
    setTreeInfos([
      {
        name: 'my namea sdf asd',
        stage: 2,
        treeName: 'fir_tree',
        uid: 'asd9fjas9d-d',
      },
      { name: 'my name', stage: 1, treeName: 'fir_tree', uid: 'asd9fjas9-4d' },
      { name: 'my name', stage: 2, treeName: 'fir_tree', uid: 'asd9fjas9-da' },
      { name: 'my name', stage: 4, treeName: 'fir_tree', uid: 'asd9fjas9-dt' },
      {
        name: 'my name',
        stage: 0,
        treeName: 'middle_lane_tree',
        uid: 'asd9rfjas9-d',
      },
    ]);
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.image}>
        <View style={styles.treeView}>{treeInfos && getTrees(treeInfos)}</View>
        <SearchBar navigation={navigation} />
        <Icon
          reverse
          name='logout'
          color='#517fa4'
          onPress={() => {
            signOut(auth);
          }}
          containerStyle={styles.exit}
        />
      </ImageBackground>

      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    position: 'absolute',
    top: 0,
    height: 120,
    width: '100%',
  },
  inputContainerStyle: {
    position: 'absolute',
    backgroundColor: '#fff',
    borderRadius: 20,
    top: 45,
    left: 90,
    width: 250,
    height: 40,
  },
  errorMessage: {
    position: 'absolute',
    top: 100,
    left: 90,
    color: 'red',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  treeView: {
    position: 'relative',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  add: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  close: {
    position: 'absolute',
    top: 30,
    left: 20,
  },
  exit: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
});
