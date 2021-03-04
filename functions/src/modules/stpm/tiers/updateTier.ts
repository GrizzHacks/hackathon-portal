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

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      sponsorTierName: { rules: ["string"] },
      sponsorTierOrder: { rules: ["number"] },
      logoSize: { rules: ["string"] }, // TODO: Support Enum Advanced Types
      sponsorshipExpo: { rules: ["boolean"] },
      techTalk: { rules: ["boolean"] },
      officeHours: { rules: ["boolean"] },
      prize: { rules: ["boolean"] },
      prizeBudget: { rules: ["number"] },
      attendeeData: { rules: ["string"] }, // TODO: Support Enum Advanced Types
      numberOfMentors: { rules: ["number"] },
      numberOfRecruiters: { rules: ["number"] },
      distributionOfSwag: { rules: ["boolean"] },
      openingSessionTalk: { rules: ["boolean"] },
      openingSessionTalkLength: { rules: ["number"] },
      closingSessionTalk: { rules: ["boolean"] },
      closingSessionTalkLength: { rules: ["number"] },
      // otherBenefits: { [key: string]: string }; // TODO: Support Dictionary Advanced Types
    },
  };
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
