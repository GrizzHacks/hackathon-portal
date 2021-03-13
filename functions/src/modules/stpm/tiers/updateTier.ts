import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateTier: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

// Broken out into its own exportable config to be used on the Company endpoints
export const validationRules: ValidatorObjectRules = {
  type: "object",
  rules: {
    sponsorTierName: { rules: ["string"] },
    sponsorTierOrder: { rules: ["number"] },
    logoSize: {
      rules: [{ type: "enum", rules: ["xs", "sm", "m", "lg", "xl"] }],
    },
    sponsorshipExpo: { rules: ["boolean"] },
    techTalk: { rules: ["boolean"] },
    officeHours: { rules: ["boolean"] },
    prize: { rules: ["boolean"] },
    prizeBudget: { rules: ["number"] },
    attendeeData: { rules: [{ type: "enum", rules: ["none", "pre", "post"] }] },
    numberOfMentors: { rules: ["number"] },
    numberOfRecruiters: { rules: ["number"] },
    distributionOfSwag: { rules: ["boolean"] },
    openingSessionTalk: { rules: ["boolean"] },
    openingSessionTalkLength: { rules: ["number"] },
    closingSessionTalk: { rules: ["boolean"] },
    closingSessionTalkLength: { rules: ["number"] },
    otherBenefits: {
      rules: [{ type: "dictionary", rules: ["string", "number"] }],
    },
  },
};

const validate: ExpressFunction = (req, res, next) => {
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorTiers")
    .doc(req.params.tierId)
    .update(res.locals.parsedBody as STPMTierUpdateRequest)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default updateTier;
