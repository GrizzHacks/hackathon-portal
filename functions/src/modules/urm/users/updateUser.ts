import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateUser: ExpressFunction = (req, res, next) => {
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
      firstName: { rules: ["string"] },
      lastName: { rules: ["string"] },
      phoneNumber: { rules: ["string", "emptystring"] },
      photoUrl: { rules: ["string", "emptystring"] },
      email: { rules: ["string"] },
      password: { rules: ["string"] },
      confirmPassword: { rules: ["string"] },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMUserUpdateRequest;

  if (body.password && body.password.length < 6) {
    errorHandler(
      "The password must contain at least 6 characters.",
      400,
      "The password must contain at least 6 characters."
    );
  } else if (body.password !== body.confirmPassword) {
    errorHandler(
      "password and confirmPassword do not match.",
      400,
      "password and confirmPassword do not match."
    );
  } else {
    const databaseUserUpdateObject = { ...body };
    delete databaseUserUpdateObject.password; // Remove password as it must not be saved to the database
    delete databaseUserUpdateObject.confirmPassword; // Remove confirmPassword as it must not be saved to the database

    // Check that we're changing more than just the password (i.e. a database update is required)
    console.log(Object.keys(databaseUserUpdateObject).length);
    if (Object.keys(databaseUserUpdateObject).length > 0) {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(req.params.userId)
        .update(databaseUserUpdateObject)
        .then(() => {
          executeFirebaseAuthUpdate(req, res, next);
        })
        .catch(errorHandler);
    } else {
      // Handle just a password change
      executeFirebaseAuthUpdate(req, res, next);
    }
  }
};

const executeFirebaseAuthUpdate: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = res.locals.parsedBody as URMUserUpdateRequest;

  if (body.firstName || body.lastName) {
    firebaseApp
      .firestore()
      .collection("users")
      .doc(req.params.userId)
      .get()
      .then((document) => {
        const data = document.data() as URMUser | undefined;
        if (data) {
          firebaseApp
            .auth()
            .updateUser(req.params.userId, {
              displayName: `${data.firstName} ${data.lastName}`,
              email: body.email,
              password: body.password,
              // phoneNumber:updateRequesty.phoneNumber, // TODO: Update if supporting phone login/TFA in the future
              photoURL: body.photoUrl,
            })
            .then(() => {
              res.status(200).send();
              next();
            })
            .catch(errorHandler);
        } else {
          errorHandler(`users/${req.params.userId} has no data.`);
        }
      })
      .catch(errorHandler);
  } else {
    firebaseApp
      .auth()
      .updateUser(req.params.userId, {
        email: body.email,
        password: body.password,
        // phoneNumber:updateRequesty.phoneNumber, // TODO: Update if supporting phone login/TFA in the future
        photoURL: body.photoUrl,
      })
      .then(() => {
        res.status(200).send();
        next();
      })
      .catch(errorHandler);
  }
};

export default updateUser;
