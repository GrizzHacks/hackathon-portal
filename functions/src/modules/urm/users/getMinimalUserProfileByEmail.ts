import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";

const getMinimalUserProfileByEmail: ExpressFunction = (req, res, next) => {
  validate(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      email: { rules: ["string"], required: true },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const email = res.locals.parsedBody.email as string;

  firebaseApp
    .auth()
    .getUserByEmail(email)
    .then((user) => {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((document) => {
          const data = document.data() as URMUser | undefined;
          if (data) {
            const minimalData: URMMinimalUser = {
              userId: data.userId,
              firstName: data.firstName,
              email: data.email,
              photoUrl: data.photoUrl,
            };
            res.status(200).send(JSON.stringify(minimalData));
            next();
          } else {
            errorHandler(`users/${req.params.userId} has no data.`);
          }
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};

export default getMinimalUserProfileByEmail;
