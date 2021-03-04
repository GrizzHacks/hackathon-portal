import * as functions from "firebase-functions";
import { logger } from "./helpers";
import { initModule } from "./initModule";
import stpmModule from "./modules/stpm";
import pmModule from "./modules/pm";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const stpm = initModule(stpmModule, "/stpm");

export const pm = initModule(pmModule, "/pm");

export const codeCoverageDummyTestFunction = () => true;
