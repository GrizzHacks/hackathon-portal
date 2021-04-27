import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const listQuestions: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("questions")
    .orderBy("applicationQuestionLabel", "asc")
    .get()
    .then((documents) => {
      send(documents.docs)(req, res, next);
    })
    .catch(errorHandler);
};

const send: (
  docs: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>[]
) => ExpressFunction = (docs) => (req, res, next) => {
  const questions: URMQuestion[] = [];
  for (const doc of docs) {
    questions.push(doc.data() as URMQuestion);
  }
  res.status(200).send(JSON.stringify({ questions } as URMQuestionsList));
  next();
};

export default listQuestions;
