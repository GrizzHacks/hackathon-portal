import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const deleteCategory: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .delete()
    .then(() => {
      res.status(200).send();
      next();
    })
    .catch(errorHandler);
};

const executeIfSponsorMatches: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);

  const sponsorCompany = (res.locals.permissions as UserPermission).company;

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.categoryId)
    .get()
    .then((doc) => {
      if (
        sponsorCompany === (doc.data() as PMCategory | undefined)?.companyId
      ) {
        if (
          (doc.data() as PMCategory | undefined)?.approvalStatus !== "approved"
        ) {
          execute(req, res, next);
        } else {
          errorHandler(
            `A sponsor from ${sponsorCompany} tried deleting the approved prizeCategory ${req.params.categoryId}.`,
            400,
            "Sorry, this prize category has already been approved and published. Reach out to the organizing team if you still want to delete it."
          );
        }
      } else {
        errorHandler(
          `A sponsor from ${sponsorCompany} tried deleting prizeCategory ${req.params.categoryId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    })
    .catch(errorHandler);
};

export default deleteCategory;
