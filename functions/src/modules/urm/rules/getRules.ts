import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getRules: ExpressFunction = (req, res, next) => {
  execute(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("rules")
    .doc(req.params.rulesId)
    .get()
    .then((document) => {
      const data = document.data() as URMRules | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`rules/${req.params.rulesId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getRules;
