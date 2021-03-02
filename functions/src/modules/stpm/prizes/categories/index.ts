import type { Express } from "express";
import createCategory from "./createCategory";
import getCategory from "./getCategory";
import listCategories from "./listCategories";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listCategories);
  app.get(`${endpoint}/:CategoryId`, getCategory);
  app.post(`${endpoint}/`, createCategory);
};
