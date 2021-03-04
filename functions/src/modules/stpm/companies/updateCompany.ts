import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateCompany: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      companyName: { rules: ["string"] },
      companyLogoUrl: { rules: ["string"] },
      companyAcronym: { rules: ["string"] },
      sponsorTierId: { rules: ["string"] },

      // overriddenBenefits: { [key: string]: string }; TODO: Support Dictionary Advanced Types
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};


const validateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      companyName: { rules: ["string"] },
      companyLogoUrl: { rules: ["string"] },
      companyAcronym: { rules: ["string"] },

    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorCompany")
    .doc(req.params.companyId)
    .update(res.locals.body as STPMCompaniesUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  if (sponsorCompany === req.params.companyId) {
    validateSponsor(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${sponsorCompany} tried viewing benefits for ${req.params.companyId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default updateCompany;
