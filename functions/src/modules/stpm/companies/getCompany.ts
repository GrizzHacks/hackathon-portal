import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getCompany: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .doc(req.params.companyId)
    .get()
    .then((document) => {
      const data = document.data() as STPMCompany | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`sponsorCompanies/${req.params.companyId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).companyId;
  if (sponsorCompany === req.params.companyId) {
    execute(req, res, next);
  } else {
    errorHandler(
      `A sponsor from ${sponsorCompany} tried viewing benefits for ${req.params.companyId}.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default getCompany;
