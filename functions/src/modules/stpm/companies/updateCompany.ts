import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
import { validationRules as stpmTierUpdateValidationRules } from "../tiers/updateTier";

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
      companyLogoUrl: { rules: ["string", "emptystring"] },
      companyWebsite: { rules: ["string", "emptystring"] },
      companyAcronym: { rules: ["string", "emptystring"] },
      sponsorTierId: { rules: ["string"] },
      overriddenBenefits: { rules: [stpmTierUpdateValidationRules] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      companyName: { rules: ["string"] },
      companyLogoUrl: { rules: ["string", "emptystring"] },
      companyWebsite: { rules: ["string", "emptystring"] },
      companyAcronym: { rules: ["string", "emptystring"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .doc(req.params.companyId)
    .update(res.locals.parsedBody as STPMCompanyUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).companyId;
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
