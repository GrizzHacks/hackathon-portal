import type { Express } from "express";
import createApplications from "./createApplications";
import deleteApplications from "./deleteApplications";
import getApplications from "./getApplications";
import listApplications from "./listApplications";
import updateApplications from "./updateApplications";

export default (app: Express, endpoint: string) => {
   app.get(`${endpoint}/`, listApplications);
  app.get(`${endpoint}/:applicationId`, getApplications);
  app.post(`${endpoint}/`, createApplications);
  app.patch(`${endpoint}/:applicationId`, updateApplications);
  app.delete(`${endpoint}/:applicationId`, deleteApplications);
};
