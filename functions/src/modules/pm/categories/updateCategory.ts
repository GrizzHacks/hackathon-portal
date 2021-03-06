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
    sponsor: { accepted: validateSponsor },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCategoryName: { rules: ["string"] },
      prizeCategoryDescription: { rules: ["string"] },
      eligibility: { rules: ["string", "emptystring"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      companyId: { rules: ["string", "emptystring"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCategoryName: { rules: ["string"] },
      prizeCategoryDescription: { rules: ["string"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["inProgress", "awaitingApproval"],
          },
        ],
      },
      eligibility: { rules: ["string", "emptystring"] },
    },
  };
  requestBodyTypeValidator(
    req,
    res,
    next
  )(validationRules, executeIfSponsorMatches);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as PMCategoryUpdateRequest;

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const sponsorCompany = (res.locals.permissions as UserPermission).companyId;

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .get()
    .then((doc) => {
      if (
        sponsorCompany === (doc.data() as PMCategory | undefined)?.companyId
      ) {
        if (
          (doc.data() as PMCategory | undefined)?.approvalStatus !== "approved"
        ) {
          execute(req, res, next);
        } else {
          errorHandler(
            `A sponsor from ${sponsorCompany} tried updating the approved prizeCategory ${req.params.categoryId}.`,
            400,
            "Sorry, this prize category has already been approved and published. Reach out to the organizing team if you still want to make an edit."
          );
        }
      } else {
        errorHandler(
          `A sponsor from ${sponsorCompany} tried updating prizeCategory ${req.params.categoryId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    })
    .catch(errorHandler);
};

export default updateCategory;
