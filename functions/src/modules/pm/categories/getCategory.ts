import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getCategory: ExpressFunction = (req, res, next) => {
  execute(req, res, next);
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
        uasPermissionSwitch({
          organizer: {
            accepted: send(data),
            pending: sendIfApproved(data),
            rejected: sendIfApproved(data),
          },
          sponsor: {
            accepted: sendIfSponsorMatches(data),
            pending: sendIfApproved(data),
            rejected: sendIfApproved(data),
          },
          mentor: sendIfApproved(data),
          volunteer: sendIfApproved(data),
          hacker: sendIfApproved(data),
          public: sendIfApproved(data),
        })(req, res, next);
      } else {
        errorHandler(`prizeCategories/${req.params.categoryId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const send: (data: PMCategory) => ExpressFunction = (data) => (
  req,
  res,
  next
) => {
  res.status(200).send(JSON.stringify(data));
  next();
};

const sendIfSponsorMatches: (data: PMCategory) => ExpressFunction = (data) => (
  req,
  res,
  next
) => {
  const sponsorCompany = (res.locals.permissions as UserPermission).companyId;

  if (sponsorCompany === data.companyId) {
    send(data)(req, res, next);
  } else {
    sendIfApproved(data)(req, res, next);
  }
};

const sendIfApproved: (data: PMCategory) => ExpressFunction = (data) => (
  req,
  res,
  next
) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  if (data.approvalStatus === "approved") {
    send(data)(req, res, next);
  } else {
    errorHandler(
      `Someone unauthorized tried viewing a prize that is still undergoing approval.`,
      403,
      "Sorry, you do not have access to perform that operation."
    );
  }
};

export default getCategory;
