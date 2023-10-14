import React from "react";
import app from "../../config/firebase";
import { get, getDatabase, push, ref, set } from "firebase/database";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const database = getDatabase(app);

export const addFriend = (adderUID: string, addedUID: string) => {
  const friendListRef = ref(database, "friends/" + adderUID);
  push(friendListRef, addedUID);
};

export const getFriends = (UID: string) => {
  const friendListRef = ref(database, "friends/" + UID);
  get(friendListRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No friends");
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

  const relListRef = ref(database, "events/" + eventID);
  set(relListRef, { name, date, location, imageIDs });

  return eventID;
};

export const addImagesToEvent = (eventID: string, imageIDs: string[]) => {
  const relListRef = ref(database, "events/" + eventID + "/imageIDs");
  imageIDs.forEach((id) => {
    push(relListRef, id);
  });

  return eventID;
};

export const addRelationshipFromEvent = (
  userID1: string,
  userID2: string,
  eventID: string
) => {
  const relName =
    userID1 < userID2 ? userID1 + "_" + userID2 : userID2 + "_" + userID1;
  const relListRef = ref(database, "relationship/" + relName + "/events");
  push(relListRef, eventID);
};
