import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

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
      companyLogoUrl: { rules: ["string"], required: true },
      companyAcronym: { rules: ["string"], required: true },
      sponsorTierId: { rules: ["string"], required: true },
      //overriddenBenefits: { [key: string]: string }; TODO: Support Dictionary Advanced Types
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
