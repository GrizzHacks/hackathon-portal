import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";

const createUsers: ExpressFunction = (req, res, next) => {
  validate(req, res, next);
};

const validate: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      firstName: { rules: ["string"], required: true },
      lastName: { rules: ["string"], required: true },
      phoneNumber: { rules: ["string", "emptystring"] },
      photoUrl: { rules: ["string", "emptystring"] },
      email: { rules: ["string"], required: true },
      password: { rules: ["string"], required: true },
      confirmPassword: { rules: ["string"], required: true },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMUserCreateRequest;

  if (body.password !== body.confirmPassword) {
    errorHandler(
      "password and confirmPassword do not match.",
      400,
      "password and confirmPassword do not match."
    );
  } else if (body.password.length < 6) {
    errorHandler(
      "The password must contain at least 6 characters.",
      400,
      "The password must contain at least 6 characters."
    );
  } else {
    firebaseApp
      .auth()
      .createUser({
        displayName: `${body.firstName} ${body.lastName}`,
        email: body.email,
        password: body.password,
        // phoneNumber: body.phoneNumber, // TODO: Update if supporting phone login/TFA in the future
        photoURL: body.photoUrl,
      })
      .then((user) => {
        const databaseUser: URMUser = {
          userId: user.uid,
          firstName: body.firstName,
          lastName: body.lastName,
          phoneNumber: body.phoneNumber || "",
          photoUrl: body.photoUrl || "",
          email: body.email,
        };

        firebaseApp
          .firestore()
          .collection("users")
          .doc(user.uid)
          .set(databaseUser)
          .then(() => {
            res.status(201).send();
            next();
          })
          .catch(errorHandler);
      })
      .catch(errorHandler);
  }
};

export default createUsers;
