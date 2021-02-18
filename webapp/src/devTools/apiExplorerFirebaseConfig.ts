import firebase from "firebase";

// Create a seperate instance of the FirebaseApp so that the dev tools are a seperate auth instance.
export const ApiExplorerFirebaseApp = firebase.initializeApp(
  {
    apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  },
  "ApiExplorerFirebaseApp"
);

// Switch between the production code and the emulator
if (window.location.href.includes("localhost")) {
  ApiExplorerFirebaseApp.auth().useEmulator("http://localhost:9099");
}
