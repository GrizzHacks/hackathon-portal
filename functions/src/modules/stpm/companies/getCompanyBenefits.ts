import type { ExpressFunction } from "../../../@types";
import { firebaseApp } from "../../../config/firebaseConfig";
import { expressErrorHandlerFactory } from "../../../helpers";
import { uasPermissionSwitch } from "../../../systems/uas";

const getCompanyBenefits: ExpressFunction = (req, res, next) => {
  uasPermissionSwitch({
    organizer: { accepted: execute },
    sponsor: { accepted: executeIfSponsorMatches },
  })(req, res, next);
};

const execute: ExpressFunction = (req, res, next) => {
  extractAndMergeSponsorCompanyBenefits(
    req.params.companyId,
    (mergedData) => (req, res, next) => {
      res.status(200).send(JSON.stringify(mergedData));
      next();
    }
  )(req, res, next);
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

export const extractAndMergeSponsorCompanyBenefits: (
  companyId: string,
  callback: (mergedData: STPMTier) => ExpressFunction
) => ExpressFunction = (companyId, callback) => (req, res, next) => {
  const errorHandler = expressErrorHandlerFactory(req, res, next);
  firebaseApp
    .firestore()
    .collection("sponsorCompanies")
    .doc(companyId)
    .get()
    .then((document) => {
      const companyData = document.data() as STPMCompany | undefined;
      if (companyData) {
        firebaseApp
          .firestore()
          .collection("sponsorTiers")
          .doc(companyData.sponsorTierId)
          .get()
          .then((document) => {
            const tierData = document.data() as STPMTier | undefined;
            if (tierData) {
              const mergedData = mergeTierBenefitsAndCompanyOverriddenBenefits(
                tierData,
                companyData.overriddenBenefits
              );
              callback(mergedData)(req, res, next);
            } else {
              errorHandler(
                `sponsorTiers/${companyData.sponsorTierId} has no data.`
              );
            }
          })
          .catch(errorHandler);
      } else {
        errorHandler(`sponsorCompanies/${req.params.companyId} has no data.`);
      }
    })
    .catch(errorHandler);
};

const mergeTierBenefitsAndCompanyOverriddenBenefits = (
  tierData: STPMTier,
  overriddenBenefits: STPMTierUpdateRequest
): STPMTier => {
  // Override all shared properties in tierData with the overriddenBenefits
  const mergedData: STPMTier = { ...tierData, ...overriddenBenefits };
  // Override all shared properties in tierData.otherBenefits with the overriddenBenefits.otherBenefits
  mergedData.otherBenefits = {
    ...tierData.otherBenefits,
    ...overriddenBenefits.otherBenefits,
  };
  return mergedData;
};

export const internalFunctionsForTesting = {
  mergeTierBenefitsAndCompanyOverriddenBenefits,
};

export default getCompanyBenefits;
