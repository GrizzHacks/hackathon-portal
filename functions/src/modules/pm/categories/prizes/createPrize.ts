import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
    expressErrorHandlerFactory,
    requestBodyTypeValidator,
  } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const createCategory: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: { accepted: validate},
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
        prizeId: { rules: ["string"], required: true },
        prizeName: { rules: ["string"], required: true },
        PrizeUrl: { rules: ["string"]},
        prizeCategory: { rules: ["string"]},
        prizeListingName: { rules: ["string"], required: true },
        //overriddenBenefits: { [key: string]: string }; TODO: Support Dictionary Advanced Types
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);


  const body = JSON.parse(req.body)

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(body.CategoryId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};


export default createCategory;