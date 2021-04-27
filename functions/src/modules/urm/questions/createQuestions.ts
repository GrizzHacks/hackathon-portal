import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const createQuestions: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      questionId: { rules: ["string"], required: true },
      applicationQuestionLabel: { rules: ["string"], required: true },
      inOrganizerApplication: {
        rules: [{ type: "enum", rules: ["required", "optional", "no"] }],
      },
      inSponsorApplication: {
        rules: [{ type: "enum", rules: ["required", "optional", "no"] }],
      },
      inMentorApplication: {
        rules: [{ type: "enum", rules: ["required", "optional", "no"] }],
      },
      inVolunteerApplication: {
        rules: [{ type: "enum", rules: ["required", "optional", "no"] }],
      },
      inHackerApplication: {
        rules: [{ type: "enum", rules: ["required", "optional", "no"] }],
      },
      type: {
        rules: [
          { type: "enum", rules: ["string", "number", "enum", "reference"] },
        ],
        required: true,
      },
      enumLabels: { rules: ["string"] },
      enumValues: { rules: ["string"] },
      referenceEndpoint: { rules: ["string"] },
      referenceLabelAttribute: { rules: ["string"] },
      referenceValueAttribute: { rules: ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMQuestionCreateRequest;

  body.inOrganizerApplication = body.inOrganizerApplication
    ? body.inOrganizerApplication
    : "no";
  body.inSponsorApplication = body.inSponsorApplication
    ? body.inSponsorApplication
    : "no";
  body.inMentorApplication = body.inMentorApplication
    ? body.inMentorApplication
    : "no";
  body.inVolunteerApplication = body.inVolunteerApplication
    ? body.inVolunteerApplication
    : "no";
  body.inHackerApplication = body.inHackerApplication
    ? body.inHackerApplication
    : "no";

  if (body.type === "enum") {
    // Clean unused fields
    body.referenceEndpoint = "";
    body.referenceLabelAttribute = "";
    body.referenceValueAttribute = "";

    // More advanced data validation
    if (body.enumLabels === undefined || body.enumValues === undefined) {
      errorHandler(
        "enumLabels and enumValues must both be defined for question type enum.",
        400,
        "enumLabels and enumValues must both be defined for question type enum."
      );
    } else if (
      body.enumLabels.split(";").length !== body.enumValues.split(";").length
    ) {
      errorHandler(
        "enumLabels and enumValues must both have the same number of items.",
        400,
        "enumLabels and enumValues must both have the same number of items."
      );
    } else {
      firebaseApp
        .firestore()
        .collection("questions")
        .doc(body.questionId)
        .set(body)
        .then(() => {
          res.status(201).send();
          next();
        })
        .catch(errorHandler);
    }
  } else if (body.type === "reference") {
    // Clean unused fields
    body.enumLabels = "";
    body.enumValues = "";

    // More advanced data validation
    if (
      body.referenceEndpoint === undefined ||
      body.referenceLabelAttribute === undefined ||
      body.referenceValueAttribute === undefined
    ) {
      errorHandler(
        "referenceEndpoint, referenceLabelAttribute, and referenceValueAttribute must all be defined for question type reference.",
        400,
        "referenceEndpoint, referenceLabelAttribute, and referenceValueAttribute must all be defined for question type reference."
      );
    } else {
      firebaseApp
        .firestore()
        .collection("questions")
        .doc(body.questionId)
        .set(body)
        .then(() => {
          res.status(201).send();
          next();
        })
        .catch(errorHandler);
    }
  } else {
    // Clean unused fields
    body.enumLabels = "";
    body.enumValues = "";
    body.referenceEndpoint = "";
    body.referenceLabelAttribute = "";
    body.referenceValueAttribute = "";

    firebaseApp
      .firestore()
      .collection("questions")
      .doc(body.questionId)
      .set(body)
      .then(() => {
        res.status(201).send();
        next();
      })
      .catch(errorHandler);
  }
};

export default createQuestions;
