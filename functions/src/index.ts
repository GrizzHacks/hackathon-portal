import * as functions from "firebase-functions";
import { logger } from "./helpers";
import { initModule } from "./initModule";
import stpmModule from "./modules/stpm";
import pmModule from "./modules/pm";
import mewmModule from "./modules/mewm";
import urmModule from "./modules/urm";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = functions.https.onRequest((request, response) => {
  logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

export const stpm = initModule(stpmModule, "/stpm");

export const pm = initModule(pmModule, "/pm");

export const mewm = initModule(mewmModule, "/mewm");

export const urm = initModule(urmModule, "/urm");

export const codeCoverageDummyTestFunction = () => true;
