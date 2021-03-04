import type { Express } from "express";
import createTier from "./createTier";
import deleteTier from "./deleteTier";
import getTier from "./getTier";
import listTiers from "./listTiers";
import updateTier from "./updateTier";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listTiers);
  app.get(`${endpoint}/:tierId`, getTier);
  app.post(`${endpoint}/`, createTier);
  app.patch(`${endpoint}/:tierId`, updateTier);
  app.delete(`${endpoint}/:tierId`, deleteTier);
};
