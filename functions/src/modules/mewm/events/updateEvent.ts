import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import {
  expressErrorHandlerFactory,
  requestBodyTypeValidator,
} from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const updateEvent: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: ValidateOrganizer },
    sponsor: { accepted: ValidateSponsor },
  })(req, res, next);
};

const ValidateOrganizer: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventName: { rules: ["string"] },
      eventDescription: { rules: ["string"] },
      virtual: { rules: ["boolean"] },
      location: { rules: ["string", "emptystring"] },
      joinLink: { rules: ["string", "emptystring"] },
      joinLinkToPresenters: { rules: ["number"] },
      joinLinkToAttendees: { rules: ["number"] },
      companyId: { rules: ["string", "emptystring"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      managers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
      speakers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(req, res, next)(validationRules, execute);
};

const ValidateSponsor: ExpressFunction = (req, res, next) => {
  const validationRules: ValidatorObjectRules = {
    type: "object",
    rules: {
      eventName: { rules: ["string"] },
      eventDescription: { rules: ["string"] },
      virtual: { rules: ["boolean"] },
      location: { rules: ["string", "emptystring"] },
      joinLink: { rules: ["string", "emptystring"] },
      joinLinkToPresenters: { rules: ["number"] },
      joinLinkToAttendees: { rules: ["number"] },
      companyId: { rules: ["string", "emptystring"] },
      approvalStatus: {
        rules: [
          {
            type: "enum",
            rules: ["approved", "rejected", "inProgress", "awaitingApproval"],
          },
        ],
      },
      managers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
      speakers: {
        rules: [
          {
            type: "array",
            rules: ["string"],
          },
        ],
      },
    },
  };
  requestBodyTypeValidator(
    req,
    res,
    next
  )(validationRules, executeIfSponsorMatches);
};

const execute: ExpressFunction = (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  const body = res.locals.parsedBody as MEWMEventUpdateRequest;

  firebaseApp
    .firestore()
    .collection("events")
    .doc(req.params.eventId)
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

  firebaseApp
    .firestore()
    .collection("prizeCategories")
    .doc(req.params.eventId)
    .get()
    .then((doc) => {
      if (sponsorCompany === (doc.data() as MEWMEvent | undefined)?.companyId) {
        if (
          (doc.data() as MEWMEvent | undefined)?.approvalStatus === "approved"
        ) {
          execute(req, res, next);
        } else {
          errorHandler(
            `Someone unauthorized tried viewing an event that is still undergoing approval.`,
            403,
            "Sorry, you do not have access to perform that operation."
          );
        }
      } else {
        errorHandler(
          `A sponsor from ${sponsorCompany} tried updating event ${req.params.eventId}.`,
          403,
          "Sorry, you do not have access to perform that operation."
        );
      }
    });
};

export default updateEvent;
