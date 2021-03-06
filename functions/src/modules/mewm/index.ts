import type { Express } from "express";
import events from "./events";
import timeslots from "./timeslots";
import types from "./types";

export default (app: Express) => {
  events(app, "/events");
  timeslots(app, "/timeslots");
  types(app, "/types");
};
