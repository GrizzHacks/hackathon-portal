

import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const updatePrize: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
  })(req, res, next);
};


const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeDisplayName: { rules: ["string"],  },
      prizePrice: { rules: ["string"],  },
      prizeUrl: { rules: ["string"]},
      prizeASIN: { rules: ["string"]},
      prizeListingName: { rules: ["string"], },
     },
    }

  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
}
 


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as PMPrizeUpdateRequest;

  firebaseApp
    .firestore()
    .collection("prizeCategories)
    .doc(req.params.categoryId)
    .collection("prizes")
    .doc(req.params.prizeId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};






export default updatePrize;
