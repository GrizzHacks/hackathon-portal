import type { Express } from "express";
import createProfiles from "./createProfiles";
import deleteProfiles from "./deleteProfiles";
import getProfiles from "./getProfiles";
import listProfiles from "./listProfiles";
import updateProfiles from "./updateProfiles";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/:profilesId`, getProfiles);
  app.post(`${endpoint}/`, createProfiles);
  app.patch(`${endpoint}/:profilesId`, updateProfiles);
  app.delete(`${endpoint}/:profilesId`, deleteProfiles);
  app.get(`${endpoint}/`, listProfiles);
};
