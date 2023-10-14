import React from "react";
import app from "../../config/firebase";
import { get, getDatabase, push, ref, set } from "firebase/database";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const database = getDatabase(app);

export const createUser = (userID: string, name: string, email: string) => {
  const userRef = ref(database, "users/" + userID);
  set(userRef, { name, email });
};

export const findUser = async (query: string) => {
  const userRef = ref(database, "users/");
  const user = await get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(
          Object.entries(snapshot.val()).find(
            (user) => user[1].email.toLowerCase() === query.toLowerCase()
          )
        );
        return Object.entries(snapshot.val()).find(
          (user) => user[1].email.toLowerCase() === query.toLowerCase()
        );
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
  if (user) return user;
  else return undefined;
};

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

export const getFriends = async (userID: string) => {
  const friendListRef = ref(database, "friends/" + userID);
  try {
    const snapshot = await get(friendListRef)

    if (snapshot.exists()) {
      console.log(snapshot.val());
      return snapshot.val();
    } else {
      console.log("No friends");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUserInfo = async (userID: string) => {
  const userInfoRef = ref(database, "users/" + userID)
  try {
    const snapshot = await get(userInfoRef)

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("User doesn't exist");
    }
  } catch (error) {
    console.error(error);
  }
}

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

export const getEventsByRelationship = async (relID: string) => {
  const relListRef = ref(database, "relationships/" + relID);
  try {
    const snapshot = await get(relListRef)

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No events");
    }
  } catch (error) {
    console.error(error);
  }
};

export const getStrengthByRelationship = async (relID: string) => {
  const events = await getEventsByRelationship(relID)
  return Math.min(Object.keys(events).length, 4)
};
