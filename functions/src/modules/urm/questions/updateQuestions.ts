import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";
const updateQuestion: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: validate },
  })(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      applicationQuestionLabel: { rules: ["string"] },
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
      },
      enumLabels: { rules: ["string"] },
      enumValues: { rules: ["string"] },
      referenceEndpoint: { rules: ["string"] },
      referenceCollection: { rules: ["string"] },
      referenceLabelAttribute: { rules: ["string"] },
      referenceValueAttribute: { rules: ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMQuestionUpdateRequest;

  firebaseApp
    .firestore()
    .collection("questions")
    .doc(req.params.questionId)
    .get()
    .then((document) => {
      const data = document.data() as URMQuestion | undefined;
      if (data) {
        const merged = { ...data, ...body };
        if (body.type === "enum") {
          // Clean unused fields
          body.referenceEndpoint = "";
          body.referenceCollection = "";
          body.referenceLabelAttribute = "";
          body.referenceValueAttribute = "";

          // More advanced data validation
          if (
            merged.enumLabels === undefined ||
            merged.enumValues === undefined
          ) {
            errorHandler(
              "enumLabels and enumValues must both be defined for question type enum.",
              400,
              "enumLabels and enumValues must both be defined for question type enum."
            );
          } else if (
            merged.enumLabels.split(";").length !==
            merged.enumValues.split(";").length
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
              .doc(req.params.questionId)
              .update(body)
              .then(() => {
                res.status(200).send();
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
            merged.referenceEndpoint === undefined ||
            merged.referenceCollection === undefined ||
            merged.referenceLabelAttribute === undefined ||
            merged.referenceValueAttribute === undefined
          ) {
            errorHandler(
              "referenceEndpoint, referenceCollection, referenceLabelAttribute, and referenceValueAttribute must all be defined for question type reference.",
              400,
              "referenceEndpoint, referenceCollection, referenceLabelAttribute, and referenceValueAttribute must all be defined for question type reference."
            );
          } else {
            firebaseApp
              .firestore()
              .collection("questions")
              .doc(req.params.questionId)
              .update(body)
              .then(() => {
                res.status(200).send();
                next();
              })
              .catch(errorHandler);
          }
        } else {
          // Clean unused fields
          body.enumLabels = "";
          body.enumValues = "";
          body.referenceEndpoint = "";
          body.referenceCollection = "";
          body.referenceLabelAttribute = "";
          body.referenceValueAttribute = "";

          firebaseApp
            .firestore()
            .collection("questions")
            .doc(req.params.questionId)
            .update(body)
            .then(() => {
              res.status(200).send();
              next();
            })
            .catch(errorHandler);
        }
      } else {
        errorHandler(`questions/${req.params.questionId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default updateQuestion;
