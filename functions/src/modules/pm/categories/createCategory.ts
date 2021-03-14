import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validateOrganizer },
    sponsor: { accepted: validateSponsor },
  })(req, res, next);
};

const validateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      prizeCategoryId: { rules: ["string"], required: true },
      prizeCategoryName: { rules: ["string"], required: true },
      prizeCategoryDescription: { rules: ["string"], required: true },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      eligibility: { rules: ["string", "emptystring"] },
      companyId: { rules: ["string", "emptystring"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const validateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      categoryId: { rules: ["string"], required: true },
      prizeCategoryName: { rules: ["string"], required: true },
      prizeCategoryDescription: { rules: ["string"], required: true },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["inProgress", "awaitingApproval"],
          },
        ],
      },
      eligibility: { rules: ["string", "emptystring"] },
      companyId: { rules: ["string"], required: true },
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

  const body = res.locals.parsedBody as PMCategoryCreateRequest;

  if (body.approvalStatus === undefined) {
    body.approvalStatus = "inProgress";
  }

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(body.prizeCategoryId)
    .set(body)
    .then(() => {
      res.status(201).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  const body = res.locals.parsedBody as PMCategoryCreateRequest;

  if (sponsorCompany === body.companyId) {
    execute(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${sponsorCompany} tried creating a prize for ${body.companyId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default createCategory;
