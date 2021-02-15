import express = require("express");
import type { Express } from "express";
import * as functions from "firebase-functions";
import { logRequestStartFactory, logRequestStopFactory } from "./systems/ilms";
import cors = require("cors");

/**
 * Initializes a new Express App with the default configuration (logging, authentication, etc.) for a new module.
 *
 * @param module The configuration function for a given module.
 * @param endpoint The string of the endpoint the module will be hosted at.
 * @returns An https Firebase function endpoint.
 */
export const initModule = (
  module: (app: Express) => void,
  endpoint: string
) => {
  const app = express();

  // Automatically allow cross-origin requests
  app.use(cors({ origin: true }));

  // Log request endpoint when request starts
  app.use(logRequestStartFactory(endpoint));

  // Initialize Routes and Module-Specific Middleware
  module(app);

  // Log request final status and duration
  app.use(logRequestStopFactory(endpoint));

  return functions.https.onRequest(app);
};
