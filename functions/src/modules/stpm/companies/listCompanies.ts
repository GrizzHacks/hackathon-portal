import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listCompanies: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .orderBy("sponsorName", "asc")
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
