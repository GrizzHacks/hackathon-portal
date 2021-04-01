import type { Express } from "express";
import events from "./profiles";
import timeslots from "./questions";
import types from "./rules";

export default (app: Express) => {
  events(app, "/profiles");
  timeslots(app, "/questions");
  types(app, "/rules");
};
