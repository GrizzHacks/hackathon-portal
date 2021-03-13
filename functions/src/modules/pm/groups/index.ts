import type { Express } from "express";
import createGroup from "./createGroup";
import deleteGroup from "./deleteGroup";
import getGroup from "./getGroup";
import listGroups from "./listGroups";
import updateGroup from "./updateGroup";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listGroups);
  app.get(`${endpoint}/:groupId`, getGroup);
  app.post(`${endpoint}/`, createGroup);
  app.patch(`${endpoint}/:groupId`, updateGroup);
  app.delete(`${endpoint}/:groupId`, deleteGroup);
};
