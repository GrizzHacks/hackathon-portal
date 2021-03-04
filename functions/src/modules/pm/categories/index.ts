import type { Express } from "express";
import createCategory from "./createCategory";
import deleteCategory from "./deleteCategory";
import getCategory from "./getCategory";
import listCategories from "./listCategories";
import prizes from "./prizes";
import updateCategory from "./updateCategory";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listCategories);
  app.get(`${endpoint}/:categoryId`, getCategory);
  app.post(`${endpoint}/`, createCategory);
  app.patch(`${endpoint}/:categoryId`, updateCategory);
  app.delete(`${endpoint}/:categoryId`, deleteCategory);
  prizes(app, `${endpoint}/:categoryId/prizes`);
};
