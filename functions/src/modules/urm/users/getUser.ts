import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getUser: ExpressFunction = (req, res, next) => {
  const requesterId = (res.locals.permissions as UserPermission).userId;

  if (requesterId === req.params.userId) {
    execute(req, res, next);
  } else {
    uasPermissionSwitch({
      organizer: { accepted: execute },
      sponsor: { accepted: execute },
    })(req, res, next);
  }
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("users")
    .doc(req.params.userId)
    .get()
    .then((document) => {
      const data = document.data() as URMUser | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`users/${req.params.userId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getUser;
