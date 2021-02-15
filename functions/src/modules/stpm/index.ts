import express = require("express");
import cors = require("cors");
import companies from "./companies";
import tiers from "./tiers";
import { firebaseApp } from "../../config/firebaseConfig";

const app = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Add middleware to authenticate requests
// app.use(myMiddleware);

app.get("/", (req, res) => res.send(test()));
  companies(app, "/companies");
  tiers(app, "/tiers");

export default app;

const test = () =>
  firebaseApp
    .firestore()
    .collection("test")
    .doc("test")
    .set({ test: "test1234" })
    .then(() => true)
    .catch((error) => error);
