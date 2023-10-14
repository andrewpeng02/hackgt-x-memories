import { Button, Icon, Input, Text, Image } from '@rneui/themed';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  addEventToRelationship,
  addFriend,
  getEvent,
  getEventsByRelationship,
  getFriends,
  getRelationship,
} from '../utils/firebase/realtimedb';
import { getAuth } from 'firebase/auth';
import { getImageURI } from '../utils/firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { uploadPhoto } from '../utils/firebase/storage';

const auth = getAuth();

const createEvents = (
  events: {
    name: string;
    date: string;
    location: string;
    imageIDs: string[];
  }[],
  eventImageURIs: string[][]
) => {
  if (events) {
    return events.map((event) => {
      const imageURIs: string[] = [];
      event.imageIDs.forEach((imageID) => {
        getImageURI(imageID).then((res) => imageURIs.push(res));
      });
      return (
        <View style={eventStyles.mainView}>
          <View style={eventStyles.firstCol}>
            <Text style={eventStyles.dateText}>{event.date}</Text>
          </View>
          <View style={eventStyles.secondCol}>
            <Text style={eventStyles.titleText}>{event.name}</Text>
            {imageURIs.map((imageURI) => {
              return <Image source={imageURI as any} />;
            })}
          </View>
        </View>
      );
    });
  } else return <></>;
};

const eventStyles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
  },
  firstCol: {
    flexGrow: 0.15,
    alignItems: 'center',
    padding: 10,
  },
  secondCol: {
    flexGrow: 1,
    height: '100%',
    padding: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 12,
  },
});

const AskFriend = (friend: { name: string; id: string; navigation: any }) => {
  const [opened, setOpened] = useState(false);

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

function ImageGallery({ imageSources }: { imageSources: { uri: string }[] }) {
  return (
    <View style={imageGalleryStyles.container}>
      {imageSources.map((imageSource) => (
        <Image
          source={imageSource}
          key={imageSource.uri}
          style={imageGalleryStyles.image}
        />
      ))}
    </View>
  );
}

const imageGalleryStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  image: {
    width: 100,
    height: 100,
    margin: 5,
  },
});

function CreateEvent({
  assets,
  friendID,
  handleBack,
}: {
  assets: ImagePickerAsset[];
  friendID: string;
  handleBack: () => {};
}) {
  const [eventName, setEventName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [errorMessage, setErrorMesssage] = useState<string>('');
  const [relID, setRelID] = useState('');
  useEffect(() => {
    const setRel = async () => {
      setRelID(await getRelationship(auth.currentUser!.uid, friendID));
    };
    setRel();
  }, []);

  const imageSources = assets.map((asset) => {
    return {
      uri: asset.uri,
    };
  });

  const createEvent = async () => {
    if (!eventName) {
      setErrorMesssage('Must input an event name');
      return;
    }
    if (!location) {
      setErrorMesssage('Must input a location name');
      return;
    }
    setErrorMesssage('');

    const imageIDs = await Promise.all(
      assets.map((asset) => uploadPhoto(asset.uri))
    );
    await addEventToRelationship(
      relID,
      eventName,
      new Date().toLocaleString(),
      location,
      imageIDs
    );
    handleBack();
  };

  return (
    <View style={createEventStyles.container}>
      <Text style={createEventStyles.title}>Create your event</Text>
      <Input label='Title' onChangeText={(text) => setEventName(text)} />
      <Input label='Location' onChangeText={(text) => setLocation(text)} />
      {errorMessage ? (
        <Text style={createEventStyles.errorMessage}>{errorMessage}</Text>
      ) : undefined}
      <ImageGallery imageSources={imageSources} />
      <View style={createEventStyles.buttonContainer}>
        <Button
          title='Back'
          buttonStyle={createEventStyles.buttons}
          onPress={handleBack}
        />
        <Button
          title='Create'
          buttonStyle={createEventStyles.buttons}
          onPress={createEvent}
        />
      </View>
    </View>
  );
}

const createEventStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderRadius: 10,
    width: '100%',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    margin: 20,
    fontSize: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 40,
    margin: 20,
    justifyContent: 'space-between',
  },
  buttons: {
    width: 150,
    borderRadius: 20,
  },
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginTop: -10,
    marginBottom: 10,
  },
});

export default function ChatScreen({ navigation, route }) {
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [assets, setAssets] = useState<ImagePickerAsset[]>([]);
  const [events, setEvents] = useState([]);
  const [eventImageURIs, setEventImageURIs] = useState([]);

  const friendID = route.params.user[0];
  const relID = getRelationship(auth.currentUser!.uid, friendID);

  useEffect(() => {
    setEvents([]);
    const func = async () => {
      const relID = await getRelationship(auth.currentUser!.uid, friendID);
      const eventIDs = await getEventsByRelationship(relID);
      if (eventIDs) {
        setEvents(
          await Promise.all(
            Object.values(eventIDs).map((event) => {
              return getEvent(event);
            })
          )
        );
        events.forEach((event) => {
          const eventImageIDs = event.imageIDs.map(async (imageID) => {
            return await getImageURI(imageID);
          });
          setEventImageURIs((eventImageURIs) => [
            ...eventImageURIs,
            eventImageIDs,
          ]);
        });
      }
      console.log(eventImageURIs);
    };
    func();
  }, [auth.currentUser?.uid, friendID]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled && result.assets) {
      setShowCreateEvent(true);
      setAssets(result.assets);
    } else {
      console.error('You did not select any image.');
    }
  };

  return (
    <View style={styles.container}>
      <AskFriend
        name={route.params.user[1].name}
        id={friendID}
        navigation={navigation}
      />
      <Text>{route.params.user[1].name}</Text>
      {createEvents()}
      <Icon
        reverse
        name='add'
        color='#517fa4'
        onPress={pickImage}
        containerStyle={styles.add}
      />
      {showCreateEvent && assets.length > 0 ? (
        <CreateEvent
          assets={assets!}
          friendID={friendID}
          handleBack={() => {
            setAssets([]);
            setShowCreateEvent(false);
          }}
        />
      ) : null}
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
  add: {
    position: 'absolute',
    bottom: 30,
    left: 20,
  },
});
