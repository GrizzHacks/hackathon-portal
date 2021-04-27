import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";

const listCompanies: ExpressFunction = (req, res, next) => {
  execute(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .orderBy("companyName", "asc")
    .get()
    .then((documents) => {
      const sponsorCompanies: STPMCompany[] = [];
      for (const doc of documents.docs) {
        sponsorCompanies.push(doc.data() as STPMCompany);
      }
      res
        .status(200)
        .send(JSON.stringify({ sponsorCompanies } as STPMCompanyList));
      next();
    })

    .catch(errorHandler);
};

export default listCompanies;
