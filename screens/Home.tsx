import { Button, Icon, Image, Input, Text } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { useAssets } from 'expo-asset';

import BackgroundImage from '../assets/background.jpeg';
import { getAuth, signOut } from 'firebase/auth';
import { getFriends, findUser, getStrengthByRelationship, getUserInfo } from '../utils/firebase/realtimedb';
import { useIsFocused } from '@react-navigation/native';

type TreeInfo = { friendName: string; stage: number; treeName: string; friendID: string; };
type TreeProps = {
  friendName: string;
  stage: number;
  treeName: string;
  friendID: string;
  top: number;
  left: number;
  navigation: any;
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

function Tree({ friendName, stage, treeName, friendID, left, top, navigation }: TreeProps) {
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

  const handlePress = () => {
    navigation.navigate('Chat', { user: [friendID, { name: friendName, id: friendID}], tree: <Image source={{ uri: asset.uri }} style={[treeStyles.image, dimensions]} /> });
  };

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
          <Text>{friendName}</Text>
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

async function getTreeInfos(): Promise<TreeInfo[] | undefined> {
  if (!auth.currentUser?.uid) return undefined;
  const friends = await getFriends(auth.currentUser.uid);
  const treeInfos = []
  for (const [friendID, relID] of Object.entries(friends)) {
    const strength = await getStrengthByRelationship(relID)
    const friendInfo = await getUserInfo(friendID)
    treeInfos.push({ friendName: friendInfo.name, friendID: friendID, stage: strength, treeName: 'fir_tree'})
  }
  return treeInfos
}

function getTrees(treeInfos: TreeInfo[], navigation) {
  let left = 30;
  let top = 0;
  return treeInfos.map((treeInfo) => {
    if (top === 600) {
      top = 150;
      left += 150;
    } else {
      top += 150;
    }

    let sumDigits = 0
    let sumAll = 0
    for (let i = 0; i < treeInfo.friendID.length; i++) {
      const c = treeInfo.friendID.charAt(i)
      sumAll += c.charCodeAt(0)
      if (c >= '0' && c <= '9') {
        sumDigits += c.charCodeAt(0)
      }
    }

    const leftRandomized = left + Math.floor((sumDigits % 10) * 4);
    const topRandomized = top + Math.floor((sumAll % 10) * 3);

    return (
      <Tree
        {...treeInfo}
        left={leftRandomized}
        top={topRandomized}
        navigation = {navigation}
        key={treeInfo.friendID}
      />
    );
  });
}

function SearchBar({ navigation }) {
  const [opened, setOpened] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMesssage] = useState('');
  const [firTreeAsset] = useAssets([require('../assets/fir_tree/1.png')])

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
                const tree = <Image source={{ uri: firTreeAsset![0].uri }} style={[treeStyles.image, firTreeDimensions[0]]} />
                navigation.navigate('Chat', { user: user, tree: tree });
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
  const [treeInfos, setTreeInfos] = useState<TreeInfo[]>();
  const isFocused = useIsFocused();

  useEffect(() => {
    const setTreeInfosAsync = async () => {
      setTreeInfos(await getTreeInfos())
    }
    setTreeInfosAsync()
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ImageBackground source={BackgroundImage} style={styles.image}>
        <View style={styles.treeView}>{treeInfos && getTrees(treeInfos, navigation)}</View>
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
