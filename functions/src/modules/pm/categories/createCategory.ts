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
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCategoryId: { rules: ["string"], required: true },
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

const validateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCategoryId: { rules: ["string"], required: true },
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

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  if (sponsorCompany === req.params.categoryId) {
    validateSponsor(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${sponsorCompany} tried viewing information for ${req.params.categoryId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as PMCategoryCreateRequest;

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
