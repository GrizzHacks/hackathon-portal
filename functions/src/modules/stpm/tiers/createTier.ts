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
      logoSize: { rules: ["string"], required: true }, // TODO: Support Enum Advanced Types
      sponsorshipExpo: { rules: ["boolean"], required: true },
      techTalk: { rules: ["boolean"], required: true },
      officeHours: { rules: ["boolean"], required: true },
      prize: { rules: ["boolean"], required: true },
      prizeBudget: { rules: ["number"] },
      attendeeData: { rules: ["string"], required: true }, // TODO: Support Enum Advanced Types
      numberOfMentors: { rules: ["number"], required: true },
      numberOfRecruiters: { rules: ["number"], required: true },
      distributionOfSwag: { rules: ["boolean"], required: true },
      openingSessionTalk: { rules: ["boolean"], required: true },
      openingSessionTalkLength: { rules: ["number"] },
      closingSessionTalk: { rules: ["boolean"], required: true },
      closingSessionTalkLength: { rules: ["number"] },
      // otherBenefits: { [key: string]: string }; // TODO: Support Dictionary Advanced Types
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
  body.prizeBudget = body.prizeBudget ? body.prizeBudget : 0;
  body.openingSessionTalkLength = body.openingSessionTalkLength
    ? body.openingSessionTalkLength
    : 0;
  body.closingSessionTalkLength = body.closingSessionTalkLength
    ? body.closingSessionTalkLength
    : 0;

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
