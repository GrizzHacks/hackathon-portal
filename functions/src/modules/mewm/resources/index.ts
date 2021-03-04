import type { Express } from "express";
import createResource from "./createResource";
import deleteResource from "./deleteResource";
import getResource from "./getResource";
import listResources from "./listResources";
import updateResource from "./updateResource";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listResources);
  app.get(`${endpoint}/:resourceId`, getResource);
  app.post(`${endpoint}/`, createResource);
  app.patch(`${endpoint}/:resourceId`, updateResource);
  app.delete(`${endpoint}/:resourceId`, deleteResource);
};
