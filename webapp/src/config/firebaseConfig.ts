import firebase from "firebase";

export const firebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
});

// Switch between the production code and the emulator
if (window.location.href.includes("localhost")) {
  firebaseApp.auth().useEmulator("http://localhost:9099");
  firebaseApp.firestore().useEmulator("localhost", 8080);

  // Firebase functions SDK is currently unused in favor of calling endpoints directly
  // firebaseApp.functions().useEmulator("localhost", 5001);
}

const firebaseRegion = "us-central1";

export const apiUrl = window.location.href.includes("localhost")
  ? `https://localhost:5001/${process.env.REACT_APP_FIREBASE_PROJECTID}/${firebaseRegion}/`
  : `https://${firebaseRegion}-${process.env.REACT_APP_FIREBASE_PROJECTID}.cloudfunctions.net`;
