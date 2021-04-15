import type { Express } from "express";
import companies from "./companies";
import tiers from "./tiers";

export default (app: Express) => {
  companies(app, "/companies");
  tiers(app, "/tiers");
};
