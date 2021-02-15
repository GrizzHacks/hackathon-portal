import * as functions from "firebase-functions";
import { initModule } from "./initModule";
import stpmModule from "./modules/stpm";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const stpm = initModule(stpmModule, "/stpm");
