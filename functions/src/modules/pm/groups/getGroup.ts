import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getGroup: ExpressFunction = (req, res, next) => { 
   const errorHandler = expressErrorHandlerFactory(req, res, next);
    firebaseApp
    .firestore()
    .collection("prizeGroups")
    .doc(req.params.prizeGroupId)
    .get()
    .then((document) => {
      const data = document.data() as PMGroup | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`Prize Group /${req.params.prizeGroupId} has no data.`);
      }
    })
    .catch(errorHandler);
};


export default getGroup;
