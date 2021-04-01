

import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const updatePrize: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: ValidateOrganizer },
  })(req, res, next);
};


const ValidateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeDisplayName: { rules: ["string"],  },
      prizePrice: { rules: ["string"],  },
      prizeUrl: { rules: ["string"]},
      prizeasin: { rules: ["string"]},
      prizeListingName: { rules: ["string"], },
      prizeurl: { rules: ["string"], },
    }

  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
}
 


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as PMPrizeUpdateRequest;

  firebaseApp
    .firestore()
    .collection("Prize")
    .doc(req.params.prizeId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};






export default updatePrize;