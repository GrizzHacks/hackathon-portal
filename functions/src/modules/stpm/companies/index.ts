import type { Express } from "express";
import createCompany from "./createCompany";
import deleteCompany from "./deleteCompany";
import getCompany from "./getCompany";
import getCompanyBenefits from "./getCompanyBenefits";
import listCompanies from "./listCompanies";
import updateCompany from "./updateCompany";

export default (app: Express, endpoint: string) => {
  // build multiple CRUD interfaces:
  app.get(`${endpoint}/`, listCompanies);
  app.get(`${endpoint}/:companyId`, getCompany);
  app.post(`${endpoint}/`, createCompany);
  app.patch(`${endpoint}/:companyId`, updateCompany);
  app.delete(`${endpoint}/:companyId`, deleteCompany);
  app.get(`${endpoint}/:companyId/benefits/`, getCompanyBenefits);
};
