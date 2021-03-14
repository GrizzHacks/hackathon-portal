import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
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
        timeslotId: { rules: ["string"], required: true },
        startTime: { rules: ["string"], required: true },
        endTime: { rules: ["string"], required: true },
        // approvalStatus: {
        //     rules: [
        //       {
        //         type: "enum",
        //         rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
        //       },
    },
   
        };
    };
 // requestBodyTypeValidator(req, res, next)(validationRules, execute);




const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as MEWMEventUpdateRequest;

  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};





export default updateTimeslot;