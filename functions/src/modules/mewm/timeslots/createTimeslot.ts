import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
import type { ExpressFunction } from "../../../@types";

const replaceMe: ExpressFunction = (req, res, next) => {};
const createEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
    sponsor: { accepted: validate }, // TO-DO: Need to filter for only sponsors where the benefit allows
  })(req, res, next);
};


export default replaceMe;
const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventId: { rules: ["string"], required: true },
      eventName: { rules: ["string"], required: true },
      eventDescription: { rules: ["string"], required: true },
      virtual: { rules: ["boolean"], required: true },
      location: { rules: ["string"]},
      joinLink: { rules: ["string"]},
      joinLinkToPresenters: { rules: ["string"]},
      joinLinkToAttendees: { rules: ["string"]},