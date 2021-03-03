import type { ExpressFunction } from "../../../@types";
import { uasPermissionSwitch } from "../../../systems/uas";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";




const getCompany: ExpressFunction = (req, res, next) => {
  res.status(200).send();
  next();
  uasPermissionSwitch({
    organizer: {accepted: execute},
    sponsor: {accepted: execute},
  })(req,res,next)
};

const execute: ExpressFunction = (req,res, next) => {
  const errorHandler = expressErrorHandlerFactory(req,res,next);
  firebaseApp
  .firestore()
  .collection("Companies")
  .doc(req.params.comapnyId)
  .get()
  .then((document) => {
  console.log(req.params.comapnyId);
  res.status(200).send(document.data());
  next();
  })
  .catch(errorHandler);
}

export default getCompany;
