import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createTier: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      sponsorTierId: { rules: ["string"], required: true },
      sponsorTierName: { rules: ["string"], required: true },
      sponsorTierOrder: { rules: ["number"] },
      logoSize: {
        rules: [{ type: "enum", rules: ["xs", "sm", "m", "lg", "xl"] }],
        required: true,
      },
      sponsorshipExpo: { rules: ["boolean"], required: true },
      techTalk: { rules: ["boolean"], required: true },
      officeHours: { rules: ["boolean"], required: true },
      prizeBudget: { rules: ["number"], required: true },
      attendeeData: {
        rules: [{ type: "enum", rules: ["none", "pre", "post"] }],
        required: true,
      },
      numberOfMentors: { rules: ["number"], required: true },
      numberOfRecruiters: { rules: ["number"], required: true },
      distributionOfSwag: { rules: ["boolean"], required: true },
      openingSessionTalkLength: { rules: ["number"], required: true },
      closingSessionTalkLength: { rules: ["number"], required: true },
      otherBenefits: {
        rules: [{ type: "dictionary", rules: ["string", "number"] }],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as STPMTierCreateRequest;

  // Preprocessing for values that allow default values
  body.sponsorTierOrder = body.sponsorTierOrder
    ? body.sponsorTierOrder
    : Date.now();
  body.otherBenefits = body.otherBenefits ? body.otherBenefits : {};

  firebaseApp
    .firestore()
    .collection("sponsorTiers")
    .doc(body.sponsorTierId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

export default createTier;
