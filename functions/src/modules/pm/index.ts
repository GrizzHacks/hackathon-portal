import type { Express } from "express";
import categories from "./categories";
import groups from "./groups";

export default (app: Express) => {
  categories(app, "/categories");
  groups(app, "/groups");
};
