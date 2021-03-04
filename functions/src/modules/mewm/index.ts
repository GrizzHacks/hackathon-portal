import type { Express } from "express";
import events from "./events";
import resourcess from "./resources";
import timeslots from "./timeslots";
import types from "./types";

export default (app: Express) => {
  events(app, "/events");
  resourcess(app, "/resourcess");
  timeslots(app, "/timeslots");
  types(app, "/types");
};
