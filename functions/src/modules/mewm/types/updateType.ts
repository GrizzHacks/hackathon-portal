import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateType: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
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
      eventTypeName: { rules: ["string"] },
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
  const body = res.locals.parsedBody as MEWMEventTypeUpdateRequest;

  firebaseApp
    .firestore()
    .collection("eventTypes")
    .doc(req.params.typeId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateType;
