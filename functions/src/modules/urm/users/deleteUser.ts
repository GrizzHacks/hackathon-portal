import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const deleteUser: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .auth()
    .deleteUser(req.params.userId)
    .then(() => {
      firebaseApp
        .firestore()
        .collection("users")
        .doc(req.params.userId)
        .delete()
        .then(() => {
          res.status(200).send();
          next();
        })
        .catch(errorHandler);
    })
    .catch(errorHandler);
};

export default deleteUser;
