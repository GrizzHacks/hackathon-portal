import type { Express } from "express";
import profiles from "./profiles";
import questions from "./questions";
import rules from "./rules";

export default (app: Express) => {
  profiles(app, "/profiles");
  questions(app, "/questions");
  rules(app, "/rules");
};
