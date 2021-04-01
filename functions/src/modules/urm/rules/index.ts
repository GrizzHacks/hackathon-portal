import type { Express } from "express";
import createRules from "./createRules";
import deleteRules from "./deleteRules";
import getRules from "./getRules";
import listRules from "./listRules";
import updateRules from "./updateRules";

export default (app: Express, endpoint: string) => {
   app.get(`${endpoint}/`, listRules);
  app.get(`${endpoint}/:rulesId`, getRules);
  app.post(`${endpoint}/`, createRules);
  app.patch(`${endpoint}/:rulesId`, updateRules);
  app.delete(`${endpoint}/:rulesId`, deleteRules);
};
