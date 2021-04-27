import type { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";

const createapplications: ExpressFunction = (req, res, next) => {
  const requesterId = (res.locals.permissions as UserPermission).userId;

  if (requesterId === req.params.userId) {
    validate(req, res, next);
  } else {
    uasPermissionSwitch({
      organizer: { accepted: validate },
    })(req, res, next);
  }
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      role: {
        rules: [
          {
            type: "enum",
            rules: ["organizer", "sponsor", "mentor", "volunteer", "hacker"],
          },
        ],
      },
      otherQuestions: {
        rules: [{ type: "dictionary", rules: ["string", "number"] }],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMApplicationCreateRequest;

  body.accepted = "pending";

  firebaseApp
    .firestore()
    .collection("users")
    .doc(req.params.userId)
    .update(body)
    .then(() => {
      firebaseApp
        .auth()
        .setCustomUserClaims(req.params.userId, {
          role: body.role.toUpperCase(),
        })
        .then(() => {
          firebaseApp
            .firestore()
            .collection("users")
            .doc(req.params.userId)
            .get()
            .then((document) => {
              const userData = document.data() as URMUser | undefined;
              if (userData) {
                const mergedData = {
                  ...userData,
                  ...(userData as any).otherQuestions,
                };
                console.log(mergedData);
                firebaseApp
                  .firestore()
                  .collection("rules")
                  .orderBy("ruleOrder", "asc")
                  .get()
                  .then((documents) => {
                    let early = false;
                    for (const doc of documents.docs) {
                      const rule = doc.data() as URMRules;
                      if (rule.role === body.role) {
                        const value: string | undefined =
                          mergedData[rule.applicationQuestionId];
                        if (
                          value &&
                          (value === rule.acceptedValues ||
                            "*" === rule.acceptedValues)
                        ) {
                          firebaseApp
                            .firestore()
                            .collection("rules")
                            .doc(rule.ruleId)
                            .update({
                              matchesRemaining: rule.matchesRemaining - 1,
                            })
                            .then(() => {
                              firebaseApp
                                .firestore()
                                .collection("users")
                                .doc(req.params.userId)
                                .update({ accepted: rule.result })
                                .then(() => {
                                  firebaseApp
                                    .auth()
                                    .setCustomUserClaims(req.params.userId, {
                                      role: body.role.toUpperCase(),
                                      accepted: rule.result,
                                    })
                                    .then(() => {
                                      early = true;
                                      res.status(201).send();
                                      next();
                                    })
                                    .catch(errorHandler);
                                })
                                .catch(errorHandler);
                            })
                            .catch(errorHandler);
                          break;
                        }
                      }
                    }
                    setTimeout(() => {
                      if (!early) {
                        res.status(201).send();
                        next();
                      }
                    }, 500);
                  });
              } else {
                errorHandler(`users/${req.params.userId} has no data.`);
              }
            })
            .catch(errorHandler);
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};

export default createapplications;
