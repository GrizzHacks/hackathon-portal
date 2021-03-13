import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listCategories: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .orderBy("prizeCategoryName", "asc")
    .get()
    .then((documents) => {
      const prizeCategories: PMCategory[] = [];
      for (const doc of documents.docs) {
        prizeCategories.push(doc.data() as PMCategory);
      }
      res
        .status(200)
        .send(JSON.stringify({ prizeCategories } as PMCategoryList));
      next();
    })

    .catch(errorHandler);
};

export default listCategories;
