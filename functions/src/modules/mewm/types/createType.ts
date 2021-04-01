import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createType: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const permissionsObjectValidationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      accepted: {
        rules: ["boolean"],
      },
      pending: {
        rules: ["boolean"],
      },
      rejected: {
        rules: ["boolean"],
      },
    },
  };

  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventTypeId: { rules: ["string"], required: true },
      eventTypeName: { rules: ["string"], required: true },
      eventTypeDescription: { rules: ["string", "emptystring"] },
      permissions: {
        rules: [
          {
            type: "object",
            rules: {
              organizer: {
                rules: ["boolean", permissionsObjectValidationRules],
              },
              sponsor: {
                rules: ["boolean", permissionsObjectValidationRules],
              },
              mentor: {
                rules: ["boolean", permissionsObjectValidationRules],
              },
              volunteer: {
                rules: ["boolean", permissionsObjectValidationRules],
              },
              hacker: {
                rules: ["boolean", permissionsObjectValidationRules],
              },
            },
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as MEWMEventTypeCreateRequest;

  if (body.eventTypeDescription === undefined) {
    body.eventTypeDescription = "";
  }
  if (body.permissions === undefined) {
    body.permissions = {};
  }

  firebaseApp
    .firestore()
    .collection("eventTypes")
    .doc(body.eventTypeId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createType;
