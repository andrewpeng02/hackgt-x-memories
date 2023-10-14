import React from "react";
import app from "../../config/firebase";
import { get, getDatabase, push, ref, set } from "firebase/database";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const database = getDatabase(app);

export const addFriend = (adderUID: string, addedUID: string) => {
  const friendRef = ref(database, "friends/" + adderUID + "/" + addedUID);
  const alreadyFriends = get(friendRef).then((snapshot) => {
    if (snapshot.exists()) return 1;
  });
  if (!alreadyFriends) {
    const relID = uuidv4();
    set(friendRef, relID);

    const friendRef2 = ref(database, "friends/" + addedUID + "/" + adderUID);
    set(friendRef2, relID);

    ref(database, "relationships/" + relID);
  }
};

export const getFriends = (userID: string) => {
  const friendListRef = ref(database, "friends/" + userID);
  get(friendListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No friends");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getRelationship = (user1ID: string, user2ID: string) => {
  const friendRef = ref(database, "friends/" + user1ID + "/" + user2ID);
  get(friendRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No relationship");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const createEvent = (
  name: string,
  date: string,
  location: string,
  imageIDs: string[]
) => {
  const eventID = uuidv4();

  const eventListRef = ref(database, "events/" + eventID);
  set(eventListRef, { name, date, location, imageIDs });

  return eventID;
};

export const addEventToRelationship = (
  relID: string,
  name: string,
  date: string,
  location: string,
  imageIDs: string[]
) => {
  const eventID = createEvent(name, date, location, imageIDs);
  const relRef = ref(database, "relationships/" + relID);
  push(relRef, eventID);
};

export const addImagesToEvent = (eventID: string, imageIDs: string[]) => {
  const relListRef = ref(database, "events/" + eventID + "/imageIDs");
  imageIDs.forEach((id) => {
    push(relListRef, id);
  });

  return eventID;
};

export const getEventsByRelationship = (relID: string) => {
  const relListRef = ref(database, "relationships/" + relID);
  get(relListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        return snapshot.val();
      } else {
        console.log("No events");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};

export const getNumberOfEventsByRelationship = (relID: string) => {
  const relListRef = ref(database, "relationships/" + relID);
  get(relListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(Object.keys(snapshot.val()).length);
        return Object.keys(snapshot.val()).length;
      } else {
        console.log("No events");
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
