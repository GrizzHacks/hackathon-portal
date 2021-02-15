import type { Express } from "express";
import createTier from "./createCompany";
import deleteTier from "./deleteCompany";
import getTier from "./getCompany";
import listTiers from "./listCompanies";
import updateTier from "./updateCompany";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listTiers);
  app.get(`${endpoint}/:tierId`, getTier);
  app.post(`${endpoint}/`, createTier);
  app.patch(`${endpoint}/:tierId`, updateTier);
  app.delete(`${endpoint}/:tierId`, deleteTier);
};
