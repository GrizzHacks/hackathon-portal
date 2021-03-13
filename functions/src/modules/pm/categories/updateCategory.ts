import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
        prizeCategoryName: { rules: ["string"] },
        prizeCategoryDescription: { rules: ["string"]},
        eligibility: { rules: ["string"]},
        approvalStatus: { rules: [{
          type: "enum",
          rules: ["string"],
        }]},
        companyId: { rules: ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {
    const validationRules: ValidatorObjectRules = {
      type: "object",
      rules: {
          prizeCategoryName: { rules: ["string"], required: true },
          prizeCategoryDescription: { rules: ["string"]},
          approvalStatus: { rules: ["string"]},
          eligibility: { rules: ["string"]},
      },
    };
    requestBodyTypeValidator(req, res, next)(validationRules, execute);
  };

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .update(res.locals.parsedBody as PMCategoryUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
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

export default updateCategory;
