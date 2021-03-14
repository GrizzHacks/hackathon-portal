import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
    sponsor: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      categoryId: { rules: ["string"], required: true },
      prizeCategoryName: { rules: ["string"], required: true },
      prizeCategoryDescription: { rules: ["string"], required: true},
      approvalStatus: { rules: [{
        type: "enum",
        rules: ["string"],
      }]},
      eligibility: { rules: ["string"]},
      companyId: { rules: ["string"]},
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as PMCategoryCreateRequest;

  if(body.approvalStatus === undefined){
    body.approvalStatus = "inProgress"
  }

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(body.categoryId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createCategory;
