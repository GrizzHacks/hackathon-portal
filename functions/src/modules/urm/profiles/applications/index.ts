import type { Express } from "express";
import createApplications from "./createApplications";
import deleteApplications from "./deleteApplications";
import getApplications from "./getApplications";
import listApplications from "./listApplications";
import updateApplications from "./updateApplications";

export default (app: Express, endpoint: string) => {
   app.get(`${endpoint}/`, listApplications);
  app.get(`${endpoint}/:profilesId`, getApplications);
  app.post(`${endpoint}/`, createApplications);
  app.patch(`${endpoint}/:profilesId`, updateApplications);
  app.delete(`${endpoint}/:profilesId`, deleteApplications);
};
