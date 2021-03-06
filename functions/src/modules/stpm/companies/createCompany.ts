import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
import { validationRules as stpmTierUpdateValidationRules } from "../tiers/updateTier";

const createCompany: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      companyId: { rules: ["string"], required: true },
      companyName: { rules: ["string"], required: true },
      companyLogoUrl: { rules: ["string", "emptystring"] },
      companyWebsite: { rules: ["string", "emptystring"] },
      companyAcronym: { rules: ["string", "emptystring"] },
      sponsorTierId: { rules: ["string"], required: true },
      overriddenBenefits: { rules: [stpmTierUpdateValidationRules] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as STPMCompanyCreateRequest;

  // Preprocessing for values that allow default values
  body.overriddenBenefits = body.overriddenBenefits
    ? body.overriddenBenefits
    : {};

  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .doc(body.companyId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createCompany;
