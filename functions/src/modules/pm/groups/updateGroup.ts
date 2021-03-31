import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateGroup: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: validateOrganizer },
    }) (req, res, next)
};
const validateOrganizer: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeGroupId: { rules: ["string"] },
        prizeGroupName: { rules: ["string"] },
        prizeGroupDescription: { rules: ["string"] },
        prizeGroupOrder: {
          rules: [
          {
              type: "array",
              rules: ["string"],
          },
          ],
        },
          },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
}; 

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("PrizeCategoryGroup")
    .doc(req.params.prizeGroupId)
    .update(res.locals.parsedBody as PMGroupUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateGroup;
