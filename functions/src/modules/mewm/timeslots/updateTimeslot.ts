import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateTimeslot: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: ValidateOrganizer },
  })(req, res, next);
};


const ValidateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      startTime: { rules: ["string"] },
      endTime: { rules: ["string"] },
      eventTypeId: { rules: ["string"] },
      eventId: { rules: ["string"]},
    }
    
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
}


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as MEWMTimeslotUpdateRequest;

  firebaseApp
    .firestore()
    .collection("timeslots")
    .doc(req.params.timeslotId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};





export default updateTimeslot;
