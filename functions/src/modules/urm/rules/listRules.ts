import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const listRules: ExpressFunction = (req, res, next) => {
  execute(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("rules")
    .orderBy("ruleOrder", "asc")
    .get()
    .then((documents) => {
      const rules: URMRules[] = [];
      for (const doc of documents.docs) {
        rules.push(doc.data() as URMRules);
      }
      res.status(200).send(JSON.stringify({ rules } as URMRulesList));
      next();
    })

    .catch(errorHandler);
};

export default listRules;
