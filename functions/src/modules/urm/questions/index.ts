import type { Express } from "express";
import createQuestions from "./createQuestions";
import deleteQuestions from "./deleteQuestions";
import getQuestions from "./getQuestions";
import listQuestions from "./listQuestions";
import updateQuestions from "./updateQuestions";

export default (app: Express, endpoint: string) => {
   app.get(`${endpoint}/`, listQuestions);
  app.get(`${endpoint}/:questionsId`, getQuestions);
  app.post(`${endpoint}/`, createQuestions);
  app.patch(`${endpoint}/:questionsId`, updateQuestions);
  app.delete(`${endpoint}/:questionsId`, deleteQuestions);
};
