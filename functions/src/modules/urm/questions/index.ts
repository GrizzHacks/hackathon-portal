import type { Express } from "express";
import createQuestions from "./createQuestions";
import deleteQuestions from "./deleteQuestions";
import getQuestions from "./getQuestions";
import listQuestions from "./listQuestions";
import updateQuestions from "./updateQuestions";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listQuestions);
  app.get(`${endpoint}/:questionId`, getQuestions);
  app.post(`${endpoint}/`, createQuestions);
  app.patch(`${endpoint}/:questionId`, updateQuestions);
  app.delete(`${endpoint}/:questionId`, deleteQuestions);
};
