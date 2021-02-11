import * as functions from "firebase-functions";
import stpmModule from "./modules/stpm";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  functions.logger.info(process.env.FIREBASE_CONFIG as string, {
    structuredData: true,
  });
  response.send("Hello from Firebase!");
});

export const stpm = functions.https.onRequest(stpmModule);
