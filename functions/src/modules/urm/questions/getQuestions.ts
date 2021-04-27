import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const getQuestion: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("questions")
    .doc(req.params.questionId)
    .get()
    .then((document) => {
      const data = document.data() as URMQuestion | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`questions/${req.params.questionId} has no data.`);
      }
    })
    .catch(errorHandler);
};

export default getQuestion;
