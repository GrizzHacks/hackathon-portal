import type { Express } from "express";
import createTimeslot from "./createTimeslot";
import deleteTimeslot from "./deleteTimeslot";
import getTimeslot from "./getTimeslot";
import listTimeslots from "./listTimeslots";
import updateTimeslot from "./updateTimeslot";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listTimeslots);
  app.get(`${endpoint}/:timeslotId`, getTimeslot);
  app.post(`${endpoint}/`, createTimeslot);
  app.patch(`${endpoint}/:timeslotId`, updateTimeslot);
  app.delete(`${endpoint}/:timeslotId`, deleteTimeslot);
};
