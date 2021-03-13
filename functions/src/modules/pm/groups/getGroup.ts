import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getGroup: ExpressFunction = (req, res, next) => {  const execute: ExpressFunction = (req, res, next) => {
    const errorHandler = expressErrorHandlerFactory(req, res, next);
    firebaseApp
      .firestore()
      .collection("PrizeCatagoryGroup")
      .doc(req.params.companyId)
      .get()
      .then((document) => {
        const data = document.data() as PMGroup | undefined;
        if (data) {
          res.status(200).send(JSON.stringify(data));
          next();
        } else {
          errorHandler(`PrizeCatagoryGroup/${req.params.companyId} has no data.`);
        }
      })
      .catch(errorHandler);
  };};




export default getGroup;
