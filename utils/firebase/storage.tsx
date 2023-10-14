import React from 'react';
import app from '../../config/firebase';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const storage = getStorage(app);

export const pickImage = async () => {
  try {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      uploadPhoto(result.assets[0].uri);
    }
  } catch (E) {
    console.log(E);
  }
};

export async function getImageURI(imageID: string) {
  const storageRef = ref(storage, 'images/' + imageID);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}

export async function uploadPhoto(imageURI: string) {
  const getBlobFromURI = async (imageURI: string) => {
    const blob: Blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', imageURI, true);
      xhr.send(null);
    });

    return blob;
  };

  const imageID = uuidv4();
  const storageRef = ref(storage, 'images/' + imageID);
  const image = await getBlobFromURI(imageURI);
  const uploadTask = uploadBytesResumable(storageRef, image);

  uploadTask.on(
    'state_changed',
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload progress: ' + progress);
    },
    (error) => {
      console.error(error.code, error.message);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        console.log('File available at', downloadURL);
      });
    }
  );

  return imageID;
}
