import type { Express } from "express";
import createGroup from "./createGroup";
import deleteGroup from "./deleteGroup";
import getGroup from "./getGroup";
import listGroups from "./listGroups";
import updateGroup from "./updateGroup";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listGroups);
  app.get(`${endpoint}/:prizeGroupId`, getGroup);
  app.post(`${endpoint}/`, createGroup);
  app.patch(`${endpoint}/:prizeGroupId`, updateGroup);
  app.delete(`${endpoint}/:prizeGroupId`, deleteGroup);
};
