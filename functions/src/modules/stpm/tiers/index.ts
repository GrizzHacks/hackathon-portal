import { Express } from "express";
import createTier from "./createCompany";
import deleteTier from "./deleteCompany";
import getTier from "./getCompany";
import listTiers from "./listCompanies";
import updateTier from "./updateCompany";

const endpoint = "/tiers";

export default (app: Express) => {
  // build multiple CRUD interfaces:
  app.get(`${endpoint}/`, (req, res) => res.send(listTiers()));
  app.get(`${endpoint}/:tierId`, (req, res) =>
    res.send(getTier(req.params.tierId))
  );
  app.post(`${endpoint}/`, (req, res) => res.send(createTier(req.body)));
  app.patch(`${endpoint}/:tierId`, (req, res) =>
    res.send(updateTier(req.params.tierId, req.body))
  );
  app.delete(`${endpoint}/:tierId`, (req, res) =>
    res.send(deleteTier(req.params.tierId))
  );
};
