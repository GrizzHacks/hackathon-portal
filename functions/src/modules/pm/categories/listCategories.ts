import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const listCategories: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
    mentor: { accepted: executeIfApprovalStatusApproved },
    volunteer: { accepted: executeIfApprovalStatusApproved },
    hacker: { accepted: executeIfApprovalStatusApproved },
    public: executeIfApprovalStatusApproved
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

export default listCategories;
