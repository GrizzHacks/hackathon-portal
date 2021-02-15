import type { Express } from "express";
import companies from "./companies";
import tiers from "./tiers";
import { firebaseApp } from "../../config/firebaseConfig";

export default (app: Express) => {
  app.get("/", (req, res) => res.send(test()));
  companies(app, "/companies");
  tiers(app, "/tiers");
};

const test = () =>
  firebaseApp
    .firestore()
    .collection("test")
    .doc("test")
    .set({ test: "test1234" })
    .then(() => true)
    .catch((error) => error);
