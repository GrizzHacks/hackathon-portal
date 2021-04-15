import type { Express } from "express";
import createProfiles from "./createProfiles";
import deleteProfiles from "./deleteProfiles";
import getProfiles from "./getProfiles";
import listProfiles from "./listProfiles";
import updateProfiles from "./updateProfiles";
import applications from "./applications";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/:profileId`, getProfiles);
  app.post(`${endpoint}/`, createProfiles);
  app.patch(`${endpoint}/:profileId`, updateProfiles);
  app.delete(`${endpoint}/:profileId`, deleteProfiles);
  app.get(`${endpoint}/`, listProfiles);
  applications(app, `${endpoint}/:profileId/applications`);
};
