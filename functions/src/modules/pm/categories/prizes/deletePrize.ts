import { ExpressFunction } from "../../../../@types";
import { firebaseApp } from "../../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../../helpers";
import { uasPermissionSwitch } from "../../../../systems/uas";


const deletePrize: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};


const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("Prize")
    .doc(req.params.prizeId)
    .delete()
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

export default deletePrize;
