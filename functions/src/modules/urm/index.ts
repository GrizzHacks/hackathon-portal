import type { Express } from "express";
import users from "./users";
import questions from "./questions";
import rules from "./rules";

export default (app: Express) => {
  users(app, "/users");
  questions(app, "/questions");
  rules(app, "/rules");
};
