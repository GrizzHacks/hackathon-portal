import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
    expressErrorHandlerFactory,
    requestBodyTypeValidator,
  } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const createprize: ExpressFunction = (req, res, next) => {

  uasPermissionSwitch({
    organizer: { accepted: validate},
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeId: { rules: ["string"], required: true  },
        prizeDisplayName: { rules: ["string"], required: true  },
        prizePrice: { rules: ["string"], required: true },
        prizeListingName: { rules: ["string"], required: true },
        prizeURL: { rules: ["string"], required: true  },
        prizeasin: { rules: ["string"], required: true  },
        
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
 
 const body = res.locals.parsedBody as PMPrizeCreateRequest;

  firebaseApp
    .firestore()
    .collection("Prize")
    .doc(body.prizeId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};


export default createprize;