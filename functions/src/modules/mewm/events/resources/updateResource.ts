import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const updateResources: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
        resourceName: { rules: ["string"] },
        resourceDescription: { rules: ["string"] },
        resourceUrl: { rules:  ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as MEWMEventResourcesUpdateRequest;
  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
    .collection("resources")
    .doc(req.params.resourceId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).companyId;
  if (sponsorCompany === req.params.companyId) {
    validate(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${sponsorCompany} tried updating resources for ${req.params.resourceId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default updateResources;
