import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
    mentor: { accepted: executeIfApprovalStatusApproved },
    volunteer: { accepted: executeIfApprovalStatusApproved },
    hacker: { accepted: executeIfApprovalStatusApproved },
    public: execute
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .get()
    .then((document) => {
      const data = document.data() as PMCategory | undefined;
      if (data) {
        res.status(200).send(JSON.stringify(data));
        next();
      } else {
        errorHandler(`prizeCategories/${req.params.categoryId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const sponsorCompany = (res.locals.permissions as UserPermission).company;
  if (sponsorCompany === req.params.companyId || req.params.approvalStatus === "approved") {
    execute(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing an event that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

const executeIfApprovalStatusApproved: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  if (req.params.approvalStatus === "approved") {
    execute(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing an event that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default getCategory;
