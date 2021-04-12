import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getQuestion: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("questions")
    .doc(req.params.questionsId)
    .get()
    .then((document) => {
      const data = document.data() as URMQuestion | undefined;
      res.status(200).send(JSON.stringify(data));
      next();
    })
    .catch(errorHandler);
};

export default getQuestion;
