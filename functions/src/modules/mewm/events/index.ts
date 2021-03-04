import type { Express } from "express";
import createEvent from "./createEvent";
import deleteEvent from "./deleteEvent";
import getEvent from "./getEvent";
import listEvents from "./listEvent";
import updateEvent from "./updateEvent";

export default (app: Express, endpoint: string) => {
  app.get(`${endpoint}/`, listEvents);
  app.get(`${endpoint}/:eventId`, getEvent);
  app.post(`${endpoint}/`, createEvent);
  app.patch(`${endpoint}/:eventId`, updateEvent);
  app.delete(`${endpoint}/:eventId`, deleteEvent);
};
