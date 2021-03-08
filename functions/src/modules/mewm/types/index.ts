import type { Express } from "express";
import createType from "./createType";
import deleteType from "./deleteType";
import getType from "./getType";
import listTypes from "./listTypes";
import updateType from "./updateType";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listTypes);
  app.get(`${endpoint}/:typeId`, getType);
  app.post(`${endpoint}/`, createType);
  app.patch(`${endpoint}/:typeId`, updateType);
  app.delete(`${endpoint}/:typeId`, deleteType);
};
