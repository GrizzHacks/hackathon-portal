import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getSuperCatagory: ExpressFunction = (req, res, next) => {
    uasPermissionSwitch({
        organizer: {accepted: execute},
    })(req, res, next);
  };

const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
    firebaseApp
      .firestore()
      .collection("superCategories")
      .doc(req.params.id)
      .get()
      .then((document) => {
        console.log(req.params.id);
        console.log(document.data());
        res.status(200).send(document.data());
        next();
      })
      .catch(errorHandler);
  };
  export default getSuperCatagory;