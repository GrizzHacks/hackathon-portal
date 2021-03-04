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
      .collection("PrizeCatagoryGroup")
      .doc(req.params.id)
      .get()
      .then((document) => {
        const data = document.data() as STPMPrizeCatagoryGroup | undefined;
        if(data){
        res.status(200).send(data);
        next();
        } else {
            errorHandler('PrizeCatagoryGroup/${req.params.id} has no data');
        }
      })
      .catch(errorHandler);
  };
  export default getSuperCatagory;