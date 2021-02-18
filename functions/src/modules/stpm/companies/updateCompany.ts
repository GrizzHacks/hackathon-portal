import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";



const updateCompany: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {

  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const body = JSON.parse(req.body)

  firebaseApp
    .firestore()
    .collection("sponsorCompany")
    .doc(req.params.companyId)
    .update(body)
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};


const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
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




export default updateCompany;
