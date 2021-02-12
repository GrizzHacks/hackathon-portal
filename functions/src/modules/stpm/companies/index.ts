import { Express } from "express";
import createCompany from "./createCompany";
import deleteCompany from "./deleteCompany";
import getCompany from "./getCompany";
import getCompanyBenefits from "./getCompanyBenefits";
import listCompanies from "./listCompanies";
import updateCompany from "./updateCompany";

const endpoint = "/companies";

export default (app: Express) => {
  // build multiple CRUD interfaces:
  app.get(`${endpoint}/`, (req, res) => res.send(listCompanies()));
  app.get(`${endpoint}/:companyId`, (req, res) =>
    res.send(getCompany(req.params.companyId))
  );
  app.post(`${endpoint}/`, (req, res) => res.send(createCompany(req.body)));
  app.patch(`${endpoint}/:companyId`, (req, res) =>
    res.send(updateCompany(req.params.companyId, req.body))
  );
  app.delete(`${endpoint}/:companyId`, (req, res) =>
    res.send(deleteCompany(req.params.companyId))
  );
  app.get(`${endpoint}/:companyId/benefits`, (req, res) =>
    res.send(getCompanyBenefits(req.params.companyId))
  );
};
