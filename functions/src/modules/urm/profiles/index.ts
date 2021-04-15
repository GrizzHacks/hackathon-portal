import type { Express } from "express";
import applications from "./applications";
import createProfiles from "./createProfiles";
import deleteProfiles from "./deleteProfiles";
import getMinimalProfileByEmail from "./getMinimalProfileByEmail";
import getProfiles from "./getProfile";
import listProfiles from "./listProfiles";
import updateProfiles from "./updateProfiles";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/:profileId`, getProfiles);
  app.post(`${endpoint}/`, createProfiles);
  app.patch(`${endpoint}/:profileId`, updateProfiles);
  app.delete(`${endpoint}/:profileId`, deleteProfiles);
  app.get(`${endpoint}/`, listProfiles);
  applications(app, `${endpoint}/:profileId/applications`);

  // For the login page
  app.post(`${endpoint}-by-email`, getMinimalProfileByEmail);
};
